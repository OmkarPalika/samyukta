// Central data export - Single source of truth for all hardcoded data
export * from './event';
export * from './contacts';
export * from './pages';
export * from './sponsors';
export * from './schedule';
export * from './faqs';
export * from './speakers';
export * from './ui';

// Re-export commonly used configurations
export { EVENT_DATA as EVENT_CONFIG } from './event';
export { CONTACTS_DATA } from './contacts';
export { PAGES_DATA } from './pages';
export { SPONSORS_DATA } from './sponsors';
export { EVENT_SCHEDULE as MOCK_EVENT_DAYS } from './schedule';
export { FAQ_DATA as MOCK_FAQS, FAQ_CATEGORIES as MOCK_FAQ_CATEGORIES } from './faqs';
export { SPEAKERS_DATA as MOCK_SPEAKERS, SPEAKERS_STATUS, SPEAKING_BENEFITS } from './speakers';
export { UI_CONFIG, BADGE_CONFIGS } from './ui';