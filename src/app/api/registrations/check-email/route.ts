import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    const existingRegistration = await collections.registrations.findOne({
      'members.email': email.toLowerCase()
    });

    return NextResponse.json({ exists: !!existingRegistration });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ error: 'Failed to check email' }, { status: 500 });
  }
}
