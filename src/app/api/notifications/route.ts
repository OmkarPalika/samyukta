import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const db = await getDb();
    const { notifications } = getCollections(db);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const notificationList = await notifications
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    const formattedNotifications = notificationList.map(notification => ({
      id: notification._id?.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      recipients: notification.recipients,
      channels: notification.channels,
      status: notification.status,
      scheduled_at: notification.scheduled_at?.toISOString(),
      sent_at: notification.sent_at?.toISOString(),
      expires_at: notification.expires_at?.toISOString(),
      action_url: notification.action_url,
      action_text: notification.action_text,
      created_by: notification.created_by,
      created_at: notification.created_at.toISOString(),
      updated_at: notification.updated_at.toISOString()
    }));

    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      message, 
      type = 'info', 
      priority = 'medium',
      category = 'general',
      recipients,
      channels = ['in_app'],
      status = 'draft',
      scheduled_at,
      expires_at,
      action_url,
      action_text
    } = body;

    if (!title || !message || !recipients) {
      return NextResponse.json(
        { error: 'Title, message, and recipients are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { notifications } = getCollections(db);

    const newNotification = {
      title,
      message,
      type,
      priority,
      category,
      recipients,
      channels,
      status,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      expires_at: expires_at ? new Date(expires_at) : undefined,
      action_url,
      action_text,
      created_by: user.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await notifications.insertOne(newNotification);

    return NextResponse.json({
      notification: {
        _id: result.insertedId.toString(),
        ...newNotification,
        scheduled_at: newNotification.scheduled_at?.toISOString(),
        expires_at: newNotification.expires_at?.toISOString(),
        created_at: newNotification.created_at.toISOString(),
        updated_at: newNotification.updated_at.toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
