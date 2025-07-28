import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections } from '@/lib/mongodb-schemas';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { emailCampaigns, emailTemplates, users } = getCollections(db);

    const { id } = await params;
    
    // Get campaign
    const campaign = await emailCampaigns.findOne({
      _id: new ObjectId(id)
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json({ error: 'Campaign already sent or in progress' }, { status: 400 });
    }

    // Get template
    const template = await emailTemplates.findOne({
      _id: new ObjectId(campaign.template_id)
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Get recipients based on campaign settings
    const recipientQuery: Record<string, unknown> = {};
    
    if (campaign.recipients.type === 'role' && campaign.recipients.filters?.roles) {
      recipientQuery.role = { $in: campaign.recipients.filters.roles };
    } else if (campaign.recipients.type === 'custom' && campaign.recipients.filters?.custom_emails) {
      recipientQuery.email = { $in: campaign.recipients.filters.custom_emails };
    }
    // For 'all' type, no filter is applied

    const recipients = await users.find(recipientQuery).toArray();

    // Update campaign status
    await emailCampaigns.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'sending',
          sent_at: new Date(),
          stats: {
            total_recipients: recipients.length,
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            failed: 0
          }
        } 
      }
    );

    // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate sending emails
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        // Replace template variables
        let htmlContent = template.html_content;
        let subject = template.subject;
        
        // Replace common variables
        htmlContent = htmlContent.replace(/\{\{name\}\}/g, recipient.full_name || 'User');
        htmlContent = htmlContent.replace(/\{\{email\}\}/g, recipient.email);
        subject = subject.replace(/\{\{name\}\}/g, recipient.full_name || 'User');

        // Here you would send the actual email
        // await sendEmail(recipient.email, subject, htmlContent);
        
        sentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        failedCount++;
      }
    }

    // Update final campaign status
    await emailCampaigns.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: failedCount === 0 ? 'sent' : 'failed',
          stats: {
            total_recipients: recipients.length,
            sent: sentCount,
            delivered: sentCount, // In real implementation, this would be tracked separately
            opened: 0,
            clicked: 0,
            failed: failedCount
          }
        } 
      }
    );

    return NextResponse.json({ 
      success: true, 
      sent: sentCount, 
      failed: failedCount,
      total: recipients.length
    });
  } catch (error) {
    console.error('Failed to send email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send email campaign' },
      { status: 500 }
    );
  }
}