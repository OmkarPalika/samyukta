import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { team_id, old_email, new_email } = await request.json();
    
    if (!team_id || !old_email || !new_email) {
      return NextResponse.json({ error: 'Team ID, old email, and new email are required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Update email in team members collection
    const updateResult = await collections.teamMembers.updateOne(
      { registration_id: team_id, email: old_email },
      { $set: { email: new_email } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get updated member and registration details
    const member = await collections.teamMembers.findOne({ registration_id: team_id, email: new_email });
    const registration = await collections.registrations.findOne({ team_id });
    const allMembers = await collections.teamMembers.find({ registration_id: team_id }).toArray();

    if (!member || !registration) {
      return NextResponse.json({ error: 'Registration details not found' }, { status: 404 });
    }

    // Send confirmation email to new address
    await sendRegistrationConfirmation(
      new_email,
      {
        name: member.full_name,
        email: new_email,
        college: registration.college,
        phone: member.whatsapp,
        ticketType: registration.ticket_type,
        registrationId: team_id,
        amount: registration.total_amount,
        workshopTrack: registration.workshop_track,
        teamMembers: allMembers.map(m => m.full_name),
        eventDates: "August 6-9, 2025",
        venue: "ANITS Campus, Visakhapatnam"
      },
      member.passkey || ''
    );

    return NextResponse.json({
      success: true,
      message: `Email updated from ${old_email} to ${new_email} and confirmation sent`
    });

  } catch (error) {
    console.error('Failed to update email:', error);
    return NextResponse.json(
      { error: 'Failed to update email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
