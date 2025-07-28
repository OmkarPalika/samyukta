import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Registration code is required' 
      }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
    // Find registration by team_id or registration_code
    const registration = await collections.registrations.findOne({
      $or: [
        { team_id: code },
        { registration_code: code }
      ]
    });
    
    if (!registration) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid registration code'
      });
    }
    
    // Get team members
    const members = await collections.teamMembers.find({ 
      registration_id: registration.team_id 
    }).toArray();
    
    const response = {
      valid: true,
      registration: {
        id: registration._id?.toString(),
        team_id: registration.team_id,
        college: registration.college,
        team_size: registration.team_size,
        ticket_type: registration.ticket_type,
        workshop_track: registration.workshop_track,
        competition_track: registration.competition_track,
        total_amount: registration.total_amount,
        status: registration.status,
        created_at: registration.created_at.toISOString(),
        members: members.map(member => ({
          participant_id: member.participant_id,
          full_name: member.full_name,
          email: member.email,
          present: member.present || false
        }))
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Failed to validate registration:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Failed to validate registration' 
      },
      { status: 500 }
    );
  }
}
