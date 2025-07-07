import { NextRequest, NextResponse } from 'next/server';
import { RegistrationCreateRequest, RegistrationResponse } from '@/entities/Registration';

// GET /api/registrations - Get all registrations with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');
    const status = searchParams.get('status') as 'completed' | 'pending_review' | null;
    const ticketType = searchParams.get('ticket_type') as 'Combo' | 'Custom' | null;

    // Mock data - replace with actual database queries
    const registrations: RegistrationResponse[] = [
      {
        id: '1',
        team_id: 'team_001',
        college: college || 'ANITS',
        team_size: 3,
        members: [
          {
            participant_id: 'p001',
            passkey: 'pass123',
            full_name: 'John Doe',
            email: 'john@example.com',
            whatsapp: '+91 9876543210',
            year: '3rd',
            department: 'CSE',
            accommodation: true,
            food_preference: 'veg',
          },
        ],
        ticket_type: ticketType || 'Combo',
        workshop_track: 'AI',
        competition_track: 'Hackathon',
        total_amount: 1500,
        transaction_id: 'TXN123456',
        payment_screenshot_url: 'https://example.com/payment.jpg',
        status: status || 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        registration_code: 'REG001',
        qr_code_url: 'https://example.com/qr.png',
      },
    ];

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// POST /api/registrations - Create a new registration
export async function POST(request: NextRequest) {
  try {
    const body: RegistrationCreateRequest = await request.json();

    // Validate required fields
    if (!body.college || !body.members || body.members.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: college, members' },
        { status: 400 }
      );
    }

    // Validate ticket_type
    if (!['Combo', 'Custom'].includes(body.ticket_type)) {
      return NextResponse.json(
        { error: 'Invalid ticket_type. Must be "Combo" or "Custom"' },
        { status: 400 }
      );
    }

    // Validate workshop_track
    if (!['Cloud', 'AI', 'None'].includes(body.workshop_track)) {
      return NextResponse.json(
        { error: 'Invalid workshop_track. Must be "Cloud", "AI", or "None"' },
        { status: 400 }
      );
    }

    // Validate competition_track
    if (!['Hackathon', 'Pitch', 'None'].includes(body.competition_track)) {
      return NextResponse.json(
        { error: 'Invalid competition_track. Must be "Hackathon", "Pitch", or "None"' },
        { status: 400 }
      );
    }

    // Validate team members
    for (const member of body.members) {
      if (!member.full_name || !member.email || !member.whatsapp) {
        return NextResponse.json(
          { error: 'Each member must have full_name, email, and whatsapp' },
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

    // Mock database insert - replace with actual database logic
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

    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}