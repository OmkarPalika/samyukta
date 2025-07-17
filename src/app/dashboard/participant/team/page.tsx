'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { PageLoading } from '@/components/shared/Loading';

export default function TeamPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamQRCodes, setTeamQRCodes] = useState<Array<{participant_id: string; name: string; qr_code: string}>>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{name: string; role: string; email: string}>>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        if (currentUser.email) {
          try {
            const memberResponse = await fetch(`/api/registrations/team-qr?email=${currentUser.email}`);
            if (memberResponse.ok) {
              const memberData = await memberResponse.json();
              setTeamQRCodes(memberData.qr_codes || []);
            }
          } catch (error) {
            console.error('Failed to fetch team data:', error);
          }
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  useEffect(() => {
    if (user) {
      // Default to just the current user if no team data is available
      const defaultMember = { name: user.full_name || 'You', role: 'Team Lead', email: user.email || '' };
      setTeamMembers([defaultMember]);
      
      // Try to get actual team members from QR codes data
      if (teamQRCodes.length > 0) {
        const mappedMembers = teamQRCodes.map((member, index) => ({
          name: member.name,
          role: index === 0 ? 'Team Lead' : 'Member',
          email: member.name === user.full_name ? user.email : `${member.name.toLowerCase().replace(/\\s+/g, '.')}@example.com`
        }));
        setTeamMembers(mappedMembers);
      }
    }
  }, [user, teamQRCodes]);

  if (loading) {
    return <PageLoading text="Loading team information..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          <div className="flex items-center mb-4 sm:mb-6 lg:hidden">
            <Users className="w-5 h-5 mr-2 text-violet-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Team Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white text-sm sm:text-base">Team Details</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Team ID:</span>
                    <span className="text-white text-sm sm:text-base">TEAM-2025-001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">College:</span>
                    <span className="text-white text-sm sm:text-base truncate ml-2">{user.college || 'ANITS'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Team Size:</span>
                    <span className="text-white text-sm sm:text-base">{teamMembers.length} members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Track:</span>
                    <Badge className="bg-blue-500/10 text-blue-400 text-xs sm:text-sm">{user.track || 'Cloud Computing'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white text-sm sm:text-base">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base truncate">{member.name}</p>
                        <p className="text-gray-400 text-xs sm:text-sm truncate">{member.email}</p>
                      </div>
                      <Badge className={`flex-shrink-0 text-xs sm:text-sm ${
                        index === 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Team QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {teamQRCodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {teamQRCodes.map((member, index) => (
                    <div key={index} className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                      {member.qr_code ? (
                        <div className="relative group">
                          <Image
                            src={member.qr_code}
                            alt={`QR Code for ${member.name}`}
                            width={96}
                            height={96}
                            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 rounded-lg"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs bg-transparent border-white/30 text-white hover:bg-white/20"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.download = `samyukta-qr-${member.name.replace(/\\s+/g, '-')}.png`;
                                link.href = member.qr_code;
                                link.click();
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                          <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500/50" />
                        </div>
                      )}
                      <p className="text-white font-medium text-sm sm:text-base truncate">{member.name}</p>
                      <p className="text-gray-400 text-xs">{member.participant_id}</p>
                      {member.name === user?.full_name && (
                        <Badge className="mt-1 bg-blue-500/10 text-blue-400 text-xs">You</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No team QR codes available</p>
                  <p className="text-gray-500 text-sm">QR codes will be generated after registration approval</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 bg-transparent border-gray-600 text-gray-300 hover:text-blue-400"
                    onClick={() => router.push('/register')}
                  >
                    Register for Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}