import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const collections = await getTypedCollections();

    // Check in users collection (admin/coordinator accounts)
    const user = await collections.users.findOne({ email });
    if (user) {
      return NextResponse.json({ exists: true, role: user.role });
    }

    // Check in team_members collection (participants)
    const participant = await collections.teamMembers.findOne({ email });
    if (participant) {
      return NextResponse.json({ exists: true, role: 'participant' });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}