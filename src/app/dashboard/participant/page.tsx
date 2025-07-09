'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/entities/User';
import { Game } from '@/entities/Game';
import { Social } from '@/entities/Social';
import { HelpTicket } from '@/entities/HelpTicket';
import { Competition } from '@/entities/Competition';
import { User as UserType, Competition as CompetitionData, UserCompetitionData } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, User as UserIcon, Trophy, Camera, HelpCircle, Settings, Target, Users, Linkedin, Instagram, Globe, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { PageLoading } from '@/components/shared/Loading';

export default function ParticipantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
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
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [userCompetitions, setUserCompetitions] = useState<UserCompetitionData[]>([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinForm, setJoinForm] = useState({
    competition_id: '',
    registration_type: 'individual' as 'individual' | 'team',
    team_id: '',
    transaction_id: '',
    payment_screenshot: null as File | null
  });
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const teamMembers = useMemo(() => [
    { name: user?.full_name || 'You', role: 'Team Lead', email: user?.email || '' },
    { name: 'Member 2', role: 'Member', email: 'member2@example.com' },
    { name: 'Member 3', role: 'Member', email: 'member3@example.com' }
  ], [user]);

  const availableCompetitions = useMemo(() => 
    competitions.filter(comp => 
      !userCompetitions.some(uc => uc.competition.id === comp.id)
    ), 
    [competitions, userCompetitions]
  );

  const loadCompetitions = useCallback(async () => {
    if (!user) return;
    try {
      const [allCompetitions, userComps] = await Promise.all([
        Competition.getAll(),
        Competition.getUserCompetitions(user.id)
      ]);
      setCompetitions(allCompetitions.filter(c => c.status === 'open'));
      setUserCompetitions(userComps);
    } catch (error) {
      console.error('Failed to load competitions:', error);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadCompetitions();
    }
  }, [loadCompetitions, user]);
  
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

  const handleJoinCompetition = async () => {
    if (!user || !joinForm.competition_id || !joinForm.transaction_id || !joinForm.payment_screenshot) {
      setJoinMessage('Please fill all required fields');
      return;
    }

    setJoinLoading(true);
    setJoinMessage('');

    try {
      await Competition.joinCompetition({
        competition_id: joinForm.competition_id,
        user_id: user.id,
        team_id: joinForm.team_id || undefined,
        registration_type: joinForm.registration_type,
        transaction_id: joinForm.transaction_id,
        payment_screenshot: joinForm.payment_screenshot
      });
      
      setJoinMessage('Registration submitted successfully! Awaiting approval.');
      setTimeout(() => {
        setShowJoinDialog(false);
        setJoinForm({
          competition_id: '',
          registration_type: 'individual',
          team_id: '',
          transaction_id: '',
          payment_screenshot: null
        });
        setJoinMessage('');
        loadCompetitions();
      }, 2000);
    } catch (error) {
      setJoinMessage('Failed to join competition. Please try again.');
      console.error('Failed to join competition:', error);
    } finally {
      setJoinLoading(false);
    }
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

  const handleSocialUpload = async (file: File) => {
    if (!user) return;
    try {
      const socialData = {
        uploaded_by: user.id,
        file_url: URL.createObjectURL(file),
        caption: 'Samyukta 2025 moment!'
      };
      await Social.create(socialData);
    } catch (error) {
      console.error('Social upload error:', error);
    }
  };

  const handleHelpTicket = async (title: string, description: string, file?: File) => {
    if (!user) return;
    try {
      const ticketData = {
        submitted_by: user.id,
        title: title,
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
    return <PageLoading text="Loading dashboard..." />;
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
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span className="text-blue-400">{user.full_name}</span>!
            </h1>
            <p className="text-sm text-gray-400">
              Ready to make the most of Samyukta 2025? Let&apos;s dive in.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
            <div className="space-y-4 sm:space-y-6 lg:col-span-1 w-full max-w-full">
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
                    <CardContent className="text-center p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        {qrCode ? (
                          <Image
                            src={qrCode}
                            alt="Your QR Code"
                            width={192}
                            height={192}
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto rounded-lg"
                            unoptimized
                          />
                        ) : (
                          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white rounded-lg flex items-center justify-center mx-auto">
                            <QrCode className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-blue-500/50" />
                          </div>
                        )}
                        <p className="text-gray-400 text-xs sm:text-sm">
                        Use this QR code for games and networking
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-600 text-gray-300 hover:text-blue-400 text-xs sm:text-sm"
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
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-lg sm:text-xl md:text-2xl font-bold text-white">
                          {user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-2">{user.full_name}</h3>
                      <p className="text-gray-400 text-sm sm:text-base truncate">{user.email}</p>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-2 text-xs sm:text-sm">
                        Participant
                      </Badge>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        <Input
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
                        <Input
                          value={profileData.instagram}
                          onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                          placeholder="Instagram handle"
                        />
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={profileData.portfolio}
                          onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                          placeholder="Portfolio URL"
                        />
                      </div>
                    </div>

                    <Button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-sm sm:text-base">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
                )}
            </motion.div>
          </div>

          <div className="lg:col-span-2 w-full max-w-full min-w-0">
            <Tabs defaultValue="games" className="w-full max-w-full">
              {/* Desktop Tabs */}
              <TabsList className="hidden lg:grid w-full grid-cols-5 bg-gray-800/40 mb-8 h-16">
                <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Games</div>
                    <div className="text-xs opacity-70">Interactive</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="competitions" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Competitions</div>
                    <div className="text-xs opacity-70">Join & Track</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="team" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Team</div>
                    <div className="text-xs opacity-70">Information</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white h-full">
                  <div className="text-center">
                    <div className="font-semibold">Social</div>
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
              
              {/* Mobile Tabs - Hidden */}
              <TabsList className="hidden">
                <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white flex-shrink-0 px-4">
                  Games
                </TabsTrigger>
                <TabsTrigger value="competitions" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white flex-shrink-0 px-4">
                  Competitions
                </TabsTrigger>
                <TabsTrigger value="team" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white flex-shrink-0 px-4">
                  Team
                </TabsTrigger>
                <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex-shrink-0 px-4">
                  Social
                </TabsTrigger>
                <TabsTrigger value="help" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex-shrink-0 px-4">
                  Help
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Interactive Games</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full max-w-full">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 w-full max-w-full">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-white text-sm sm:text-base">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                        QR Quest
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <p className="text-gray-400 text-sm sm:text-base">Campus-wide scavenger hunt. Scan QR codes to collect points!</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm sm:text-base">Your Score:</span>
                          <Badge className="bg-green-500/10 text-green-400 text-xs sm:text-sm">{gameStats.qrQuest} points</Badge>
                        </div>
                        <Button
                          onClick={() => setShowScanner('qr-quest')}
                          className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Start Scanning
                        </Button>
                        <div className="mt-3 p-2 bg-gray-700/30 rounded">
                          <h5 className="text-xs font-medium text-white mb-1">QR Locations:</h5>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>• Main Auditorium</div>
                            <div>• Tech Lab</div>
                            <div>• Cafeteria</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 w-full max-w-full">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-white text-sm sm:text-base">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-400" />
                        Imposter Hunt
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <p className="text-gray-400 text-sm sm:text-base">Find the imposters among participants. Use your deduction skills!</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm sm:text-base">Suspects Found:</span>
                          <Badge className="bg-red-500/10 text-red-400 text-xs sm:text-sm">{gameStats.imposterSuspects} suspects</Badge>
                        </div>
                        <Button
                          onClick={() => setShowScanner('imposter')}
                          className="w-full bg-red-600 hover:bg-red-700 text-sm sm:text-base"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Scan Participants
                        </Button>
                        <div className="mt-3 p-2 bg-gray-700/30 rounded">
                          <h5 className="text-xs font-medium text-white mb-1">Current Suspects:</h5>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>• John Doe</div>
                            <div>• Jane Smith</div>
                            <div>• Alex Johnson</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 w-full max-w-full">
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
                            <div key={rank} className="flex items-center justify-between p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Badge className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-xs sm:text-sm">
                                  {rank}
                                </Badge>
                                <span className="text-white text-sm sm:text-base">Participant {rank}</span>
                              </div>
                              <span className="text-green-400 text-sm sm:text-base">{150 - rank * 10} pts</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="imposter" className="mt-4">
                        <div className="text-center text-gray-400 py-6 sm:py-8">
                          <p className="text-sm sm:text-base">Game results will be displayed here during the event</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competitions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Competitions</h2>
                  <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Join Competition
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Join Competition</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Competition</Label>
                          <Select value={joinForm.competition_id} onValueChange={(value) => setJoinForm({...joinForm, competition_id: value})}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select competition" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {availableCompetitions.map((comp) => (
                                <SelectItem key={comp.id} value={comp.id} className="text-white">
                                  {comp.name} - ₹{comp.registration_fee}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Registration Type</Label>
                          <Select value={joinForm.registration_type} onValueChange={(value: 'individual' | 'team') => setJoinForm({...joinForm, registration_type: value})}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="individual" className="text-white">Individual</SelectItem>
                              <SelectItem value="team" className="text-white">Join Existing Team</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {joinForm.registration_type === 'team' && (
                          <div className="space-y-2">
                            <Label className="text-gray-300">Team ID (Optional)</Label>
                            <Input 
                              value={joinForm.team_id || ''}
                              onChange={(e) => setJoinForm({...joinForm, team_id: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white" 
                              placeholder="Enter existing team ID to join"
                            />
                            <p className="text-xs text-gray-400">Leave empty to create a new team</p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Transaction ID</Label>
                          <Input 
                            value={joinForm.transaction_id}
                            onChange={(e) => setJoinForm({...joinForm, transaction_id: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white" 
                            placeholder="Enter transaction ID"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Payment Screenshot</Label>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => setJoinForm({...joinForm, payment_screenshot: e.target.files?.[0] || null})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        {joinMessage && (
                          <div className={`text-sm p-2 rounded ${joinMessage.includes('success') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                            {joinMessage}
                          </div>
                        )}
                        <Button 
                          onClick={handleJoinCompetition} 
                          disabled={joinLoading}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 disabled:opacity-50"
                        >
                          {joinLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Registration
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm sm:text-base">My Competitions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      {userCompetitions.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                          {userCompetitions.map((comp) => (
                            <div key={comp.competition.id} className="p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-white font-medium text-sm sm:text-base truncate">{comp.competition.name}</h4>
                                  <p className="text-gray-400 text-xs sm:text-sm truncate">{comp.competition.category}</p>
                                  <p className="text-gray-400 text-xs">Type: {comp.registration.registration_type}</p>
                                </div>
                                <Badge className={`flex-shrink-0 text-xs sm:text-sm ${
                                  comp.registration.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                  comp.registration.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                  'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                  {comp.registration.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No competitions joined yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm sm:text-base">Available Competitions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        {availableCompetitions.map((comp) => (
                          <div key={comp.id} className="p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-white font-medium text-sm sm:text-base truncate">{comp.name}</h4>
                                <p className="text-gray-400 text-xs sm:text-sm truncate">{comp.category}</p>
                                <p className="text-gray-400 text-xs">Fee: ₹{comp.registration_fee}</p>
                                <p className="text-gray-400 text-xs">
                                  Slots: {comp.slots_filled}/{comp.slots_available}
                                </p>
                              </div>
                              <Badge className="bg-blue-500/10 text-blue-400 flex-shrink-0 text-xs sm:text-sm">
                                {comp.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Team Information</h2>
                
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
                          <span className="text-white text-sm sm:text-base">3 members</span>
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

                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Team QR Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                            <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500/50" />
                          </div>
                          <p className="text-white font-medium text-sm sm:text-base truncate">{member.name}</p>
                          <p className="text-gray-400 text-xs">TEAM-001-{index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Social Feed</h2>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => router.push('/social')}
                      className="bg-gradient-to-r from-pink-500 to-violet-500"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      View Full Feed
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-transparent hover:bg-white hover:text-blue-400 border-gray-600 text-gray-300"
                    >
                      My Media
                    </Button>
                  </div>
                </div>
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSocialUpload(file);
                        }}
                        className="hidden"
                        id="social-upload"
                      />
                      <label htmlFor="social-upload">
                        <Button className="bg-gradient-to-r from-pink-500 to-violet-500 cursor-pointer">
                          <Camera className="w-4 h-4 mr-2" />
                          Share Photo
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
                        <Label className="text-gray-300 text-sm sm:text-base">Issue Title</Label>
                        <Input name="title" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm sm:text-base">Description</Label>
                        <Textarea name="description" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm sm:text-base">Attachment (optional)</Label>
                        <Input type="file" name="file" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                      </div>
                      <Button type="submit" className="w-full text-sm sm:text-base">
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