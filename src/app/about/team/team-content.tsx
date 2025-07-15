"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Instagram, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

// Define types for the team data structure
type SocialLinks = {
  linkedin?: string;
  instagram?: string;
};

type TeamMember = {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly social: SocialLinks;
};

type TeamCategory = {
  readonly title: string;
  readonly description: string;
  readonly members: readonly TeamMember[];
};

type ComingSoonSection = {
  readonly title: string;
  readonly description: string;
};

type TeamData = {
  readonly title: string;
  readonly description: string;
  readonly categories: readonly TeamCategory[];
  readonly coming_soon: ComingSoonSection;
};

// Define the props type for the component
type TeamContentProps = {
  teamData: TeamData;
};

export default function TeamContent({ teamData }: TeamContentProps) {
  return (
    <>
      {teamData.categories.map((category: TeamCategory, index: number) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">{category.title}</h2>
            <p className="text-gray-400">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.members.map((member: TeamMember, memberIndex: number) => (
              <motion.div
                key={memberIndex}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-0 overflow-hidden shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"></div>
                  
                  <div className="relative p-6 flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-70"></div>
                      <Avatar className="w-28 h-28 border-2 border-white/10 relative shadow-inner">
                        <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-2 text-center z-10">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {member.name}
                      </h3>
                      <div className="px-4 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full backdrop-blur-sm inline-block">
                        <p className="text-sm font-medium text-blue-300">{member.role}</p>
                      </div>
                      
                      <div className="pt-3 flex justify-center space-x-4">
                        {('linkedin' in member.social && member.social.linkedin) ? (
                          <Link href={member.social.linkedin as string} target="_blank" rel="noopener noreferrer" 
                            className="bg-blue-900/30 hover:bg-blue-600/30 p-2 rounded-full transition-colors group-hover:scale-110 transform duration-200">
                            <Linkedin size={18} className="text-blue-300" />
                          </Link>
                        ) : null}
                        {('instagram' in member.social && member.social.instagram) ? (
                          <Link href={member.social.instagram as string} target="_blank" rel="noopener noreferrer"
                            className="bg-pink-900/30 hover:bg-pink-600/30 p-2 rounded-full transition-colors group-hover:scale-110 transform duration-200">
                            <Instagram size={18} className="text-pink-300" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-3xl mx-auto mb-16"
      >
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
          <CardContent className="p-8 sm:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-blue-400" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {teamData.coming_soon.title}
                </h3>
                <p className="text-gray-300 max-w-xl mx-auto">
                  {teamData.coming_soon.description as string}
                </p>
                
                <div className="pt-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Expected by July 15th, 2025
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Join Section - Commented out as in original code
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 text-center mt-16 backdrop-blur-sm border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-white mb-3">{teamData.joinSection.title}</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">{teamData.joinSection.description}</p>
        <Link 
          href={`mailto:${teamData.joinSection.contactEmail}`}
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
        >
          Contact Us
        </Link>
      </motion.div> */}
    </>
  );
}