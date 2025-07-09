import { NextRequest, NextResponse } from 'next/server';
import { MOCK_GAME_DATA, MOCK_GAME_STATS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ data: MOCK_GAME_DATA, stats: MOCK_GAME_STATS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    switch (action) {
      case 'scanQR':
        MOCK_GAME_STATS.totalScans++;
        MOCK_GAME_DATA.push({
          id: Date.now().toString(),
          userId,
          action: 'qr_scan',
          data,
          timestamp: new Date().toISOString()
        });
        break;

      case 'addSuspect':
        MOCK_GAME_STATS.totalSuspects++;
        MOCK_GAME_DATA.push({
          id: Date.now().toString(),
          userId,
          action: 'suspect_added',
          suspectId: data,
          timestamp: new Date().toISOString()
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, stats: MOCK_GAME_STATS });
  } catch {
    return NextResponse.json({ error: 'Failed to process game action' }, { status: 500 });
  }
}