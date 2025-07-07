'use client';

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Trophy, Code, Lightbulb, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PublicLayout from "@/components/layout/PublicLayout";

export default function Events() {
  const days = [
    {
      id: "day1",
      title: "Day 1: Inauguration & Workshop Kickoff",
      date: "August 6, 2025",
      dressCode: "Professional",
      color: "from-blue-500 to-cyan-500",
      events: [
        { time: "9:00 - 10:30 AM", title: "Inauguration", icon: Trophy, type: "ceremony" },
        { time: "10:30 - 11:00 AM", title: "Logistics", icon: Users, type: "networking" },
        { time: "11:00 AM - 12:30 PM", title: "Workshop Session 1", description: "Parallel tracks for Cloud (AWS) and AI (Google)", icon: Code, type: "workshop" },
        { time: "12:30 - 1:30 PM", title: "Lunch Break", icon: Users, type: "networking" },
        { time: "1:00 - 2:00 PM", title: "Workshop Continues", icon: Code, type: "workshop" },
        { time: "2:00 - 4:30 PM", title: "Workshop Session 2", icon: Code, type: "workshop" },
        { time: "4:30 - 5:00 PM", title: "Discussion, Icebreaker Game & Wind-up", icon: Users, type: "game" },
        { time: "5:00 - 6:00 PM", title: "Refreshments & Logistics", icon: Users, type: "networking" },
        { time: "6:30 - 8:00 PM", title: "Cultural Night", icon: Music, type: "cultural" },
        { time: "8:00 PM", title: "Dinner (for hostellers)", icon: Users, type: "networking" }
      ]
    },
    {
      id: "day2", 
      title: "Day 2: Deep Dive Workshops",
      date: "August 7, 2025",
      dressCode: "Cultural",
      color: "from-violet-500 to-purple-500",
      events: [
        { time: "9:00 AM - 12:30 PM", title: "Workshop Session 3", icon: Code, type: "workshop" },
        { time: "12:30 - 1:30 PM", title: "Workshop Continues / Lunch Break", icon: Users, type: "networking" },
        { time: "2:00 - 4:30 PM", title: "Workshop Session 4", icon: Code, type: "workshop" },
        { time: "4:30 - 5:00 PM", title: "Feedback, Quiz & Giveaways", icon: Trophy, type: "game" },
        { time: "5:00 - 6:00 PM", title: "Refreshments & Logistics", icon: Users, type: "networking" },
        { time: "7:30 PM", title: "Dinner (for hostellers)", icon: Users, type: "networking" }
      ]
    },
    {
      id: "day3",
      title: "Day 3: Hackathon & Startup Pitch", 
      date: "August 8, 2025",
      dressCode: "Freestyle",
      color: "from-pink-500 to-rose-500",
      events: [
        { time: "9:00 - 11:00 AM", title: "Hackathon & Pitch Arena Kickoff", description: "GFG 'Solve-for-India' HackJam & IIC Pitch Arena begin", icon: Code, type: "competition" },
        { time: "11:00 - 11:15 AM", title: "Refreshments", icon: Users, type: "networking" },
        { time: "11:15 AM - 1:00 PM", title: "Track Continuation", icon: Code, type: "competition" },
        { time: "1:00 - 2:00 PM", title: "Lunch Break", icon: Users, type: "networking" },
        { time: "2:00 - 3:00 PM", title: "Final Submissions & Track Continuation", icon: Code, type: "competition" },
        { time: "3:00 - 5:00 PM", title: "Judging & Final Evaluation", icon: Trophy, type: "competition" },
        { time: "5:30 - 6:00 PM", title: "Game Results & Polls Reveal", icon: Users, type: "game" },
        { time: "6:00 - 7:00 PM", title: "Grand Closing Ceremony & Prize Distribution", icon: Trophy, type: "ceremony" }
      ]
    },
    {
      id: "day4",
      title: "Day 4: Industry Visit",
      date: "August 9, 2025", 
      dressCode: "Summit T-shirt",
      color: "from-emerald-500 to-teal-500",
      events: [
        { time: "9:30 AM", title: "Departure to AMTZ, Vizag", description: "Only for Club Leads & Winners", icon: MapPin, type: "visit" },
        { time: "11:00 AM - 12:00 PM", title: "Explore AMTZ", icon: MapPin, type: "visit" },
        { time: "12:00 - 1:00 PM", title: "Self-paid Lunch", icon: Users, type: "networking" },
        { time: "1:00 - 3:00 PM", title: "Innovation Showcase & Industrial Tour", icon: Lightbulb, type: "visit" },
        { time: "3:00 - 3:30 PM", title: "Group Photos", icon: Users, type: "networking" },
        { time: "4:00 PM", title: "Return & Feedback Collection", icon: Users, type: "networking" }
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

  const typeStyles: Record<string, string> = {
    ceremony: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    workshop: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
    game: "bg-green-500/10 text-green-400 border-green-500/20",
    cultural: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    competition: "bg-red-500/10 text-red-400 border-red-500/20",
    networking: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    mentoring: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    visit: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    panel: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  };

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

                  {/* Events */}
                  <div className="space-y-4 sm:space-y-6">
                    {day.events.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl card-padding border border-gray-700 hover:border-gray-600 transition-all"
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${day.color} flex items-center justify-center`}>
                            <event.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                            <Badge className={typeStyles[event.type]} variant="outline">
                              {event.type}
                            </Badge>
                            <div className="flex items-center text-gray-400 text-sm sm:text-base">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {event.time}
                            </div>
                          </div>
                          <div className="text-spacing">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{event.title}</h3>
                            {event.description && <p className="text-sm sm:text-base text-gray-400">{event.description}</p>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
      </div>
    </PublicLayout>
  );
}