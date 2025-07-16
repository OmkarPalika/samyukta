import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, passkey } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    let user = null;
    let userId = '';
    
    // Check users collection first (for admin/coordinator accounts)
    if (password) {
      const foundUser = await collections.users.findOne({ email });
      if (foundUser && await bcrypt.compare(password, foundUser.password)) {
        user = foundUser;
        userId = foundUser._id!.toString();
      }
    }
    
    // Fallback to team members with passkey
    if (!user && passkey) {
      const participant = await collections.teamMembers.findOne({ email, passkey });
      if (participant) {
        user = {
          _id: participant._id,
          email: participant.email,
          full_name: participant.full_name,
          role: 'participant' as const,
          college: participant.college
        };
        userId = participant.participant_id || participant._id!.toString();
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Create session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await collections.sessions.insertOne({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt,
      created_at: new Date()
    });
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: user.full_name,
        email: user.email,
        role: user.role || 'participant',
        college: user.college
      }
    });
    
    response.cookies.set('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    
    // Ensure we always return JSON
    if (error instanceof Error && error.message.includes('Database connection failed')) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}