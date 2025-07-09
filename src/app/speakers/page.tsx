'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Twitter, Globe, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { MOCK_SPEAKERS, MOCK_SPEAKER_TRACKS, MOCK_SPEAKING_BENEFITS } from "@/lib/mock-data";

export default function Speakers() {




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
                  Industry Experts
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                Learn from the best minds in technology, innovation, and entrepreneurship
              </p>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  6 Expert Sessions
                </Badge>
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Industry Leaders
                </Badge>
                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Interactive Sessions
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Track Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
          >
            {MOCK_SPEAKER_TRACKS.map((track) => (
              <Badge
                key={track.name}
                className={`bg-gradient-to-r ${track.color} text-white border-0 px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer hover:scale-105 transition-transform`}
              >
                {track.name}
              </Badge>
            ))}
          </motion.div>

          {/* Speakers Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_SPEAKERS.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col">
                      {/* Speaker Avatar & Basic Info */}
                      <div className="text-center">
                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-2xl font-bold text-white">
                            {speaker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{speaker.name}</h3>
                        <p className="text-sm sm:text-base text-gray-300">{speaker.designation}</p>
                        <p className="text-xs sm:text-sm text-gray-400 mb-3">{speaker.company}</p>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-3 mb-4">
                          {speaker.social.linkedin && (
                            <Link href={speaker.social.linkedin} className="text-blue-400 hover:text-blue-300 transition-colors">
                              <Linkedin className="w-5 h-5" />
                            </Link>
                          )}
                          {speaker.social.twitter && (
                            <Link href={speaker.social.twitter} className="text-blue-400 hover:text-blue-300 transition-colors">
                              <Twitter className="w-5 h-5" />
                            </Link>
                          )}
                          {speaker.social.website && (
                            <Link href={speaker.social.website} className="text-blue-400 hover:text-blue-300 transition-colors">
                              <Globe className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="space-y-3">
                        <div>
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">
                            {speaker.track}
                          </Badge>
                          <h4 className="text-sm sm:text-base font-semibold text-white">{speaker.session}</h4>
                        </div>

                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{speaker.day}</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{speaker.time}</span>
                        </div>

                        <p className="text-sm text-gray-400 line-clamp-3">{speaker.bio}</p>

                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {speaker.expertise.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Opportunities */}
      <section className="section-padding bg-gray-800/20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="text-spacing-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Want to <span className="text-blue-400">Speak</span> at Samyukta?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Join our community of expert speakers and share your knowledge with the next generation of innovators
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {MOCK_SPEAKING_BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col items-center">
                      <div className="text-4xl mb-2">{benefit.icon}</div>
                      <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              href="mailto:speakers@samyukta.anits.edu.in?subject=Speaking Opportunity - Samyukta 2025"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-300 neon-glow"
            >
              Apply to Speak
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}