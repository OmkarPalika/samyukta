// Central configuration for all hardcoded content
export const EVENT_CONFIG = {
  // Event Details
  name: "Samyukta 2025",
  tagline: "Igniting Innovation. Uniting Talent.",
  description: "India's premier student-led national innovation summit bringing together 400+ participants, 30+ colleges, and industry leaders for 4 days of learning, building, and celebrating.",
  
  // Dates
  dates: {
    start: '2025-08-06T09:00:00',
    end: '2025-08-09T18:00:00',
    display: 'August 6-9, 2025',
    registration_deadline: '2025-02-15T23:59:59Z'
  },
  
  // Location
  location: {
    venue: "ANITS, Visakhapatnam",
    full_name: "Anil Neerukonda Institute of Technology and Sciences",
    address: {
      street: "Sangivalasa",
      city: "Visakhapatnam", 
      state: "Andhra Pradesh",
      pincode: "531162",
      country: "IN"
    }
  },
  
  // Capacity & Stats
  capacity: {
    total_participants: 400,
    max_total: 400,
    colleges: 50,
    days: 4,
    partners: 15,
    cloud_workshop: 200,
    ai_workshop: 200
  },
  
  // Pricing
  pricing: {
    individual: 999,
    team_3: 2499,
    team_5: 3999,
    direct_join_hackathon: 250,
    direct_join_pitch: 200,
    combo_discount: 299
  },
  
  // Prizes
  prizes: {
    total: "₹5L+",
    hackathon: {
      first: "₹50,000",
      second: "₹25,000", 
      third: "₹10,000"
    },
    pitch: {
      first: "₹30,000 + Incubation",
      second: "₹15,000",
      third: "₹5,000"
    }
  },
  
  // Tracks & Highlights
  tracks: [
    {
      title: "Cloud Computing Track",
      description: "AWS-powered workshops and certifications",
      color: "from-blue-500 to-cyan-500",
      icon: "Cloud"
    },
    {
      title: "AI & ML Workshop", 
      description: "Google AI training and hands-on projects",
      color: "from-violet-500 to-purple-500",
      icon: "Brain"
    },
    {
      title: "Hackathon & Pitch",
      description: "Compete for ₹5L+ in prizes and recognition", 
      color: "from-pink-500 to-rose-500",
      icon: "Trophy"
    },
    {
      title: "Interactive Games",
      description: "QR Quest and Imposter Hunt across campus",
      color: "from-green-500 to-emerald-500", 
      icon: "Target"
    }
  ],
  
  // Partners
  partners: [
    "AWS Educate", "Google Cloud", "GeeksforGeeks",
    "Innovation Council", "AMTZ"
  ],
  
  // Contact Information
  contacts: {
    main_email: "samyukta@anits.edu.in",
    sponsor_email: "sponsors@samyukta.anits.edu.in",
    tech_email: "tech@samyukta.anits.edu.in",
    accommodation_email: "accommodation@samyukta.anits.edu.in",
    helpline: "+91-9876543210",
    campus_security: "+91-9876543214",
    event_helpline: "+91-9876543215"
  },
  
  // Social Media
  social: {
    twitter: "@samyukta_anits",
    instagram: "@samyukta_anits", 
    linkedin: "company/anits-samyukta",
    youtube: "@anits-official"
  },
  
  // Benefits
  benefits: [
    "AWS Educate Account with $100+ credits",
    "Google Cloud Platform credits and certifications", 
    "Exclusive starter kit with swag and resources",
    "Access to all interactive games and competitions",
    "Meals, snacks, and refreshments throughout the event",
    "Evening cultural events and entertainment",
    "Networking opportunities with industry leaders",
    "Certificate of participation and skill validation",
    "Priority access to internship and job opportunities",
    "Lifetime membership to Samyukta alumni network"
  ],
  
  // Emergency Contacts
  emergency: [
    { title: "Medical Emergency", contact: "108 (Ambulance)", description: "24/7 emergency medical services" },
    { title: "Campus Security", contact: "+91-9876543214", description: "ANITS security helpline" },
    { title: "Event Helpline", contact: "+91-9876543215", description: "24/7 during event dates" },
    { title: "Police Station", contact: "100 (Police)", description: "Local police emergency" }
  ]
};

// URL Configuration
export const URL_CONFIG = {
  base: process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta.anits.edu.in',
  register: '/register',
  login: '/login',
  dashboard: '/dashboard',
  events: '/events',
  about: '/about',
  contact: '/contact'
};

// Demo Login Credentials
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@samyukta.com', password: 'admin123' },
  coordinator: { email: 'coordinator@samyukta.com', password: 'coord123' },
  participant: { email: 'participant@samyukta.com', password: 'part123' }
};