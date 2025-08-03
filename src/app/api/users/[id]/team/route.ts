import { NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const collections = await getTypedCollections();

    // Find user's team membership
    const teamMember = await collections.team_members.findOne({ participant_id: id });

    if (!teamMember) {
      return NextResponse.json({ error: 'User is not part of any team' }, { status: 404 });
    }

    // Get team registration details using the registration_id from team member
    const registration = await collections.registrations.findOne({ _id: new ObjectId(teamMember.registration_id) });

    if (!registration) {
      return NextResponse.json({ error: 'Team registration not found' }, { status: 404 });
    }

    return NextResponse.json({
      team_id: registration.team_id,
      registration_id: teamMember.registration_id,
      college: registration.college,
      team_size: registration.team_size,
      competition_track: registration.competition_track,
      workshop_track: registration.workshop_track
    });

  } catch (error) {
    console.error('Error fetching user team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}