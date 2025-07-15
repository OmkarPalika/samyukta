// Re-export centralized data for backward compatibility
export { EVENT_DATA as EVENT_CONFIG } from '@/data';
export { CONTACTS_DATA } from '@/data';
export { PARTNERS_DATA } from '@/data';

// URL Configuration
export const URL_CONFIG = {
  base: process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta.vercel.app',
  register: '/register',
  login: '/login',
  dashboard: '/dashboard',
  events: '/events',
  about: '/about',
  contact: '/contact'
};

// Demo Login Credentials
export const DEMO_CREDENTIALS = {
  admin: { email: 'omkar@samyukta.com', password: '@Omkar143' },
  coordinator: { email: 'coordinator@samyukta.com', password: 'coord123' },
  participant: { email: 'participant@samyukta.com', password: 'part123' }
};