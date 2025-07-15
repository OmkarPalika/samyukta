'use client';

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { generateEventStructuredData, generateOrganizationStructuredData } from "@/lib/seo";

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
import { EVENT_CONFIG, URL_CONFIG } from "@/lib/config";
import { PARTNERS_DATA } from "@/data";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [user, setUser] = useState<UserType | null>(null);
  
  const baseUrl = useMemo(() => 
    process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta..vercel.app', 
    []
  );
  
  const eventStructuredData = useMemo(() => generateEventStructuredData({
    name: `${EVENT_CONFIG.name} - India's Premier Student Innovation Summit`,
    description: EVENT_CONFIG.description,
    startDate: `${EVENT_CONFIG.dates.start}+05:30`,
    endDate: `${EVENT_CONFIG.dates.end}+05:30`,
    location: {
      name: EVENT_CONFIG.location.full_name,
      address: {
        streetAddress: EVENT_CONFIG.location.address.street,
        addressLocality: EVENT_CONFIG.location.address.city,
        addressRegion: EVENT_CONFIG.location.address.state,
        postalCode: EVENT_CONFIG.location.address.pincode,
        addressCountry: EVENT_CONFIG.location.address.country
      }
    },
    organizer: {
      name: "ANITS Samyukta Team",
      url: "https://anits.edu.in"
    },
    offers: {
      price: EVENT_CONFIG.pricing.entry_workshop.toString(),
      priceCurrency: "INR",
      url: `${baseUrl}${URL_CONFIG.register}`
    },
    image: [`${baseUrl}/og-image.jpg`],
    url: baseUrl
  }), [baseUrl]);
  
  const organizationStructuredData = useMemo(() => 
    generateOrganizationStructuredData(), 
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const eventDate = new Date(EVENT_CONFIG.dates.start);
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

  const iconMap = useMemo(() => ({ Cloud, Brain, Trophy, Target }), []);
  
  const highlights = useMemo(() => 
    EVENT_CONFIG.tracks?.map((track: { title: string; description: string; color: string; icon: string }) => ({
      ...track,
      icon: iconMap[track.icon as keyof typeof iconMap]
    })) || [], 
    [iconMap]
  );

  const partners = useMemo(() => PARTNERS_DATA, []);

  return (
    <>
      <Script
        id="event-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventStructuredData),
        }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      
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
                  {EVENT_CONFIG.name}
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-gray-300 font-light mb-6 text-center">
                {EVENT_CONFIG.tagline}
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 text-center">
                {EVENT_CONFIG.description}
              </p>

              {/* Event Details */}
              <div className="flex flex-wrap justify-center text-gray-300" style={{ gap: 'var(--gap-md)', margin: 'var(--gap-xl) 0' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>{EVENT_CONFIG.dates.display}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  <span>{EVENT_CONFIG.location.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span>{EVENT_CONFIG.capacity.total_participants}+ Participants</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row justify-center" style={{ gap: 'var(--gap-sm)' }}>
                <Link href={user ? URL_CONFIG.dashboard : URL_CONFIG.register}>
                  <Button className="px-12 py-6 text-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-xl neon-glow">
                    {user ? "Access Dashboard" : "Register Now"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href={URL_CONFIG.events}>
                  <Button variant="outline" className="px-12 py-6 text-lg bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500 hover:border-white rounded-xl">
                    Explore Events
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  onClick={() => window.open(`mailto:samyukta.summit@gmail.com?subject=Sponsorship Inquiry - ${EVENT_CONFIG.name}`, '_blank')}
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
              {highlights.map((highlight: { title: string; description: string; color: string; icon: React.ComponentType<{ className?: string }> }, index: number) => (
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
                <Link href={user ? URL_CONFIG.dashboard : URL_CONFIG.register}>
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
    </>
  );
}
