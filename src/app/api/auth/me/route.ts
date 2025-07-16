import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const collections = await getTypedCollections();
    
    // Validate session
    const session = await collections.sessions.findOne({ 
      session_token: token,
      expires_at: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Try to find user in users collection first (admin/coordinator)
    const user = await collections.users.findOne({ 
      _id: ObjectId.isValid(session.user_id) ? new ObjectId(session.user_id) : undefined 
    }, { projection: { password: 0 } });
    
    if (user) {
      return NextResponse.json({
        id: user._id?.toString(),
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        college: user.college,
        track: user.track,
        year: user.year,
        dept: user.dept,
        linkedin: user.linkedin,
        instagram: user.instagram,
        portfolio: user.portfolio
      });
    }

    // Fallback to team members (participants)
    const participant = await collections.teamMembers.findOne({ 
      participant_id: session.user_id 
    });
    
    if (participant) {
      return NextResponse.json({
        id: participant.participant_id,
        full_name: participant.full_name,
        email: participant.email,
        role: 'participant',
        college: participant.college,
        year: participant.year,
        dept: participant.department
      });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}