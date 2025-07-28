import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/db-utils';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { userId, email, name } = await request.json();

    if (!userId || !email || !name) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, email, name' 
      }, { status: 400 });
    }

    // Validate userId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get user data from database
    const users = await getCollection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has registration data
    const registrations = await getCollection('registrations');
    const registration = await registrations.findOne({ 
      'members.participant_id': userId 
    });

    if (!registration) {
      return NextResponse.json({ 
        error: 'No registration found for this user' 
      }, { status: 404 });
    }

    // Find the specific member in the registration
    const member = registration.members.find((m: { participant_id: string }) => m.participant_id === userId);
    
    if (!member) {
      return NextResponse.json({ 
        error: 'Member not found in registration' 
      }, { status: 404 });
    }

    // Prepare registration data for email
    const registrationData = {
      name: member.full_name || name,
      email: member.email || email,
      college: registration.college || 'ANITS',
      phone: member.whatsapp || 'N/A',
      ticketType: registration.ticket_type || 'Combo',
      registrationId: registration.team_id || registration._id.toString(),
      amount: registration.total_amount || 0,
      workshopTrack: registration.workshop_track || 'None',
      eventDates: 'January 24-26, 2025',
      venue: 'ANITS Campus, Visakhapatnam',
      teamMembers: registration.members.map((m: { full_name: string }) => m.full_name)
    };

    // Send confirmation email
    await sendRegistrationConfirmation(
      email, 
      registrationData, 
      member.passkey || 'TEMP123'
    );

    return NextResponse.json({ 
      message: 'Confirmation email sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Resend confirmation email error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
