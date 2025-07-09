'use client';

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventTimeline from "@/components/shared/EventTimeline";
import { MOCK_EVENT_DAYS, MOCK_EVENT_BENEFITS } from "@/lib/mock-data";

export default function Events() {
  return (
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
              {MOCK_EVENT_DAYS.map((day) => (
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

            {MOCK_EVENT_DAYS.map((day) => (
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
            {MOCK_EVENT_BENEFITS.map((benefit, index) => (
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
  );
}