import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread_only') === 'true';

    const db = await getDb();
    const { userNotifications } = getCollections(db);

    // Get user notifications with notification details
    const pipeline = [
      {
        $match: {
          user_id: user.id,
          ...(unreadOnly ? { read: false } : {})
        }
      },
      {
        $lookup: {
          from: 'notifications',
          localField: 'notification_id',
          foreignField: '_id',
          as: 'notification'
        }
      },
      {
        $unwind: '$notification'
      },
      {
        $sort: { created_at: -1 }
      },
      {
        $limit: 50 // Limit to recent 50 notifications
      }
    ];

    const userNotificationsList = await userNotifications.aggregate(pipeline).toArray();

    const formattedNotifications = userNotificationsList.map(userNotif => ({
      id: userNotif._id?.toString(),
      notification_id: userNotif.notification_id,
      title: userNotif.notification.title,
      message: userNotif.notification.message,
      type: userNotif.notification.type,
      priority: userNotif.notification.priority,
      action_url: userNotif.notification.action_url,
      action_text: userNotif.notification.action_text,
      read: userNotif.read,
      read_at: userNotif.read_at?.toISOString(),
      clicked: userNotif.clicked,
      clicked_at: userNotif.clicked_at?.toISOString(),
      created_at: userNotif.created_at.toISOString(),
      expires_at: userNotif.notification.expires_at?.toISOString()
    }));

    return NextResponse.json({ 
      notifications: formattedNotifications,
      unread_count: formattedNotifications.filter(n => !n.read).length
    });
  } catch (error) {
    console.error('Failed to fetch user notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, notification_ids } = body;

    const db = await getDb();
    const { userNotifications } = getCollections(db);

    if (action === 'mark_all_read') {
      // Mark all user notifications as read
      await userNotifications.updateMany(
        { user_id: user.id, read: false },
        { 
          $set: { 
            read: true, 
            read_at: new Date() 
          } 
        }
      );

      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (action === 'mark_read' && notification_ids && Array.isArray(notification_ids)) {
      // Mark specific notifications as read
      await userNotifications.updateMany(
        { 
          user_id: user.id, 
          _id: { $in: notification_ids.map((id: string) => new ObjectId(id)) },
          read: false 
        },
        { 
          $set: { 
            read: true, 
            read_at: new Date() 
          } 
        }
      );

      return NextResponse.json({ success: true, message: 'Notifications marked as read' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update user notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}