import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mock-data';
import { getTypedCollections } from '@/lib/db-utils';

// Mock authentication check - Replace with your actual authentication logic
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if it's a mock token (for development)
    if (token.startsWith('mock_token_')) {
      const userId = token.replace('mock_token_', '');
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      return NextResponse.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        college: user.college,
        track: user.track,
        year: user.year,
        dept: user.dept
      });
    }

    // Real session validation
    const collections = await getTypedCollections();
    const session = await collections.sessions.findOne({ 
      session_token: token,
      expires_at: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Get participant data
    const participant = await collections.teamMembers.findOne({ participant_id: session.user_id });
    
    if (!participant) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      id: participant.participant_id,
      full_name: participant.full_name,
      email: participant.email,
      role: 'participant',
      college: participant.college,
      year: participant.year,
      dept: participant.department
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}