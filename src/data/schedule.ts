// Event Schedule and Timeline Data
export const EVENT_SCHEDULE = [
  {
    id: "day1",
    title: "Day 1: Inauguration & Workshop Kickoff",
    date: "August 6, 2025",
    dress_code: "Professional",
    color: "from-blue-500 to-cyan-500",
    events: [
      { 
        time: "9:00–10:30 AM", 
        duration: 1.5, 
        unified: { title: "Inauguration", type: "ceremony" } 
      },
      { 
        time: "10:30–11:00 AM", 
        duration: 0.5, 
        unified: { title: "Logistics", type: "logistics" } 
      },
      { 
        time: "11:00–12:30 PM", 
        duration: 1.5, 
        track_a: { title: "Workshop Session 1", description: "Cloud Computing Fundamentals", type: "workshop" }, 
        track_b: { title: "Workshop Session 1", description: "AI/ML Fundamentals", type: "workshop" },
        track_c: { title: "Workshop Session 1", description: "Cybersecurity Fundamentals", type: "workshop" }
      },
      { 
        time: "12:30–1:30 PM", 
        duration: 1, 
        track_a: { title: "Lunch Break", type: "break" }, 
        track_b: { title: "Workshop Continues", description: "Advanced AI Concepts", type: "workshop" },
        track_c: { title: "Workshop Continues", description: "Network Security Basics", type: "workshop" }
      },
      { 
        time: "1:00–2:00 PM", 
        duration: 1, 
        track_a: { title: "Workshop Continues", description: "AWS Services Deep Dive", type: "workshop" }, 
        track_b: { title: "Lunch Break", type: "break" },
        track_c: { title: "Lunch Break", type: "break" }
      },
      { 
        time: "2:00–4:30 PM", 
        duration: 2.5, 
        track_a: { title: "Workshop Session 2", description: "Hands-on AWS Projects", type: "workshop" }, 
        track_b: { title: "Workshop Session 2", description: "Google Cloud AI Tools", type: "workshop" },
        track_c: { title: "Workshop Session 2", description: "Ethical Hacking & Penetration Testing", type: "workshop" }
      },
      { 
        time: "4:30–5:00 PM", 
        duration: 0.5, 
        unified: { title: "Discussion, Icebreaker Game & Wind-up", type: "game" } 
      },
      { 
        time: "5:00–6:00 PM", 
        duration: 1, 
        unified: { title: "Refreshments & Logistics", type: "networking" } 
      },
      { 
        time: "6:30–8:00 PM", 
        duration: 1.5, 
        unified: { title: "Cultural Night", description: "Performances and Entertainment", type: "cultural" } 
      }
    ]
  },
  {
    id: "day2",
    title: "Day 2: Deep Dive Workshops",
    date: "August 7, 2025",
    dress_code: "Cultural",
    color: "from-violet-500 to-purple-500",
    events: [
      { 
        time: "9:00–12:30 PM", 
        duration: 3.5, 
        track_a: { title: "Workshop Session 3", description: "Advanced AWS Architecture", type: "workshop" }, 
        track_b: { title: "Workshop Session 3", description: "Machine Learning Models", type: "workshop" },
        track_c: { title: "Workshop Session 3", description: "Advanced Threat Detection", type: "workshop" }
      },
      { 
        time: "12:30–1:30 PM", 
        duration: 1, 
        track_a: { title: "Workshop Continues", description: "Serverless Computing", type: "workshop" }, 
        track_b: { title: "Lunch Break", type: "break" },
        track_c: { title: "Workshop Continues", description: "Incident Response & Forensics", type: "workshop" }
      },
      { 
        time: "1:00–2:00 PM", 
        duration: 1, 
        track_a: { title: "Lunch Break", type: "break" }, 
        track_b: { title: "Workshop Continues", description: "Neural Networks", type: "workshop" },
        track_c: { title: "Lunch Break", type: "break" }
      },
      { 
        time: "2:00–4:30 PM", 
        duration: 1.5, 
        track_a: { title: "Workshop Session 4", description: "DevOps with AWS", type: "workshop" }, 
        track_b: { title: "Workshop Session 4", description: "AI Ethics & Deployment", type: "workshop" },
        track_c: { title: "Workshop Session 4", description: "Security Compliance & Best Practices", type: "workshop" }
      },
      { 
        time: "4:30–5:00 PM", 
        duration: 0.5, 
        unified: { title: "Feedback Collection, Quiz & Giveaways", type: "game" } 
      },
      { 
        time: "5:00–6:00 PM", 
        duration: 1, 
        unified: { title: "Refreshments & Logistics", type: "networking" } 
      }
    ]
  },
  {
    id: "day3",
    title: "Day 3: Hackathon & Startup Pitch",
    date: "August 8, 2025",
    dress_code: "Freestyle",
    color: "from-pink-500 to-rose-500",
    events: [
      { 
        time: "9:00–11:00 AM", 
        duration: 2, 
        track_a: { title: "GFG Presents: Solve-for-India HackJam", description: "Hackathon Kickoff", type: "competition" }, 
        track_b: { title: "IIC Presents: Pitch Arena", description: "Startup-ready teams", type: "competition" } 
      },
      { 
        time: "11:00–11:15 AM", 
        duration: 0.25, 
        unified: { title: "Refreshments", type: "break" } 
      },
      { 
        time: "11:15–1:00 PM", 
        duration: 1.75, 
        track_a: { title: "Track Continuation", description: "Development Phase", type: "competition" }, 
        track_b: { title: "Track Continuation", description: "Pitch Refinement", type: "competition" } 
      },
      { 
        time: "1:00–2:00 PM", 
        duration: 1, 
        unified: { title: "Lunch Break", type: "break" } 
      },
      { 
        time: "2:00–3:00 PM", 
        duration: 1, 
        track_a: { title: "Final Submission", description: "Project Finalization", type: "competition" }, 
        track_b: { title: "Track Continuation & Free Exploration", type: "competition" } 
      },
      { 
        time: "3:00–5:00 PM", 
        duration: 2, 
        track_a: { title: "Judging & Final Evaluation", type: "competition" }, 
        track_b: { title: "Panel Deliberation", type: "competition" } 
      },
      { 
        time: "5:00–5:30 PM", 
        duration: 0.5, 
        unified: { title: "Logistics", type: "logistics" } 
      },
      { 
        time: "5:30–6:00 PM", 
        duration: 0.5, 
        unified: { title: "Imposter & QR Quest Results, Polls & Ratings Reveal", type: "game" } 
      },
      { 
        time: "6:00–7:00 PM", 
        duration: 1, 
        unified: { title: "Grand Closing Ceremony + Prize Distribution", type: "ceremony" } 
      }
    ]
  },
  {
    id: "day4",
    title: "Day 4: Industry Visit",
    date: "August 9, 2025",
    dress_code: "Summit T-shirt",
    color: "from-emerald-500 to-teal-500",
    events: [
      { 
        time: "9:30 AM", 
        duration: 1.5, 
        unified: { title: "Refreshments & Logistics, Departure to AMTZ, Vizag", description: "Only for Club Leads & Winners", type: "visit" } 
      },
      { 
        time: "11:00 AM–12:00 PM", 
        duration: 1, 
        unified: { title: "Explore AMTZ", description: "Facility Tour", type: "visit" } 
      },
      { 
        time: "12:00–1:00 PM", 
        duration: 1, 
        unified: { title: "Self-paid Lunch", type: "break" } 
      },
      { 
        time: "1:00–3:00 PM", 
        duration: 2, 
        unified: { title: "Innovation Showcase & Industrial Tour", type: "visit" } 
      },
      { 
        time: "3:00–3:30 PM", 
        duration: 0.5, 
        unified: { title: "Group Photos", type: "networking" } 
      },
      { 
        time: "4:00 PM", 
        duration: 1, 
        unified: { title: "Return & Feedback Collection", type: "networking" } 
      }
    ]
  }
] as const;