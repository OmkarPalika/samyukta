import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check in users collection (single source of truth)
    try {
      const { getCollection } = await import('@/lib/db-utils');
      const users = await getCollection('users');
      const user = await users.findOne({ email });
      if (user) {
        return NextResponse.json({ exists: true, role: user.role || 'participant' });
      }
    } catch (error) {
      console.log('Users collection error:', error);
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}