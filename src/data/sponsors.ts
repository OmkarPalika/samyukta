// Sponsors Page Data and Configuration
export const SPONSORS_PAGE_DATA = {
  title: "Our Sponsors",
  description: "Partnering with industry leaders to create an unforgettable experience",
  benefits_section: {
    title: "Sponsorship Benefits",
    description: "Maximize your brand exposure and connect with India's brightest tech talent"
  },
  cta_section: {
    title: "Ready to Partner with Us?",
    description: "Join leading brands in supporting India's most innovative tech summit and connect with tomorrow's technology leaders.",
    contact_email: "sponsors@samyukta.anits.edu.in",
    contact_phone: "+91-9876543210"
  }
} as const;

// Sponsors and Partners Data
export const SPONSORS_DATA = [
  {
    tier: "Hosting Sponsor",
    color: "from-blue-500 to-cyan-500",
    bg_color: "bg-blue-500/10",
    text_color: "text-blue-400",
    border_color: "border-blue-500/20",
    amount: "Main Venue",
    sponsors: [
      {
        name: "ANITS",
        website: "https://anits.edu.in",
        description: "Anil Neerukonda Institute of Technology and Sciences"
      }
    ]
  },
  {
    tier: "Workshop Sponsors",
    color: "from-orange-400 to-amber-500",
    bg_color: "bg-orange-500/10",
    text_color: "text-orange-400",
    border_color: "border-orange-500/20",
    amount: "Technical Workshops",
    sponsors: [
      {
        name: "AWS Educate",
        website: "https://aws.amazon.com/education/awseducate",
        description: "Amazon's global initiative to provide students with resources for cloud learning"
      },
      {
        name: "GDG Vizag",
        website: "https://gdg.community.dev/gdg-vizag",
        description: "Google Developer Group Visakhapatnam"
      }
    ]
  },
  {
    tier: "Hackathon Sponsor",
    color: "from-green-400 to-emerald-500",
    bg_color: "bg-green-500/10",
    text_color: "text-green-400",
    border_color: "border-green-500/20",
    amount: "Coding Competition",
    sponsors: [
      {
        name: "GeeksforGeeks",
        website: "https://geeksforgeeks.org",
        description: "Leading programming education platform"
      }
    ]
  },
  {
    tier: "Startup Pitch Sponsors",
    color: "from-violet-400 to-purple-500",
    bg_color: "bg-violet-500/10",
    text_color: "text-violet-400",
    border_color: "border-violet-500/20",
    amount: "Entrepreneurship Track",
    sponsors: [
      {
        name: "Institute's Innovation Council (IIC)",
        website: "https://mic.gov.in",
        description: "Fostering innovation and entrepreneurship in educational institutions"
      },
      {
        name: "MMK Universe",
        website: "#",
        description: "Supporting startup ecosystem and innovation"
      },
      {
        name: "BizVerve Club",
        website: "#",
        description: "Student entrepreneurship club"
      },
      {
        name: "A-Hub/TIE",
        website: "#",
        description: "Startup incubation and mentorship"
      }
    ]
  },
  {
    tier: "Industrial Visit",
    color: "from-red-400 to-rose-500",
    bg_color: "bg-red-500/10",
    text_color: "text-red-400",
    border_color: "border-red-500/20",
    amount: "Industry Exposure",
    sponsors: [
      {
        name: "AMTZ",
        website: "https://amtz.in",
        description: "Andhra Pradesh MedTech Zone"
      }
    ]
  },
  {
    tier: "Swags Partners",
    color: "from-yellow-400 to-amber-500",
    bg_color: "bg-yellow-500/10",
    text_color: "text-yellow-400",
    border_color: "border-yellow-500/20",
    amount: "Merchandise & Goodies",
    sponsors: [
      {
        name: "UNIGLOBAL",
        website: "#",
        description: "Overseas consultancy firm"
      },
      {
        name: "Interview Buddy",
        website: "#",
        description: "Career preparation and interview training"
      }
    ]
  }
] as const;

// Partners List
export const PARTNERS_DATA = [
  "AWS Educate", 
  "Google Cloud", 
  "GeeksforGeeks",
  "Institute's Innovation Council", 
  "AMTZ",
  "UniGlobal", 
  "Interview Buddy", 
  "MMK Universe"
] as const;

// Event Statistics
export const EVENT_STATS = [
  { number: "400+", label: "Participants", icon: "Users" },
  { number: "30+", label: "Colleges", icon: "Target" },
  { number: "4", label: "Days", icon: "Globe" },
  { number: "5+", label: "Partners", icon: "Star" }
] as const;