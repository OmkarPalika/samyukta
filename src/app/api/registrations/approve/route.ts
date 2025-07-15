import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json();
    
    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }
    
    const collections = await getTypedCollections();
    
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
    
    // Update status to confirmed
    const updateData = {
      status: 'confirmed' as const,
      updated_at: new Date()
    };
    
    if (ObjectId.isValid(registrationId)) {
      await collections.registrations.updateOne(
        { _id: new ObjectId(registrationId) },
        { $set: updateData }
      );
    } else {
      await collections.registrations.updateOne(
        { team_id: registrationId },
        { $set: updateData }
      );
    }
    
    // Get updated registration
    const updatedRegistration = ObjectId.isValid(registrationId)
      ? await collections.registrations.findOne({ _id: new ObjectId(registrationId) })
      : await collections.registrations.findOne({ team_id: registrationId });
    
    return NextResponse.json({
      success: true,
      message: 'Registration approved successfully',
      registration: {
        id: updatedRegistration?._id?.toString(),
        team_id: updatedRegistration?.team_id,
        status: updatedRegistration?.status,
        updated_at: updatedRegistration?.updated_at.toISOString()
      }
    });
    
  } catch (error) {
    console.error('Failed to approve registration:', error);
    return NextResponse.json(
      { error: 'Failed to approve registration' },
      { status: 500 }
    );
  }
}