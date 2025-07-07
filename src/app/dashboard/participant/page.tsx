'use client';

import { useState, useEffect } from 'react';
import { User, UserData } from '@/entities/User';
import { Game } from '@/entities/Game';
import { Gallery } from '@/entities/Gallery';
import { HelpTicket } from '@/entities/HelpTicket';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRScanner from '@/components/dashboard/QRScanner';
import { QRGenerator, QRPayload } from '@/lib/qr-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, User as UserIcon, Trophy, Camera, HelpCircle, Settings, Target, Users, Linkedin, Instagram, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

export default function ParticipantDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [showScanner, setShowScanner] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState({ qrQuest: 0, imposterSuspects: 0 });
  const [profileData, setProfileData] = useState({
    linkedin: '',
    instagram: '',
    portfolio: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setProfileData({
        linkedin: currentUser.linkedin || '',
        instagram: currentUser.instagram || '',
        portfolio: currentUser.portfolio || ''
      });

      if (currentUser.id) {
        const qr = await QRGenerator.generateParticipantQR({
          id: currentUser.id,
          name: currentUser.full_name,
          email: currentUser.email,
          college: currentUser.college,
          track: currentUser.track,
          year: currentUser.year,
          dept: currentUser.dept
        });
        setQrCode(qr);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  const handleQRScan = async (data: QRPayload, gameType: string) => {
    if (!user) return;
    try {
      if (gameType === 'qr-quest') {
        await Game.scanQR(user.id, JSON.stringify(data));
        setGameStats(prev => ({ ...prev, qrQuest: prev.qrQuest + 10 }));
      } else if (gameType === 'imposter') {
        await Game.addSuspect(user.id, data.id);
        setGameStats(prev => ({ ...prev, imposterSuspects: prev.imposterSuspects + 1 }));
      }
      setShowScanner(null);
    } catch (error) {
      console.error('QR scan error:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    try {
      await User.updateProfile(user.id, profileData);
      setUser({ ...user, ...profileData });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleGalleryUpload = async (file: File) => {
    if (!user) return;
    try {
      const galleryData = {
        uploaded_by: user.id,
        file_url: URL.createObjectURL(file),
        caption: 'Samyukta 2025 moment!',
        status: 'pending' as const
      };
      await Gallery.create(galleryData);
    } catch (error) {
      console.error('Gallery upload error:', error);
    }
  };

  const handleHelpTicket = async (title: string, description: string, file?: File) => {
    if (!user) return;
    try {
      const ticketData = {
        submitted_by: user.id,
        issue: title,
        description,
        priority: 'medium' as const,
        attachment_url: file ? URL.createObjectURL(file) : undefined
      };
      await HelpTicket.create(ticketData);
    } catch (error) {
      console.error('Help ticket error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/40 border-gray-700 p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400">Please log in to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="container-responsive section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Welcome back, <span className="text-blue-400">{user.full_name}</span>!
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Ready to make the most of Samyukta 2025? Let&apos;s dive in.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {!isCardFlipped ? (
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-white">
                        <div className="flex items-center">
                          <QrCode className="w-5 h-5 mr-2" />
                          Your QR Code
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCardFlipped(true)}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <UserIcon className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-4">
                        {qrCode ? (
                          <Image
                            src={qrCode}
                            alt="Your QR Code"
                            width={192}
                            height={192}
                            className="w-48 h-48 mx-auto rounded-lg"
                            unoptimized
                          />
                        ) : (
                          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto">
                            <QrCode className="w-32 h-32 text-blue-500/50" />
                          </div>
                        )}
                        <p className="text-gray-400 text-sm">
                        Use this QR code for games and networking
                      </p>
                      <Button
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-300 hover:text-blue-400"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = 'samyukta-qr.png';
                          link.href = qrCode;
                          link.click();
                        }}
                      >
                        Save QR Code
                      </Button>
                    </div>
                  </CardContent>
                  </Card>
              ) : (
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-2" />
                      Your Profile
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCardFlipped(false)}
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-2xl font-bold text-white">
                          {user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold text-white mt-2">{user.full_name}</h3>
                      <p className="text-gray-400">{user.email}</p>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-2">
                        Participant
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-blue-400" />
                        <Input
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <Input
                          value={profileData.instagram}
                          onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Instagram handle"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <Input
                          value={profileData.portfolio}
                          onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Portfolio URL"
                        />
                      </div>
                    </div>

                    <Button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-blue-500 to-violet-500">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
                )}
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/40 mb-8 h-16">
                <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Games</div>
                    <div className="text-xs opacity-70">Interactive</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="team" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Team</div>
                    <div className="text-xs opacity-70">Information</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Gallery</div>
                    <div className="text-xs opacity-70">Photos</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="help" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Help</div>
                    <div className="text-xs opacity-70">Support</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Interactive Games</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Target className="w-5 h-5 mr-2 text-green-400" />
                        QR Quest
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-400">Campus-wide scavenger hunt. Scan QR codes to collect points!</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Your Score:</span>
                          <Badge className="bg-green-500/10 text-green-400">{gameStats.qrQuest} points</Badge>
                        </div>
                        <Button
                          onClick={() => setShowScanner('qr-quest')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Start Scanning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Users className="w-5 h-5 mr-2 text-red-400" />
                        Imposter Hunt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-400">Find the imposters among participants. Use your deduction skills!</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Suspects Found:</span>
                          <Badge className="bg-red-500/10 text-red-400">{gameStats.imposterSuspects} suspects</Badge>
                        </div>
                        <Button
                          onClick={() => setShowScanner('imposter')}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Scan Participants
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      Live Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="qr-quest">
                      <TabsList className="bg-gray-700/50">
                        <TabsTrigger value="qr-quest">QR Quest</TabsTrigger>
                        <TabsTrigger value="imposter">Imposter Hunt</TabsTrigger>
                      </TabsList>
                      <TabsContent value="qr-quest" className="mt-4">
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((rank) => (
                            <div key={rank} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Badge className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                                  {rank}
                                </Badge>
                                <span className="text-white">Participant {rank}</span>
                              </div>
                              <span className="text-green-400">{150 - rank * 10} pts</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="imposter" className="mt-4">
                        <div className="text-center text-gray-400 py-8">
                          Game results will be displayed here during the event
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Team Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Team Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Team ID:</span>
                          <span className="text-white">TEAM-2025-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">College:</span>
                          <span className="text-white">{user.college || 'ANITS'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Team Size:</span>
                          <span className="text-white">3 members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Track:</span>
                          <Badge className="bg-blue-500/10 text-blue-400">{user.track || 'Cloud Computing'}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: user.full_name, role: 'Team Lead', email: user.email },
                          { name: 'Member 2', role: 'Member', email: 'member2@example.com' },
                          { name: 'Member 3', role: 'Member', email: 'member3@example.com' }
                        ].map((member, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-white font-medium">{member.name}</p>
                              <p className="text-gray-400 text-sm">{member.email}</p>
                            </div>
                            <Badge className={index === 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}>
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Team QR Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { name: user.full_name, id: 'TEAM-001-1' },
                        { name: 'Member 2', id: 'TEAM-001-2' },
                        { name: 'Member 3', id: 'TEAM-001-3' }
                      ].map((member, index) => (
                        <div key={index} className="text-center p-4 bg-gray-700/30 rounded-lg">
                          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                            <QrCode className="w-16 h-16 text-blue-500/50" />
                          </div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-gray-400 text-xs">{member.id}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Event Gallery</h2>
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleGalleryUpload(file);
                        }}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label htmlFor="gallery-upload">
                        <Button className="bg-gradient-to-r from-pink-500 to-violet-500 cursor-pointer">
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </label>
                      <p className="text-gray-400 text-sm mt-4">
                        Share your Samyukta 2025 moments with the community!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="help" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Help & Support</h2>
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Submit Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const title = formData.get('title') as string;
                      const description = formData.get('description') as string;
                      const file = formData.get('file') as File;
                      handleHelpTicket(title, description, file);
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Issue Title</Label>
                        <Input name="title" className="bg-gray-700 border-gray-600 text-white" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Description</Label>
                        <Textarea name="description" className="bg-gray-700 border-gray-600 text-white" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Attachment (optional)</Label>
                        <Input type="file" name="file" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                      <Button type="submit" className="w-full">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Submit Ticket
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          title={showScanner === 'qr-quest' ? 'QR Quest Scanner' : 'Imposter Hunt Scanner'}
          description={showScanner === 'qr-quest' ? 'Scan QR codes to earn points' : 'Scan participants to add suspects'}
          onScan={(data) => handleQRScan(data, showScanner)}
          onClose={() => setShowScanner(null)}
        />
      )}
    </div>
    </DashboardLayout >
  );
}