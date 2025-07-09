'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import Script from "next/script";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";
import { MOCK_FAQS, MOCK_FAQ_CATEGORIES, generateFAQStructuredData, FAQS_PAGE_DATA, CONTACT_PAGE_DATA } from "@/lib";

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
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
            className="text-center mb-8 sm:mb-12 px-4 sm:px-6"
          >
            <div className="text-spacing-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {FAQS_PAGE_DATA.title}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mt-4">
                {FAQS_PAGE_DATA.description}
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8 px-4 sm:px-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-base sm:text-lg"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0"
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
          <div className="max-w-4xl mx-auto space-y-4 px-4 sm:px-6 md:px-0">
            <Accordion type="single" collapsible className="w-full accordion-glow">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4"
                >
                  <AccordionItem value={`item-${faq.id}`} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-500 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                      <div className="flex items-start space-x-3 sm:space-x-4 w-full">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
                          <h3 className="text-base sm:text-lg font-semibold text-white pr-2 sm:pr-4">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-4 sm:px-6 pb-2">
                        <div className="ml-10 sm:ml-12 pt-2 border-t border-gray-700">
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
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
        <div className="container-responsive px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-spacing-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {FAQS_PAGE_DATA.supportSection.title.split('Questions')[0]}<span className="text-blue-400">Questions?</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                {FAQS_PAGE_DATA.supportSection.description}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
            {CONTACT_PAGE_DATA.supportChannels.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent>
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
