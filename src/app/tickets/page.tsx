'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Calculator, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Loading from "@/components/shared/Loading";
import { ClientAuth } from "@/lib/client-auth";

export default function Tickets() {
  const [teamSize, setTeamSize] = useState([1]);
  const [ticketChoice, setTicketChoice] = useState('entry_workshop');
  const [workshopTrack, setWorkshopTrack] = useState('cloud');
  const [competitionTrack, setCompetitionTrack] = useState('');
  const [comboCompetition, setComboCompetition] = useState('hackathon');
  const [slots, setSlots] = useState<{
    total: {
      remaining: number;
      registered: number;
      max: number;
    };
    workshops: {
      cloud: {
        remaining: number;
        registered: number;
        max: number;
        closed: boolean;
      };
      ai: {
        remaining: number;
        registered: number;
        max: number;
        closed: boolean;
      };
      cybersecurity: {
        remaining: number;
        registered: number;
        max: number;
        closed: boolean;
      };
    };
    competitions: {
      hackathon: {
        remaining: number;
        registered: number;
        max: number;
      };
      pitch: {
        remaining: number;
        registered: number;
        max: number;
      };
    };
    direct_join: {
      available: boolean;
      hackathon_price: number;
      pitch_price: number;
    };
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication status
        const user = await ClientAuth.me();
        setIsAuthenticated(!!user);

        // Fetch consolidated slot data
        const response = await fetch('/api/slots');
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculatePrice = () => {
    let basePrice = 0;
    const breakdown: { item: string; price: number }[] = [];
    const currentTeamSize = teamSize[0];

    if (ticketChoice === 'combo') {
      basePrice = comboCompetition === 'hackathon' ? 950 : 900;
      breakdown.push({ item: `Combo Pass (${comboCompetition})`, price: basePrice });
    } else if (ticketChoice === 'startup_only') {
      basePrice = 200;
      breakdown.push({ item: "Startup Pitch Only", price: 200 });
    } else {
      basePrice = 800;
      breakdown.push({ item: "Entry + Workshop Pass", price: 800 });

      if (competitionTrack) {
        const competitionPrice = competitionTrack === 'hackathon' ? 150 : 100;
        basePrice += competitionPrice;
        breakdown.push({ item: `${competitionTrack} Entry`, price: competitionPrice });
      }
    }

    let teamDiscount = 0;
    
    // Calculate team discounts
    if (ticketChoice === 'combo' && currentTeamSize > 1) {
      teamDiscount = currentTeamSize * 10;
    } else if (ticketChoice === 'startup_only' && currentTeamSize > 1) {
      // Group discounts for startup-only tickets
      if (currentTeamSize >= 5) {
        teamDiscount = currentTeamSize * 50; // ₹50 discount per person
      } else if (currentTeamSize >= 3) {
        teamDiscount = currentTeamSize * 30; // ₹30 discount per person
      } else if (currentTeamSize === 2) {
        teamDiscount = currentTeamSize * 20; // ₹20 discount per person
      }
    }
    
    const totalForTeam = (basePrice * currentTeamSize) - teamDiscount;
    const totalPerPerson = totalForTeam / currentTeamSize;

    return { breakdown, teamDiscount, totalPerPerson, totalForTeam, teamSize: currentTeamSize };
  };

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-gray-200">
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
                  Choose Your Journey
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                Flexible pricing options designed for every type of participant
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Early Bird Pricing Active
                </Badge>
                {slots && (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Only {slots.total.remaining} slots left!
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
              <Loading size="md" text="Loading ticket information..." className="py-8" />
            </div>
          )}

          {/* Slots Overview */}
          {slots && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-8 sm:mb-12"
            >
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{slots.total.remaining}</div>
                      <div className="text-sm text-gray-400 mb-2">Total Slots Left</div>
                      <Progress value={(slots.total.registered / slots.total.max) * 100} className="h-2 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-violet-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{slots.workshops.cloud.remaining}</div>
                      <div className="text-sm text-gray-400 mb-2">Cloud Workshop</div>
                      <Progress value={(slots.workshops.cloud.registered / slots.workshops.cloud.max) * 100} className="h-2 bg-blue-900/20 [&>div]:bg-blue-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-400 mb-1">{slots.workshops.ai.remaining}</div>
                      <div className="text-sm text-gray-400 mb-2">AI Workshop</div>
                      <Progress value={(slots.workshops.ai.registered / slots.workshops.ai.max) * 100} className="h-2 bg-violet-900/20 [&>div]:bg-violet-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">{slots.workshops.cybersecurity.remaining}</div>
                      <div className="text-sm text-gray-400 mb-2">Cybersecurity Workshop</div>
                      <Progress value={(slots.workshops.cybersecurity.registered / slots.workshops.cybersecurity.max) * 100} className="h-2 bg-red-900/20 [&>div]:bg-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}



          {/* Ticket Cards */}
          <div className="grid lg:grid-cols-3 grid-gap mb-8 sm:mb-12 lg:mb-16 max-w-6xl mx-auto">
            {/* Entry + Workshop Card */}
            <motion.div whileHover={{ y: -10 }}>
              <Card
                onClick={() => setTicketChoice('entry_workshop')}
                className={`cursor-pointer bg-gray-800/40 backdrop-blur-sm border-gray-700 h-full transition-all ${ticketChoice === 'entry_workshop' ? 'ring-2 ring-blue-500' : 'hover:border-gray-600'}`}
              >
                <CardHeader>
                  <div className="text-spacing">
                    <CardTitle className="text-white text-xl sm:text-2xl">Entry + Workshop Pass</CardTitle>
                    <p className="text-2xl sm:text-3xl font-bold text-white">₹800 <span className="text-base sm:text-lg font-normal text-gray-400">/ person</span></p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="card-gap flex flex-col">
                    <p className="text-sm sm:text-base text-gray-400">Core access to the summit and one hands-on workshop track.</p>

                    {ticketChoice === 'entry_workshop' && (
                      <div className="space-y-3 sm:space-y-4 border-t border-gray-600 pt-3 sm:pt-4">
                        <div className="text-spacing">
                          <Label className="text-white text-xs sm:text-sm font-medium">Workshop Track</Label>
                          <RadioGroup value={workshopTrack} onValueChange={setWorkshopTrack} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cloud" id="cloud" disabled={slots?.workshops.cloud.closed} />
                                <Label htmlFor="cloud" className={`text-xs sm:text-sm ${slots?.workshops.cloud.closed ? 'text-gray-500' : 'text-gray-300'}`}>
                                  Cloud Computing (AWS)
                                </Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.workshops.cloud.remaining <= 10 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                  {slots.workshops.cloud.remaining} left
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ai" id="ai" disabled={slots?.workshops.ai.closed} />
                                <Label htmlFor="ai" className={`text-xs sm:text-sm ${slots?.workshops.ai.closed ? 'text-gray-500' : 'text-gray-300'}`}>
                                  AI & Machine Learning (Google)
                                </Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.workshops.ai.remaining <= 10 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                                  {slots.workshops.ai.remaining} left
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cybersecurity" id="cybersecurity" disabled={slots?.workshops.cybersecurity.closed} />
                                <Label htmlFor="cybersecurity" className={`text-xs sm:text-sm ${slots?.workshops.cybersecurity.closed ? 'text-gray-500' : 'text-gray-300'}`}>
                                  Cybersecurity & Ethical Hacking
                                </Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.workshops.cybersecurity.remaining <= 10 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                  {slots.workshops.cybersecurity.remaining} left
                                </Badge>
                              )}
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="text-spacing">
                          <Label className="text-white text-xs sm:text-sm font-medium">Optional Competition Entry</Label>
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="hackathon"
                                  checked={competitionTrack === 'hackathon'}
                                  onCheckedChange={(checked) => setCompetitionTrack(checked ? 'hackathon' : '')}
                                />
                                <Label htmlFor="hackathon" className="text-xs sm:text-sm text-gray-300">
                                  Hackathon Entry (+₹150)
                                </Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.competitions.hackathon.remaining > 50 ? 'bg-green-500/10 text-green-400 border-green-500/20' : slots.competitions.hackathon.remaining > 20 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                  {slots.competitions.hackathon.remaining} left
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="pitch"
                                  checked={competitionTrack === 'pitch'}
                                  onCheckedChange={(checked) => setCompetitionTrack(checked ? 'pitch' : '')}
                                />
                                <Label htmlFor="pitch" className="text-xs sm:text-sm text-gray-300">
                                  Startup Pitch Entry (+₹100)
                                </Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.competitions.pitch.remaining > 50 ? 'bg-green-500/10 text-green-400 border-green-500/20' : slots.competitions.pitch.remaining > 20 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                  {slots.competitions.pitch.remaining} left
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />All Keynotes & Sessions</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />One Workshop Track</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Networking & Game Access</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Meals & Refreshments</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Startup Only Card */}
            <motion.div whileHover={{ y: -10 }}>
              <Card
                onClick={() => setTicketChoice('startup_only')}
                className={`cursor-pointer bg-gray-800/40 backdrop-blur-sm border-gray-700 h-full transition-all ${ticketChoice === 'startup_only' ? 'ring-2 ring-pink-500' : 'hover:border-gray-600'}`}
              >
                <CardHeader>
                  <div className="text-spacing">
                    <CardTitle className="text-white text-xl sm:text-2xl">Startup Pitch Only</CardTitle>
                    <p className="text-2xl sm:text-3xl font-bold text-white">₹200 <span className="text-base sm:text-lg font-normal text-gray-400">/ person</span></p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="card-gap flex flex-col">
                    <p className="text-sm sm:text-base text-gray-400">Focused on startup pitch competition only.</p>

                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Startup Pitch Competition</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Mentorship Sessions</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Networking Access</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Meals & Refreshments</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Certificate of Participation</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-400" />Group discounts available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Combo Card */}
            <motion.div whileHover={{ y: -10 }} className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
              </div>
              <Card
                onClick={() => setTicketChoice('combo')}
                className={`cursor-pointer bg-gray-800/40 backdrop-blur-sm border-gray-700 h-full transition-all ${ticketChoice === 'combo' ? 'ring-2 ring-violet-500' : 'hover:border-gray-600'}`}
              >
                <CardHeader>
                  <div className="text-spacing">
                    <CardTitle className="text-white text-xl sm:text-2xl">Combo Pack</CardTitle>
                    <p className="text-2xl sm:text-3xl font-bold text-white">₹900 - ₹950 <span className="text-base sm:text-lg font-normal text-gray-400">/ person</span></p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="card-gap flex flex-col">
                    <p className="text-sm sm:text-base text-gray-400">Everything included, plus entry into a competition track.</p>

                    {ticketChoice === 'combo' && (
                      <div className="border-t border-gray-600 pt-3 sm:pt-4">
                        <div className="text-spacing">
                          <Label className="text-white text-xs sm:text-sm font-medium">Competition Track</Label>
                          <RadioGroup value={comboCompetition} onValueChange={setComboCompetition} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hackathon" id="combo-hackathon" />
                                <Label htmlFor="combo-hackathon" className="text-xs sm:text-sm text-gray-300">Hackathon Track (₹950)</Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.competitions.hackathon.remaining > 50 ? 'bg-green-500/10 text-green-400 border-green-500/20' : slots.competitions.hackathon.remaining > 20 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                  {slots.competitions.hackathon.remaining} left
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pitch" id="combo-pitch" />
                                <Label htmlFor="combo-pitch" className="text-xs sm:text-sm text-gray-300">Startup Pitch Track (₹900)</Label>
                              </div>
                              {slots && (
                                <Badge className={`text-xs ${slots.competitions.pitch.remaining > 50 ? 'bg-green-500/10 text-green-400 border-green-500/20' : slots.competitions.pitch.remaining > 20 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                  {slots.competitions.pitch.remaining} left
                                </Badge>
                              )}
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}

                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Entry + Workshop Pass</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Competition Entry</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Team Discount Eligible</li>
                      <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />Priority Access</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Price Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-base sm:text-lg">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Price Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="card-gap flex flex-col">
                  {/* Team Size Slider */}
                  <div className="text-spacing">
                    <div className="flex justify-between items-center">
                      <label className="text-sm sm:text-base text-gray-300">Team Size</label>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs sm:text-sm">
                        {teamSize[0]} member{teamSize[0] !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Slider
                      value={teamSize}
                      onValueChange={setTeamSize}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="text-spacing">
                    <h3 className="font-semibold text-white text-sm sm:text-base">Price Breakdown</h3>
                    <div className="space-y-2">
                      {pricing.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs sm:text-sm text-gray-300">
                          <span>{item.item}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                      {pricing.teamDiscount > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-green-400">
                          <span>
                            {ticketChoice === 'combo' 
                              ? `Team Discount (${pricing.teamSize} x ₹10)`
                              : ticketChoice === 'startup_only'
                                ? `Group Discount (${
                                    pricing.teamSize >= 5 ? '5+ members' :
                                    pricing.teamSize >= 3 ? '3-4 members' :
                                    '2 members'
                                  })`
                                : 'Team Discount'
                            }
                          </span>
                          <span>-₹{pricing.teamDiscount}</span>
                        </div>
                      )}
                      <hr className="border-gray-600" />
                      <div className="flex justify-between text-base sm:text-lg font-bold text-white">
                        <span>Total for Team</span>
                        <span>₹{pricing.totalForTeam}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                        <span>Per Person</span>
                        <span>₹{Math.round(pricing.totalPerPerson)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-base sm:text-lg py-2 sm:py-3">
                      {isAuthenticated ? "Go to Dashboard" : "Proceed to Registration"}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
