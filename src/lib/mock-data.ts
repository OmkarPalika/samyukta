import { 
  LoginUser, 
  Competition, 
  // CompetitionRegistration, 
  // HelpTicket, 
  // SocialItem, 
  GameAction, 
  GameStats,
  RegistrationStats,
  PitchRating,
  MapLocation
} from './types';
import { EVENT_CONFIG, DEMO_CREDENTIALS } from './config';
import { 
  CONTACTS_DATA} from '@/data';

// Mock Users Database
export const MOCK_USERS: LoginUser[] = [
  {
    id: 'admin',
    email: DEMO_CREDENTIALS.admin.email,
    password: DEMO_CREDENTIALS.admin.password,
    full_name: 'System Administrator',
    role: 'admin',
    college: 'ANITS',
    track: 'Admin',
    year: 'Convenor',
    dept: 'Administration'
  },
  {
    id: 'coord1',
    email: DEMO_CREDENTIALS.coordinator.email,
    password: DEMO_CREDENTIALS.coordinator.password,
    full_name: 'Event Coordinator',
    role: 'coordinator',
    college: 'ANITS',
    track: 'Event Management',
    year: 'Staff',
    dept: 'Coordination'
  }
];

// Mock Competitions
export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    name: 'HackJam: Solve-for-India',
    description: '6-hour hackathon focused on solving real-world problems',
    category: 'Hackathon',
    max_team_size: 5,
    min_team_size: 1,
    registration_fee: EVENT_CONFIG.pricing.direct_join_hackathon,
    slots_available: 250,
    slots_filled: 0,
    registration_deadline: EVENT_CONFIG.dates.registration_deadline,
    competition_date: '2025-08-08T09:00:00Z',
    status: 'open',
    requirements: ['Laptop', 'Programming skills', 'Team collaboration', 'Critical thinking'],
    prizes: [`${EVENT_CONFIG.prizes.hackathon.first} First Prize`, `${EVENT_CONFIG.prizes.hackathon.second} Second Prize`, `${EVENT_CONFIG.prizes.hackathon.third} Third Prize`]
  },
  {
    id: 'comp-2',
    name: 'Startup Pitch Competition',
    description: 'Present your startup idea to industry experts',
    category: 'Pitch',
    max_team_size: 5,
    min_team_size: 1,
    registration_fee: EVENT_CONFIG.pricing.direct_join_pitch,
    slots_available: 250,
    slots_filled: 0,
    registration_deadline: '2025-02-18T23:59:59Z',
    competition_date: '2025-02-22T14:00:00Z',
    status: 'open',
    requirements: ['Business plan', 'Presentation slides', 'Demo (optional)'],
    prizes: [EVENT_CONFIG.prizes.pitch.first, EVENT_CONFIG.prizes.pitch.second, EVENT_CONFIG.prizes.pitch.third]
  }
];

// Mock Competition Registrations (mutable for API operations)
// export const MOCK_COMPETITION_REGISTRATIONS: CompetitionRegistration[] = [
//   {
//     id: 'reg-1',
//     competition_id: 'comp-1',
//     user_id: 'user-1',
//     team_id: 'team-1',
//     registration_type: 'individual',
//     transaction_id: 'TXN123456',
//     payment_screenshot_url: 'uploads/payments/screenshot.jpg',
//     status: 'approved',
//     created_at: '2025-01-15T10:00:00Z',
//     updated_at: '2025-01-16T10:00:00Z'
//   }
// ];

// Mock Help Tickets (mutable for API operations)
// export const MOCK_HELP_TICKETS: HelpTicket[] = [
//   {
//     id: '1',
//     title: 'Login Issue',
//     description: 'Cannot access my dashboard after registration',
//     submitted_by: 'user123',
//     status: 'open',
//     priority: 'medium',
//     created_at: new Date().toISOString()
//   },
//   {
//     id: '2',
//     title: 'Payment Verification',
//     description: 'Payment made but status not updated',
//     submitted_by: 'user456',
//     status: 'in_progress',
//     priority: 'high',
//     created_at: new Date().toISOString()
//   }
// ];

// Mock Social Items (mutable for API operations)
// export const MOCK_SOCIAL_ITEMS: SocialItem[] = [
//   {
//     id: '1',
//     file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
//     caption: 'Opening ceremony with 400+ enthusiastic participants',
//     uploaded_by: 'event_team',
//     status: 'approved',
//     category: 'ceremony',
//     likes: 45,
//     comments: 12,
//     shares: 8,
//     tags: ['opening', 'ceremony', 'samyukta2025'],
//     created_at: '2024-08-06T09:00:00Z'
//   },
//   {
//     id: '2',
//     file_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
//     caption: 'AWS workshop in progress - Cloud computing mastery',
//     uploaded_by: 'coordinator_1',
//     status: 'approved',
//     category: 'workshop',
//     likes: 32,
//     comments: 8,
//     shares: 5,
//     tags: ['aws', 'workshop', 'cloud'],
//     created_at: '2024-08-06T11:30:00Z'
//   },
//   {
//     id: '3',
//     file_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
//     caption: 'Team collaboration during hackathon',
//     uploaded_by: 'participant_23',
//     status: 'approved',
//     category: 'hackathon',
//     likes: 67,
//     comments: 15,
//     shares: 12,
//     tags: ['hackathon', 'teamwork', 'coding'],
//     created_at: '2024-08-08T14:00:00Z'
//   },
//   {
//     id: '4',
//     file_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
//     caption: 'Cultural night performances and celebrations',
//     uploaded_by: 'cultural_team',
//     status: 'approved',
//     category: 'cultural',
//     likes: 89,
//     comments: 23,
//     shares: 18,
//     tags: ['cultural', 'dance', 'music'],
//     created_at: '2024-08-06T19:00:00Z'
//   },
//   {
//     id: '5',
//     file_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
//     caption: 'Networking session with industry experts',
//     uploaded_by: 'networking_team',
//     status: 'approved',
//     category: 'networking',
//     likes: 28,
//     comments: 5,
//     shares: 3,
//     tags: ['networking', 'industry', 'experts'],
//     created_at: '2024-08-07T16:00:00Z'
//   },
//   {
//     id: '6',
//     file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
//     caption: 'AI/ML workshop with Google Cloud experts',
//     uploaded_by: 'tech_team',
//     status: 'approved',
//     category: 'workshop',
//     likes: 43,
//     comments: 9,
//     shares: 6,
//     tags: ['ai', 'ml', 'google'],
//     created_at: '2024-08-07T10:00:00Z'
//   },
//   {
//     id: '7',
//     file_url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=600&fit=crop',
//     caption: 'Prize distribution ceremony',
//     uploaded_by: 'admin_team',
//     status: 'approved',
//     category: 'ceremony',
//     likes: 76,
//     comments: 18,
//     shares: 14,
//     tags: ['awards', 'winners', 'celebration'],
//     created_at: '2024-08-08T18:00:00Z'
//   },
//   {
//     id: '8',
//     file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
//     caption: 'Group photo with all participants',
//     uploaded_by: 'photo_team',
//     status: 'approved',
//     category: 'group',
//     likes: 120,
//     comments: 34,
//     shares: 28,
//     tags: ['group', 'memories', 'finale'],
//     created_at: '2024-08-08T17:00:00Z'
//   }
// ];

// Mock Game Data (mutable for API operations)
export const MOCK_GAME_DATA: GameAction[] = [];

export const MOCK_GAME_STATS: GameStats = {
  totalScans: 0,
  activePlayers: 0,
  totalSuspects: 0
};

// Mock Registration Stats
export const MOCK_REGISTRATION_STATS: RegistrationStats = {
  total_registrations: 365,
  cloud_workshop: 185,
  ai_workshop: 180,
  hackathon_entries: 89,
  pitch_entries: 67,
  max_total: EVENT_CONFIG.capacity.max_total,
  max_cloud: EVENT_CONFIG.capacity.cloud_workshop,
  max_ai: EVENT_CONFIG.capacity.ai_workshop,
  remaining_total: 35,
  remaining_cloud: 15,
  remaining_ai: 20,
  direct_join_available: true,
  direct_join_hackathon_price: EVENT_CONFIG.pricing.direct_join_hackathon,
  direct_join_pitch_price: EVENT_CONFIG.pricing.direct_join_pitch
};



// Mock Pitch Ratings (mutable for API operations)
export const MOCK_PITCH_RATINGS: PitchRating[] = [];

// Mock Registrations (mutable for API operations)
export const MOCK_REGISTRATIONS: import('./types').RegistrationResponse[] = [];

// Mock Speakers Data
// Original speakers data commented out for now
/*
export const MOCK_SPEAKERS = [
  {
    id: 'speaker-1',
    name: 'Dr. Jane Smith',
    title: 'AI Research Lead, Google',
    bio: 'Leading researcher in artificial intelligence with over 15 years of experience.',
    image: '/images/speakers/jane-smith.jpg',
    topics: ['Artificial Intelligence', 'Machine Learning'],
    schedule: '2025-02-21T10:00:00Z',
    venue: 'Main Auditorium'
  },
  {
    id: 'speaker-2',
    name: 'John Davis',
    title: 'Cloud Architect, AWS',
    bio: 'Expert in cloud infrastructure and serverless architecture.',
    image: '/images/speakers/john-davis.jpg',
    topics: ['Cloud Computing', 'DevOps'],
    schedule: '2025-02-21T14:00:00Z',
    venue: 'Tech Hall'
  }
];
*/



// Mock Map Locations
export const MOCK_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'anits-main',
    name: 'ANITS Main Campus',
    type: 'venue',
    coordinates: { lat: 17.921812, lng: 83.420420 },
    description: 'Main venue for Samyukta 2025',
    color: 'from-blue-500 to-cyan-500',
    distance: '0 km',
    estimatedTime: 'You are here',
    icon: '🏛️'
  }
];

// Re-export centralized event timeline data
export { EVENT_SCHEDULE as MOCK_EVENT_DAYS } from '@/data';

// Re-export centralized speakers data
export { SPEAKERS_DATA as MOCK_SPEAKERS, SPEAKERS_STATUS } from '@/data';

// Mock Sponsors Data
export const MOCK_SPONSOR_TIERS = [
  {
    tier: "Title Sponsor",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/20",
    amount: "₹5,00,000+",
    sponsors: [
      {
        name: "Amazon Web Services",
        website: "https://aws.amazon.com",
        description: "Leading cloud computing platform powering millions of businesses worldwide"
      }
    ]
  },
  {
    tier: "Platinum Sponsors",
    color: "from-gray-300 to-gray-500",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-300",
    borderColor: "border-gray-500/20",
    amount: "₹2,00,000+",
    sponsors: [
      {
        name: "Google Cloud",
        website: "https://cloud.google.com",
        description: "Enterprise-grade cloud computing and AI services"
      },
      {
        name: "Microsoft Azure",
        website: "https://azure.microsoft.com",
        description: "Comprehensive cloud platform for modern applications"
      }
    ]
  },
  {
    tier: "Gold Sponsors",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-600/10",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-600/20",
    amount: "₹1,00,000+",
    sponsors: [
      {
        name: "GeeksforGeeks",
        website: "https://geeksforgeeks.org",
        description: "Leading programming education platform"
      },
      {
        name: "AMTZ Visakhapatnam",
        website: "https://amtz.in",
        description: "Andhra Pradesh MedTech Zone fostering healthcare innovation"
      },
      {
        name: "Innovation Council",
        website: "#",
        description: "Promoting innovation and entrepreneurship in education"
      }
    ]
  },
  {
    tier: "Silver Sponsors",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-600/10",
    textColor: "text-gray-400",
    borderColor: "border-gray-600/20",
    amount: "₹50,000+",
    sponsors: [
      {
        name: "TechCorp Solutions",
        website: "#",
        description: "Digital transformation consulting services"
      },
      {
        name: "StartupHub India",
        website: "#",
        description: "Startup ecosystem enabler and incubator"
      },
      {
        name: "DevTools Pro",
        website: "#",
        description: "Professional development tools and services"
      }
    ]
  }
];

// Mock Event Benefits
export const MOCK_EVENT_BENEFITS = EVENT_CONFIG.benefits;

// Speaker tracks and benefits are commented out as they're not currently used

// Mock Sponsorship Benefits
// export const MOCK_SPONSORSHIP_BENEFITS = [
//   {
//     tier: "Title Sponsor",
//     benefits: [
//       "Exclusive naming rights to the event",
//       "Logo on all marketing materials and banners",
//       "30-minute keynote speaking slot",
//       "Premium booth space at venue",
//       "Logo on participant certificates",
//       "Dedicated social media campaigns",
//       "Access to participant database",
//       "VIP seating for leadership team",
//       "Recognition in all press releases",
//       "Lifetime partnership status"
//     ]
//   },
//   {
//     tier: "Platinum",
//     benefits: [
//       "Logo on main stage backdrop",
//       "15-minute speaking opportunity",
//       "Premium exhibition booth",
//       "Logo on event t-shirts",
//       "Social media mentions",
//       "Inclusion in event app",
//       "Networking dinner invitation",
//       "Certificate co-branding"
//     ]
//   },
//   {
//     tier: "Gold",
//     benefits: [
//       "Logo on event materials",
//       "Exhibition booth space",
//       "Logo on participant badges",
//       "Social media recognition",
//       "Inclusion in event program",
//       "Networking session access",
//       "Recruitment opportunities"
//     ]
//   },
//   {
//     tier: "Silver",
//     benefits: [
//       "Logo on event website",
//       "Small exhibition space",
//       "Social media mentions",
//       "Inclusion in event brochure",
//       "Networking opportunities",
//       "Talent recruitment access"
//     ]
//   }
// ];

// Re-export centralized event stats
export { EVENT_STATS as MOCK_EVENT_STATS } from '@/data';

// Re-export centralized contact data
export const MOCK_CONTACTS = CONTACTS_DATA.team;

// Re-export centralized FAQ data
export { FAQ_DATA as MOCK_FAQS, FAQ_CATEGORIES as MOCK_FAQ_CATEGORIES } from '@/data';