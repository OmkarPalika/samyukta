import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if user is admin
    const user = await collections.users.findOne({ _id: new ObjectId(session.user_id) });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Find team member
    const member = await collections.teamMembers.findOne({ _id: new ObjectId(id) });
    
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const response = {
      id: member._id?.toString(),
      participant_id: member.participant_id,
      passkey: member.passkey,
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp,
      year: member.year,
      department: member.department,
      college: member.college,
      gender: member.gender,
      accommodation: member.accommodation,
      food_preference: member.food_preference,
      is_club_lead: member.is_club_lead,
      club_name: member.club_name,
      present: member.present,
      registration_id: member.registration_id,
      created_at: member.created_at?.toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Team member fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateTeamMember(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateTeamMember(request, params);
}

async function updateTeamMember(
  request: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
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

    // Check if user is admin
    const user = await collections.users.findOne({ _id: new ObjectId(session.user_id) });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updateData = await request.json();
    const memberId = id;

    console.log('Updating team member:', memberId, 'with data:', updateData);

    // Validate ObjectId format
    if (!ObjectId.isValid(memberId)) {
      console.log('Invalid ObjectId format:', memberId);
      return NextResponse.json({ error: 'Invalid team member ID format' }, { status: 400 });
    }

    // Validate required fields
    if (!updateData.full_name || !updateData.email) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    // Check if team member exists first
    const existingMember = await collections.teamMembers.findOne({ _id: new ObjectId(memberId) });
    console.log('Existing member found:', existingMember ? 'Yes' : 'No');
    
    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Update team member
    const result = await collections.teamMembers.updateOne(
      { _id: new ObjectId(memberId) },
      { 
        $set: {
          full_name: updateData.full_name,
          email: updateData.email,
          phone: updateData.phone,
          whatsapp: updateData.whatsapp,
          year: updateData.year,
          department: updateData.department,
          college: updateData.college,
          gender: updateData.gender,
          accommodation: updateData.accommodation,
          food_preference: updateData.food_preference,
          is_club_lead: updateData.is_club_lead,
          club_name: updateData.club_name,
          updated_at: new Date()
        }
      }
    );

    console.log('Update result:', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team member update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}