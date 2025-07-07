import { NextRequest, NextResponse } from 'next/server';

const MOCK_USERS = [
  {
    id: 'admin1',
    email: 'admin@samyukta.com',
    full_name: 'System Administrator',
    role: 'admin'
  },
  {
    id: 'coord1',
    email: 'coordinator@samyukta.com',
    full_name: 'Event Coordinator',
    role: 'coordinator'
  },
  {
    id: 'part1',
    email: 'participant@samyukta.com',
    full_name: 'John Participant',
    role: 'participant',
    college: 'ANITS',
    track: 'Cloud Computing',
    year: '3rd Year',
    dept: 'CSE'
  }
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ users: MOCK_USERS });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}