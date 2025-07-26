import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get users with pagination (only admin/coordinator users)
    const users = await collections.users
      .find(filter, { projection: { password: 0 } })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    // Get total count
    const total = await collections.users.countDocuments(filter);
    
    const formattedUsers = users.map(user => ({
      id: user._id?.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      college: user.college,
      track: user.track,
      year: user.year,
      dept: user.dept,
      designation: user.designation,
      committee: user.committee,
      linkedin: user.linkedin,
      instagram: user.instagram,
      portfolio: user.portfolio,
      created_at: user.created_at?.toISOString(),
      updated_at: user.updated_at?.toISOString()
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = await request.json();
    const collections = await getTypedCollections();
    
    // Check if email already exists
    const existingUser = await collections.users.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    // Hash password if provided
    if (userData.password) {
      const bcrypt = await import('bcryptjs');
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Insert user
    const result = await collections.users.insertOne({
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        ...userData,
        password: undefined
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}