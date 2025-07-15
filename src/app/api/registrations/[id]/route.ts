import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const collections = await getTypedCollections();
    const { id: registrationId } = await params;
    
    // Find registration by ID or team_id
    let registration;
    if (ObjectId.isValid(registrationId)) {
      registration = await collections.registrations.findOne({ _id: new ObjectId(registrationId) });
    } else {
      registration = await collections.registrations.findOne({ team_id: registrationId });
    }
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    // Get team members
    const members = await collections.teamMembers.find({ 
      registration_id: registration.team_id 
    }).toArray();
    
    const response = {
      id: registration._id?.toString(),
      team_id: registration.team_id,
      college: registration.college,
      team_size: registration.team_size,
      ticket_type: registration.ticket_type,
      workshop_track: registration.workshop_track,
      competition_track: registration.competition_track,
      total_amount: registration.total_amount,
      transaction_id: registration.transaction_id,
      payment_screenshot_url: registration.payment_screenshot_url,
      status: registration.status,
      created_at: registration.created_at.toISOString(),
      updated_at: registration.updated_at.toISOString(),
      members: members.map(member => ({
        id: member._id?.toString(),
        participant_id: member.participant_id,
        passkey: member.passkey,
        full_name: member.full_name,
        email: member.email,
        whatsapp: member.whatsapp,
        year: member.year,
        department: member.department,
        college: member.college,
        accommodation: member.accommodation,
        food_preference: member.food_preference,
        is_club_lead: member.is_club_lead,
        club_name: member.club_name,
        present: member.present
      }))
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Failed to fetch registration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const collections = await getTypedCollections();
    const { id: registrationId } = await params;
    const updateData = await request.json();
    
    // Find registration
    let registration;
    if (ObjectId.isValid(registrationId)) {
      registration = await collections.registrations.findOne({ _id: new ObjectId(registrationId) });
    } else {
      registration = await collections.registrations.findOne({ team_id: registrationId });
    }
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    // Update registration
    const updateFields = {
      ...updateData,
      updated_at: new Date()
    };
    
    if (ObjectId.isValid(registrationId)) {
      await collections.registrations.updateOne(
        { _id: new ObjectId(registrationId) },
        { $set: updateFields }
      );
    } else {
      await collections.registrations.updateOne(
        { team_id: registrationId },
        { $set: updateFields }
      );
    }
    
    // Get updated registration
    const updatedRegistration = ObjectId.isValid(registrationId)
      ? await collections.registrations.findOne({ _id: new ObjectId(registrationId) })
      : await collections.registrations.findOne({ team_id: registrationId });
    
    return NextResponse.json({
      success: true,
      registration: {
        id: updatedRegistration?._id?.toString(),
        team_id: updatedRegistration?.team_id,
        college: updatedRegistration?.college,
        team_size: updatedRegistration?.team_size,
        ticket_type: updatedRegistration?.ticket_type,
        workshop_track: updatedRegistration?.workshop_track,
        competition_track: updatedRegistration?.competition_track,
        total_amount: updatedRegistration?.total_amount,
        transaction_id: updatedRegistration?.transaction_id,
        payment_screenshot_url: updatedRegistration?.payment_screenshot_url,
        status: updatedRegistration?.status,
        created_at: updatedRegistration?.created_at.toISOString(),
        updated_at: updatedRegistration?.updated_at.toISOString()
      }
    });
    
  } catch (error) {
    console.error('Failed to update registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const collections = await getTypedCollections();
    const { id: registrationId } = await params;
    
    // Find registration
    let registration;
    if (ObjectId.isValid(registrationId)) {
      registration = await collections.registrations.findOne({ _id: new ObjectId(registrationId) });
    } else {
      registration = await collections.registrations.findOne({ team_id: registrationId });
    }
    
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    // Delete team members first
    await collections.teamMembers.deleteMany({ registration_id: registration.team_id });
    
    // Delete registration
    if (ObjectId.isValid(registrationId)) {
      await collections.registrations.deleteOne({ _id: new ObjectId(registrationId) });
    } else {
      await collections.registrations.deleteOne({ team_id: registrationId });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    });
    
  } catch (error) {
    console.error('Failed to delete registration:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}