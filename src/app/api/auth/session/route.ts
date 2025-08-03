import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No authentication token found' 
      }, { status: 401 });
    }

    const collections = await getTypedCollections();
    
    // Validate session
    const session = await collections.sessions.findOne({ 
      session_token: token,
      expires_at: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'Invalid or expired session' 
      }, { status: 401 });
    }

    // Try to find user in users collection first (admin/coordinator)
    let user = null;
    if (ObjectId.isValid(session.user_id)) {
      user = await collections.users.findOne({ 
        _id: new ObjectId(session.user_id)
      }, { projection: { password: 0 } });
    }
    
    if (user) {
      return NextResponse.json({
        authenticated: true,
        user: {
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
        },
        session: {
          expires_at: session.expires_at,
          created_at: session.created_at
        }
      });
    }

    // Fallback to team members (participants)
    const participant = await collections.teamMembers.findOne({ 
      participant_id: session.user_id 
    });
    
    if (participant) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: participant.participant_id,
          full_name: participant.full_name,
          email: participant.email,
          role: 'participant',
          college: participant.college,
          year: participant.year,
          dept: participant.department
        },
        session: {
          expires_at: session.expires_at,
          created_at: session.created_at
        }
      });
    }

    return NextResponse.json({ 
      authenticated: false, 
      error: 'User not found' 
    }, { status: 401 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST method to refresh/extend session
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
    }

    const collections = await getTypedCollections();
    
    // Find existing session
    const session = await collections.sessions.findOne({ 
      session_token: token,
      expires_at: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // Extend session by 7 days
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);
    
    await collections.sessions.updateOne(
      { session_token: token },
      { 
        $set: { 
          expires_at: newExpiry,
          last_activity: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Session extended successfully',
      expires_at: newExpiry
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE method to invalidate session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
    }

    const collections = await getTypedCollections();
    
    // Remove session from database
    await collections.sessions.deleteOne({ session_token: token });

    // Clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Session invalidated successfully'
    });
    
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Session invalidation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}