import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPETITION_REGISTRATIONS } from '@/lib/mock-data';
import { CompetitionRegistration } from '@/lib/types';

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

    // Mock file upload - in real implementation, upload to cloud storage
    const payment_screenshot_url = `uploads/payments/${Date.now()}_${payment_screenshot.name}`;

    const registration = {
      id: `reg-${Date.now()}`,
      competition_id,
      user_id,
      team_id: team_id || null,
      registration_type,
      transaction_id,
      payment_screenshot_url,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    MOCK_COMPETITION_REGISTRATIONS.push(registration as CompetitionRegistration);

    return NextResponse.json(registration);
  } catch {
    return NextResponse.json(
      { error: 'Failed to join competition' },
      { status: 500 }
    );
  }
}