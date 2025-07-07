'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Crown, Award, Users, Target, Globe, Mail, Phone } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";

export default function Sponsors() {
  const sponsorTiers = [
    {
      tier: "Title Sponsor",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/20",
      amount: "₹5,00,000+",
      sponsors: [
        {
          name: "Amazon Web Services",
          logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
          website: "https://aws.amazon.com",
          description: "Leading cloud computing platform powering millions of businesses worldwide"
        }
      ]
    },
    {
      tier: "Platinum Sponsors",
      icon: Award,
      color: "from-gray-300 to-gray-500",
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-300",
      borderColor: "border-gray-500/20",
      amount: "₹2,00,000+",
      sponsors: [
        {
          name: "Google Cloud",
          logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
          website: "https://cloud.google.com",
          description: "Enterprise-grade cloud computing and AI services"
        },
        {
          name: "Microsoft Azure",
          logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg",
          website: "https://azure.microsoft.com",
          description: "Comprehensive cloud platform for modern applications"
        }
      ]
    },
    {
      tier: "Gold Sponsors",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-600/10",
      textColor: "text-yellow-500",
      borderColor: "border-yellow-600/20",
      amount: "₹1,00,000+",
      sponsors: [
        {
          name: "GeeksforGeeks",
          logo: "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
          website: "https://geeksforgeeks.org",
          description: "Leading programming education platform"
        },
        {
          name: "AMTZ Visakhapatnam",
          logo: "https://via.placeholder.com/200x100/1e40af/ffffff?text=AMTZ",
          website: "https://amtz.in",
          description: "Andhra Pradesh MedTech Zone fostering healthcare innovation"
        },
        {
          name: "Innovation Council",
          logo: "https://via.placeholder.com/200x100/7c3aed/ffffff?text=IC",
          website: "#",
          description: "Promoting innovation and entrepreneurship in education"
        }
      ]
    },
    {
      tier: "Silver Sponsors",
      icon: Users,
      color: "from-gray-400 to-gray-600",
      bgColor: "bg-gray-600/10",
      textColor: "text-gray-400",
      borderColor: "border-gray-600/20",
      amount: "₹50,000+",
      sponsors: [
        {
          name: "TechCorp Solutions",
          logo: "https://via.placeholder.com/200x100/3b82f6/ffffff?text=TechCorp",
          website: "#",
          description: "Digital transformation consulting services"
        },
        {
          name: "StartupHub India",
          logo: "https://via.placeholder.com/200x100/10b981/ffffff?text=StartupHub",
          website: "#",
          description: "Startup ecosystem enabler and incubator"
        },
        {
          name: "DevTools Pro",
          logo: "https://via.placeholder.com/200x100/f59e0b/ffffff?text=DevTools",
          website: "#",
          description: "Professional development tools and services"
        }
      ]
    }
  ];

  const sponsorshipBenefits = [
    {
      tier: "Title Sponsor",
      benefits: [
        "Exclusive naming rights to the event",
        "Logo on all marketing materials and banners",
        "30-minute keynote speaking slot",
        "Premium booth space at venue",
        "Logo on participant certificates",
        "Dedicated social media campaigns",
        "Access to participant database",
        "VIP seating for leadership team",
        "Recognition in all press releases",
        "Lifetime partnership status"
      ]
    },
    {
      tier: "Platinum",
      benefits: [
        "Logo on main stage backdrop",
        "15-minute speaking opportunity",
        "Premium exhibition booth",
        "Logo on event t-shirts",
        "Social media mentions",
        "Inclusion in event app",
        "Networking dinner invitation",
        "Certificate co-branding"
      ]
    },
    {
      tier: "Gold",
      benefits: [
        "Logo on event materials",
        "Exhibition booth space",
        "Logo on participant badges",
        "Social media recognition",
        "Inclusion in event program",
        "Networking session access",
        "Recruitment opportunities"
      ]
    },
    {
      tier: "Silver",
      benefits: [
        "Logo on event website",
        "Small exhibition space",
        "Social media mentions",
        "Inclusion in event brochure",
        "Networking opportunities",
        "Talent recruitment access"
      ]
    }
  ];

  const stats = [
    { number: "500+", label: "Participants", icon: Users },
    { number: "50+", label: "Colleges", icon: Target },
    { number: "4", label: "Days", icon: Globe },
    { number: "15+", label: "Partners", icon: Star }
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
              {stats.map((stat, index) => (
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
                          <stat.icon className="w-6 h-6 text-white" />
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
              {sponsorTiers.map((tier, tierIndex) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tierIndex * 0.2 }}
                >
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                        <tier.icon className="w-8 h-8 text-white" />
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
              {sponsorshipBenefits.map((package_, index) => (
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
    </PublicLayout>
  );
}