import { NextResponse } from 'next/server';

// Mock logout endpoint - Replace with your actual authentication logic
export async function POST() {
  try {
    // Create response that clears the authentication cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}