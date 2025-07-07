import { NextRequest, NextResponse } from 'next/server';

// Mock users database with one credential for each role
const MOCK_USERS = [
  {
    id: 'admin1',
    email: 'admin@samyukta.com',
    password: 'admin123',
    full_name: 'System Administrator',
    role: 'admin'
  },
  {
    id: 'coord1',
    email: 'coordinator@samyukta.com',
    password: 'coord123',
    full_name: 'Event Coordinator',
    role: 'coordinator'
  },
  {
    id: 'part1',
    email: 'participant@samyukta.com',
    password: 'part123',
    full_name: 'John Participant',
    role: 'participant',
    college: 'ANITS',
    track: 'Cloud Computing',
    year: '3rd Year',
    dept: 'CSE'
  }
];

// Mock login endpoint - Replace with your actual authentication logic
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user in mock database
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        college: user.college,
        track: user.track,
        year: user.year,
        dept: user.dept,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create response with authentication cookie
      const response = NextResponse.json(userData);
      response.cookies.set('auth_token', `mock_token_${user.id}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}