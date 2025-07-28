import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';

// Process scheduled notifications
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job or scheduler
    // For security, you might want to add an API key check here
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'your-secret-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { notifications } = getCollections(db);

    // Find notifications that are scheduled and ready to be sent
    const now = new Date();
    const scheduledNotifications = await notifications.find({
      status: 'scheduled',
      scheduled_at: { $lte: now }
    }).toArray();

    let processedCount = 0;
    const results = [];

    for (const notification of scheduledNotifications) {
      try {
        // Send the notification by calling the send endpoint
        const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${notification._id}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${expectedToken}`
          }
        });

        if (sendResponse.ok) {
          processedCount++;
          results.push({
            id: notification._id.toString(),
            title: notification.title,
            status: 'sent'
          });
        } else {
          results.push({
            id: notification._id.toString(),
            title: notification.title,
            status: 'failed',
            error: await sendResponse.text()
          });
        }
      } catch (error) {
        console.error(`Failed to process scheduled notification ${notification._id}:`, error);
        results.push({
          id: notification._id.toString(),
          title: notification.title,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${processedCount} scheduled notifications`,
      total_found: scheduledNotifications.length,
      processed: processedCount,
      results
    });

  } catch (error) {
    console.error('Failed to process scheduled notifications:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled notifications' },
      { status: 500 }
    );
  }
}

// Get scheduled notifications (admin only)
export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { notifications } = getCollections(db);

    const scheduledNotifications = await notifications.find({
      status: 'scheduled',
      scheduled_at: { $gte: new Date() }
    }).sort({ scheduled_at: 1 }).toArray();

    const formattedNotifications = scheduledNotifications.map(notification => ({
      id: notification._id.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      scheduled_at: notification.scheduled_at?.toISOString(),
      recipients: notification.recipients,
      channels: notification.channels,
      created_by: notification.created_by,
      created_at: notification.created_at.toISOString()
    }));

    return NextResponse.json({ 
      scheduled_notifications: formattedNotifications,
      count: formattedNotifications.length
    });

  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduled notifications' },
      { status: 500 }
    );
  }
}