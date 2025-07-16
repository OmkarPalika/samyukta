import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participant_id, workshop_session, action = 'checkin' } = await request.json();
    
    if (!participant_id || !workshop_session) {
      return NextResponse.json({ error: 'Participant ID and workshop session required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find participant
    const participant = await collections.teamMembers.findOne({ participant_id });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Get registration to check workshop track
    const registration = await collections.registrations.findOne({ team_id: participant.registration_id });
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const attendanceRecord = {
      workshop_id: workshop_session,
      participant_id,
      completion_status: 'attended' as const,
      check_in_time: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    await collections.workshopAttendance.insertOne(attendanceRecord);

    return NextResponse.json({
      success: true,
      participant: {
        name: participant.full_name,
        workshop_track: registration.workshop_track
      },
      workshop_session,
      action
    });

  } catch (error) {
    console.error('Workshop attendance error:', error);
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}