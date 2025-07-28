import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { sendRegistrationConfirmation } from '@/lib/email';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
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

    // Check if user is admin
    const user = await collections.users.findOne({ _id: new ObjectId(session.user_id) });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { registrationId } = await request.json();

    // Get registration details
    const registration = await collections.registrations.findOne({ 
      _id: new ObjectId(registrationId) 
    });

    if (!registration) {
      return NextResponse.json({ 
        error: 'No registration found' 
      }, { status: 404 });
    }

    // Get all team members for this registration
    const members = await collections.teamMembers
      .find({ registration_id: registration.team_id })
      .toArray();

    if (members.length === 0) {
      return NextResponse.json({ 
        error: 'No team members found for this registration' 
      }, { status: 404 });
    }

    // Send confirmation email to each team member
    const emailPromises = members.map(async (member) => {
      try {
        await sendRegistrationConfirmation(
          member.email,
          {
            name: member.full_name,
            email: member.email,
            college: registration.college,
            phone: member.whatsapp,
            ticketType: registration.ticket_type,
            registrationId: registration.team_id,
            amount: registration.total_amount,
            workshopTrack: registration.workshop_track,
            teamMembers: members.map(m => m.full_name),
            eventDates: "January 24-26, 2025",
            venue: "ANITS Campus, Visakhapatnam"
          },
          member.passkey || 'DEFAULT_PASSKEY'
        );
        return { email: member.email, success: true };
      } catch (emailError) {
        console.error(`Failed to send email to ${member.email}:`, emailError);
        return { email: member.email, success: false, error: emailError };
      }
    });

    const emailResults = await Promise.all(emailPromises);
    const successfulEmails = emailResults.filter(result => result.success).length;
    const failedEmails = emailResults.filter(result => !result.success);

    return NextResponse.json({
      success: true,
      message: `Confirmation emails sent to ${successfulEmails}/${members.length} team members`,
      email_status: {
        total: members.length,
        successful: successfulEmails,
        failed: failedEmails.length,
        failed_emails: failedEmails.map(f => f.email)
      }
    });

  } catch (error) {
    console.error('Failed to resend registration confirmation:', error);
    return NextResponse.json({ 
      error: 'Failed to resend confirmation emails' 
    }, { status: 500 });
  }
}
