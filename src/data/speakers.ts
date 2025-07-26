// Speakers Page Data and Configuration
export const SPEAKERS_PAGE_DATA = {
  title: "Industry Experts",
  description: "Learn from the best minds in technology, innovation, and entrepreneurship",
  badges: [
    { icon: "Calendar", text: "6 Expert Sessions" },
    { icon: "MapPin", text: "Industry Leaders" },
    { icon: "Clock", text: "Interactive Sessions" }
  ],
  speakingOpportunities: {
    title: "Want to Speak at Samyukta?",
    description: "Join our community of expert speakers and share your knowledge with the next generation of innovators",
    contactEmail: "samyukta.summit@gmail.com"
  }
} as const;

// Speakers and Speaking Opportunities Data
export const SPEAKERS_STATUS = {
  isReady: false,
  message: 'Speakers will be updated soon',
  expectedUpdateDate: '2025-07-20T00:00:00Z'
} as const;

// Mock speakers data for when ready
export const SPEAKERS_DATA = [
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
] as const;

// Speaking opportunity benefits
export const SPEAKING_BENEFITS = [
  {
    icon: '🎯',
    title: 'Reach Tech Talent',
    description: 'Connect with 500+ students and young professionals passionate about technology'
  },
  {
    icon: '🌟',
    title: 'Brand Visibility',
    description: 'Showcase your expertise and enhance your personal and company brand'
  },
  {
    icon: '🤝',
    title: 'Networking',
    description: 'Connect with industry leaders, academics, and government officials'
  }
] as const;