import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET() {
  try {
    const collections = await getTypedCollections();
    
    // Get registration counts
    const totalCount = await collections.teamMembers.countDocuments({});
    
    const cloudCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'Cloud' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const aiCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'AI' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const hackathonCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Hackathon' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const pitchCount = await collections.registrations.aggregate([
      { $match: { competition_track: 'Pitch' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    // Define limits
    const MAX_TOTAL = 400;
    const MAX_CLOUD = 200;
    const MAX_AI = 200;
    const MAX_HACKATHON = 250;
    const MAX_PITCH = 250;
    
    // Calculate remaining slots
    const remaining_total = Math.max(0, MAX_TOTAL - totalCount);
    const remaining_cloud = Math.max(0, MAX_CLOUD - cloudCount);
    const remaining_ai = Math.max(0, MAX_AI - aiCount);
    const remaining_hackathon = Math.max(0, MAX_HACKATHON - hackathonCount);
    const remaining_pitch = Math.max(0, MAX_PITCH - pitchCount);
    
    // Consolidated slot data
    const slotData = {
      // Overall stats
      total: {
        registered: totalCount,
        max: MAX_TOTAL,
        remaining: remaining_total,
        closed: totalCount >= MAX_TOTAL
      },
      
      // Workshop tracks
      workshops: {
        cloud: {
          registered: cloudCount,
          max: MAX_CLOUD,
          remaining: remaining_cloud,
          closed: cloudCount >= MAX_CLOUD
        },
        ai: {
          registered: aiCount,
          max: MAX_AI,
          remaining: remaining_ai,
          closed: aiCount >= MAX_AI
        }
      },
      
      // Competition tracks
      competitions: {
        hackathon: {
          registered: hackathonCount,
          max: MAX_HACKATHON,
          remaining: remaining_hackathon,
          closed: hackathonCount >= MAX_HACKATHON,
          category: 'Hackathon',
          slots_available: MAX_HACKATHON,
          slots_filled: hackathonCount
        },
        pitch: {
          registered: pitchCount,
          max: MAX_PITCH,
          remaining: remaining_pitch,
          closed: pitchCount >= MAX_PITCH,
          category: 'Pitch',
          slots_available: MAX_PITCH,
          slots_filled: pitchCount
        }
      },
      
      // Direct join availability
      direct_join: {
        available: totalCount > 350,
        hackathon_price: 400,
        pitch_price: 300
      },
      
      // Legacy format for backward compatibility
      remaining_total,
      remaining_cloud,
      remaining_ai,
      remaining_hackathon,
      remaining_pitch,
      total_registrations: totalCount,
      cloud_workshop: cloudCount,
      ai_workshop: aiCount,
      hackathon_competition: hackathonCount,
      pitch_competition: pitchCount,
      max_total: MAX_TOTAL,
      max_cloud: MAX_CLOUD,
      max_ai: MAX_AI,
      max_hackathon: MAX_HACKATHON,
      max_pitch: MAX_PITCH,
      event_closed: totalCount >= MAX_TOTAL,
      cloud_closed: cloudCount >= MAX_CLOUD,
      ai_closed: aiCount >= MAX_AI,
      hackathon_closed: hackathonCount >= MAX_HACKATHON,
      pitch_closed: pitchCount >= MAX_PITCH,
      direct_join_available: totalCount > 350,
      direct_join_hackathon_price: 400,
      direct_join_pitch_price: 300
    };
    
    return NextResponse.json(slotData);
  } catch (error) {
    console.error('Failed to fetch slot data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot information' },
      { status: 500 }
    );
  }
}