import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { notifications, userNotifications } = getCollections(db);

    // Date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current week stats
    const totalSent = await notifications.countDocuments({ status: 'sent' });
    const totalSentThisWeek = await notifications.countDocuments({ 
      status: 'sent',
      sent_at: { $gte: oneWeekAgo }
    });
    const totalSentLastWeek = await notifications.countDocuments({ 
      status: 'sent',
      sent_at: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    // User notification stats
    const totalUserNotifications = await userNotifications.countDocuments();
    const totalUserNotificationsThisWeek = await userNotifications.countDocuments({
      created_at: { $gte: oneWeekAgo }
    });
    const totalUserNotificationsLastWeek = await userNotifications.countDocuments({
      created_at: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const totalRead = await userNotifications.countDocuments({ read: true });
    const totalReadThisWeek = await userNotifications.countDocuments({ 
      read: true,
      read_at: { $gte: oneWeekAgo }
    });
    const totalReadLastWeek = await userNotifications.countDocuments({ 
      read: true,
      read_at: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const totalClicked = await userNotifications.countDocuments({ clicked: true });
    const totalClickedThisWeek = await userNotifications.countDocuments({ 
      clicked: true,
      clicked_at: { $gte: oneWeekAgo }
    });
    const totalClickedLastWeek = await userNotifications.countDocuments({ 
      clicked: true,
      clicked_at: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    // Calculate rates
    const deliveryRate = totalSent > 0 ? (totalUserNotifications / totalSent) * 100 : 0;
    const readRate = totalUserNotifications > 0 ? (totalRead / totalUserNotifications) * 100 : 0;
    const clickRate = totalUserNotifications > 0 ? (totalClicked / totalUserNotifications) * 100 : 0;

    // Calculate week-over-week changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const sentChange = calculateChange(totalSentThisWeek, totalSentLastWeek);
    const deliveredChange = calculateChange(totalUserNotificationsThisWeek, totalUserNotificationsLastWeek);
    
    const readRateThisWeek = totalUserNotificationsThisWeek > 0 ? (totalReadThisWeek / totalUserNotificationsThisWeek) * 100 : 0;
    const readRateLastWeek = totalUserNotificationsLastWeek > 0 ? (totalReadLastWeek / totalUserNotificationsLastWeek) * 100 : 0;
    const readRateChange = calculateChange(readRateThisWeek, readRateLastWeek);

    const clickRateThisWeek = totalUserNotificationsThisWeek > 0 ? (totalClickedThisWeek / totalUserNotificationsThisWeek) * 100 : 0;
    const clickRateLastWeek = totalUserNotificationsLastWeek > 0 ? (totalClickedLastWeek / totalUserNotificationsLastWeek) * 100 : 0;
    const clickRateChange = calculateChange(clickRateThisWeek, clickRateLastWeek);

    const stats = {
      total_sent: totalSent,
      total_delivered: totalUserNotifications,
      total_read: totalRead,
      total_clicked: totalClicked,
      delivery_rate: deliveryRate,
      read_rate: readRate,
      click_rate: clickRate,
      // Week-over-week changes
      sent_change: sentChange,
      delivered_change: deliveredChange,
      read_rate_change: readRateChange,
      click_rate_change: clickRateChange
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Failed to fetch notification stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification stats' },
      { status: 500 }
    );
  }
}
