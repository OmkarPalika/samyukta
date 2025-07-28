import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participant_id, action = 'checkin', room_number } = await request.json();
    
    if (!participant_id) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find participant
    const participant = await collections.teamMembers.findOne({ participant_id });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Check if participant requested accommodation
    if (!participant.accommodation) {
      return NextResponse.json({ error: 'Participant did not request accommodation' }, { status: 400 });
    }

    if (action === 'checkin' && !room_number) {
      return NextResponse.json({ error: 'Room number required for check-in' }, { status: 400 });
    }

    // Record accommodation action
    const accommodationRecord = {
      participant_id,
      participant_name: participant.full_name,
      gender: participant.gender || 'Other',
      action,
      room_number: action === 'checkin' ? room_number : undefined,
      timestamp: new Date(),
      date: new Date().toISOString().split('T')[0]
    };

    await collections.accommodationLogs?.insertOne(accommodationRecord);

    // Update participant accommodation status
    if (action === 'checkin') {
      await collections.teamMembers.updateOne(
        { participant_id },
        { $set: { accommodation_room: room_number, accommodation_status: 'checked_in' } }
      );
    } else if (action === 'checkout') {
      await collections.teamMembers.updateOne(
        { participant_id },
        { $set: { accommodation_status: 'checked_out' } }
      );
    }

    return NextResponse.json({
      success: true,
      participant: {
        name: participant.full_name,
        gender: participant.gender
      },
      action,
      room_number: action === 'checkin' ? room_number : undefined
    });

  } catch (error) {
    console.error('Accommodation error:', error);
    return NextResponse.json({ error: 'Failed to process accommodation' }, { status: 500 });
  }
}
