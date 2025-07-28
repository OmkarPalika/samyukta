import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

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

    const collections = await getTypedCollections();
    
    // Check if user has already rated this pitch in this round
    const existingRating = await collections.pitchRatings?.findOne({
      pitch_team_id: data.pitch_team_id,
      voter_id: data.voter_id,
      pitch_round: data.pitch_round
    });
    
    if (existingRating) {
      // Update existing rating
      await collections.pitchRatings.updateOne(
        { _id: existingRating._id },
        { 
          $set: { 
            rating: data.rating,
            comment: data.comments,
            updated_at: new Date()
          } 
        }
      );
      
      return NextResponse.json({
        id: existingRating._id.toString(),
        ...data,
        updated_at: new Date().toISOString(),
        message: 'Rating updated successfully'
      });
    }
    
    // Create new rating
    const result = await collections.pitchRatings.insertOne({
      pitch_team_id: data.pitch_team_id,
      voter_id: data.voter_id,
      rating: data.rating,
      pitch_round: data.pitch_round,
      comment: data.comments || '',
      created_at: new Date(),
      updated_at: new Date()
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...data,
      created_at: new Date().toISOString()
    });
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
    const { searchParams } = new URL(request.url);
    const pitchTeamId = searchParams.get('pitch_team_id');
    const voterId = searchParams.get('voter_id');
    const pitchRound = searchParams.get('pitch_round');
    
    const collections = await getTypedCollections();
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (pitchTeamId) filter.pitch_team_id = pitchTeamId;
    if (voterId) filter.voter_id = voterId;
    if (pitchRound) filter.pitch_round = pitchRound;
    
    // Get ratings
    const ratings = await collections.pitchRatings
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
    
    // Format ratings for response
    const formattedRatings = ratings.map(rating => ({
      id: rating._id.toString(),
      pitch_team_id: rating.pitch_team_id,
      voter_id: rating.voter_id,
      rating: rating.rating,
      pitch_round: rating.pitch_round,
      comment: rating.comment,
      created_at: rating.created_at.toISOString(),
      updated_at: rating.updated_at.toISOString()
    }));
    
    return NextResponse.json(formattedRatings);
  } catch (error) {
    console.error('Pitch ratings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pitch ratings' },
      { status: 500 }
    );
  }
}
