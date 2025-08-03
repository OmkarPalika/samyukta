'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Trophy, Code, Music, LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

interface TimelineEvent {
  readonly time: string;
  readonly duration: number;
  readonly track_a?: {
    readonly title: string;
    readonly description?: string;
    readonly type: string;
  };
  readonly track_b?: {
    readonly title: string;
    readonly description?: string;
    readonly type: string;
  };
  readonly track_c?: {
    readonly title: string;
    readonly description?: string;
    readonly type: string;
  };
  readonly unified?: {
    readonly title: string;
    readonly description?: string;
    readonly type: string;
  };
}

interface EventTimelineProps {
  day: {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly dress_code: string;
    readonly color: string;
    readonly events: readonly TimelineEvent[];
  };
}

export default function EventTimeline({ day }: EventTimelineProps) {
  const typeIcons: Record<string, LucideIcon> = useMemo(() => ({
    registration: Users,
    ceremony: Trophy,
    workshop: Code,
    game: Users,
    cultural: Music,
    competition: Trophy,
    networking: Users,
    visit: MapPin,
    break: Clock,
    logistics: Users
  }), []);

  const typeColors: Record<string, string> = useMemo(() => ({
    registration: 'from-blue-500 to-indigo-500',
    ceremony: 'from-yellow-500 to-orange-500',
    workshop: 'from-blue-500 to-cyan-500',
    game: 'from-green-500 to-emerald-500',
    cultural: 'from-purple-500 to-violet-500',
    competition: 'from-red-500 to-pink-500',
    networking: 'from-cyan-500 to-blue-500',
    visit: 'from-pink-500 to-rose-500',
    break: 'from-gray-500 to-gray-600',
    logistics: 'from-indigo-500 to-purple-500'
  }), []);

  // Dynamic track labels based on day
  const getTrackLabels = useMemo(() => {
    if (day.id === 'day3') {
      return {
        trackA: 'Track A (GFG)',
        trackB: 'Track B (IIC)',
        trackC: 'Track C (Cybersecurity)'
      };
    }
    return {
      trackA: 'Track A (Cloud - AWS)',
      trackB: 'Track B (AI - Google)',
      trackC: 'Track C (Cybersecurity)'
    };
  }, [day.id]);

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500"></div>

      <div className="space-y-6">
        {day.events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start space-x-6"
          >
            {/* Timeline Dot */}
            <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-r ${day.color} flex items-center justify-center shadow-lg`}>
              <Clock className="w-6 h-6 text-white" />
            </div>

            {/* Event Content */}
            <div className="flex-1 pb-8">
              {/* Time Badge */}
              <div className="mb-4">
                <Badge className={`bg-gradient-to-r ${day.color} text-white px-4 py-2 text-sm font-semibold`}>
                  {event.time} ({event.duration} min)
                </Badge>
              </div>

              {/* Event Cards */}
              {event.unified ? (
                // Single unified event
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${typeColors[event.unified.type]} flex items-center justify-center flex-shrink-0`}>
                        {(() => {
                          const IconComponent = typeIcons[event.unified.type] || Users;
                          return <IconComponent className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{event.unified.title}</h3>
                        {event.unified.description && (
                          <p className="text-gray-400">{event.unified.description}</p>
                        )}
                        <Badge variant="outline" className="mt-3 bg-gray-500/10 text-gray-400 border-gray-500/20 capitalize">
                          {event.unified.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Multi track events
                <div className={`grid gap-4 ${event.track_c ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                  {/* Track A */}
                  {event.track_a && (
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all">
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">
                            {getTrackLabels.trackA}
                          </Badge>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${typeColors[event.track_a.type]} flex items-center justify-center flex-shrink-0`}>
                            {(() => {
                              const IconComponent = typeIcons[event.track_a.type] || Users;
                              return <IconComponent className="w-5 h-5 text-white" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{event.track_a.title}</h4>
                            {event.track_a.description && (
                              <p className="text-gray-400 text-sm">{event.track_a.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Track B */}
                  {event.track_b && (
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all">
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-2">
                            {getTrackLabels.trackB}
                          </Badge>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${typeColors[event.track_b.type]} flex items-center justify-center flex-shrink-0`}>
                            {(() => {
                              const IconComponent = typeIcons[event.track_b.type] || Users;
                              return <IconComponent className="w-5 h-5 text-white" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{event.track_b.title}</h4>
                            {event.track_b.description && (
                              <p className="text-gray-400 text-sm">{event.track_b.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Track C */}
                  {event.track_c && (
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all">
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
                            {getTrackLabels.trackC}
                          </Badge>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${typeColors[event.track_c.type]} flex items-center justify-center flex-shrink-0`}>
                            {(() => {
                              const IconComponent = typeIcons[event.track_c.type] || Users;
                              return <IconComponent className="w-5 h-5 text-white" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{event.track_c.title}</h4>
                            {event.track_c.description && (
                              <p className="text-gray-400 text-sm">{event.track_c.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}