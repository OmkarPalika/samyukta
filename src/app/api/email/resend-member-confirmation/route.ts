import { NextRequest, NextResponse } from 'next/server';
import { getDbPromise } from '@/lib/mongodb';
import { User } from '@/entities/User';
import { ObjectId, Db } from 'mongodb';

// Type definitions
interface RegistrationDocument {
  _id: ObjectId;
  team_id: string;
  college: string;
  total_amount: number;
  workshop_track: string;
  competition_track: string;
}

interface TeamMemberDocument {
  _id: ObjectId;
  registration_id: ObjectId;
  full_name: string;
  email: string;
  college?: string;
  phone?: string;
  whatsapp?: string;
  passkey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, memberEmail, teamId } = body;

    console.log('Resend member confirmation request:', { memberId, memberEmail, teamId });

    // Check admin authentication
    const currentUser = await User.me();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!memberId || !memberEmail) {
      return NextResponse.json({ error: 'Member ID and email are required' }, { status: 400 });
    }

    const db = await getDbPromise();

    // Get member details
    let member: TeamMemberDocument | null;
    try {
      member = await db.collection('team_members').findOne({
        _id: new ObjectId(memberId)
      }) as TeamMemberDocument | null;
    } catch (mongoError) {
      console.error('Error finding member:', mongoError);
      return NextResponse.json({ error: 'Invalid member ID format' }, { status: 400 });
    }

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get registration details
    const registration = await db.collection('registrations').findOne({
      _id: member.registration_id
    }) as RegistrationDocument | null;

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Prepare email data
    const emailData = {
      name: member.full_name,
      email: member.email,
      college: member.college || registration.college,
      phone: member.whatsapp || member.phone,
      registrationId: registration.team_id,
      passkey: member.passkey || generatePasskey(),
      eventDates: "August 6-9, 2025",
      venue: "ANITS Campus, Visakhapatnam",
      ticketType: getTicketType(registration),
      amount: registration.total_amount,
      workshopTrack: registration.workshop_track,
      teamMembers: await getTeamMemberNames(db, registration._id)
    };

    // Send email
    console.log('Sending email with data:', emailData);
    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Email API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    // Update member's passkey if it was generated
    if (!member.passkey) {
      await db.collection('team_members').updateOne(
        { _id: new ObjectId(memberId) },
        { $set: { passkey: emailData.passkey } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Confirmation email sent to ${member.full_name}`,
      email: member.email
    });

  } catch (error) {
    console.error('Resend member confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to resend confirmation email' },
      { status: 500 }
    );
  }
}

function generatePasskey(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getTicketType(registration: RegistrationDocument): string {
  const hasWorkshop = registration.workshop_track && registration.workshop_track !== 'None';
  const hasCompetition = registration.competition_track && registration.competition_track !== 'None';

  if (hasWorkshop && hasCompetition) {
    if (registration.competition_track === 'Hackathon') {
      return "Entry + Workshop + Hackathon";
    } else {
      return "Entry + Workshop + Pitch";
    }
  } else if (hasWorkshop) {
    return "Entry + Workshop";
  } else if (hasCompetition) {
    if (registration.competition_track === 'Hackathon') {
      return "Combo (Hackathon)";
    } else {
      return "Combo (Startup Pitch)";
    }
  } else {
    return "Entry Only";
  }
}

async function getTeamMemberNames(db: Db, registrationId: ObjectId): Promise<string[]> {
  const members = await db.collection('team_members').find({
    registration_id: registrationId
  }).toArray() as TeamMemberDocument[];

  return members.map((member: TeamMemberDocument) => member.full_name);
}