import { NextResponse } from 'next/server';
import { MOCK_REGISTRATION_STATS } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(MOCK_REGISTRATION_STATS);
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration stats' },
      { status: 500 }
    );
  }
}