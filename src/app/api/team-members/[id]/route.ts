import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function PATCH(
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

    const updateData = await request.json();
    const memberId = id;

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

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team member update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}