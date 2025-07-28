import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { to, subject, message, userName } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: to, subject, message' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #0F0F23 0%, #1A1B3A 100%); color: #ffffff;">
  
  <!-- Main Container -->
  <div style="max-width: 600px; margin: 0 auto; background: #0F0F23; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.3); letter-spacing: -0.5px;">
        SAMYUKTA 2025
      </h1>
      <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 8px 20px; margin: 15px auto 0; display: inline-block; border: 1px solid rgba(255,255,255,0.1);">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
          ADMIN MESSAGE
        </p>
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${userName ? `
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: 700;">
          Hello ${userName}!
        </h2>
      </div>
      ` : ''}
      
      <div style="background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <h3 style="margin: 0 0 20px 0; color: #4F46E5; font-size: 20px; font-weight: 700;">
          ${subject}
        </h3>
        
        <div style="color: #ffffff; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
          ${message}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 14px;">
          This message was sent by the Samyukta 2025 administration team.
        </p>
        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.4); font-size: 12px;">
          ANITS Campus, Visakhapatnam | January 24-26, 2025
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Send email
    await sendEmail(to, subject, htmlContent);

    return NextResponse.json({ 
      message: 'Email sent successfully',
      to: to,
      subject: subject
    });

  } catch (error) {
    console.error('Send custom email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
