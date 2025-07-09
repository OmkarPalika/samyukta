import { NextRequest, NextResponse } from 'next/server';
import { RegistrationCreateRequest, RegistrationResponse } from '@/lib/types';
import { MOCK_REGISTRATIONS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationCreateRequest = await request.json();

    if (!body.college || !body.members || body.members.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: college and members' },
        { status: 400 }
      );
    }

    for (const member of body.members) {
      if (!member.full_name || !member.email || !member.whatsapp || !member.year || !member.department) {
        return NextResponse.json(
          { error: 'All member fields are required: full_name, email, whatsapp, year, department' },
          { status: 400 }
        );
      }
      
      if (!['veg', 'non-veg'].includes(member.food_preference)) {
        return NextResponse.json(
          { error: 'Invalid food_preference. Must be "veg" or "non-veg"' },
          { status: 400 }
        );
      }
    }

    const newRegistration: RegistrationResponse = {
      id: `reg_${Date.now()}`,
      team_id: `team_${Date.now()}`,
      college: body.college,
      team_size: body.members.length,
      members: body.members.map((member, index) => ({
        ...member,
        participant_id: member.participant_id || `p_${Date.now()}_${index}`,
        passkey: member.passkey || `pass_${Math.random().toString(36).substr(2, 9)}`,
      })),
      ticket_type: body.ticket_type,
      workshop_track: body.workshop_track,
      competition_track: body.competition_track,
      total_amount: body.total_amount || 0,
      transaction_id: body.transaction_id,
      payment_screenshot_url: body.payment_screenshot_url,
      status: 'pending_review',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      registration_code: `REG${Date.now()}`,
      qr_code_url: `https://example.com/qr/${Date.now()}.png`,
    };

    MOCK_REGISTRATIONS.push(newRegistration);
    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(MOCK_REGISTRATIONS);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}