import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const collections = await getTypedCollections();
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (userId) filter.user_id = userId;
    
    // Get game data
    const gameData = await collections.games
      .find(filter)
      .sort({ timestamp: -1 })
      .toArray();
    
    // Get game stats
    const totalScans = await collections.games.countDocuments({ action: 'qr_scan' });
    const totalSuspects = await collections.games.countDocuments({ action: 'suspect_added' });
    const totalUsers = await collections.games.distinct('user_id').then(ids => ids.length);
    
    const stats = {
      totalScans,
      totalSuspects,
      totalUsers,
      lastUpdated: new Date().toISOString()
    };
    
    // Format game data for response
    const formattedGameData = gameData.map(item => ({
      id: item._id.toString(),
      userId: item.user_id,
      action: item.action,
      data: item.data,
      suspectId: item.suspect_id,
      timestamp: item.timestamp.toISOString()
    }));
    
    return NextResponse.json({ data: formattedGameData, stats });
  } catch (error) {
    console.error('Failed to fetch game data:', error);
    return NextResponse.json({ error: 'Failed to fetch game data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;
    
    if (!action || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    const now = new Date();
    
    switch (action) {
      case 'scanQR':
        await collections.games.insertOne({
          user_id: userId,
          action: 'qr_scan',
          data,
          timestamp: now,
          created_at: now,
          updated_at: now
        });
        break;

      case 'addSuspect':
        await collections.games.insertOne({
          user_id: userId,
          action: 'suspect_added',
          suspect_id: data,
          timestamp: now,
          created_at: now,
          updated_at: now
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Get updated stats
    const totalScans = await collections.games.countDocuments({ action: 'qr_scan' });
    const totalSuspects = await collections.games.countDocuments({ action: 'suspect_added' });
    const totalUsers = await collections.games.distinct('user_id').then(ids => ids.length);
    
    const stats = {
      totalScans,
      totalSuspects,
      totalUsers,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Failed to process game action:', error);
    return NextResponse.json({ error: 'Failed to process game action' }, { status: 500 });
  }
}