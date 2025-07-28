import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    const collections = await getTypedCollections();
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    const competitions = await collections.competitions
      .find(filter)
      .sort({ competition_date: 1 })
      .toArray();
    
    const formattedCompetitions = competitions.map(comp => ({
      id: comp._id?.toString(),
      name: comp.name,
      description: comp.description,
      category: comp.category,
      max_team_size: comp.max_team_size,
      min_team_size: comp.min_team_size,
      registration_fee: comp.registration_fee,
      slots_available: comp.slots_available,
      slots_filled: comp.slots_filled,
      registration_deadline: comp.registration_deadline.toISOString(),
      competition_date: comp.competition_date.toISOString(),
      status: comp.status,
      requirements: comp.requirements,
      prizes: comp.prizes,
      created_at: comp.created_at.toISOString(),
      updated_at: comp.updated_at.toISOString()
    }));
    
    return NextResponse.json(formattedCompetitions);
  } catch (error) {
    console.error('Failed to fetch competitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const competitionData = await request.json();
    const collections = await getTypedCollections();
    
    // Check if competition with same name exists
    const existing = await collections.competitions.findOne({ name: competitionData.name });
    if (existing) {
      return NextResponse.json({ error: 'Competition with this name already exists' }, { status: 400 });
    }
    
    const result = await collections.competitions.insertOne({
      ...competitionData,
      registration_deadline: new Date(competitionData.registration_deadline),
      competition_date: new Date(competitionData.competition_date),
      slots_filled: 0,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return NextResponse.json({
      success: true,
      competition: {
        id: result.insertedId.toString(),
        ...competitionData
      }
    });
  } catch (error) {
    console.error('Failed to create competition:', error);
    return NextResponse.json(
      { error: 'Failed to create competition' },
      { status: 500 }
    );
  }
}
