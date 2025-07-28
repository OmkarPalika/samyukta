import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET() {
  try {
    const collections = await getTypedCollections();
    const today = new Date().toISOString().split('T')[0];

    // Get basic counts
    const [
      totalRegistrations,
      totalParticipants,
      presentToday,
      mealsDistributed,
      workshopAttendance,
      competitionCheckins,
      accommodationOccupied
    ] = await Promise.all([
      collections.registrations.countDocuments({}),
      collections.teamMembers.countDocuments({}),
      collections.teamMembers.countDocuments({ present: true }),
      collections.meals?.countDocuments({ date: today }) || 0,
      collections.workshopAttendance?.countDocuments({ date: today }) || 0,
      collections.competitionCheckins?.countDocuments({ date: today }) || 0,
      collections.teamMembers.countDocuments({ accommodation_status: 'checked_in' })
    ]);

    // Get track distribution
    const trackStats = await collections.registrations.aggregate([
      { $group: { _id: '$workshop_track', count: { $sum: 1 } } }
    ]).toArray();

    const competitionStats = await collections.registrations.aggregate([
      { $group: { _id: '$competition_track', count: { $sum: 1 } } }
    ]).toArray();

    return NextResponse.json({
      overview: {
        total_registrations: totalRegistrations,
        total_participants: totalParticipants,
        present_today: presentToday,
        attendance_rate: totalParticipants > 0 ? Math.round((presentToday / totalParticipants) * 100) : 0
      },
      daily: {
        meals_distributed: mealsDistributed,
        workshop_attendance: workshopAttendance,
        competition_checkins: competitionCheckins,
        accommodation_occupied: accommodationOccupied
      },
      tracks: {
        workshops: trackStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        competitions: competitionStats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
