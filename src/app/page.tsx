'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ChevronRight,
  Star,
  Target,
  Brain,
  Cloud,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { User as UserType } from "@/lib/types";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const eventDate = new Date('2025-08-06T09:00:00');
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    User.me()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const highlights = [
    {
      icon: Cloud,
      title: "Cloud Computing Track",
      description: "AWS-powered workshops and certifications",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI & ML Workshop",
      description: "Google AI training and hands-on projects",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Trophy,
      title: "Hackathon & Pitch",
      description: "Compete for ₹5L+ in prizes and recognition",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Target,
      title: "Interactive Games",
      description: "QR Quest and Imposter Hunt across campus",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const partners = [
    "AWS Educate", "Google Cloud", "GeeksforGeeks",
    "Innovation Council", "AMTZ"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
              style={{ marginBottom: 'var(--gap-2xl)' }}
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-2">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Samyukta 2025
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-gray-300 font-light mb-6 text-center">
                Igniting Innovation. Uniting Talent.
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 text-center">
                India&apos;s premier student-led national innovation summit bringing together 400+ participants,
                30+ colleges, and industry leaders for 4 days of learning, building, and celebrating.
              </p>

              {/* Event Details */}
              <div className="flex flex-wrap justify-center text-gray-300" style={{ gap: 'var(--gap-md)', margin: 'var(--gap-xl) 0' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>August 6-9, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  <span>ANITS, Visakhapatnam</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span>400+ Participants</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row justify-center" style={{ gap: 'var(--gap-sm)' }}>
                <Link href={user ? "/dashboard" : "/register"}>
                  <Button className="px-12 py-6 text-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-xl neon-glow">
                    {user ? "Access Dashboard" : "Register Now"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="px-12 py-6 text-lg bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500 hover:border-white rounded-xl">
                    Explore Events
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  onClick={() => window.open('mailto:sponsors@samyukta.anits.edu.in?subject=Sponsorship Inquiry - Samyukta 2025', '_blank')}
                  className="w-fit mx-auto md:mx-0 px-12 py-6 text-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 rounded-xl"
                >
                  Sponsor Us
                  <Star className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 gap-0">
                <CardHeader className="component-padding">
                  <CardTitle className="text-center text-white text-2xl">
                    Event Countdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="component-padding">
                  <div className="grid grid-cols-4 grid-gap text-center">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="text-spacing">
                        <div className="text-3xl md:text-4xl font-bold text-white">
                          {value || 0}
                        </div>
                        <div className="text-gray-400 text-sm uppercase tracking-wide">
                          {unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="section-padding bg-gray-800/20">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
              style={{ marginBottom: 'var(--gap-2xl)' }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                What Makes Samyukta <span className="text-blue-400">Special</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto text-center">
                Four incredible tracks designed to challenge, inspire, and transform your tech journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-gap-lg">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                    <CardContent className="card-padding text-center">
                      <div className="card-gap flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${highlight.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <highlight.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{highlight.title}</h3>
                        <p className="text-gray-400">{highlight.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="section-padding">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
              style={{ marginBottom: 'var(--gap-2xl)' }}
            >
              <div className="text-spacing-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Powered by <span className="text-violet-400">Industry Leaders</span>
                </h2>
                <p className="text-xl text-gray-400">
                  Backed by the biggest names in tech and innovation
                </p>
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center xl:justify-between gap-4 md:gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <Badge
                    variant="outline"
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-300 border-gray-600 hover:border-gray-500 transition-colors text-center"
                  >
                    {partner}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding bg-gradient-to-r from-blue-500/10 to-violet-500/10">
          <div className="container-responsive text-center" style={{ maxWidth: '64rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-spacing-lg">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Ready to Make History?
                </h2>
                <p className="text-xl text-gray-400">
                  Join 400+ innovators, learn from industry experts, compete for prizes, and be part of India&apos;s most exciting tech summit.
                </p>
                <Link href={user ? "/dashboard" : "/register"}>
                  <Button className="mt-5 px-16 py-6 text-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-xl neon-glow">
                    {user ? "Access Dashboard" : "Secure Your Spot"}
                    {user ? <ArrowRight className="w-6 h-6 ml-2" /> : <Star className="w-6 h-6 ml-2" />}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
}
