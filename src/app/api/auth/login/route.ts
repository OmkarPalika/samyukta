import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    
    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        userId: userId,
        email: user.email,
        role: user.role || 'participant'
      },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Create session in database
    const sessionExpiry = new Date();
    sessionExpiry.setDate(sessionExpiry.getDate() + 7); // 7 days
    
    await collections.sessions.insertOne({
      session_token: token,
      user_id: userId,
      expires_at: sessionExpiry,
      created_at: new Date(),
      user_agent: request.headers.get('user-agent') || '',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    // Set cookie
    const response = NextResponse.json({
      id: userId,
      full_name: user.full_name,
      email: user.email,
      role: user.role || 'participant',
      college: user.college
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
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
