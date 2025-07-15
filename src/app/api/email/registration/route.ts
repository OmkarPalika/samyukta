import { NextRequest, NextResponse } from 'next/server';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    
    await sendRegistrationConfirmation(registrationData.email, registrationData, registrationData.passkey);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
  }
}
