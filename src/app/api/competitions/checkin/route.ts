import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participant_id, competition_type } = await request.json();
    
    if (!participant_id || !competition_type) {
      return NextResponse.json({ error: 'Participant ID and competition type required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find participant
    const participant = await collections.teamMembers.findOne({ participant_id });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Get registration to check competition track
    const registration = await collections.registrations.findOne({ team_id: participant.registration_id });
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Verify participant is registered for this competition
    if (registration.competition_track !== competition_type) {
      return NextResponse.json({ 
        error: `Participant not registered for ${competition_type}. Registered for: ${registration.competition_track}` 
      }, { status: 400 });
    }

    // Check if already checked in
    const existingCheckin = await collections.competitionCheckins.findOne({ 
      participant_id, 
      competition_type,
      date: new Date().toISOString().split('T')[0]
    });

    if (existingCheckin) {
      return NextResponse.json({ error: 'Already checked in for this competition today' }, { status: 400 });
    }

    // Record competition check-in
    await collections.competitionCheckins.insertOne({
      participant_id,
      participant_name: participant.full_name,
      team_id: participant.registration_id,
      competition_type,
      checkin_time: new Date(),
      date: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({
      success: true,
      participant: {
        name: participant.full_name,
        team_id: participant.registration_id
      },
      competition_type
    });

  } catch (error) {
    console.error('Competition checkin error:', error);
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
  }
}