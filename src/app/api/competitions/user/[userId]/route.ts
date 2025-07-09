import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPETITIONS, MOCK_COMPETITION_REGISTRATIONS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Get user's competition registrations
    const userRegistrations = MOCK_COMPETITION_REGISTRATIONS.filter(reg => reg.user_id === userId);
    
    // Combine with competition details
    const userCompetitions = userRegistrations.map(registration => {
      const competition = MOCK_COMPETITIONS.find(comp => comp.id === registration.competition_id);
      return {
        competition,
        registration,
        team_members: [] // Add team members if registration_type is 'team'
      };
    }).filter(item => item.competition);

    return NextResponse.json(userCompetitions);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user competitions' },
      { status: 500 }
    );
  }
}