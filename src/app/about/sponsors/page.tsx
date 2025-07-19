'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Award, Users, Target, Globe, Mail, Building, Code, Briefcase, Factory, Gift } from "lucide-react";
import Link from "next/link";
import { MOCK_EVENT_STATS, SPONSORS_PAGE_DATA, SPONSORS_DATA } from "@/lib";
import Image from "next/image";

export default function Sponsors() {
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
                  {SPONSORS_PAGE_DATA.title}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                {SPONSORS_PAGE_DATA.description}
              </p>
            </div>
          </motion.div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {MOCK_EVENT_STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardContent className="card-padding">
                    <div className="text-spacing text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                        {stat.icon === "Users" && <Users className="w-6 h-6 text-white" />}
                        {stat.icon === "Target" && <Target className="w-6 h-6 text-white" />}
                        {stat.icon === "Globe" && <Globe className="w-6 h-6 text-white" />}
                        {stat.icon === "Star" && <Star className="w-6 h-6 text-white" />}
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sponsors by Tier */}
          <div className="space-y-12">
            {SPONSORS_DATA.map((tier, tierIndex) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tierIndex * 0.2 }}
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                      {tier.tier === "Hosting Sponsor" && <Building className="w-8 h-8 text-white" />}
                      {tier.tier === "Workshop Sponsors" && <Code className="w-8 h-8 text-white" />}
                      {tier.tier === "Hackathon Sponsor" && <Award className="w-8 h-8 text-white" />}
                      {tier.tier === "Startup Pitch Sponsors" && <Briefcase className="w-8 h-8 text-white" />}
                      {tier.tier === "Industrial Visit" && <Factory className="w-8 h-8 text-white" />}
                      {tier.tier === "Swags Partners" && <Gift className="w-8 h-8 text-white" />}
                      {tier.tier === "Games Sponsors" && <Target className="w-8 h-8 text-white" />}
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{tier.tier}</h2>
                  <Badge className={`${tier.bg_color} ${tier.text_color} ${tier.border_color} px-4 py-2`}>
                    {tier.amount}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tier.sponsors.map((sponsor, sponsorIndex) => (
                    <motion.div
                      key={sponsorIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tierIndex * 0.1 + sponsorIndex * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                        <CardContent className="card-padding">
                          <div className="card-gap flex flex-col items-center text-center">
                            <div className="w-30 h-30 bg-white rounded-lg flex items-center justify-center p-2 mb-4">
                              <Image
                                src={sponsor.logo}
                                alt={`${sponsor.name} logo`}
                                width={100}
                                height={100}
                                style={{ width: 'auto', height: 'auto' }}
                                className="max-w-full max-h-full object-cover"
                              />
                            </div>
                            <h3 className="text-lg font-bold text-white">{sponsor.name}</h3>
                            <p className="text-gray-400 text-sm">{sponsor.description}</p>
                            <Link
                              href={sponsor.website}
                              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                              target="_blank"
                            >
                              Visit Website →
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Card
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
                  Contact <span className="text-blue-400">Us</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  Interested in sponsoring Samyukta 2025? Reach out to our team for more information.
                </p>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-2xl"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 z-0"></div>
                  <CardContent className="relative z-10 p-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                        <Mail className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Sponsorship Inquiries</h3>
                        <p className="text-gray-300">For custom sponsorship packages and partnership opportunities</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-blue-400 font-medium">{SPONSORS_PAGE_DATA.ctaSection.contactEmail}</p>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-blue-400 font-medium">{SPONSORS_PAGE_DATA.ctaSection.contactPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button
                          onClick={() => window.open(`mailto:${SPONSORS_PAGE_DATA.ctaSection.contactEmail}?subject=Sponsorship Inquiry - Samyukta 2025`, '_blank')}
                          className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`tel:${SPONSORS_PAGE_DATA.ctaSection.contactPhone}`, '_blank')}
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section> */}

      {/* Become a Sponsor CTA */}
      <section className="section-padding bg-gradient-to-r from-blue-600/10 to-violet-600/10">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-spacing-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Ready to <span className="text-pink-400">Partner</span> with Us?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto">
                Join leading brands in supporting India&apos;s most innovative tech summit
              </p>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => window.open(`mailto:${SPONSORS_PAGE_DATA.cta_section.contact_email}?subject=Sponsorship Inquiry - Samyukta 2025`, '_blank')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-300 neon-glow"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Become a Sponsor
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}