import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { team_id, member_emails } = await request.json();
    
    if (!team_id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Get registration details
    const registration = await collections.registrations.findOne({ team_id });
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Get team members
    const members = await collections.teamMembers
      .find({ registration_id: team_id })
      .toArray();

    if (members.length === 0) {
      return NextResponse.json({ error: 'No team members found' }, { status: 404 });
    }

    // Filter members if specific emails are provided
    const membersToEmail = member_emails 
      ? members.filter(member => member_emails.includes(member.email))
      : members;

    if (membersToEmail.length === 0) {
      return NextResponse.json({ error: 'No matching members found' }, { status: 404 });
    }

    // Send emails to each member
    const emailPromises = membersToEmail.map(async (member) => {
      try {
        console.log(`Resending confirmation email to ${member.email} (${member.full_name})`);
        
        await sendRegistrationConfirmation(
          member.email,
          {
            name: member.full_name,
            email: member.email,
            college: registration.college,
            phone: member.whatsapp,
            ticketType: registration.ticket_type,
            registrationId: team_id,
            amount: registration.total_amount,
            workshopTrack: registration.workshop_track,
            teamMembers: members.map(m => m.full_name),
            eventDates: "August 6-9, 2025",
            venue: "ANITS Campus, Visakhapatnam"
          },
          member.passkey || ''
        );
        
        console.log(`✅ Email resent successfully to ${member.email}`);
        return { email: member.email, success: true };
      } catch (emailError) {
        console.error(`❌ Failed to resend email to ${member.email}:`, emailError);
        return { email: member.email, success: false, error: emailError };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    console.log(`Email resend summary for team ${team_id}:`);
    console.log(`✅ Successful: ${successful}/${membersToEmail.length}`);
    if (failed.length > 0) {
      console.log(`❌ Failed emails:`, failed.map(f => f.email));
    }

    return NextResponse.json({
      success: true,
      message: `Emails resent to ${successful} out of ${membersToEmail.length} members`,
      results: {
        total: membersToEmail.length,
        successful,
        failed: failed.length,
        failed_emails: failed.map(f => f.email)
      }
    });

  } catch (error) {
    console.error('Failed to resend registration emails:', error);
    return NextResponse.json(
      { error: 'Failed to resend emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}