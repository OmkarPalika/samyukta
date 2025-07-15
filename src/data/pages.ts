import { Target, Heart, Users, Globe, Lightbulb, Award } from "lucide-react";

// Page-specific content and data
export const PAGES_DATA = {
  // About Page
  about: {
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
        stats: "Exciting Prizes"
      }
    ],
    anits_advantage: {
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
    community_impact: {
      title: "Building Tomorrow's Tech Leaders",
      description: "Samyukta 2025 isn't just about the four days in August — it's about creating lasting connections, fostering innovation, and building a community that continues to grow and impact the tech ecosystem.",
      stats: [
        { number: "400+", label: "Participants" },
        { number: "10+", label: "Clubs United" },
        { number: "5+", label: "Industry Partners" },
        { number: "4", label: "Days of Innovation" }
      ]
    }
  },

  // Team Page
  team: {
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
    coming_soon: {
      title: "More Team Members Coming Soon",
      description: "The complete Samyukta team will be updated by July 15th, 2025"
    }
  }
} as const;