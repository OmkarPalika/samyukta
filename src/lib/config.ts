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
    registration_deadline: '2025-07-29T23:59:59Z'
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
    colleges: 30,
    clubs: 10,
    days: 4,
    partners: 5,
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
    total: "₹20,000 + Incentives",
    hackathon: {
      first: "₹5,000",
      second: "₹3,000", 
      third: "₹2,000"
    },
    pitch: {
      first: "₹5,000 + Mentorship",
      second: "₹3,000",
      third: "₹2,000"
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
      description: "Compete for ₹20k+ in prizes and recognition", 
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
    "Institute's Innovation Council", "AMTZ",
    "UniGlobal", "Interview Buddy", "MMK Universe"
  ],
  
  // Contact Information
  contacts: {
    main_email: "samyukta.summit@gmail.com",
    pr_email: "samyukta.summit@gmail.com",
    sponsor_email: "samyukta.summit@gmail.com",
    helpline: "+91-9014247180",
    pr_phone: "+91-9059614659"
  },
  
  // Social Media
  social: {
    twitter: "@samyukta_anits",
    instagram: "@samyukta.2025", 
    linkedin: "groups/14723748/",
    // youtube: "@anits-official"
  },
  
  // Benefits
  benefits: [
    "Exclusive starter kit with swag and resources",
    "Access to all interactive games and competitions",
    "Meals, snacks, and refreshments throughout the event",
    "Evening cultural events and entertainment",
    "Networking opportunities with industry leaders",
    "Certificate of participation and skill validation"
  ],
  
  // Emergency Contacts
  // emergency: [
  //   { title: "Medical Emergency", contact: "108 (Ambulance)", description: "24/7 emergency medical services" },
  //   { title: "Campus Security", contact: "+91-9876543214", description: "ANITS security helpline" },
  //   { title: "Event Helpline", contact: "+91-9876543215", description: "24/7 during event dates" },
  //   { title: "Police Station", contact: "100 (Police)", description: "Local police emergency" }
  // ]
};

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
  admin: { email: 'admin@samyukta.com', password: 'admin123' },
  coordinator: { email: 'coordinator@samyukta.com', password: 'coord123' },
  participant: { email: 'participant@samyukta.com', password: 'part123' }
};