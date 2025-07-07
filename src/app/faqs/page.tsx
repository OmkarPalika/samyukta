'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Questions', icon: '🔍' },
    { id: 'registration', name: 'Registration', icon: '📝' },
    { id: 'event', name: 'Event Details', icon: '📅' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
    { id: 'technical', name: 'Technical', icon: '💻' },
    { id: 'sponsorship', name: 'Sponsorship', icon: '🤝' },
    { id: 'general', name: 'General', icon: '❓' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'registration',
      question: 'How do I register for Samyukta 2025?',
      answer: 'Registration is simple! Click the "Register Now" button on our homepage, fill out the form with your details, select your preferred tracks, and submit. You\'ll receive a confirmation email with your QR code and further instructions.'
    },
    {
      id: 2,
      category: 'registration',
      question: 'What is the registration fee?',
      answer: 'Registration fees vary by package: Individual (₹999), Team of 3 (₹2499), Team of 5 (₹3999). All packages include workshops, meals, swag, certificates, and access to all events. Early bird discounts are available!'
    },
    {
      id: 3,
      category: 'registration',
      question: 'Can I register as a team?',
      answer: 'Yes! We encourage team registrations for hackathons and collaborative projects. Teams can have 3-5 members. All team members must register individually but can link their registrations during the process.'
    },
    {
      id: 4,
      category: 'event',
      question: 'What are the event dates and timings?',
      answer: 'Samyukta 2025 runs from August 6-9, 2025. Day 1 starts at 9:00 AM with inauguration. Each day has different themes: Learn (Day 1), Build (Day 2), Launch (Day 3), and Lead (Day 4). Check our Events page for detailed schedules.'
    },
    {
      id: 5,
      category: 'event',
      question: 'Which tracks are available?',
      answer: 'We offer 4 main tracks: 1) Cloud Computing (AWS-powered), 2) AI & Machine Learning (Google Cloud), 3) Hackathon & Startup Pitch, 4) Interactive Games & Networking. You can participate in multiple tracks!'
    },
    {
      id: 6,
      category: 'event',
      question: 'What should I bring to the event?',
      answer: 'Bring your laptop, phone charger, notebook, pen, and enthusiasm! We provide meals, swag, and materials. Don\'t forget your QR code (digital or printed) for entry and games. Optional: business cards for networking.'
    },
    {
      id: 7,
      category: 'accommodation',
      question: 'Is accommodation provided?',
      answer: 'Yes! We provide dormitory-style accommodation in ANITS hostels for outstation participants. Accommodation includes dinner on arrival day and breakfast on departure day. Register early as spaces are limited.'
    },
    {
      id: 8,
      category: 'accommodation',
      question: 'What about local participants?',
      answer: 'Local participants (within 50km of ANITS) don\'t need accommodation but are welcome to join evening events and dinners. We provide transportation coordination for local participants if needed.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'What technical prerequisites do I need?',
      answer: 'Basic programming knowledge is helpful but not mandatory. We welcome beginners! For advanced tracks, familiarity with cloud platforms or AI/ML concepts is beneficial but not required. We provide learning resources beforehand.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Will there be hands-on coding?',
      answer: 'Absolutely! Day 2 focuses on workshops with hands-on coding sessions. Day 3 features our hackathon where you\'ll build real projects. Bring your laptop and be ready to code, collaborate, and create!'
    },
    {
      id: 11,
      category: 'technical',
      question: 'What software/tools will I learn?',
      answer: 'You\'ll get hands-on experience with AWS services, Google Cloud Platform, popular AI/ML frameworks, development tools, and more. We provide free credits and accounts for all major platforms.'
    },
    {
      id: 12,
      category: 'sponsorship',
      question: 'How can my company sponsor Samyukta?',
      answer: 'We offer various sponsorship tiers: Title (₹5L+), Platinum (₹2L+), Gold (₹1L+), and Silver (₹50K+). Each tier includes different benefits like branding, speaking slots, and recruitment opportunities. Contact sponsors@samyukta.anits.edu.in'
    },
    {
      id: 13,
      category: 'sponsorship',
      question: 'What are the benefits of sponsoring?',
      answer: 'Sponsors get brand visibility to 500+ students, recruitment opportunities, speaking slots, booth space, social media promotion, and networking with industry leaders. It\'s a great way to connect with top talent!'
    },
    {
      id: 14,
      category: 'general',
      question: 'What is the dress code?',
      answer: 'Day 1: Professional attire for inauguration. Day 2: Cultural dress encouraged for networking. Day 3: Freestyle/comfortable for hackathon. Day 4: Summit t-shirt for industry visit. Details are in your confirmation email.'
    },
    {
      id: 15,
      category: 'general',
      question: 'Are meals provided?',
      answer: 'Yes! All meals are included: breakfast, lunch, dinner, and snacks. We cater to dietary restrictions (vegetarian, vegan, etc.). Specify your requirements during registration.'
    },
    {
      id: 16,
      category: 'general',
      question: 'Can I get a certificate?',
      answer: 'Yes! All participants receive digital certificates of participation. Winners of hackathons and competitions get special recognition certificates. Certificates are available for download from your dashboard post-event.'
    },
    {
      id: 17,
      category: 'general',
      question: 'What COVID-19 safety measures are in place?',
      answer: 'We follow all local health guidelines. Sanitization stations are available throughout the venue. We recommend carrying your own sanitizer and mask. Health protocols may be updated based on current guidelines.'
    },
    {
      id: 18,
      category: 'general',
      question: 'What if I need to cancel my registration?',
      answer: 'Cancellations made 30+ days before the event get full refund. 15-30 days: 50% refund. Less than 15 days: no refund but you can transfer your registration to another person. Contact us for assistance.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
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
    <PublicLayout>
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
              {categories.map((category) => (
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
                                {categories.find(c => c.id === faq.category)?.name}
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
                  contact: "help@samyukta.anits.edu.in",
                  action: "mailto:help@samyukta.anits.edu.in"
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
    </PublicLayout>
  );
}