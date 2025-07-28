// Email templates for different notification types

interface NotificationEmailData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  action_text?: string;
  recipient_name?: string;
  tracking_id?: string;
  base_url?: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'info': return '#3B82F6'; // blue
    case 'success': return '#10B981'; // green
    case 'warning': return '#F59E0B'; // yellow
    case 'error': return '#EF4444'; // red
    case 'announcement': return '#8B5CF6'; // purple
    default: return '#6B7280'; // gray
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'info': return 'ℹ️';
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'announcement': return '📢';
    default: return '🔔';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'URGENT';
    case 'high': return 'HIGH PRIORITY';
    case 'medium': return 'MEDIUM PRIORITY';
    case 'low': return 'LOW PRIORITY';
    default: return '';
  }
};

export const generateNotificationEmail = (data: NotificationEmailData): string => {
  const typeColor = getTypeColor(data.type);
  const typeIcon = getTypeIcon(data.type);
  const priorityLabel = getPriorityLabel(data.priority);
  const baseUrl = data.base_url || process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta2025.vercel.app';
  
  // Generate tracking URLs
  const trackingPixelUrl = data.tracking_id 
    ? `${baseUrl}/api/email-tracking?id=${data.tracking_id}&type=open`
    : '';
  
  const trackedActionUrl = data.action_url && data.tracking_id
    ? `${baseUrl}/api/email-tracking?id=${data.tracking_id}&type=click&url=${encodeURIComponent(data.action_url)}`
    : data.action_url;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Samyukta 2025</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .notification-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background-color: ${typeColor}15;
            border-left: 4px solid ${typeColor};
            border-radius: 8px;
        }
        .notification-icon {
            font-size: 24px;
            margin-right: 12px;
        }
        .notification-title {
            font-size: 20px;
            font-weight: 600;
            color: ${typeColor};
            margin: 0;
        }
        .priority-badge {
            display: inline-block;
            background-color: ${data.priority === 'urgent' ? '#EF4444' : data.priority === 'high' ? '#F59E0B' : data.priority === 'medium' ? '#3B82F6' : '#10B981'};
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 25px;
        }
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .action-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            color: #718096;
            font-size: 14px;
            margin: 0;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .notification-header {
                flex-direction: column;
                text-align: center;
            }
            .notification-icon {
                margin-right: 0;
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Samyukta 2025</div>
            <div class="subtitle">ANITS Cultural & Technical Summit</div>
        </div>
        
        <div class="content">
            <div class="notification-header">
                <span class="notification-icon">${typeIcon}</span>
                <div>
                    <h2 class="notification-title">${data.title}</h2>
                    ${priorityLabel ? `<span class="priority-badge">${priorityLabel}</span>` : ''}
                </div>
            </div>
            
            <div class="message">
                ${data.message.replace(/\n/g, '<br>')}
            </div>
            
            ${trackedActionUrl ? `
                <a href="${trackedActionUrl}" class="action-button">
                    ${data.action_text || 'View Details'} →
                </a>
            ` : ''}
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                ${data.recipient_name ? `Hi ${data.recipient_name},` : 'Hello,'}<br>
                This notification was sent to you from the Samyukta 2025 platform. 
                You can also view this and other notifications in your dashboard.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2025 Samyukta - ANITS Cultural & Technical Summit<br>
                Anil Neerukonda Institute of Technology and Sciences, Visakhapatnam
            </p>
            <div class="social-links">
                <a href="mailto:samyukta.summit@gmail.com">Contact Us</a>
                <a href="https://samyukta2025.vercel.app">Visit Website</a>
            </div>
        </div>
    </div>
    
    ${trackingPixelUrl ? `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />` : ''}
</body>
</html>
  `.trim();
};

// Template for bulk notification emails
export const generateBulkNotificationEmail = (notifications: NotificationEmailData[], recipientName?: string): string => {
  const notificationItems = notifications.map(notification => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: ${getTypeColor(notification.type)}15; border-left: 4px solid ${getTypeColor(notification.type)}; border-radius: 8px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 18px; margin-right: 10px;">${getTypeIcon(notification.type)}</span>
        <h3 style="margin: 0; color: ${getTypeColor(notification.type)};">${notification.title}</h3>
        ${notification.priority !== 'low' ? `<span style="background-color: ${notification.priority === 'urgent' ? '#EF4444' : notification.priority === 'high' ? '#F59E0B' : '#3B82F6'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 10px;">${getPriorityLabel(notification.priority)}</span>` : ''}
      </div>
      <p style="margin: 0; color: #4a5568;">${notification.message}</p>
      ${notification.action_url ? `<a href="${notification.action_url}" style="color: ${getTypeColor(notification.type)}; text-decoration: none; font-weight: 600; margin-top: 10px; display: inline-block;">${notification.action_text || 'View Details'} →</a>` : ''}
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Notifications - Samyukta 2025</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">Samyukta 2025</div>
            <div style="opacity: 0.9; font-size: 16px;">You have ${notifications.length} new notification${notifications.length > 1 ? 's' : ''}</div>
        </div>
        
        <div class="content">
            <p style="margin-bottom: 25px;">
                ${recipientName ? `Hi ${recipientName},` : 'Hello,'}<br>
                Here are your latest notifications from Samyukta 2025:
            </p>
            
            ${notificationItems}
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                You can view all your notifications and manage your preferences in your dashboard.
            </p>
        </div>
        
        <div class="footer">
            <p style="color: #718096; font-size: 14px; margin: 0;">
                © 2025 Samyukta - ANITS Cultural & Technical Summit
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
};