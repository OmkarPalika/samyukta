import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { users } = getCollections(db);

    const userData = await users.findOne({ _id: new ObjectId(user.id) });
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Default preferences if not set
    const defaultPreferences = {
      email_notifications: true,
      in_app_notifications: true,
      notification_types: {
        info: true,
        success: true,
        warning: true,
        error: true,
        announcement: true
      },
      notification_frequency: 'immediate', // immediate, daily, weekly
      quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };

    const preferences = userData.notification_preferences || defaultPreferences;

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { users } = getCollections(db);

    await users.updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          notification_preferences: preferences,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({ 
      message: 'Notification preferences updated successfully',
      preferences 
    });
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}