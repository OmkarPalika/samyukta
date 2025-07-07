'use client';

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PublicLayout from "@/components/layout/PublicLayout";
import EventTimeline from "@/components/shared/EventTimeline";

export default function Events() {
  const days = [
    {
      id: "day1",
      title: "Day 1: Inauguration & Workshop Kickoff",
      date: "August 6, 2025",
      dressCode: "Professional",
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
          trackA: { title: "Workshop Session 1", description: "Cloud Computing Fundamentals", type: "workshop" },
          trackB: { title: "Workshop Session 1", description: "AI/ML Fundamentals", type: "workshop" }
        },
        {
          time: "12:30–1:30 PM",
          duration: 1,
          trackA: { title: "Lunch Break", type: "break" },
          trackB: { title: "Workshop Continues", description: "Advanced AI Concepts", type: "workshop" }
        },
        {
          time: "1:00–2:00 PM",
          duration: 1,
          trackA: { title: "Workshop Continues", description: "AWS Services Deep Dive", type: "workshop" },
          trackB: { title: "Lunch Break", type: "break" }
        },
        {
          time: "2:00–4:30 PM",
          duration: 2.5,
          trackA: { title: "Workshop Session 2", description: "Hands-on AWS Projects", type: "workshop" },
          trackB: { title: "Workshop Session 2", description: "Google Cloud AI Tools", type: "workshop" }
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
        },
        {
          time: "8:00 PM",
          duration: 1,
          unified: { title: "Dinner (for hostellers)", type: "networking" }
        }
      ]
    },
    {
      id: "day2",
      title: "Day 2: Deep Dive Workshops",
      date: "August 7, 2025",
      dressCode: "Cultural",
      color: "from-violet-500 to-purple-500",
      events: [
        {
          time: "9:00–12:30 PM",
          duration: 3.5,
          trackA: { title: "Workshop Session 3", description: "Advanced AWS Architecture", type: "workshop" },
          trackB: { title: "Workshop Session 3", description: "Machine Learning Models", type: "workshop" }
        },
        {
          time: "12:30–1:30 PM",
          duration: 1,
          trackA: { title: "Workshop Continues", description: "Serverless Computing", type: "workshop" },
          trackB: { title: "Lunch Break", type: "break" }
        },
        {
          time: "1:00–2:00 PM",
          duration: 1,
          trackA: { title: "Lunch Break", type: "break" },
          trackB: { title: "Workshop Continues", description: "Neural Networks", type: "workshop" }
        },
        {
          time: "2:00–4:30 PM",
          duration: 1.5,
          trackA: { title: "Workshop Session 4", description: "DevOps with AWS", type: "workshop" },
          trackB: { title: "Workshop Session 4", description: "AI Ethics & Deployment", type: "workshop" }
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
        },
        {
          time: "7:30 PM",
          duration: 1,
          unified: { title: "Dinner (for hostellers)", type: "networking" }
        }
      ]
    },
    {
      id: "day3",
      title: "Day 3: Hackathon & Startup Pitch",
      date: "August 8, 2025",
      dressCode: "Freestyle",
      color: "from-pink-500 to-rose-500",
      events: [
        {
          time: "9:00–11:00 AM",
          duration: 2,
          trackA: { title: "GFG Presents: Solve-for-India HackJam", description: "Hackathon Kickoff", type: "competition" },
          trackB: { title: "IIC Presents: Pitch Arena", description: "Startup-ready teams", type: "competition" }
        },
        {
          time: "11:00–11:15 AM",
          duration: 0.25,
          unified: { title: "Refreshments", type: "break" }
        },
        {
          time: "11:15–1:00 PM",
          duration: 1.75,
          trackA: { title: "Track Continuation", description: "Development Phase", type: "competition" },
          trackB: { title: "Track Continuation", description: "Pitch Refinement", type: "competition" }
        },
        {
          time: "1:00–2:00 PM",
          duration: 1,
          unified: { title: "Lunch Break", type: "break" }
        },
        {
          time: "2:00–3:00 PM",
          duration: 1,
          trackA: { title: "Final Submission", description: "Project Finalization", type: "competition" },
          trackB: { title: "Track Continuation & Free Exploration", type: "competition" }
        },
        {
          time: "3:00–5:00 PM",
          duration: 2,
          trackA: { title: "Judging & Final Evaluation", type: "competition" },
          trackB: { title: "Panel Deliberation", type: "competition" }
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
      dressCode: "Summit T-shirt",
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
  ];

  const benefits = [
    "AWS Educate Account with $100+ credits",
    "Google Cloud Platform credits and certifications",
    "Exclusive starter kit with swag and resources",
    "Access to all interactive games and competitions",
    "Meals, snacks, and refreshments throughout the event",
    "Evening cultural events and entertainment",
    "Networking opportunities with industry leaders",
    "Certificate of participation and skill validation",
    "Priority access to internship and job opportunities",
    "Lifetime membership to Samyukta alumni network"
  ];


  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <div className="text-spacing-lg">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Event Timeline
                  </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                  Four days of intensive learning, building, competing, and networking
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    August 6-9, 2025
                  </Badge>
                  <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    ANITS, Visakhapatnam
                  </Badge>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    500+ Participants
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Timeline Tabs */}
            <Tabs defaultValue="day1" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-800/40 mb-8 sm:mb-10 lg:mb-12 h-20">
                {days.map((day) => (
                  <TabsTrigger
                    key={day.id}
                    value={day.id}
                    className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white h-full flex items-center justify-center transition-colors duration-300 ease-in-out"
                  >
                    <div className="text-center">
                      <div className="font-semibold">{day.title.split(":")[0]}</div>
                      <div className="text-xs opacity-70">{day.title.split(":")[1]}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map((day) => (
                <TabsContent key={day.id} value={day.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Day Header */}
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                      <div className="text-spacing-lg">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                          {day.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300">{day.date}</p>
                        <div className="flex justify-center items-center">
                          <Badge className={`bg-gradient-to-r ${day.color} text-white px-3 sm:px-4 py-2 text-sm sm:text-base`}>
                            {day.dressCode} Dress Code
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <EventTimeline day={day} />
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-gray-800/20">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <div className="text-spacing-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  What You&apos;ll <span className="text-blue-400">Get</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  Every participant receives incredible value, resources, and opportunities that extend far beyond the event
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2 sm:space-x-3 bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="section-padding bg-gray-800/20">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <div className="text-spacing-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Venue <span className="text-blue-400">Map</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  Navigate the ANITS campus with our interactive map. Find event venues, parking, food courts, and more.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}