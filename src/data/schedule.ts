// Event Schedule and Timeline Data
export const EVENT_SCHEDULE = [
  {
    id: "day1",
    title: "Day 1: Inauguration & AI/ML Track",
    date: "August 6, 2025",
    dress_code: "Professional",
    color: "from-blue-500 to-cyan-500",
    events: [
      {
        time: "9:00–9:30 AM",
        duration: 30,
        unified: { title: "Registration & Kit Distribution", type: "registration" }
      },
      {
        time: "9:30–10:30 AM",
        duration: 60,
        unified: { title: "Inauguration", type: "ceremony" }
      },
      {
        time: "10:30–12:00 PM",
        duration: 90,
        unified: { title: "AI/ML Workshop Session 1", description: "AI/ML Fundamentals", type: "workshop" }
      },
      {
        time: "12:00–1:00 PM",
        duration: 60,
        unified: { title: "Lunch Break", type: "break" }
      },
      {
        time: "1:00–2:00 PM",
        duration: 60,
        unified: { title: "AI/ML Workshop Session 2", description: "Machine Learning Models & Implementation", type: "workshop" }
      },
      {
        time: "2:00–4:00 PM",
        duration: 120,
        unified: { title: "Games & Activities", description: "Zero Protocol: A Game of Strategy & Tactics", type: "game" }
      },
      {
        time: "4:00–5:00 PM",
        duration: 60,
        unified: { title: "Refreshments & Networking", type: "networking" }
      },
      {
        time: "5:00–6:30 PM",
        duration: 90,
        unified: { title: "Cultural Night", description: "Performances and Entertainment", type: "cultural" }
      }
    ]
  },
  {
    id: "day2",
    title: "Day 2: Cloud Computing Track Deep Dive",
    date: "August 7, 2025",
    dress_code: "Cultural",
    color: "from-violet-500 to-purple-500",
    events: [
      {
        time: "9:00–12:00 AM",
        duration: 120,
        unified: { title: "Cloud Workshop Session 1", description: "Cloud Computing Fundamentals", type: "workshop" }
      },
      {
        time: "12:00–1:00 PM",
        duration: 30,
        unified: { title: "Lunch Break", type: "break" }
      },
      {
        time: "1:00 AM–2:00 PM",
        duration: 150,
        unified: { title: "Cloud Workshop Session 2", description: "Deep Dive into Cloud Computing", type: "workshop" }
      },
      {
        time: "2:00–4:00 PM",
        duration: 120,
        unified: { title: "Games & Activities", description: "Zero Protocol: A Game of Strategy & Tactics", type: "game" }
      },
      {
        time: "4:00–5:00 PM",
        duration: 60,
        unified: { title: "Refreshments & Networking", type: "networking" }
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
        duration: 120,
        track_a: { title: "GFG Presents: Solve-for-India HackJam", description: "Hackathon Kickoff", type: "competition" },
        track_b: { title: "IIC Presents: Pitch Arena", description: "Startup-ready teams", type: "competition" }
      },
      {
        time: "11:00–11:15 AM",
        duration: 15,
        unified: { title: "Refreshments", type: "break" }
      },
      {
        time: "11:15–1:00 PM",
        duration: 105,
        track_a: { title: "Track Continuation", description: "Development Phase", type: "competition" },
        track_b: { title: "Track Continuation", description: "Pitching Continuation", type: "competition" }
      },
      {
        time: "1:00–2:00 PM",
        duration: 60,
        unified: { title: "Lunch Break", type: "break" }
      },
      {
        time: "2:00–3:00 PM",
        duration: 60,
        track_a: { title: "Final Submission", description: "Project Finalization", type: "competition" },
        track_b: { title: "Track Continuation & Free Exploration", type: "competition" }
      },
      // {
      //   time: "3:00–5:00 PM",
      //   duration: 2,
      //   track_a: { title: "Judging & Final Evaluation", type: "competition" },
      //   track_b: { title: "Panel Deliberation", type: "competition" }
      // },
      // {
      //   time: "5:00–5:30 PM",
      //   duration: 0.5,
      //   unified: { title: "Logistics", type: "logistics" }
      // },
      {
        time: "3:30–3:45 PM",
        duration: 15,
        unified: { title: "Imposter & QR Quest Results, Polls & Ratings Reveal", type: "game" }
      },
      {
        time: "3:45–4:30 PM",
        duration: 1,
        unified: { title: "Grand Closing Ceremony + Prize Distribution", type: "ceremony" }
      }
    ]
  },
  {
    id: "day4",
    title: "Day 4: Industry Visit",
    date: "August 9, 2025",
    dress_code: "T-shirt and Jeans",
    color: "from-emerald-500 to-teal-500",
    events: [
      {
        time: "9:30 AM–11:00 AM",
        duration: 1.5,
        unified: { title: "Departure to AMTZ, Vizag and Refreshments & Logistics", description: "Only for Club Leads & Winners", type: "visit" }
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