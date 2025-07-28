import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify this is an internal request or admin user
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, message, action_url, action_text, priority } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .priority-high { border-left: 4px solid #e74c3c; }
            .priority-urgent { border-left: 4px solid #c0392b; }
            .priority-medium { border-left: 4px solid #f39c12; }
            .priority-low { border-left: 4px solid #27ae60; }
            .action-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Samyukta 2025</h1>
              <p>ANITS Cultural Festival</p>
            </div>
            <div class="content priority-${priority || 'medium'}">
              <h2>${subject}</h2>
              <p>${message.replace(/\n/g, '<br>')}</p>
              ${action_url ? `
                <div style="text-align: center;">
                  <a href="${action_url}" class="action-button">
                    ${action_text || 'View Details'}
                  </a>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated notification from Samyukta 2025.</p>
              <p>© 2025 ANITS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Use the existing email service
    const { sendEmail } = await import('@/lib/email');
    await sendEmail(to, `[Samyukta 2025] ${subject}`, htmlContent);

    return NextResponse.json({ 
      success: true, 
      message: 'Notification email sent successfully' 
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return NextResponse.json(
      { error: 'Failed to send notification email' },
      { status: 500 }
    );
  }
}