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

    // Try to find member by ObjectId or participant_id
    let member;
    if (ObjectId.isValid(id)) {
      member = await collections.teamMembers.findOne({ _id: new ObjectId(id) });
    }
    if (!member) {
      member = await collections.teamMembers.findOne({ participant_id: id });
    }
    
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

    console.log('Update request received:', {
      memberId,
      isObjectIdValid: ObjectId.isValid(memberId),
      updateData
    });

    // Validate required fields
    if (!updateData.full_name || !updateData.email) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    // Try to find member by ObjectId or participant_id
    let existingMember;
    
    // Try by ObjectId if valid
    if (ObjectId.isValid(memberId)) {
      const objectId = new ObjectId(memberId);
      console.log('Searching by ObjectId:', {
        memberId,
        objectIdStr: objectId.toString()
      });
      
      existingMember = await collections.teamMembers.findOne({ 
        _id: objectId 
      });
    }
    
    // If not found, try by participant_id
    if (!existingMember) {
      console.log('Trying participant_id lookup:', {
        memberId
      });
      
      const cursor = await collections.teamMembers.find({}).toArray();
      console.log('All members:', cursor.map(m => ({
        _id: m._id.toString(),
        participant_id: m.participant_id,
        email: m.email
      })));
      
      existingMember = await collections.teamMembers.findOne({ 
        participant_id: memberId 
      });
    }
    
    // Log the full state for debugging
    console.log('Search results:', {
      memberIdReceived: memberId,
      memberFound: existingMember !== null,
      foundMemberId: existingMember?._id?.toString(),
      foundParticipantId: existingMember?.participant_id
    });
    
    console.log('Existing member found:', existingMember ? 'Yes' : 'No');
    
    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Always use the _id from the found member as an ObjectId for the update
    const updateFilter = { _id: existingMember._id };

    const result = await collections.teamMembers.updateOne(
      updateFilter,
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