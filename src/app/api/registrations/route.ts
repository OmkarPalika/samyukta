import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const collections = await getTypedCollections();
    
    // Validate session
    const session = await collections.sessions.findOne({ 
      session_token: token,
      expires_at: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const college = searchParams.get('college');
    const ticketType = searchParams.get('ticket_type');
    const workshopTrack = searchParams.get('workshop_track');
    const competitionTrack = searchParams.get('competition_track');
    const search = searchParams.get('search');
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (college) filter.college = { $regex: college, $options: 'i' };
    if (ticketType) filter.ticket_type = ticketType;
    if (workshopTrack) filter.workshop_track = workshopTrack;
    if (competitionTrack) filter.competition_track = competitionTrack;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { team_id: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { transaction_id: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count
    const total = await collections.registrations.countDocuments(filter);
    
    // Get registrations with pagination
    const registrations = await collections.registrations
      .find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    // Get team members for each registration
    const registrationsWithMembers = await Promise.all(
      registrations.map(async (registration) => {
        const members = await collections.teamMembers
          .find({ registration_id: registration.team_id })
          .toArray();
        
        return {
          _id: registration._id?.toString(),
          team_id: registration.team_id,
          college: registration.college,
          team_size: registration.team_size,
          ticket_type: registration.ticket_type,
          workshop_track: registration.workshop_track,
          competition_track: registration.competition_track,
          total_amount: registration.total_amount,
          transaction_id: registration.transaction_id,
          payment_screenshot_url: registration.payment_screenshot_url,
          status: registration.status,
          registration_code: registration.registration_code,
          qr_code_url: registration.qr_code_url,
          created_at: registration.created_at.toISOString(),
          updated_at: registration.updated_at.toISOString(),
          members: members.map(member => ({
            _id: member._id.toString(),
            participant_id: member.participant_id,
            full_name: member.full_name,
            email: member.email,
            phone: member.phone,
            whatsapp: member.whatsapp,
            year: member.year,
            department: member.department,
            college: member.college,
            gender: member.gender,
            accommodation: member.accommodation,
            food_preference: member.food_preference,
            is_club_lead: member.is_club_lead,
            club_name: member.club_name
          }))
        };
      })
    );
    
    return NextResponse.json({
      registrations: registrationsWithMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    const collections = await getTypedCollections();
    
    // Check for duplicate emails
    const emails = registrationData.members.map((member: { email: string }) => member.email);
    const existingMembers = await collections.teamMembers.find({ email: { $in: emails } }).toArray();
    
    if (existingMembers.length > 0) {
      const duplicateEmails = existingMembers.map(member => member.email);
      return NextResponse.json({ 
        error: 'Email already registered', 
        duplicate_emails: duplicateEmails 
      }, { status: 400 });
    }
    
    // Generate unique team ID
    const teamId = `TEAM${Date.now()}`;
    
    // Prepare registration document
    const registration = {
      team_id: teamId,
      college: registrationData.college,
      team_size: registrationData.members.length,
      ticket_type: registrationData.ticket_type,
      workshop_track: registrationData.ticket_type === 'startup_only' ? null : registrationData.workshop_track,
      competition_track: registrationData.ticket_type === 'startup_only' ? 'Pitch' : registrationData.competition_track,
      total_amount: registrationData.total_amount,
      transaction_id: registrationData.transaction_id,
      payment_screenshot_url: registrationData.payment_screenshot_url,
      status: 'pending' as const,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Check slot availability with participant counts (allow overflow for last team)
    const totalParticipants = await collections.teamMembers.countDocuments({});
    
    // For startup_only tickets, skip workshop validation and use Pitch competition
    const actualWorkshopTrack = registrationData.ticket_type === 'startup_only' ? null : registrationData.workshop_track;
    const actualCompetitionTrack = registrationData.ticket_type === 'startup_only' ? 'Pitch' : registrationData.competition_track;
    
    const workshopParticipants = actualWorkshopTrack ? await collections.registrations.aggregate([
      { $match: { workshop_track: actualWorkshopTrack } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0) : 0;
    
    const competitionParticipants = actualCompetitionTrack ? await collections.registrations.aggregate([
      { $match: { competition_track: actualCompetitionTrack } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0) : 0;
    
    // Reject only if current count already exceeds limit (allows last team overflow)
    if (totalParticipants >= 400) {
      return NextResponse.json({ error: 'Event registrations are closed' }, { status: 400 });
    }
    
    // Skip workshop validation for startup_only tickets
    if (registrationData.ticket_type !== 'startup_only') {
      if (actualWorkshopTrack === 'Cloud' && workshopParticipants >= 200) {
        return NextResponse.json({ error: 'Cloud workshop registrations are closed' }, { status: 400 });
      }
      
      if (actualWorkshopTrack === 'AI' && workshopParticipants >= 200) {
        return NextResponse.json({ error: 'AI workshop registrations are closed' }, { status: 400 });
      }
      
      if (actualWorkshopTrack === 'Cybersecurity' && workshopParticipants >= 100) {
        return NextResponse.json({ error: 'Cybersecurity workshop registrations are closed' }, { status: 400 });
      }
    }
    
    if (actualCompetitionTrack === 'Hackathon' && competitionParticipants >= 250) {
      return NextResponse.json({ error: 'Hackathon registrations are closed' }, { status: 400 });
    }
    
    if (actualCompetitionTrack === 'Pitch' && competitionParticipants >= 250) {
      return NextResponse.json({ error: 'Startup Pitch registrations are closed' }, { status: 400 });
    }
    
    // Insert registration
    await collections.registrations.insertOne(registration);
    
    // Insert team members with email sending
    const memberPromises = registrationData.members.map(async (member: { participant_id: string; passkey: string; full_name: string; email: string; whatsapp: string; gender?: string; role?: string; custom_role?: string; organization?: string; custom_organization?: string; college?: string; degree?: string; custom_degree?: string; year: string; department: string; stream?: string; accommodation: boolean; food_preference: 'veg' | 'non-veg'; workshop_track: string; competition_track?: string; is_club_lead?: boolean; club_name?: string; club_designation?: string }) => {
      console.log(`Member ${member.full_name} gender: ${member.gender}`);
      const teamMember = {
        registration_id: teamId,
        participant_id: member.participant_id,
        passkey: member.passkey,
        full_name: member.full_name,
        email: member.email,
        whatsapp: member.whatsapp,
        gender: member.gender || 'Not specified',
        role: member.role || 'Student',
        custom_role: member.custom_role,
        organization: member.organization || 'College/University',
        custom_organization: member.custom_organization,
        college: member.college || registrationData.college,
        degree: member.degree,
        custom_degree: member.custom_degree,
        year: member.year,
        department: member.department,
        stream: member.stream,
        accommodation: member.accommodation,
        food_preference: member.food_preference as 'veg' | 'non-veg',
        workshop_track: member.workshop_track,
        competition_track: member.competition_track,
        is_club_lead: member.is_club_lead || false,
        club_name: member.club_name || undefined,
        club_designation: member.club_designation,
        present: false,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Insert team member
      await collections.teamMembers.insertOne(teamMember);
      // Send individual confirmation email to each member
      try {
        console.log(`Sending confirmation email to ${member.email} (${member.full_name})`);
        await sendRegistrationConfirmation(
          member.email,
          {
            name: member.full_name,
            email: member.email,
            college: registrationData.college,
            phone: member.whatsapp,
            ticketType: registrationData.ticket_type,
            registrationId: teamId,
            amount: registrationData.total_amount,
            workshopTrack: member.workshop_track,
            teamMembers: registrationData.members.map((m: { full_name: string }) => m.full_name),
            eventDates: "August 6-9, 2025",
            venue: "ANITS Campus, Visakhapatnam"
          },
          member.passkey
        );
        console.log(`✅ Email sent successfully to ${member.email}`);
        return { email: member.email, success: true };
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${member.email}:`, emailError);
        return { email: member.email, success: false, error: emailError };
      }
    });
    
    const emailResults = await Promise.all(memberPromises);
    
    // Save startup pitch data to competition_registrations collection if it's a startup-only ticket
    if (registrationData.ticket_type === 'startup_only' && registrationData.startup_pitch_data) {
      const pitchData = registrationData.startup_pitch_data;
      
      // Create competition registration document
      const competitionRegistration = {
        competition_id: 'startup-pitch-2025', // You might want to make this dynamic
        user_id: registrationData.members[0].email, // Using team lead email as user_id
        team_id: teamId,
        registration_type: registrationData.members.length > 1 ? 'team' : 'individual',
        transaction_id: registrationData.transaction_id,
        payment_screenshot_url: registrationData.payment_screenshot_url,
        // Startup Pitch specific fields
        startup_name: pitchData.startupName,
        pitch_category: pitchData.pitchCategory,
        brief_description: pitchData.briefDescription,
        problem_statement: pitchData.problemStatement,
        target_market: pitchData.targetMarket,
        current_stage: pitchData.currentStage,
        team_size: pitchData.teamSize,
        funding_status: pitchData.fundingStatus,
        pitch_deck_url: pitchData.pitchDeckUrl || null,
        demo_url: pitchData.demoUrl,
        team_members: pitchData.teamMembers ? 
          pitchData.teamMembers.map((index: number) => registrationData.members[index]?.full_name).filter(Boolean) : 
          registrationData.members.map((m: { full_name: string }) => m.full_name),
        external_members: pitchData.externalMembers || [],
        status: 'pending' as const,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      try {
        await collections.competitionRegistrations.insertOne(competitionRegistration);
        console.log(`✅ Startup pitch data saved for team ${teamId}`);
      } catch (pitchError) {
        console.error(`❌ Failed to save startup pitch data for team ${teamId}:`, pitchError);
        // Don't fail the entire registration if pitch data save fails
      }
    }
    
    // Log email sending results
    const successfulEmails = emailResults.filter(result => result.success).length;
    const failedEmails = emailResults.filter(result => !result.success);
    
    console.log(`Email sending summary for team ${teamId}:`);
    console.log(`✅ Successful: ${successfulEmails}/${registrationData.members.length}`);
    if (failedEmails.length > 0) {
      console.log(`❌ Failed emails:`, failedEmails.map(f => f.email));
    }
    
    return NextResponse.json({
      success: true,
      team_id: teamId,
      email_status: {
        total: registrationData.members.length,
        successful: successfulEmails,
        failed: failedEmails.length,
        failed_emails: failedEmails.map(f => f.email)
      },
      message: 'Registration completed successfully'
    });

  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

