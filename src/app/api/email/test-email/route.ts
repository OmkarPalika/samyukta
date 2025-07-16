import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f4; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #00D4FF;">🧪 Email Test Successful!</h1>
          <p>Your Gmail SMTP configuration is working correctly.</p>
          <p style="color: #666;">Test sent at: ${new Date().toLocaleString()}</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Next Steps:</strong><br>
            • Configure your Gmail App Password<br>
            • Test the registration email template<br>
            • Deploy to production
          </div>
        </div>
      </div>
    `;
    
    await sendEmail(email, '🧪 Samyukta Email Test', testHtml);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
