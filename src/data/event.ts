// Event Configuration - Core event details
export const EVENT_DATA = {
  // Basic Info
  name: "Samyukta 2025",
  tagline: "Igniting Innovation. Uniting Talent.",
  description: "India's premier student-led national innovation summit bringing together 400+ participants, 30+ colleges, and industry leaders for 4 days of learning, building, and celebrating.",
  
  // Dates & Time
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
      country: "IN",
      full: "Sangivalasa, Bheemunipatnam Mandal,\nVisakhapatnam District, Andhra Pradesh 531162"
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
    entry_workshop: 800,
    combo_hackathon: 950,
    combo_pitch: 900,
    hackathon_addon: 150,
    pitch_addon: 100,
    direct_join_hackathon: 250,
    direct_join_pitch: 200,
    combo_discount: 50,
    team_discount_per_person: 10
  },
  
  // Prizes
  prizes: {
    total: "Cash Prizes + Incentives + Surprises",
    hackathon: {
      first: "Cash Prizes + GFG Merchandise + Interview Buddy Merchandise",
      second: "Cash Prizes + GFG Merchandise + Interview Buddy Merchandise", 
      third: "Cash Prizes + Interview Buddy Merchandise"
    },
    pitch: {
      first: "Cash Prizes + Mentorship",
      second: "Cash Prizes + Mentorship",
      third: "Cash Prizes + Mentorship"
    }
  },
  
  // Tracks
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
      description: "Compete for exciting prizes and recognition", 
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
  
  // Benefits
  benefits: [
    "Exclusive starter kit with swag and resources",
    "Access to all interactive games and competitions",
    "Meals, snacks, and refreshments throughout the event",
    "Evening cultural events and entertainment",
    "Networking opportunities with industry leaders",
    "Certificate of participation and skill validation"
  ],

  // Partnerships
  partnerships: [
    {name: "GFG", logo: "/assets/partners/gfg.png"},
    {name: "Interview Buddy", logo: "/assets/partners/interviewbuddy.png"},
    {name: "Amazon Web Services (AWS)", logo: "/assets/partners/aws.png"},
    {name: "Google Cloud Platform (GCP)", logo: "/assets/partners/googlecloud.png"},
  ],

  // Social Media Links
  social_media_links: {
    instagram: "https://www.instagram.com/samyukta.2025/",
    linkedin: "https://www.linkedin.com/groups/14723748/"
  },

  // Contact Information
  contacts: {
    email: "samyukta.summit@gmail.com",
    phone_number: "+91 8897892720",
    whatsapp_number: "+91 8897892720",
    address: "Sangivalasa, Bheemunipatnam Mandal,\nVisakhapatnam District, Andhra Pradesh 531162"
  },
} as const;