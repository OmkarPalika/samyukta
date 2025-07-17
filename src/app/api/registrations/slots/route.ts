import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET() {
  try {
    const collections = await getTypedCollections();
    
    // Get competition counts
    const pitchCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Pitch' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const hackathonCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Hackathon' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);

    // For backward compatibility with existing code
    return NextResponse.json({
      pitch: { used: pitchCount, available: Math.max(0, 250 - pitchCount) },
      hackathon: { used: hackathonCount, available: Math.max(0, 250 - hackathonCount) },
      // Add a note about the comprehensive endpoint
      note: "For comprehensive slot data, use /api/slots"
    });
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}