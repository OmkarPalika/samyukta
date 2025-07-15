import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participantId, qrData } = await request.json();
    const collections = await getTypedCollections();
    
    // Record QR scan
    await collections.games.insertOne({
      user_id: participantId,
      action: 'qr_scan',
      data: qrData,
      timestamp: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const scanCount = await collections.games.countDocuments({
      user_id: participantId,
      action: 'qr_scan'
    });
    
    return NextResponse.json({ success: true, scanCount });
  } catch {
    return NextResponse.json({ error: 'QR scan failed' }, { status: 500 });
  }
}