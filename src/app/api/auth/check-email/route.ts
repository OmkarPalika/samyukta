import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check in admins collection
    try {
      const { getCollection } = await import('@/lib/db-utils');
      const admins = await getCollection('admins');
      const admin = await admins.findOne({ email });
      if (admin) {
        return NextResponse.json({ exists: true, role: 'admin' });
      }
    } catch (error) {
      console.log('Admin collection not found or error:', error);
    }

    // Check in coordinators collection
    try {
      const { getCollection } = await import('@/lib/db-utils');
      const coordinators = await getCollection('coordinators');
      const coordinator = await coordinators.findOne({ email });
      if (coordinator) {
        return NextResponse.json({ exists: true, role: 'coordinator' });
      }
    } catch (error) {
      console.log('Coordinator collection not found or error:', error);
    }

    // Check in participants collection (registrations)
    try {
      const { getCollection } = await import('@/lib/db-utils');
      const registrations = await getCollection('registrations');
      const participant = await registrations.findOne({ 
        'members.email': email 
      });
      if (participant) {
        return NextResponse.json({ exists: true, role: 'participant' });
      }
    } catch (error) {
      console.log('Registration collection not found or error:', error);
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}