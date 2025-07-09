import { 
  LoginUser, 
  Competition, 
  CompetitionRegistration, 
  HelpTicket, 
  SocialItem, 
  GameAction, 
  GameStats,
  RegistrationStats
} from './types';
import { EVENT_CONFIG, DEMO_CREDENTIALS } from './config';

// Mock Users Database
export const MOCK_USERS: LoginUser[] = [
  {
    id: 'admin1',
    email: DEMO_CREDENTIALS.admin.email,
    password: DEMO_CREDENTIALS.admin.password,
    full_name: 'System Administrator',
    role: 'admin'
  },
  {
    id: 'coord1',
    email: DEMO_CREDENTIALS.coordinator.email,
    password: DEMO_CREDENTIALS.coordinator.password,
    full_name: 'Event Coordinator',
    role: 'coordinator'
  },
  {
    id: 'part1',
    email: DEMO_CREDENTIALS.participant.email,
    password: DEMO_CREDENTIALS.participant.password,
    full_name: 'John Participant',
    role: 'participant',
    college: 'ANITS',
    track: 'Cloud Computing',
    year: '3rd Year',
    dept: 'CSE'
  }
];

// Mock Competitions
export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    name: 'AI Innovation Hackathon',
    description: '48-hour hackathon focused on AI solutions',
    category: 'Hackathon',
    max_team_size: 4,
    min_team_size: 2,
    registration_fee: EVENT_CONFIG.pricing.individual,
    slots_available: 50,
    slots_filled: 23,
    registration_deadline: EVENT_CONFIG.dates.registration_deadline,
    competition_date: '2025-02-20T09:00:00Z',
    status: 'open',
    requirements: ['Laptop', 'Programming skills', 'Team collaboration'],
    prizes: [`${EVENT_CONFIG.prizes.hackathon.first} First Prize`, `${EVENT_CONFIG.prizes.hackathon.second} Second Prize`, `${EVENT_CONFIG.prizes.hackathon.third} Third Prize`]
  },
  {
    id: 'comp-2',
    name: 'Startup Pitch Competition',
    description: 'Present your startup idea to industry experts',
    category: 'Pitch',
    max_team_size: 3,
    min_team_size: 1,
    registration_fee: EVENT_CONFIG.pricing.direct_join_pitch,
    slots_available: 30,
    slots_filled: 12,
    registration_deadline: '2025-02-18T23:59:59Z',
    competition_date: '2025-02-22T14:00:00Z',
    status: 'open',
    requirements: ['Business plan', 'Presentation slides', 'Demo (optional)'],
    prizes: [EVENT_CONFIG.prizes.pitch.first, EVENT_CONFIG.prizes.pitch.second, EVENT_CONFIG.prizes.pitch.third]
  }
];

// Mock Competition Registrations (mutable for API operations)
export const MOCK_COMPETITION_REGISTRATIONS: CompetitionRegistration[] = [
  {
    id: 'reg-1',
    competition_id: 'comp-1',
    user_id: 'user-1',
    team_id: 'team-1',
    registration_type: 'individual',
    transaction_id: 'TXN123456',
    payment_screenshot_url: 'uploads/payments/screenshot.jpg',
    status: 'approved',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-16T10:00:00Z'
  }
];

// Mock Help Tickets (mutable for API operations)
export const MOCK_HELP_TICKETS: HelpTicket[] = [
  {
    id: '1',
    title: 'Login Issue',
    description: 'Cannot access my dashboard after registration',
    submitted_by: 'user123',
    status: 'open',
    priority: 'medium',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Payment Verification',
    description: 'Payment made but status not updated',
    submitted_by: 'user456',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString()
  }
];

// Mock Social Items (mutable for API operations)
export const MOCK_SOCIAL_ITEMS: SocialItem[] = [
  {
    id: '1',
    file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    caption: 'Opening ceremony with 500+ enthusiastic participants',
    uploaded_by: 'event_team',
    status: 'approved',
    category: 'ceremony',
    likes: 45,
    comments: 12,
    shares: 8,
    tags: ['opening', 'ceremony', 'samyukta2025'],
    created_at: '2024-08-06T09:00:00Z'
  },
  {
    id: '2',
    file_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
    caption: 'AWS workshop in progress - Cloud computing mastery',
    uploaded_by: 'coordinator_1',
    status: 'approved',
    category: 'workshop',
    likes: 32,
    comments: 8,
    shares: 5,
    tags: ['aws', 'workshop', 'cloud'],
    created_at: '2024-08-06T11:30:00Z'
  },
  {
    id: '3',
    file_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    caption: 'Team collaboration during hackathon',
    uploaded_by: 'participant_23',
    status: 'approved',
    category: 'hackathon',
    likes: 67,
    comments: 15,
    shares: 12,
    tags: ['hackathon', 'teamwork', 'coding'],
    created_at: '2024-08-08T14:00:00Z'
  },
  {
    id: '4',
    file_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    caption: 'Cultural night performances and celebrations',
    uploaded_by: 'cultural_team',
    status: 'approved',
    category: 'cultural',
    likes: 89,
    comments: 23,
    shares: 18,
    tags: ['cultural', 'dance', 'music'],
    created_at: '2024-08-06T19:00:00Z'
  },
  {
    id: '5',
    file_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    caption: 'Networking session with industry experts',
    uploaded_by: 'networking_team',
    status: 'approved',
    category: 'networking',
    likes: 28,
    comments: 5,
    shares: 3,
    tags: ['networking', 'industry', 'experts'],
    created_at: '2024-08-07T16:00:00Z'
  },
  {
    id: '6',
    file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
    caption: 'AI/ML workshop with Google Cloud experts',
    uploaded_by: 'tech_team',
    status: 'approved',
    category: 'workshop',
    likes: 43,
    comments: 9,
    shares: 6,
    tags: ['ai', 'ml', 'google'],
    created_at: '2024-08-07T10:00:00Z'
  },
  {
    id: '7',
    file_url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=600&fit=crop',
    caption: 'Prize distribution ceremony',
    uploaded_by: 'admin_team',
    status: 'approved',
    category: 'ceremony',
    likes: 76,
    comments: 18,
    shares: 14,
    tags: ['awards', 'winners', 'celebration'],
    created_at: '2024-08-08T18:00:00Z'
  },
  {
    id: '8',
    file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
    caption: 'Group photo with all participants',
    uploaded_by: 'photo_team',
    status: 'approved',
    category: 'group',
    likes: 120,
    comments: 34,
    shares: 28,
    tags: ['group', 'memories', 'finale'],
    created_at: '2024-08-08T17:00:00Z'
  }
];

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
export const MOCK_PITCH_RATINGS: unknown[] = [];

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

// Current speakers status
export const SPEAKERS_STATUS = {
  isReady: false,
  message: 'Speakers will be updated soon',
  expectedUpdateDate: '2025-07-20T00:00:00Z'
};

// Mock Map Locations
export const MOCK_MAP_LOCATIONS: unknown[] = [
  {
    id: 'anits-main',
    name: 'ANITS Main Campus',
    type: 'venue',
    coordinates: { lat: 17.921812, lng: 83.420420 },
    description: 'Main venue for Samyukta 2025',
    color: 'from-blue-500 to-cyan-500',
    distance: '0 km',
    estimatedTime: 'You are here'
  }
];

// Mock Event Timeline Data
export const MOCK_EVENT_DAYS = [
  {
    id: "day1",
    title: "Day 1: Inauguration & Workshop Kickoff",
    date: "August 6, 2025",
    dressCode: "Professional",
    color: "from-blue-500 to-cyan-500",
    events: [
      { time: "9:00–10:30 AM", duration: 1.5, unified: { title: "Inauguration", type: "ceremony" } },
      { time: "10:30–11:00 AM", duration: 0.5, unified: { title: "Logistics", type: "logistics" } },
      { time: "11:00–12:30 PM", duration: 1.5, trackA: { title: "Workshop Session 1", description: "Cloud Computing Fundamentals", type: "workshop" }, trackB: { title: "Workshop Session 1", description: "AI/ML Fundamentals", type: "workshop" } },
      { time: "12:30–1:30 PM", duration: 1, trackA: { title: "Lunch Break", type: "break" }, trackB: { title: "Workshop Continues", description: "Advanced AI Concepts", type: "workshop" } },
      { time: "1:00–2:00 PM", duration: 1, trackA: { title: "Workshop Continues", description: "AWS Services Deep Dive", type: "workshop" }, trackB: { title: "Lunch Break", type: "break" } },
      { time: "2:00–4:30 PM", duration: 2.5, trackA: { title: "Workshop Session 2", description: "Hands-on AWS Projects", type: "workshop" }, trackB: { title: "Workshop Session 2", description: "Google Cloud AI Tools", type: "workshop" } },
      { time: "4:30–5:00 PM", duration: 0.5, unified: { title: "Discussion, Icebreaker Game & Wind-up", type: "game" } },
      { time: "5:00–6:00 PM", duration: 1, unified: { title: "Refreshments & Logistics", type: "networking" } },
      { time: "6:30–8:00 PM", duration: 1.5, unified: { title: "Cultural Night", description: "Performances and Entertainment", type: "cultural" } },
      // { time: "8:00 PM", duration: 1, unified: { title: "Dinner (for hostellers)", type: "networking" } }
    ]
  },
  {
    id: "day2",
    title: "Day 2: Deep Dive Workshops",
    date: "August 7, 2025",
    dressCode: "Cultural",
    color: "from-violet-500 to-purple-500",
    events: [
      { time: "9:00–12:30 PM", duration: 3.5, trackA: { title: "Workshop Session 3", description: "Advanced AWS Architecture", type: "workshop" }, trackB: { title: "Workshop Session 3", description: "Machine Learning Models", type: "workshop" } },
      { time: "12:30–1:30 PM", duration: 1, trackA: { title: "Workshop Continues", description: "Serverless Computing", type: "workshop" }, trackB: { title: "Lunch Break", type: "break" } },
      { time: "1:00–2:00 PM", duration: 1, trackA: { title: "Lunch Break", type: "break" }, trackB: { title: "Workshop Continues", description: "Neural Networks", type: "workshop" } },
      { time: "2:00–4:30 PM", duration: 1.5, trackA: { title: "Workshop Session 4", description: "DevOps with AWS", type: "workshop" }, trackB: { title: "Workshop Session 4", description: "AI Ethics & Deployment", type: "workshop" } },
      { time: "4:30–5:00 PM", duration: 0.5, unified: { title: "Feedback Collection, Quiz & Giveaways", type: "game" } },
      { time: "5:00–6:00 PM", duration: 1, unified: { title: "Refreshments & Logistics", type: "networking" } },
      // { time: "7:30 PM", duration: 1, unified: { title: "Dinner (for hostellers)", type: "networking" } }
    ]
  },
  {
    id: "day3",
    title: "Day 3: Hackathon & Startup Pitch",
    date: "August 8, 2025",
    dressCode: "Freestyle",
    color: "from-pink-500 to-rose-500",
    events: [
      { time: "9:00–11:00 AM", duration: 2, trackA: { title: "GFG Presents: Solve-for-India HackJam", description: "Hackathon Kickoff", type: "competition" }, trackB: { title: "IIC Presents: Pitch Arena", description: "Startup-ready teams", type: "competition" } },
      { time: "11:00–11:15 AM", duration: 0.25, unified: { title: "Refreshments", type: "break" } },
      { time: "11:15–1:00 PM", duration: 1.75, trackA: { title: "Track Continuation", description: "Development Phase", type: "competition" }, trackB: { title: "Track Continuation", description: "Pitch Refinement", type: "competition" } },
      { time: "1:00–2:00 PM", duration: 1, unified: { title: "Lunch Break", type: "break" } },
      { time: "2:00–3:00 PM", duration: 1, trackA: { title: "Final Submission", description: "Project Finalization", type: "competition" }, trackB: { title: "Track Continuation & Free Exploration", type: "competition" } },
      { time: "3:00–5:00 PM", duration: 2, trackA: { title: "Judging & Final Evaluation", type: "competition" }, trackB: { title: "Panel Deliberation", type: "competition" } },
      { time: "5:00–5:30 PM", duration: 0.5, unified: { title: "Logistics", type: "logistics" } },
      { time: "5:30–6:00 PM", duration: 0.5, unified: { title: "Imposter & QR Quest Results, Polls & Ratings Reveal", type: "game" } },
      { time: "6:00–7:00 PM", duration: 1, unified: { title: "Grand Closing Ceremony + Prize Distribution", type: "ceremony" } }
    ]
  },
  {
    id: "day4",
    title: "Day 4: Industry Visit",
    date: "August 9, 2025",
    dressCode: "Summit T-shirt",
    color: "from-emerald-500 to-teal-500",
    events: [
      { time: "9:30 AM", duration: 1.5, unified: { title: "Refreshments & Logistics, Departure to AMTZ, Vizag", description: "Only for Club Leads & Winners", type: "visit" } },
      { time: "11:00 AM–12:00 PM", duration: 1, unified: { title: "Explore AMTZ", description: "Facility Tour", type: "visit" } },
      { time: "12:00–1:00 PM", duration: 1, unified: { title: "Self-paid Lunch", type: "break" } },
      { time: "1:00–3:00 PM", duration: 2, unified: { title: "Innovation Showcase & Industrial Tour", type: "visit" } },
      { time: "3:00–3:30 PM", duration: 0.5, unified: { title: "Group Photos", type: "networking" } },
      { time: "4:00 PM", duration: 1, unified: { title: "Return & Feedback Collection", type: "networking" } }
    ]
  }
];

// Mock Speakers Data
export const MOCK_SPEAKERS = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    designation: "Senior Cloud Architect",
    company: "Amazon Web Services",
    session: "Cloud-Native Architecture & Serverless Computing",
    track: "Cloud Computing",
    day: "Day 1",
    time: "11:00 AM - 12:30 PM",
    bio: "Leading cloud transformations for Fortune 500 companies with 15+ years of experience in distributed systems and AWS architecture.",
    expertise: ["AWS", "Serverless", "Microservices", "DevOps"],
    social: {
      linkedin: "https://linkedin.com/in/rajesh-kumar-aws",
      twitter: "https://twitter.com/rajesh_aws",
      website: "https://rajeshkumar.dev"
    }
  },
  {
    id: 2,
    name: "Priya Sharma",
    designation: "AI/ML Research Engineer",
    company: "Google DeepMind",
    session: "Large Language Models & Generative AI Applications",
    track: "AI & Machine Learning",
    day: "Day 1",
    time: "2:00 PM - 4:30 PM",
    bio: "Pioneer in generative AI research with multiple published papers and contributions to open-source AI frameworks.",
    expertise: ["TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    social: {
      linkedin: "https://linkedin.com/in/priya-sharma-ai",
      twitter: "https://twitter.com/priya_ai_ml"
    }
  },
  {
    id: 3,
    name: "Arjun Patel",
    designation: "Startup Founder & Mentor",
    company: "TechVenture Labs",
    session: "From Idea to IPO: Building Scalable Tech Startups",
    track: "Entrepreneurship",
    day: "Day 2",
    time: "9:00 AM - 11:00 AM",
    bio: "Serial entrepreneur with 3 successful exits. Mentor at top accelerators helping startups scale from MVP to market leadership.",
    expertise: ["Product Strategy", "Fundraising", "Team Building", "Market Expansion"],
    social: {
      linkedin: "https://linkedin.com/in/arjun-patel-founder",
      website: "https://arjunpatel.ventures"
    }
  },
  {
    id: 4,
    name: "Dr. Meena Iyer",
    designation: "Director of Innovation",
    company: "AMTZ Visakhapatnam",
    session: "MedTech Innovation & Digital Health Revolution",
    track: "Healthcare Technology",
    day: "Day 2",
    time: "2:00 PM - 4:30 PM",
    bio: "Leading digital transformation in healthcare with focus on AI-powered diagnostics and IoT-enabled medical devices.",
    expertise: ["Digital Health", "IoT", "Regulatory Affairs", "Innovation Management"],
    social: {
      linkedin: "https://linkedin.com/in/meena-iyer-medtech",
      website: "https://amtz.in"
    }
  },
  {
    id: 5,
    name: "Vikram Singh",
    designation: "Head of Engineering",
    company: "GeeksforGeeks",
    session: "Competitive Programming & Technical Interview Success",
    track: "Software Engineering",
    day: "Day 3",
    time: "9:00 AM - 11:00 AM",
    bio: "Former Google engineer turned educator, helping thousands of developers crack top tech interviews and master algorithms.",
    expertise: ["Data Structures", "Algorithms", "System Design", "Interview Prep"],
    social: {
      linkedin: "https://linkedin.com/in/vikram-singh-gfg",
      twitter: "https://twitter.com/vikram_codes"
    }
  },
  {
    id: 6,
    name: "Ananya Reddy",
    designation: "Cybersecurity Evangelist",
    company: "Microsoft Security",
    session: "Zero Trust Security & Cloud Protection Strategies",
    track: "Cybersecurity",
    day: "Day 3",
    time: "2:00 PM - 4:30 PM",
    bio: "Cybersecurity expert specializing in cloud security architecture and zero-trust implementations for enterprise clients.",
    expertise: ["Azure Security", "Zero Trust", "Threat Detection", "Compliance"],
    social: {
      linkedin: "https://linkedin.com/in/ananya-reddy-security",
      twitter: "https://twitter.com/ananya_security"
    }
  }
];

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
export const MOCK_SPONSORSHIP_BENEFITS = [
  {
    tier: "Title Sponsor",
    benefits: [
      "Exclusive naming rights to the event",
      "Logo on all marketing materials and banners",
      "30-minute keynote speaking slot",
      "Premium booth space at venue",
      "Logo on participant certificates",
      "Dedicated social media campaigns",
      "Access to participant database",
      "VIP seating for leadership team",
      "Recognition in all press releases",
      "Lifetime partnership status"
    ]
  },
  {
    tier: "Platinum",
    benefits: [
      "Logo on main stage backdrop",
      "15-minute speaking opportunity",
      "Premium exhibition booth",
      "Logo on event t-shirts",
      "Social media mentions",
      "Inclusion in event app",
      "Networking dinner invitation",
      "Certificate co-branding"
    ]
  },
  {
    tier: "Gold",
    benefits: [
      "Logo on event materials",
      "Exhibition booth space",
      "Logo on participant badges",
      "Social media recognition",
      "Inclusion in event program",
      "Networking session access",
      "Recruitment opportunities"
    ]
  },
  {
    tier: "Silver",
    benefits: [
      "Logo on event website",
      "Small exhibition space",
      "Social media mentions",
      "Inclusion in event brochure",
      "Networking opportunities",
      "Talent recruitment access"
    ]
  }
];

// Mock Event Stats
export const MOCK_EVENT_STATS = [
  { number: `${EVENT_CONFIG.capacity.total_participants}+`, label: "Participants", icon: "Users" },
  { number: `${EVENT_CONFIG.capacity.colleges}+`, label: "Colleges", icon: "Target" },
  { number: EVENT_CONFIG.capacity.days.toString(), label: "Days", icon: "Globe" },
  { number: `${EVENT_CONFIG.capacity.partners}+`, label: "Partners", icon: "Star" }
];

// Mock Contact Data
export const MOCK_CONTACTS = [
  {
    role: "Public Relations and Outreach",
    name: "Afeefa Shahzadi",
    email: EVENT_CONFIG.contacts.pr_email,
    phone: EVENT_CONFIG.contacts.pr_phone,
    department: "Helpline Team"
  },
  {
    role: "Participant Support",
    name: "M. Mohith Kumar",
    email: EVENT_CONFIG.contacts.main_email,
    phone: EVENT_CONFIG.contacts.helpline,
    department: "Helpline Team"
  }
];

// Mock Emergency Contacts
// export const MOCK_EMERGENCY_CONTACTS = EVENT_CONFIG.emergency;

// Mock FAQ Data
export const MOCK_FAQ_CATEGORIES = [
  { id: 'all', name: 'All Questions', icon: '🔍' },
  { id: 'registration', name: 'Registration', icon: '📝' },
  { id: 'event', name: 'Event Details', icon: '📅' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'technical', name: 'Technical', icon: '💻' },
  { id: 'sponsorship', name: 'Sponsorship', icon: '🤝' },
  { id: 'general', name: 'General', icon: '❓' }
];

export const MOCK_FAQS = [
  {
    id: 1,
    category: 'registration',
    question: 'How do I register for Samyukta 2025?',
    answer: 'Registration is simple! Click the "Register Now" button on our homepage, fill out the form with your details, select your preferred tracks, and submit. You\'ll receive a confirmation email with your QR code and further instructions.'
  },
  {
    id: 2,
    category: 'registration',
    question: 'What is the registration fee?',
    answer: 'Registration fees vary by package: Entry + Workshop Pass (₹800/person), Combo Pack with Startup Pitch (₹900/person), or Combo Pack with Hackathon (₹950/person). Team discounts available for groups of 2-5 members. All packages include workshops, meals, swag, certificates, and access to events.'
  },
  {
    id: 3,
    category: 'registration',
    question: 'Can I register as a team?',
    answer: 'Yes! We encourage team registrations for hackathons and collaborative projects. Teams can have 3-5 members. All team members must register individually but can link their registrations during the process.'
  },
  {
    id: 4,
    category: 'event',
    question: 'What are the event dates and timings?',
    answer: 'Samyukta 2025 runs from August 6-9, 2025. Day 1 starts at 9:00 AM with inauguration. Each day has different themes: Learn (Day 1), Build (Day 2), Launch (Day 3), and Lead (Day 4). Check our Events page for detailed schedules.'
  },
  {
    id: 5,
    category: 'event',
    question: 'Which tracks are available?',
    answer: 'We offer 4 main tracks: 1) Cloud Computing (AWS-powered), 2) AI & Machine Learning (Google Cloud), 3) Hackathon & Startup Pitch, 4) Interactive Games & Networking. You can participate in multiple tracks!'
  },
  {
    id: 6,
    category: 'event',
    question: 'What should I bring to the event?',
    answer: 'Bring your laptop (with accessories), phone charger, notebook, pen, and enthusiasm! We provide meals, swag, and materials. Don\'t forget your QR code (digital or printed) for entry and games. Optional: business cards for networking.'
  },
  {
    id: 7,
    category: 'accommodation',
    question: 'Is accommodation provided?',
    answer: 'Yes! We provide dormitory-style accommodation in ANITS hostels for outstation participants. Accommodation includes dinner on arrival day and breakfast on departure day. Register early as spaces are limited.'
  },
  {
    id: 8,
    category: 'accommodation',
    question: 'What about local participants?',
    answer: 'Local participants (within 50km of ANITS) don\'t need accommodation but are welcome to join evening events and dinners. We provide transportation coordination for local participants if needed.'
  },
  {
    id: 9,
    category: 'technical',
    question: 'What technical prerequisites do I need?',
    answer: 'Basic programming knowledge is helpful but not mandatory. We welcome beginners! For advanced tracks, familiarity with cloud platforms or AI/ML concepts is beneficial but not required. We provide learning resources beforehand.'
  },
  {
    id: 10,
    category: 'technical',
    question: 'Will there be hands-on coding?',
    answer: 'Absolutely! Day 2 focuses on workshops with hands-on coding sessions. Day 3 features our hackathon where you\'ll build real projects. Bring your laptop and be ready to code, collaborate, and create!'
  },
  {
    id: 11,
    category: 'technical',
    question: 'What software/tools will I learn?',
    answer: 'You\'ll get hands-on experience with AWS services, Google Cloud Platform, popular AI/ML frameworks, development tools, and more. We provide free credits and accounts for all major platforms.'
  },
  {
    id: 12,
    category: 'sponsorship',
    question: 'How can my company sponsor Samyukta?',
    answer: 'We offer various sponsorship tiers. Reach out to samyukta.summit@gmail.com for sponsorship details.'
  },
  {
    id: 13,
    category: 'sponsorship',
    question: 'What are the benefits of sponsoring?',
    answer: 'Sponsors get brand visibility to 500+ students, recruitment opportunities, speaking slots, booth space, social media promotion, and networking with industry leaders. It\'s a great way to connect with top talent!'
  },
  {
    id: 14,
    category: 'general',
    question: 'What is the dress code?',
    answer: 'Day 1: Professional attire for inauguration. Day 2: Cultural dress encouraged for networking. Day 3: Freestyle/comfortable for hackathon. Day 4: Summit t-shirt for industry visit. Details are in your confirmation email.'
  },
  {
    id: 15,
    category: 'general',
    question: 'Are meals provided?',
    answer: 'Yes! All meals are included: breakfast, lunch, dinner, and snacks. We cater to dietary restrictions (vegetarian, vegan, etc.). Specify your requirements during registration.'
  },
  {
    id: 16,
    category: 'general',
    question: 'Can I get a certificate?',
    answer: 'Yes! All participants receive digital certificates of participation. Winners of hackathons and competitions get special recognition certificates.'
  },
  {
    id: 17,
    category: 'general',
    question: 'What COVID-19 safety measures are in place?',
    answer: 'We follow all local health guidelines. Sanitization stations are available throughout the venue. We recommend carrying your own sanitizer and mask. Health protocols may be updated based on current guidelines.'
  },
  {
    id: 18,
    category: 'general',
    question: 'What if I need to cancel my registration?',
    answer: 'Contact us for assistance.'
  }
];