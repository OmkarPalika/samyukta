import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { uploadToGoogleDrive, UPLOAD_TYPES } from '@/lib/gdrive';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const competition_id = formData.get('competition_id') as string;
    const user_id = formData.get('user_id') as string;
    const registration_type = formData.get('registration_type') as string;
    const transaction_id = formData.get('transaction_id') as string;
    const team_id = formData.get('team_id') as string;
    const payment_screenshot = formData.get('payment_screenshot') as File;

    if (!competition_id || !user_id || !registration_type || !transaction_id || !payment_screenshot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const collections = await getTypedCollections();
    
    // Check if competition exists
    const competition = await collections.competitions.findOne({ _id: new ObjectId(competition_id) });
    if (!competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }
    
    // Check if user already registered for this competition
    const existingRegistration = await collections.competitionRegistrations.findOne({
      competition_id,
      user_id
    });
    
    if (existingRegistration) {
      return NextResponse.json({ 
        error: 'You are already registered for this competition' 
      }, { status: 400 });
    }
    
    // Upload payment screenshot
    let payment_screenshot_url;
    try {
      const fileName = `payment_${Date.now()}_${payment_screenshot.name}`;
      payment_screenshot_url = await uploadToGoogleDrive(
        payment_screenshot, 
        fileName, 
        UPLOAD_TYPES.PAYMENT_SCREENSHOTS
      );
    } catch (uploadError) {
      console.error('Payment screenshot upload failed:', uploadError);
      payment_screenshot_url = `uploads/payments/${Date.now()}_${payment_screenshot.name}`;
    }

    // Create registration
    const now = new Date();
    const result = await collections.competitionRegistrations.insertOne({
      competition_id,
      user_id,
      team_id: team_id || undefined,
      registration_type: registration_type as "team" | "individual",
      transaction_id,
      payment_screenshot_url,
      status: 'pending',
      created_at: now,
      updated_at: now
    });

    // Update competition slots filled count
    await collections.competitions.updateOne(
      { _id: new ObjectId(competition_id) },
      { $inc: { slots_filled: 1 } }
    );

    return NextResponse.json({
      id: result.insertedId.toString(),
      competition_id,
      user_id,
      team_id: team_id || null,
      registration_type,
      transaction_id,
      payment_screenshot_url,
      status: 'pending',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    });
  } catch (error) {
    console.error('Failed to join competition:', error);
    return NextResponse.json(
      { error: 'Failed to join competition' },
      { status: 500 }
    );
  }
}
