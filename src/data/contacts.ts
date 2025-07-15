// Contact Page Data and Configuration
export const CONTACT_PAGE_DATA = {
  title: "Contact Us",
  description: "Get in touch with our team for any queries, support, or partnerships",
  venue: {
    name: "Anil Neerukonda Institute of Technology & Sciences",
    address: "Sangivalasa, Bheemunipatnam Mandal,\nVisakhapatnam District, Andhra Pradesh 531162",
    phone: "+91-8897892720",
    email: "samyukta.summit@gmail.com",
    event_dates: "Aug 6-9, 2025"
  },
  transport_info: [
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
  reach_us_section: {
    title: "How to Reach Us",
    description: "Multiple convenient ways to reach ANITS, Visakhapatnam for Samyukta 2025"
  }
} as const;

// Contact Information - All contact details centralized
export const CONTACTS_DATA = {
  // Main Contacts
  main: {
    email: "samyukta.summit@gmail.com",
    helpline: "+91-9014247180"
  },
  
  // Specialized Contacts
  pr: {
    email: "samyukta.summit@gmail.com",
    phone: "+91-9059614659"
  },
  
  sponsor: {
    email: "samyukta.summit@gmail.com",
    phone: "+91-9876543210"
  },
  
  speakers: {
    email: "speakers@samyukta.anits.edu.in"
  },
  
  // Venue Contact
  venue: {
    phone: "+91-8897892720",
    email: "samyukta.summit@gmail.com"
  },
  
  // Team Members
  team: [
    {
      role: "Public Relations and Outreach",
      name: "Afeefa Shahzadi",
      email: "samyukta.summit@gmail.com",
      phone: "+91-9059614659",
      department: "Helpline Team"
    },
    {
      role: "Participant Support",
      name: "M. Mohith Kumar",
      email: "samyukta.summit@gmail.com",
      phone: "+91-9014247180",
      department: "Helpline Team"
    }
  ],
  
  // Social Media
  social: {
    twitter: "@samyukta_anits",
    instagram: "@samyukta.2025", 
    linkedin: "groups/14723748/"
  },
  
  // Support Channels
  support_channels: [
    {
      icon: "Mail",
      title: "Email Support",
      description: "Get detailed answers to your questions",
      contact: "samyukta.summit@gmail.com",
      action: "mailto:samyukta.summit@gmail.com"
    },
    {
      icon: "Phone",
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+91-9014247180",
      action: "tel:+91-9014247180"
    }
  ]
} as const;