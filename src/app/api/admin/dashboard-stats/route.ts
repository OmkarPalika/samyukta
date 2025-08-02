import { NextRequest, NextResponse } from 'next/server';
import { getDbPromise } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const { authorized } = await requireAdmin(request);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDbPromise();

    // Get total users count
    const totalUsers = await db.collection('users').countDocuments();

    // Get total registrations count
    const totalRegistrations = await db.collection('registrations').countDocuments();

    // Get total revenue from all registrations
    const revenueResult = await db.collection('registrations').aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total_amount' }
        }
      }
    ]).toArray();

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get pending approvals count
    const pendingApprovals = await db.collection('registrations').countDocuments({
      status: { $in: ['pending', 'pending_review'] }
    });

    // Calculate growth percentages (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Revenue growth
    const [currentWeekRevenue, previousWeekRevenue] = await Promise.all([
      db.collection('registrations').aggregate([
        { $match: { created_at: { $gte: last7Days } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]).toArray(),
      db.collection('registrations').aggregate([
        { $match: { created_at: { $gte: previous7Days, $lt: last7Days } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]).toArray()
    ]);

    // User growth
    const [currentWeekUsers, previousWeekUsers] = await Promise.all([
      db.collection('users').countDocuments({ created_at: { $gte: last7Days } }),
      db.collection('users').countDocuments({ created_at: { $gte: previous7Days, $lt: last7Days } })
    ]);

    // Registration growth
    const [currentWeekRegistrations, previousWeekRegistrations] = await Promise.all([
      db.collection('registrations').countDocuments({ created_at: { $gte: last7Days } }),
      db.collection('registrations').countDocuments({ created_at: { $gte: previous7Days, $lt: last7Days } })
    ]);

    // Calculate percentage changes
    const revenueGrowth = previousWeekRevenue[0]?.total > 0 
      ? Math.round(((currentWeekRevenue[0]?.total || 0) - previousWeekRevenue[0].total) / previousWeekRevenue[0].total * 100)
      : currentWeekRevenue[0]?.total > 0 ? 100 : 0;

    const userGrowth = previousWeekUsers > 0 
      ? Math.round((currentWeekUsers - previousWeekUsers) / previousWeekUsers * 100)
      : currentWeekUsers > 0 ? 100 : 0;

    const registrationGrowth = previousWeekRegistrations > 0 
      ? Math.round((currentWeekRegistrations - previousWeekRegistrations) / previousWeekRegistrations * 100)
      : currentWeekRegistrations > 0 ? 100 : 0;

    // Get recent activity (last 10 activities)
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();

    const recentRegistrations = await db.collection('registrations')
      .find({})
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();

    const recentActivity = [
      ...recentUsers.map(user => ({
        type: 'user',
        message: `New user registered: ${user.email}`,
        time: getTimeAgo(user.created_at),
        timestamp: user.created_at
      })),
      ...recentRegistrations.map(reg => ({
        type: 'registration',
        message: `New team registration: ${reg.team_id}`,
        time: getTimeAgo(reg.created_at),
        timestamp: reg.created_at
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return NextResponse.json({
      totalUsers,
      totalRegistrations,
      totalRevenue,
      pendingApprovals,
      recentActivity,
      growth: {
        revenue: revenueGrowth,
        users: userGrowth,
        registrations: registrationGrowth
      }
    });

  } catch (error) {
    console.error('Dashboard stats API error:', error);
    
    // Return error response instead of mock data
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}
