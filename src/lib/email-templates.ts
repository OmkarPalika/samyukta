interface RegistrationData {
  name: string;
  email: string;
  college: string;
  phone: string;
  ticketType: string;
  registrationId: string;
  passkey: string;
  amount: number;
  workshopTrack?: string;
  teamMembers?: string[];
  eventDates: string;
  venue: string;
}

const getTicketTheme = (data: RegistrationData) => {
  const isCombo = data.ticketType.toLowerCase().includes('combo');
  const isHackathon = data.ticketType.toLowerCase().includes('hackathon');
  const isPitch = data.ticketType.toLowerCase().includes('pitch');
  const isCloud = data.workshopTrack?.toLowerCase().includes('cloud');
  const isAI = data.workshopTrack?.toLowerCase().includes('ai');
  const teamSize = data.teamMembers?.length || 1;

  if (isCombo && isHackathon) {
    return {
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)',
      accent: '#FF6B6B',
      secondary: '#4ECDC4',
      icon: '🚀',
      pattern: 'hackathon',
      title: 'COMBO HACKATHON PASS',
      subtitle: `${teamSize}-Member Innovation Squad`
    };
  }
  
  if (isCombo && isPitch) {
    return {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
      accent: '#8B5CF6',
      secondary: '#EC4899',
      icon: '💡',
      pattern: 'pitch',
      title: 'COMBO STARTUP PASS',
      subtitle: `${teamSize}-Member Entrepreneur Team`
    };
  }
  
  if (isCloud) {
    return {
      gradient: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 50%, #0284C7 100%)',
      accent: '#00D4FF',
      secondary: '#0EA5E9',
      icon: '☁️',
      pattern: 'cloud',
      title: 'CLOUD COMPUTING PASS',
      subtitle: 'AWS Powered Learning Journey'
    };
  }
  
  if (isAI) {
    return {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)',
      accent: '#8B5CF6',
      secondary: '#A855F7',
      icon: '🤖',
      pattern: 'ai',
      title: 'AI/ML MASTERY PASS',
      subtitle: 'Google Cloud Intelligence Track'
    };
  }
  
  return {
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
    accent: '#10B981',
    secondary: '#059669',
    icon: '🎯',
    pattern: 'entry',
    title: 'ENTRY + WORKSHOP PASS',
    subtitle: 'Foundation Learning Experience'
  };
};

export const generateRegistrationConfirmationEmail = (data: RegistrationData): string => {
  const theme = getTicketTheme(data);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Samyukta 2025 - Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #0F0F23 0%, #1A1B3A 100%); color: #ffffff; background-image: url('${process.env.NEXT_PUBLIC_APP_URL}/logo.png'); background-repeat: no-repeat; background-position: center; background-size: 300px; background-attachment: fixed; position: relative;">
  <!-- Logo Background Overlay -->
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${process.env.NEXT_PUBLIC_APP_URL}/logo.png'); background-repeat: no-repeat; background-position: center; background-size: 300px; opacity: 0.03; z-index: 0; pointer-events: none;"></div>
  
  <!-- Main Container -->
  <div style="max-width: 650px; margin: 0 auto; background: #0F0F23; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05); position: relative; z-index: 1;">
    
    <!-- Dynamic Header -->
    <div style="background: ${theme.gradient}; padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite;"></div>
      <div style="position: relative; z-index: 2;">
        <div style="font-size: 48px; margin-bottom: 10px;">${theme.icon}</div>
        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.3); letter-spacing: -0.5px;">
          SAMYUKTA 2025
        </h1>
        <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 8px 20px; margin: 15px auto 0; display: inline-block; border: 1px solid rgba(255,255,255,0.1);">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
            ${theme.title}
          </p>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 500;">
          ${theme.subtitle}
        </p>
      </div>
    </div>

    <!-- Premium Ticket Section -->
    <div style="padding: 40px 30px; background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%); border: 2px solid ${theme.accent}; margin: 25px; border-radius: 20px; position: relative; backdrop-filter: blur(10px);">
      
      <!-- Holographic Effect -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, transparent 30%, ${theme.accent}20 50%, transparent 70%); border-radius: 18px; opacity: 0.3;"></div>
      
      <!-- Ticket Header -->
      <div style="text-align: center; margin-bottom: 30px; position: relative; z-index: 2;">
        <div style="display: inline-block; background: ${theme.gradient}; padding: 12px 30px; border-radius: 25px; font-weight: 800; font-size: 16px; color: #ffffff; box-shadow: 0 8px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
          ${theme.icon} ${data.ticketType.toUpperCase()}
        </div>
        ${data.teamMembers && data.teamMembers.length > 1 ? `
        <div style="margin-top: 15px;">
          <span style="background: rgba(255,255,255,0.1); padding: 6px 15px; border-radius: 15px; font-size: 12px; color: ${theme.accent}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            ${data.teamMembers.length} Member Squad
          </span>
        </div>
        ` : ''}
      </div>

      <!-- Registration Details -->
      <div style="background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 2;">
        <h3 style="margin: 0 0 20px 0; color: ${theme.accent}; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
          <span style="background: ${theme.gradient}; width: 4px; height: 20px; border-radius: 2px; margin-right: 12px;"></span>
          Registration Details
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">Registration ID:</td>
            <td style="padding: 8px 0; color: #00D4FF; font-weight: 600; text-align: right; font-family: monospace;">${data.registrationId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">College:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${data.college}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">Phone:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${data.phone}</td>
          </tr>
          ${data.workshopTrack ? `
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">Workshop Track:</td>
            <td style="padding: 8px 0; color: #8B5CF6; font-weight: 600; text-align: right;">${data.workshopTrack}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; color: #B0B0B0; font-size: 14px;">Amount Paid:</td>
            <td style="padding: 8px 0; color: #00FF88; font-weight: bold; text-align: right; font-size: 16px;">₹${data.amount}</td>
          </tr>
        </table>
      </div>

      ${data.teamMembers && data.teamMembers.length > 0 ? `
      <!-- Team Members -->
      <div style="background: linear-gradient(135deg, ${theme.secondary}20 0%, ${theme.accent}10 100%); border-radius: 16px; padding: 25px; margin-bottom: 25px; border-left: 4px solid ${theme.secondary}; position: relative; z-index: 2;">
        <h3 style="margin: 0 0 20px 0; color: ${theme.secondary}; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
          <span style="font-size: 20px; margin-right: 10px;">${theme.pattern === 'hackathon' ? '👥' : theme.pattern === 'pitch' ? '🤝' : '👫'}</span>
          Your Squad
        </h3>
        <div style="display: grid; gap: 12px;">
        ${data.teamMembers.map((member, index) => `
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; color: #ffffff; font-size: 14px; font-weight: 500; display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
            <span style="background: ${theme.gradient}; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px; color: #ffffff; flex-shrink: 0; text-align: center; line-height: 28px; vertical-align: middle;">${index + 1}</span>
            <span style="flex: 1;">${member}</span>
          </div>
        `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Event Details -->
      <div style="background: linear-gradient(135deg, ${theme.accent}15 0%, ${theme.secondary}10 100%); border-radius: 16px; padding: 25px; border-left: 4px solid ${theme.accent}; position: relative; z-index: 2;">
        <h3 style="margin: 0 0 20px 0; color: ${theme.accent}; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
          <span style="font-size: 20px; margin-right: 10px;">🎯</span>
          Event Information
        </h3>
        <div style="color: #ffffff; font-size: 15px; line-height: 1.8; display: grid; gap: 12px;">
          <div style="display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 18px; margin-right: 12px;">📅</span>
            <div><strong style="color: ${theme.accent};">Dates:</strong> ${data.eventDates}</div>
          </div>
          <div style="display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 18px; margin-right: 12px;">📍</span>
            <div><strong style="color: ${theme.accent};">Venue:</strong> ${data.venue}</div>
          </div>
          <div style="display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 18px; margin-right: 12px;">${theme.icon}</span>
            <div><strong style="color: ${theme.accent};">Track:</strong> ${data.workshopTrack || 'Multi-Track Experience'}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Access -->
    <div style="padding: 0 25px 25px 25px;">
      <div style="background: linear-gradient(135deg, ${theme.accent}15, ${theme.secondary}10); border-radius: 20px; padding: 35px; text-align: center; border: 1px solid ${theme.accent}30; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, ${theme.accent}10 0%, transparent 70%);"></div>
        
        <div style="position: relative; z-index: 2;">
          <div style="font-size: 40px; margin-bottom: 15px;">${theme.pattern === 'hackathon' ? '🚀' : theme.pattern === 'pitch' ? '💡' : '🎯'}</div>
          <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 800;">Access Your Dashboard</h3>
          <p style="margin: 0 0 25px 0; color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6;">
            Your personalized mission control center awaits
          </p>
          
          <div style="background: linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)); backdrop-filter: blur(10px); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">
            <div style="margin-bottom: 20px;">
              <span style="color: ${theme.accent}; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">🔐 Your Login Credentials</span>
            </div>
            <div style="display: grid; gap: 15px;">
              <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border-left: 4px solid ${theme.accent};">
                <div style="color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Email</div>
                <div style="color: ${theme.accent}; font-weight: 700; font-family: 'Courier New', monospace; font-size: 16px;">${data.email}</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border-left: 4px solid ${theme.secondary};">
                <div style="color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Passkey</div>
                <div style="color: ${theme.secondary}; font-weight: 700; font-family: 'Courier New', monospace; font-size: 20px; letter-spacing: 2px;">${data.passkey}</div>
              </div>
            </div>
            ${data.teamMembers && data.teamMembers.length > 1 ? `
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; margin-top: 15px;">
              <div style="color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.5;">
                <strong style="color: ${theme.accent};">Team Note:</strong> Each member receives individual credentials via email
              </div>
            </div>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 20px;" class="mobile-stack">
            <div style="display: inline-block; margin: 0 auto;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-flex; align-items: center; background: ${theme.gradient}; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); margin: 0 8px 12px 8px;">
                <span style="margin-right: 8px;">🚀</span>
                Launch Dashboard
              </a>
              
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+918897892720'}?text=Hi! I just registered for Samyukta 2025 🎉" style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #25D366, #128C7E); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3); transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); margin: 0 8px 12px 8px;">
                <span style="margin-right: 8px;">💬</span>
                Join WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Important Information -->
    <div style="padding: 0 20px 30px 20px;">
      <div style="background: rgba(255, 193, 7, 0.1); border-radius: 8px; padding: 20px; border-left: 4px solid #FFC107;">
        <h4 style="margin: 0 0 10px 0; color: #FFC107; font-size: 16px;">⚠️ Important Notes</h4>
        <ul style="margin: 0; padding-left: 20px; color: #ffffff; font-size: 14px; line-height: 1.6;">
          <li>Keep this email safe - it contains your registration details</li>
          <li>Bring a valid ID and this confirmation for event entry</li>
          <li>Check your dashboard for updates and announcements</li>
          <li>Contact support if you face any issues</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: linear-gradient(135deg, #0F0F23, #1A1B3A); padding: 30px 25px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <div style="margin-bottom: 20px; text-align: center;" class="mobile-links">
        <div style="display: inline-block;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: ${theme.accent}; text-decoration: none; display: inline-flex; align-items: center; font-weight: 600; font-size: 14px; margin: 0 15px 8px 15px;">
            <span style="margin-right: 6px;">🌐</span> Website
          </a>
          <a href="mailto:support@samyukta.anits.edu.in" style="color: ${theme.accent}; text-decoration: none; display: inline-flex; align-items: center; font-weight: 600; font-size: 14px; margin: 0 15px 8px 15px;">
            <span style="margin-right: 6px;">📧</span> Support
          </a>
          <a href="https://instagram.com/samyukta_anits" style="color: ${theme.accent}; text-decoration: none; display: inline-flex; align-items: center; font-weight: 600; font-size: 14px; margin: 0 15px 8px 15px;">
            <span style="margin-right: 6px;">📸</span> Instagram
          </a>
        </div>
      </div>
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
        <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px; line-height: 1.5;">
          <strong style="color: ${theme.accent};">Samyukta 2025</strong> - Where Innovation Meets Excellence<br>
          <span style="color: rgba(255,255,255,0.6);">Anil Neerukonda Institute of Technology and Sciences</span>
        </p>
      </div>
      <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px;">
        © 2025 All rights reserved. Made with ❤️ for tech enthusiasts.
      </p>
    </div>

  </div>
</body>
</html>
  
  <style>
    @keyframes pulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    @media (max-width: 600px) {
      .responsive-flex { flex-direction: column !important; }
      .responsive-text { font-size: 14px !important; }
      .mobile-stack a {
        display: block !important;
        margin: 8px auto !important;
        width: fit-content;
      }
      .mobile-links a {
        display: block !important;
        margin: 8px auto !important;
        text-align: center;
      }
    }
  </style>
  
  </div>
</body>
</html>
  `;
};