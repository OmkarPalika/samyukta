import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCollections, NotificationSchema, UserSchema, PushSubscriptionSchema } from '@/lib/mongodb-schemas';
import { ObjectId, WithId, Collection } from 'mongodb';
import { verifyAuth } from '@/lib/server-auth';


async function sendEmailNotifications(recipients: WithId<UserSchema>[], notification: WithId<NotificationSchema>) {
  let successful = 0;
  
  // Import email service and templates
  const { sendEmail } = await import('@/lib/email');
  const { generateNotificationEmail } = await import('@/lib/email-notification-templates');
  
  // Get database collections for tracking
  const db = await getDb();
  const { emailTracking } = getCollections(db);

  for (const recipient of recipients) {
    try {
      // Create tracking record
      const trackingRecord = await emailTracking.insertOne({
        notification_id: notification._id?.toString(),
        user_id: recipient._id?.toString() || '',
        email: recipient.email,
        event_type: 'sent',
        timestamp: new Date(),
        created_at: new Date()
      });

      // Generate email using the new template system with tracking
      const htmlContent = generateNotificationEmail({
        title: notification.title,
        message: notification.message,
        type: notification.type as 'info' | 'success' | 'warning' | 'error' | 'announcement',
        priority: notification.priority as 'low' | 'medium' | 'high' | 'urgent',
        action_url: notification.action_url,
        action_text: notification.action_text,
        recipient_name: recipient.full_name,
        tracking_id: trackingRecord.insertedId.toString()
      });

      await sendEmail(
        recipient.email,
        `[Samyukta 2025] ${notification.title}`,
        htmlContent
      );
      successful++;
    } catch (error) {
      console.error(`Error sending email to ${recipient.email}:`, error);
    }
  }

  return { successful };
}

async function sendPushNotifications(recipients: WithId<UserSchema>[], notification: WithId<NotificationSchema>, pushSubscriptionsCollection: Collection<PushSubscriptionSchema>) {
  let successful = 0;
  
  // Import push notification service
  const { pushNotificationService } = await import('@/lib/push-notifications');
  
  for (const recipient of recipients) {
    try {
      // Get user's push subscriptions
      const userSubscriptions = await pushSubscriptionsCollection.find({
        user_id: recipient._id?.toString() || ''
      }).toArray();

      for (const subDoc of userSubscriptions) {
        try {
          const result = await pushNotificationService.sendPushNotification(
            subDoc.subscription,
            {
              title: notification.title,
              message: notification.message,
              type: notification.type as 'info' | 'success' | 'warning' | 'error' | 'announcement',
              priority: notification.priority as 'low' | 'medium' | 'high' | 'urgent',
              action_url: notification.action_url,
              tag: `notification-${notification._id}`
            }
          );

          if (result) {
            successful++;
          }
        } catch (error) {
          console.error(`Failed to send push to subscription ${subDoc._id}:`, error);
          // Mark subscription as inactive if it fails
          await pushSubscriptionsCollection.updateOne(
            { _id: subDoc._id },
            { $set: { active: false, updated_at: new Date() } }
          );
        }
      }
    } catch (error) {
      console.error(`Error processing push notifications for user ${recipient._id}:`, error);
    }
  }

  return { successful };
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const { notifications, userNotifications, users, pushSubscriptions } = getCollections(db);

    const { id } = await params;
    
    // Get notification
    const notification = await notifications.findOne({
      _id: new ObjectId(id)
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (notification.status !== 'draft') {
      return NextResponse.json({ error: 'Notification already sent' }, { status: 400 });
    }

    // Get recipients based on notification settings
    const recipientQuery: Record<string, unknown> = {};
    
    if (notification.recipients.type === 'role' && notification.recipients.filters?.roles) {
      recipientQuery.role = { $in: notification.recipients.filters.roles };
    } else if (notification.recipients.type === 'custom' && notification.recipients.filters?.user_ids) {
      recipientQuery._id = { $in: notification.recipients.filters.user_ids.map((id: string) => new ObjectId(id)) };
    }
    // For 'all' type, no filter is applied

    const recipients = await users.find(recipientQuery).toArray();

    // Create user notifications for in-app channel
    if (notification.channels.includes('in_app')) {
      const userNotificationDocs = recipients.map(recipient => ({
        notification_id: id,
        user_id: recipient._id?.toString(),
        read: false,
        clicked: false,
        created_at: new Date()
      }));

      if (userNotificationDocs.length > 0) {
        await userNotifications.insertMany(userNotificationDocs);
      }
    }

    // Handle other channels (email, sms, push)
    const deliveredCount = recipients.length;
    const deliveryResults = {
      in_app: recipients.length,
      email: 0,
      sms: 0,
      push: 0
    };
    
    // For email channel, send emails
    if (notification.channels.includes('email')) {
      try {
        const emailResults = await sendEmailNotifications(recipients, notification);
        deliveryResults.email = emailResults.successful;
      } catch (error) {
        console.error('Failed to send email notifications:', error);
      }
    }
    
    // For SMS channel, send SMS (placeholder - would integrate with SMS service)
    if (notification.channels.includes('sms')) {
      try {
        // const smsResults = await sendSMSNotifications(recipients, notification);
        // deliveryResults.sms = smsResults.successful;
        console.log('SMS notifications would be sent here');
      } catch (error) {
        console.error('Failed to send SMS notifications:', error);
      }
    }
    
    // For push channel, send push notifications
    if (notification.channels.includes('push')) {
      try {
        const pushResults = await sendPushNotifications(recipients, notification, pushSubscriptions);
        deliveryResults.push = pushResults.successful;
      } catch (error) {
        console.error('Failed to send push notifications:', error);
      }
    }

    // Update notification status
    await notifications.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'sent',
          sent_at: new Date(),
          delivered_count: deliveredCount,
          delivery_results: deliveryResults
        } 
      }
    );

    return NextResponse.json({ 
      success: true, 
      recipients_count: recipients.length,
      delivered_count: deliveredCount,
      delivery_results: deliveryResults
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    
    // Update notification status to failed
    try {
      const db = await getDb();
      const { notifications } = getCollections(db);
      const { id } = await params;
      await notifications.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'failed' } }
      );
    } catch (updateError) {
      console.error('Failed to update notification status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
