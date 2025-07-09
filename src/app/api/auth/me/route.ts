import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mock-data';

// Mock authentication check - Replace with your actual authentication logic
export async function GET(request: NextRequest) {
  try {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        error: 'Not authenticated', 
        message: 'No authentication token found' 
      }, { status: 401 });
    }

    // Extract user ID from token (mock_token_userId)
    const userId = token.replace('mock_token_', '');
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid token', 
        message: 'User not found' 
      }, { status: 401 });
    }

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

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}