import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate rating data
    if (!data.pitch_team_id || !data.voter_id || !data.rating || !data.pitch_round) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // For now, return success - implement database logic later
    const pitchRating = {
      id: `pitch_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString()
    };

    return NextResponse.json(pitchRating);
  } catch (error) {
    console.error('Pitch rating creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create pitch rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    new URL(request.url);

    // For now, return empty array - implement database logic later
    return NextResponse.json([]);
  } catch (error) {
    console.error('Pitch ratings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pitch ratings' },
      { status: 500 }
    );
  }
}