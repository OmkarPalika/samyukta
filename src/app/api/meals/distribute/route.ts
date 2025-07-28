import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { participant_id, meal_type } = await request.json();
    
    if (!participant_id || !meal_type) {
      return NextResponse.json({ error: 'Participant ID and meal type required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find participant
    const participant = await collections.teamMembers.findOne({ participant_id });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Check if meal already distributed
    const existingMeal = await collections.meals?.findOne({ 
      participant_id, 
      meal_type,
      date: new Date().toISOString().split('T')[0]
    });

    if (existingMeal) {
      return NextResponse.json({ error: 'Meal already distributed today' }, { status: 400 });
    }

    // Record meal distribution
    await collections.meals?.insertOne({
      participant_id,
      participant_name: participant.full_name,
      meal_type,
      food_preference: participant.food_preference,
      distributed_at: new Date(),
      date: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({
      success: true,
      participant: {
        name: participant.full_name,
        food_preference: participant.food_preference
      },
      meal_type
    });

  } catch (error) {
    console.error('Meal distribution error:', error);
    return NextResponse.json({ error: 'Failed to distribute meal' }, { status: 500 });
  }
}
