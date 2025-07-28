'use client';

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SPEAKERS_PAGE_DATA, SPEAKERS_STATUS, SPEAKERS_DATA } from "@/lib";

interface Speaker {
  id: number;
  name: string;
  designation: string;
  company: string;
  session: string;
  track: string;
  day: string;
  time: string;
  bio: string;
  expertise: readonly string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

function SpeakersContent() {
  const [speakers, setSpeakers] = useState<readonly Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(false);

  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        // Try to fetch from database first
        const response = await fetch('/api/public/webpage-content?type=speaker&status=published');
        if (response.ok) {
          const data = await response.json();
          if (data.contents && data.contents.length > 0) {
            setSpeakers(data.contents);
            setUseDatabase(true);
          } else {
            // Fallback to static data
            setSpeakers(SPEAKERS_DATA);
            setUseDatabase(false);
          }
        } else {
          // Fallback to static data
          setSpeakers(SPEAKERS_DATA);
          setUseDatabase(false);
        }
      } catch (error) {
        console.error('Failed to load speakers:', error);
        // Fallback to static data
        setSpeakers(SPEAKERS_DATA);
        setUseDatabase(false);
      } finally {
        setLoading(false);
      }
    };

    loadSpeakers();
  }, []);

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
                  {SPEAKERS_PAGE_DATA.title}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                {SPEAKERS_PAGE_DATA.description}
              </p>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {SPEAKERS_PAGE_DATA.badges.map((badge, index) => {
                  let IconComponent;
                  if (badge.icon === 'Calendar') IconComponent = Calendar;
                  else if (badge.icon === 'MapPin') IconComponent = MapPin;
                  else if (badge.icon === 'Clock') IconComponent = Clock;
                  
                  return (
                    <Badge 
                      key={index}
                      className={`bg-${index === 0 ? 'blue' : index === 1 ? 'violet' : 'pink'}-500/10 text-${index === 0 ? 'blue' : index === 1 ? 'violet' : 'pink'}-400 border-${index === 0 ? 'blue' : index === 1 ? 'violet' : 'pink'}-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base`}
                    >
                      {IconComponent && <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                      {badge.text}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Track Filters - Commented out until speakers are ready */}
          {/* <motion.div
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
          </motion.div> */}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </motion.div>
          )}

          {/* Speakers Grid or Coming Soon */}
          {!loading && (
            <>
              {speakers.length > 0 && useDatabase ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {speakers.map((speaker, index) => (
                    <motion.div
                      key={speaker.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-500 overflow-hidden h-full">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-white mb-2">
                                {speaker.name}
                              </h3>
                              <p className="text-blue-400 font-medium">
                                {speaker.designation}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {speaker.company}
                              </p>
                            </div>
                            
                            {speaker.session && (
                              <div className="bg-gray-700/50 rounded-lg p-3">
                                <p className="text-sm text-gray-300 font-medium">
                                  {speaker.session}
                                </p>
                              </div>
                            )}
                            
                            {speaker.bio && (
                              <p className="text-gray-400 text-sm line-clamp-3">
                                {speaker.bio}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl mx-auto"
                >
                  <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
                    <CardContent className="p-8 sm:p-10 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <AlertCircle className="w-10 h-10 text-blue-400" />
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white">
                            Speakers Will Be Updated Soon
                          </h3>
                          <p className="text-gray-300 max-w-xl mx-auto">
                            {SPEAKERS_STATUS.message}. We&apos;re finalizing our lineup of industry experts and thought leaders who will share their insights at Samyukta 2025.
                          </p>
                          
                          <div className="pt-4">
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              Expected by {new Date(SPEAKERS_STATUS.expectedUpdateDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
          
          {/* Original Speakers Grid - Commented out */}
          {/* <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
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
                      <div className="text-center">
                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-2xl font-bold text-white">
                            {speaker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{speaker.name}</h3>
                        <p className="text-sm sm:text-base text-gray-300">{speaker.designation}</p>
                        <p className="text-xs sm:text-sm text-gray-400 mb-3">{speaker.company}</p>

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
          </div> */}
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
                {SPEAKERS_PAGE_DATA.speakingOpportunities.title.split('Speak')[0]}<span className="text-blue-400">Speak</span>{SPEAKERS_PAGE_DATA.speakingOpportunities.title.split('Speak')[1]}
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                {SPEAKERS_PAGE_DATA.speakingOpportunities.description}
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
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
            ].map((benefit, index) => (
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
              href={`mailto:${SPEAKERS_PAGE_DATA.speakingOpportunities.contactEmail}?subject=Speaking Opportunity - Samyukta 2025`}
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

export default function Speakers() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <SpeakersContent />
    </Suspense>
  );
}