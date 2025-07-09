import { NextResponse } from 'next/server';
import { MOCK_COMPETITIONS } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(MOCK_COMPETITIONS);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}