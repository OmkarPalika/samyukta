import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

      const response = NextResponse.json(userData);
      response.cookies.set('auth_token', `mock_token_${user.id}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
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