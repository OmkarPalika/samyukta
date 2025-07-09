'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  User,
  Users,
  // AlertCircle,
  Send,
  ExternalLink,
  Car,
  Plane,
  Train
} from "lucide-react";
import InteractiveMap from "@/components/shared/InteractiveMap";
import { MOCK_CONTACTS } from "@/lib/mock-data";
// import { MOCK_EMERGENCY_CONTACTS } from "@/lib/mock-data";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, send to API
    console.log('Form submitted:', formData);

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
      phone: ''
    });

    setIsSubmitting(false);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };


  const transportInfo = [
    {
      icon: Plane,
      title: "By Air",
      description: "Visakhapatnam Airport (VTZ) - 95 minutes drive",
      details: "Regular flights from major cities."
    },
    {
      icon: Train,
      title: "By Train",
      description: "Visakhapatnam Railway Station - 60 minutes drive",
      details: "Well connected to all major cities."
    },
    {
      icon: Car,
      title: "By Road",
      description: "NH16 connects to major cities",
      details: "GPS: ANITS, Sangivalasa, Visakhapatnam. Parking available."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section>
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
                  Contact Us
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                Get in touch with our team for any queries, support, or partnerships
              </p>
            </div>
          </motion.div>

          {/* Venue Information */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    Venue Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Anil Neerukonda Institute of Technology & Sciences
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Sangivalasa, Bheemunipatnam Mandal,<br />
                      Visakhapatnam District, Andhra Pradesh 531162
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">+91-9876543210</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">info@samyukta.anits.edu.in</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-violet-400" />
                        <span className="text-gray-300">Event: Aug 6-9, 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => window.open('https://maps.google.com/?q=ANITS+Visakhapatnam', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://anits.edu.in', '_blank')}
                      className="bg-transparent border-gray-600 text-gray-300 hover:text-blue-400 hover:bg-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-full">
                <InteractiveMap />
              </div>
            </motion.div>
          </div>

          {/* Contact Form & Team */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Send className="w-5 h-5 mr-2 text-blue-400" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className='space-y-2'>
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className='space-y-2'>
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor="category" className="text-gray-300">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="registration">Registration Help</SelectItem>
                            <SelectItem value="sponsorship">Sponsorship</SelectItem>
                            <SelectItem value="accommodation">Accommodation</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="media">Media & Press</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    Our Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_CONTACTS.map((contact, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{contact.name}</h4>
                          <p className="text-sm text-blue-400">{contact.role}</p>
                          <p className="text-xs text-gray-400">{contact.department}</p>
                          <div className="flex flex-col space-y-1 mt-2">
                            <a href={`mailto:${contact.email}`} className="text-sm text-gray-300 hover:text-blue-400">
                              {contact.email}
                            </a>
                            <a href={`tel:${contact.phone}`} className="text-sm text-gray-300 hover:text-blue-400">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              {/* <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_EMERGENCY_CONTACTS.map((emergency, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-700/20 rounded">
                        <div>
                          <h5 className="font-medium text-white text-sm">{emergency.title}</h5>
                          <p className="text-xs text-gray-400">{emergency.description}</p>
                        </div>
                        <a href={`tel:${emergency.contact}`} className="text-red-400 font-bold">
                          {emergency.contact}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transportation Info */}
      <section className="section-padding bg-gray-800/20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              How to <span className="text-blue-400">Reach Us</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Multiple convenient ways to reach ANITS, Visakhapatnam for Samyukta 2025
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {transportInfo.map((transport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4">
                        <transport.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{transport.title}</h3>
                      <p className="text-blue-400 font-semibold text-sm">{transport.description}</p>
                      <p className="text-gray-400 text-sm">{transport.details}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}