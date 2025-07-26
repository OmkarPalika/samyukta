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
      recentActivity
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