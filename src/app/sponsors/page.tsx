'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Crown, Award, Users, Target, Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { MOCK_SPONSOR_TIERS, MOCK_SPONSORSHIP_BENEFITS, MOCK_EVENT_STATS } from "@/lib/mock-data";

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
                    Our Sponsors
                  </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                  Partnering with industry leaders to create an unforgettable experience
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
              {MOCK_SPONSOR_TIERS.map((tier, tierIndex) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tierIndex * 0.2 }}
                >
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                        {tier.tier === "Title Sponsor" && <Crown className="w-8 h-8 text-white" />}
                      {tier.tier === "Platinum Sponsors" && <Award className="w-8 h-8 text-white" />}
                      {tier.tier === "Gold Sponsors" && <Star className="w-8 h-8 text-white" />}
                      {tier.tier === "Silver Sponsors" && <Users className="w-8 h-8 text-white" />}
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{tier.tier}</h2>
                    <Badge className={`${tier.bgColor} ${tier.textColor} ${tier.borderColor} px-4 py-2`}>
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
                              <div className="w-full h-24 bg-white rounded-lg flex items-center justify-center p-4 mb-4">
                                <div className="text-gray-900 font-bold text-lg">
                                  {sponsor.name}
                                </div>
                              </div>
                              <h3 className="text-lg font-bold text-white">{sponsor.name}</h3>
                              <p className="text-gray-400 text-sm">{sponsor.description}</p>
                              <Link
                                href={sponsor.website}
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
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

        {/* Sponsorship Benefits */}
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
                  Sponsorship <span className="text-blue-400">Benefits</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  Maximize your brand exposure and connect with India&apos;s brightest tech talent
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {MOCK_SPONSORSHIP_BENEFITS.map((package_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{package_.tier} Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {package_.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                  Join leading brands in supporting India&apos;s most innovative tech summit and connect with tomorrow&apos;s technology leaders.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button
                    onClick={() => window.open('mailto:sponsors@samyukta.anits.edu.in?subject=Sponsorship Inquiry - Samyukta 2025', '_blank')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-300 neon-glow"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Become a Sponsor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('tel:+91-9876543210', '_blank')}
                    className="px-8 py-4 bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500 hover:border-white rounded-xl transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us
                  </Button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    For custom sponsorship packages and partnership opportunities
                  </p>
                  <p className="text-blue-400 text-sm mt-1">
                    Contact: sponsors@samyukta.anits.edu.in | +91-9876543210
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
}