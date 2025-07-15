import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET() {
  try {
    const collections = await getTypedCollections();
    
    // Get current counts from registrations (team-based)
    const totalTeams = await collections.registrations.countDocuments({});
    const cloudTeams = await collections.registrations.countDocuments({ workshop_track: 'Cloud' });
    const aiTeams = await collections.registrations.countDocuments({ workshop_track: 'AI' });
    
    // Get actual participant counts
    const totalCount = await collections.teamMembers.countDocuments({});
    const cloudCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'Cloud' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    const aiCount = await collections.registrations.aggregate([
      { $match: { workshop_track: 'AI' } },
      { $group: { _id: null, total: { $sum: '$team_size' } } }
    ]).toArray().then(result => result[0]?.total || 0);
    
    // Get competition counts
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
    
    const stats = {
      total_registrations: totalCount,
      total_teams: totalTeams,
      cloud_workshop: cloudCount,
      ai_workshop: aiCount,
      hackathon_competition: hackathonCount,
      pitch_competition: pitchCount,
      cloud_teams: cloudTeams,
      ai_teams: aiTeams,
      max_total: MAX_TOTAL,
      max_cloud: MAX_CLOUD,
      max_ai: MAX_AI,
      max_hackathon: MAX_HACKATHON,
      max_pitch: MAX_PITCH,
      remaining_total: Math.max(0, MAX_TOTAL - totalCount),
      remaining_cloud: Math.max(0, MAX_CLOUD - cloudCount),
      remaining_ai: Math.max(0, MAX_AI - aiCount),
      remaining_hackathon: Math.max(0, MAX_HACKATHON - hackathonCount),
      remaining_pitch: Math.max(0, MAX_PITCH - pitchCount),
      // Registration status flags
      event_closed: totalCount >= MAX_TOTAL,
      cloud_closed: cloudCount >= MAX_CLOUD,
      ai_closed: aiCount >= MAX_AI,
      hackathon_closed: hackathonCount >= MAX_HACKATHON,
      pitch_closed: pitchCount >= MAX_PITCH,
      direct_join_available: totalCount > 350,
      direct_join_hackathon_price: 400,
      direct_join_pitch_price: 300
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration stats' },
      { status: 500 }
    );
  }
}