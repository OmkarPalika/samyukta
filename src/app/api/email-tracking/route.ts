import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';

// Email open tracking endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    const type = searchParams.get('type'); // 'open' or 'click'

    if (!trackingId) {
      return new NextResponse('Missing tracking ID', { status: 400 });
    }

    const db = await getDb();
    const { emailTracking } = getCollections(db);

    // Record the tracking event
    await emailTracking.updateOne(
      { _id: new ObjectId(trackingId) },
      {
        $set: {
          [`${type}_at`]: new Date(),
          [`${type}_count`]: { $inc: 1 }
        },
        $setOnInsert: {
          created_at: new Date()
        }
      },
      { upsert: true }
    );

    if (type === 'open') {
      // Return a 1x1 transparent pixel for email open tracking
      const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );

      return new NextResponse(pixel, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else {
      // For click tracking, redirect to the original URL
      const redirectUrl = searchParams.get('url');
      if (redirectUrl) {
        return NextResponse.redirect(redirectUrl);
      }
      return new NextResponse('OK', { status: 200 });
    }
  } catch (error) {
    console.error('Email tracking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Get email tracking statistics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notification_id, campaign_id } = body;

    const db = await getDb();
    const { emailTracking } = getCollections(db);

    const filter: Record<string, unknown> = {};
    if (notification_id) filter.notification_id = new ObjectId(notification_id);
    if (campaign_id) filter.campaign_id = new ObjectId(campaign_id);

    const stats = await emailTracking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total_sent: { $sum: 1 },
          total_opens: { $sum: { $cond: [{ $gt: ['$open_count', 0] }, 1, 0] } },
          total_clicks: { $sum: { $cond: [{ $gt: ['$click_count', 0] }, 1, 0] } },
          unique_opens: { $sum: { $cond: [{ $ne: ['$open_at', null] }, 1, 0] } },
          unique_clicks: { $sum: { $cond: [{ $ne: ['$click_at', null] }, 1, 0] } }
        }
      }
    ]).toArray();

    const result = stats[0] || {
      total_sent: 0,
      total_opens: 0,
      total_clicks: 0,
      unique_opens: 0,
      unique_clicks: 0
    };

    return NextResponse.json({
      ...result,
      open_rate: result.total_sent > 0 ? (result.unique_opens / result.total_sent * 100).toFixed(2) : '0.00',
      click_rate: result.total_sent > 0 ? (result.unique_clicks / result.total_sent * 100).toFixed(2) : '0.00'
    });
  } catch (error) {
    console.error('Failed to get email tracking stats:', error);
    return NextResponse.json(
      { error: 'Failed to get tracking stats' },
      { status: 500 }
    );
  }
}