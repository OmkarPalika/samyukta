import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const collections = await getTypedCollections();
    
    // Find team member by email
    const member = await collections.teamMembers.findOne({ email });
    
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get all team members for this registration
    const teamMembers = await collections.teamMembers
      .find({ registration_id: member.registration_id })
      .toArray();

    // Return QR codes for all team members
    const qrCodes = teamMembers.map(m => ({
      participant_id: m.participant_id,
      name: m.full_name,
      qr_code: m.qr_code_url || null
    }));

    return NextResponse.json({
      success: true,
      team_id: member.registration_id,
      qr_codes: qrCodes
    });

  } catch (error) {
    console.error('Failed to fetch team QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team QR codes' },
      { status: 500 }
    );
  }
}