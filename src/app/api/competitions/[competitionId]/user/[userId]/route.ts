import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPETITION_REGISTRATIONS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ competitionId: string; userId: string }> }
) {
  try {
    const { competitionId, userId } = await params;
    
    // Check if user is registered for this competition
    const registration = MOCK_COMPETITION_REGISTRATIONS.find(
      reg => reg.competition_id === competitionId && reg.user_id === userId
    );

    if (!registration) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(registration);
  } catch {
    return NextResponse.json(
      { error: 'Failed to check registration' },
      { status: 500 }
    );
  }
}