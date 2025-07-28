import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      message, 
      type, 
      priority,
      recipients,
      channels,
      status,
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

    const updateData = {
      title,
      message,
      type,
      priority,
      recipients,
      channels,
      status,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      expires_at: expires_at ? new Date(expires_at) : undefined,
      action_url,
      action_text,
      updated_at: new Date()
    };

    const { id } = await params;
    const result = await notifications.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { notifications } = getCollections(db);

    const { id } = await params;
    const result = await notifications.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}