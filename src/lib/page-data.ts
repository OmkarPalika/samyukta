import { 
  Target, 
  Heart, 
  Users, 
  Globe, 
  Lightbulb, 
  Award, 
  Mail, 
  Phone} from "lucide-react";
import { EVENT_CONFIG } from "./config";

// About Page Data
export const ABOUT_PAGE_DATA = {
  values: [
    {
      icon: Target,
      title: "Mission",
      description: "To create a platform where innovation meets opportunity, fostering collaboration between students, industry leaders, and tech enthusiasts.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Vision",
      description: "Building India's most impactful tech community by uniting diverse talents and igniting breakthrough innovations.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Bringing together 400+ participants, 10+ clubs, industry experts, and dignitaries under one roof.",
      color: "from-pink-500 to-rose-500"
    }
  ],
  differentiators: [
    {
      icon: Globe,
      title: "Industry Integration",
      description: "Direct collaboration with AWS, Google Cloud, and leading tech companies providing real-world exposure.",
      stats: "5+ Partners"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Hands-on workshops, hackathons, and pitch competitions designed to turn ideas into reality.",
      stats: "4 Tracks"
    },
    {
      icon: Award,
      title: "Recognition Platform",
      description: "Showcase your talents to industry leaders and government officials, opening doors to new opportunities.",
      stats: "₹20k+ Prizes"
    }
  ],
  anitsAdvantage: {
    points: [
      {
        title: "Strategic Location",
        description: "Located in Visakhapatnam, the emerging tech hub of South India, with proximity to AMTZ (Andhra Pradesh MedTech Zone)."
      },
      {
        title: "Industry Connections",
        description: "Strong partnerships with leading tech companies and government initiatives supporting digital transformation."
      },
      {
        title: "Innovation Ecosystem",
        description: "Home to vibrant student communities, startup incubators, and research initiatives driving technological advancement."
      }
    ],
    campus: {
      title: "ANITS, Visakhapatnam",
      description: "A premier engineering institution fostering innovation, research, and industry collaboration for over two decades."
    }
  },
  communityImpact: {
    title: "Building Tomorrow's Tech Leaders",
    description: `${EVENT_CONFIG.name} isn't just about the four days in August — it's about creating lasting connections, fostering innovation, and building a community that continues to grow and impact the tech ecosystem.`,
    stats: [
      { number: `${EVENT_CONFIG.capacity.total_participants}+`, label: "Participants" },
      { number: `${EVENT_CONFIG.capacity.clubs}+`, label: "Clubs United" },
      { number: `${EVENT_CONFIG.capacity.partners}+`, label: "Industry Partners" },
      { number: EVENT_CONFIG.capacity.days.toString(), label: "Days of Innovation" }
    ]
  }
};

// Contact Page Data
export const CONTACT_PAGE_DATA = {
  title: "Contact Us",
  description: "Get in touch with our team for any queries, support, or partnerships",
  supportChannels: [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed answers to your questions",
      contact: EVENT_CONFIG.contacts.main_email,
      action: `mailto:${EVENT_CONFIG.contacts.main_email}`
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: EVENT_CONFIG.contacts.helpline,
      action: `tel:${EVENT_CONFIG.contacts.helpline}`
    }
  ],
  venue: {
    name: "Anil Neerukonda Institute of Technology & Sciences",
    address: "Sangivalasa, Bheemunipatnam Mandal,\nVisakhapatnam District, Andhra Pradesh 531162",
    phone: "+91-8897892720",
    email: EVENT_CONFIG.contacts.main_email,
    eventDates: "Aug 6-9, 2025"
  },
  transportInfo: [
    {
      icon: "Plane",
      title: "By Air",
      description: "Visakhapatnam Airport (VTZ) - 95 minutes drive",
      details: "Regular flights from major cities."
    },
    {
      icon: "Train",
      title: "By Train",
      description: "Visakhapatnam Railway Station - 60 minutes drive",
      details: "Well connected to all major cities."
    },
    {
      icon: "Car",
      title: "By Road",
      description: "NH16 connects to major cities",
      details: "GPS: ANITS, Sangivalasa, Visakhapatnam. Parking available."
    }
  ],
  reachUsSection: {
    title: "How to Reach Us",
    description: "Multiple convenient ways to reach ANITS, Visakhapatnam for Samyukta 2025"
  }
};

// FAQs Page Data
export const FAQS_PAGE_DATA = {
  title: "Frequently Asked Questions",
  description: "Got questions? We've got answers! Find everything you need to know about Samyukta 2025.",
  supportSection: {
    title: "Still Have Questions?",
    description: "Can't find what you're looking for? Our team is here to help! Reach out to us through any of these channels."
  }
};

// Speakers Page Data
export const SPEAKERS_PAGE_DATA = {
  title: "Industry Experts",
  description: "Learn from the best minds in technology, innovation, and entrepreneurship",
  badges: [
    {
      icon: "Calendar",
      text: "6 Expert Sessions"
    },
    {
      icon: "MapPin",
      text: "Industry Leaders"
    },
    {
      icon: "Clock",
      text: "Interactive Sessions"
    }
  ],
  speakingOpportunities: {
    title: "Want to Speak at Samyukta?",
    description: "Join our community of expert speakers and share your knowledge with the next generation of innovators",
    contactEmail: "speakers@samyukta.anits.edu.in"
  }
};

// Sponsors Page Data
export const SPONSORS_PAGE_DATA = {
  title: "Our Sponsors",
  description: "Partnering with industry leaders to create an unforgettable experience",
  benefitsSection: {
    title: "Sponsorship Benefits",
    description: "Maximize your brand exposure and connect with India's brightest tech talent"
  },
  ctaSection: {
    title: "Ready to Partner with Us?",
    description: "Join leading brands in supporting India's most innovative tech summit and connect with tomorrow's technology leaders.",
    contactEmail: "sponsors@samyukta.anits.edu.in",
    contactPhone: "+91-9876543210"
  }
};

// Team Page Data
export const TEAM_PAGE_DATA = {
  title: "Our Team",
  description: "Meet the passionate individuals behind Samyukta 2025",
  categories: [
    {
      title: "Patrons",
      description: "Leadership guiding Samyukta 2025",
      members: [
        {
          name: "Prof. V. Rajya Lakshmi",
          role: "Principal, ANITS",
          image: "/team/principal.jpg",
          social: {}
        },
        {
          name: "Prof. G. Srinivas",
          role: "HoD, CSE",
          image: "/team/hod.jpg",
          social: {}
        }
      ]
    },
    {
      title: "Faculty Coordinators",
      description: "Faculty members guiding the event",
      members: [
        {
          name: "Dr. D. Nagatej",
          role: "Associate Professor, CSE",
          image: "/team/nagatej.jpg",
          social: {}
        },
        {
          name: "Mr. B. Ravi Kumar",
          role: "Assistant Professor, CSE",
          image: "/team/ravi.jpg",
          social: {}
        },
        {
          name: "Mr. B. Mahesh",
          role: "Assistant Professor, CSE",
          image: "/team/mahesh.jpg",
          social: {}
        },
        {
          name: "Mr. N. Srinivas",
          role: "Assistant Professor, CSE",
          image: "/team/srinivas.jpg",
          social: {}
        }
      ]
    },
    {
      title: "Student Coordinators",
      description: "Student leaders organizing Samyukta 2025",
      members: [
        {
          name: "Omkar Palika",
          role: "Convenor",
          image: "/team/omkar.jpg",
          social: {
            linkedin: "https://www.linkedin.com/in/omkar-palika/",
            instagram: "https://www.instagram.com/omkarpalika/"
          }
        }
      ]
    }
  ],
  comingSoon: {
    title: "More Team Members Coming Soon",
    description: "The complete Samyukta team will be updated by July 15th, 2025"
  },
  // joinSection: {
  //   title: "Join Our Team",
  //   description: "Interested in being part of Samyukta 2025? We're always looking for passionate volunteers!",
  //   contactEmail: "join@samyukta.anits.edu.in"
  // }
};