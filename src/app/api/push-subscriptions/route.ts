import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { verifyAuth } from '@/lib/server-auth';

// Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Valid subscription is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { pushSubscriptions } = getCollections(db);

    // Store or update the subscription
    await pushSubscriptions.updateOne(
      { 
        user_id: user.id,
        endpoint: subscription.endpoint 
      },
      {
        $set: {
          user_id: user.id,
          subscription: subscription,
          created_at: new Date(),
          updated_at: new Date(),
          active: true
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      message: 'Push subscription saved successfully' 
    });
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}

// Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { pushSubscriptions } = getCollections(db);

    await pushSubscriptions.updateOne(
      { 
        user_id: user.id,
        endpoint: endpoint 
      },
      {
        $set: {
          active: false,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({ 
      message: 'Push subscription removed successfully' 
    });
  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 }
    );
  }
}

// Get user's push subscriptions
export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { pushSubscriptions } = getCollections(db);

    const subscriptions = await pushSubscriptions.find({
      user_id: user.id,
      active: true
    }).toArray();

    return NextResponse.json({ 
      subscriptions: subscriptions.map(sub => ({
        id: sub._id.toString(),
        endpoint: sub.subscription.endpoint,
        created_at: sub.created_at.toISOString()
      }))
    });
  } catch (error) {
    console.error('Failed to get push subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to get push subscriptions' },
      { status: 500 }
    );
  }
}