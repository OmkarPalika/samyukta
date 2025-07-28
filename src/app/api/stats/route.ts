import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'full';
    
    const collections = await getTypedCollections();
    
    // Get workshop stats
    const workshops = await collections.workshops.find({}).toArray();
    const cloudWorkshop = workshops.find(w => w.track === 'Cloud');
    const aiWorkshop = workshops.find(w => w.track === 'AI');
    
    // Get competition stats
    const competitions = await collections.competitions.find({}).toArray();
    const hackathon = competitions.find(c => c.category === 'Hackathon');
    const pitch = competitions.find(c => c.category === 'Pitch');
    
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
    const MAX_CLOUD = cloudWorkshop?.capacity || 200;
    const MAX_AI = aiWorkshop?.capacity || 200;
    const MAX_HACKATHON = hackathon?.slots_available || 250;
    const MAX_PITCH = pitch?.slots_available || 250;
    
    // Calculate remaining slots
    const remainingTotal = Math.max(0, MAX_TOTAL - totalCount);
    const remainingCloud = Math.max(0, MAX_CLOUD - cloudCount);
    const remainingAi = Math.max(0, MAX_AI - aiCount);
    const remainingHackathon = Math.max(0, MAX_HACKATHON - hackathonCount);
    const remainingPitch = Math.max(0, MAX_PITCH - pitchCount);
    
    // Get attendance stats if available
    let attendanceStats = {};
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const presentToday = await collections.teamMembers.countDocuments({ present: true });
      const workshopAttendance = await collections.workshopAttendance?.countDocuments({ date: todayDate }) || 0;
      const competitionCheckins = await collections.competitionCheckins?.countDocuments({ date: todayDate }) || 0;
      
      attendanceStats = {
        present_today: presentToday,
        attendance_rate: totalCount > 0 ? Math.round((presentToday / totalCount) * 100) : 0,
        workshop_attendance: workshopAttendance,
        competition_checkins: competitionCheckins
      };
    } catch (err) {
      console.error('Failed to fetch attendance stats:', err);
    }
    
    // Build comprehensive stats object
    const stats = {
      // Registration counts
      registrations: {
        total: totalCount,
        total_teams: totalTeams,
        cloud: {
          participants: cloudCount,
          teams: cloudTeams
        },
        ai: {
          participants: aiCount,
          teams: aiTeams
        },
        hackathon: hackathonCount,
        pitch: pitchCount
      },
      
      // Capacity limits
      capacity: {
        total: MAX_TOTAL,
        cloud: MAX_CLOUD,
        ai: MAX_AI,
        hackathon: MAX_HACKATHON,
        pitch: MAX_PITCH
      },
      
      // Remaining slots
      remaining: {
        total: remainingTotal,
        cloud: remainingCloud,
        ai: remainingAi,
        hackathon: remainingHackathon,
        pitch: remainingPitch
      },
      
      // Status flags
      status: {
        event_closed: totalCount >= MAX_TOTAL,
        cloud_closed: cloudCount >= MAX_CLOUD,
        ai_closed: aiCount >= MAX_AI,
        hackathon_closed: hackathonCount >= MAX_HACKATHON,
        pitch_closed: pitchCount >= MAX_PITCH,
        direct_join_available: totalCount > 350
      },
      
      // Pricing
      pricing: {
        direct_join_hackathon: 400,
        direct_join_pitch: 300
      },
      
      // Attendance data
      attendance: attendanceStats,
      
      // Metadata
      timestamp: new Date().toISOString()
    };
    
    // For backward compatibility with existing code
    if (format === 'legacy' || format === 'registration') {
      return NextResponse.json({
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
        remaining_total: remainingTotal,
        remaining_cloud: remainingCloud,
        remaining_ai: remainingAi,
        remaining_hackathon: remainingHackathon,
        remaining_pitch: remainingPitch,
        event_closed: totalCount >= MAX_TOTAL,
        cloud_closed: cloudCount >= MAX_CLOUD,
        ai_closed: aiCount >= MAX_AI,
        hackathon_closed: hackathonCount >= MAX_HACKATHON,
        pitch_closed: pitchCount >= MAX_PITCH,
        direct_join_available: totalCount > 350,
        direct_join_hackathon_price: 400,
        direct_join_pitch_price: 300,
        timestamp: new Date().toISOString()
      });
    }
    
    // For realtime format
    if (format === 'realtime') {
      return NextResponse.json({
        total_registrations: totalCount,
        cloud_workshop: cloudCount,
        ai_workshop: aiCount,
        hackathon_entries: hackathonCount,
        pitch_entries: pitchCount,
        max_cloud: MAX_CLOUD,
        max_ai: MAX_AI,
        max_hackathon: MAX_HACKATHON,
        max_pitch: MAX_PITCH,
        remaining_cloud: remainingCloud,
        remaining_ai: remainingAi,
        remaining_hackathon: remainingHackathon,
        remaining_pitch: remainingPitch,
        remaining_total: remainingTotal,
        cloud_closed: cloudCount >= MAX_CLOUD,
        ai_closed: aiCount >= MAX_AI,
        hackathon_closed: hackathonCount >= MAX_HACKATHON,
        pitch_closed: pitchCount >= MAX_PITCH,
        event_closed: remainingTotal === 0,
        timestamp: new Date().toISOString()
      });
    }
    
    // Return full stats by default
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
