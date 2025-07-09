import { Metadata } from 'next';
import { generateSEO, generateFAQStructuredData } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: "FAQs - Samyukta 2025 Tech Summit | Common Questions Answered",
  description: "Find answers to frequently asked questions about Samyukta 2025. Registration, events, accommodation, travel, prizes, and more. Get all the information you need for India's premier student tech summit.",
  keywords: [
    "samyukta faqs", "tech summit questions", "registration help", "event information", 
    "ANITS tech fest", "student summit help", "hackathon questions", "workshop details"
  ],
  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta.anits.edu.in'}/faqs`
});

'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import Script from "next/script";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { MOCK_FAQS, MOCK_FAQ_CATEGORIES } from "@/lib/mock-data";

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Generate FAQ structured data
  const faqStructuredData = generateFAQStructuredData(
    MOCK_FAQS.map(faq => ({
      question: faq.question,
      answer: faq.answer
    }))
  );

  const filteredFAQs = MOCK_FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="text-spacing-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                Got questions? We&apos;ve got answers! Find everything you need to know about Samyukta 2025.
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-lg"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
          >
            {MOCK_FAQ_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`
                    ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0'
                    : 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                  `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </motion.div>

          {/* FAQs List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full justify-between p-6 text-left h-auto hover:bg-gray-700/30"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <HelpCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                            >
                              {MOCK_FAQ_CATEGORIES.find(c => c.id === faq.category)?.name}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-white pr-4">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </Button>

                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="ml-12 pt-4 border-t border-gray-700">
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No FAQs found</h3>
              <p className="text-gray-500">Try adjusting your search or selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-gray-800/20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-spacing-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Still Have <span className="text-blue-400">Questions?</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Can&apos;t find what you&apos;re looking for? Our team is here to help! Reach out to us through any of these channels.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              {
                icon: Mail,
                title: "Email Support",
                description: "Get detailed answers to your questions",
                contact: "samyukta.summit@gmail.com",
                action: "mailto:samyukta.summit@gmail.com"
              },
              {
                icon: Phone,
                title: "Phone Support",
                description: "Speak directly with our team",
                contact: "+91-9876543210",
                action: "tel:+91-9876543210"
              },
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Real-time assistance from our volunteers",
                contact: "Available 9 AM - 6 PM",
                action: "/dashboard"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4">
                        <contact.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{contact.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{contact.description}</p>
                      <p className="text-blue-400 font-semibold mb-4">{contact.contact}</p>
                      <Button
                        onClick={() => window.open(contact.action, '_blank')}
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500"
                      >
                        Contact Us
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}