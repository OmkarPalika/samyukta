import { NextRequest, NextResponse } from 'next/server';

// Mock game data storage
const gameData: Array<{
  id: string;
  userId: string;
  action: string;
  data?: string;
  suspectId?: string;
  timestamp: string;
}> = [];
const gameStats = {
  totalScans: 0,
  activePlayers: 0,
  totalSuspects: 0
};

export async function GET() {
  return NextResponse.json({ data: gameData, stats: gameStats });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    switch (action) {
      case 'scanQR':
        gameStats.totalScans++;
        gameData.push({
          id: Date.now().toString(),
          userId,
          action: 'qr_scan',
          data,
          timestamp: new Date().toISOString()
        });
        break;

      case 'addSuspect':
        gameStats.totalSuspects++;
        gameData.push({
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

    return NextResponse.json({ success: true, stats: gameStats });
  } catch {
    return NextResponse.json({ error: 'Failed to process game action' }, { status: 500 });
  }
}