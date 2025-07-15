import nodemailer from 'nodemailer';
import { generateRegistrationConfirmationEmail } from './email-templates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};

interface RegistrationData {
  name: string;
  email: string;
  college: string;
  phone: string;
  ticketType: string;
  registrationId: string;
  amount: number;
  eventDates: string;
  venue: string;
  [key: string]: unknown;
}

export const sendRegistrationConfirmation = async (to: string, registrationData: RegistrationData, passkey: string) => {
  const emailData = { ...registrationData, passkey };
  const html = generateRegistrationConfirmationEmail(emailData);
  return await sendEmail(to, `🎉 Samyukta 2025 Registration Confirmed - ${registrationData.name}`, html);
};

