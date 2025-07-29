// FAQ Page Data and Configuration
export const FAQ_PAGE_DATA = {
  title: "Frequently Asked Questions",
  description: "Got questions? We've got answers! Find everything you need to know about Samyukta 2025.",
  support_section: {
    title: "Still Have Questions?",
    description: "Can't find what you're looking for? Our team is here to help! Reach out to us through any of these channels."
  }
} as const;

// FAQ Categories and Questions Data
export const FAQ_CATEGORIES = [
  { id: 'all', name: 'All Questions', icon: '🔍' },
  { id: 'registration', name: 'Registration', icon: '📝' },
  { id: 'event', name: 'Event Details', icon: '📅' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'technical', name: 'Technical', icon: '💻' },
  { id: 'sponsorship', name: 'Sponsorship', icon: '🤝' },
  { id: 'general', name: 'General', icon: '❓' }
] as const;

export const FAQ_DATA = [
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
    answer: 'We offer 5 main tracks: 1) Cloud Computing (AWS-powered), 2) AI & Machine Learning (Google Cloud), 3) Cybersecurity & Ethical Hacking, 4) Hackathon & Startup Pitch, 5) Interactive Games & Networking. You can participate in multiple tracks!'
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
    answer: 'You\'ll get hands-on experience with AWS services, Google Cloud Platform, popular AI/ML frameworks, cybersecurity tools, development tools, and more. We provide free credits and accounts for all major platforms.'
  },
  {
    id: 19,
    category: 'technical',
    question: 'What will I learn in the Cybersecurity track?',
    answer: 'The Cybersecurity track covers ethical hacking fundamentals, penetration testing, vulnerability assessment, network security, and hands-on labs with industry-standard tools. Perfect for beginners and those looking to enhance their security skills!'
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
] as const;