'use client';

import { useState, useEffect } from 'react';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType, RegistrationResponse } from '@/lib/types';

interface HelpTicketData {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

interface Analytics {
  overview: {
    total_participants: number;
    present_today: number;
  };
  daily: {
    meals_distributed: number;
    accommodation_occupied: number;
  };
  tracks: {
    workshops: Record<string, number>;
    competitions: Record<string, number>;
  };
}
import { Registration } from '@/entities/Registration';
import { HelpTicket } from '@/entities/HelpTicket';
import { Social } from '@/entities/Social';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRScanner from '@/components/dashboard/QRScanner';
import { QRGenerator, QRPayload } from '@/lib/qr-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { QrCode, Camera, Users, CheckSquare, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { PageLoading } from '@/components/shared/Loading';

export default function CoordinatorDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [showScanner, setShowScanner] = useState<string | boolean>(false);
  const [mealType] = useState('lunch');
  const [workshopSession, setWorkshopSession] = useState('session1');
  const [competitionType, setCompetitionType] = useState('Hackathon');
  const [accommodationAction, setAccommodationAction] = useState('checkin');
  const [roomNumber, setRoomNumber] = useState('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [participants, setParticipants] = useState<RegistrationResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<RegistrationResponse | null>(null);
  const [attendanceList, setAttendanceList] = useState<Array<{id: string; name: string; email: string; present: boolean}>>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicketData[]>([]);

  useEffect(() => {
    loadUserData();
    loadParticipants();
    loadHelpTickets();
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const currentUser = await ClientAuth.me();
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }
      setUser(currentUser);
      
      if (currentUser.id) {
        const qr = await QRGenerator.generateCoordinatorQR({
          id: currentUser.id,
          name: currentUser.full_name,
          email: currentUser.email
        });
        setQrCode(qr);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  const loadParticipants = async () => {
    try {
      const data = await Registration.getAll();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
    }
  };

  const loadHelpTickets = async () => {
    try {
      const data = await HelpTicket.getAll();
      setHelpTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading help tickets:', error);
      setHelpTickets([]);
    }
  };

  const handleQRScan = async (data: QRPayload) => {
    try {
      if (showScanner === 'meal') {
        // Handle meal distribution
        const response = await fetch('/api/meals/distribute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participant_id: data.id, meal_type: mealType })
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(`Meal distributed to ${result.participant.name} (${result.participant.food_preference})`);
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } else if (showScanner === 'workshop') {
        // Handle workshop attendance
        const response = await fetch('/api/workshops/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participant_id: data.id, workshop_session: workshopSession })
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(`${result.participant.name} checked in to ${result.workshop_session} (${result.participant.workshop_track})`);
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } else if (showScanner === 'competition') {
        // Handle competition check-in
        const response = await fetch('/api/competitions/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participant_id: data.id, competition_type: competitionType })
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(`${result.participant.name} checked in to ${result.competition_type}`);
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } else if (showScanner === 'accommodation') {
        // Handle accommodation check-in/out
        const response = await fetch('/api/accommodation/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            participant_id: data.id, 
            action: accommodationAction,
            room_number: accommodationAction === 'checkin' ? roomNumber : undefined
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          const message = accommodationAction === 'checkin' 
            ? `${result.participant.name} checked into Room ${result.room_number}`
            : `${result.participant.name} checked out`;
          alert(message);
          if (accommodationAction === 'checkin') setRoomNumber('');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } else {
        // Handle gate entry
        const team = participants.find((p) => 
          p.members?.some((m) => m.id === data.id)
        );
        
        if (team) {
          setSelectedTeam(team);
          setAttendanceList(
            team.members?.map((m) => ({
              id: m.id ?? m.participant_id ?? '',
              name: m.name ?? m.full_name ?? '',
              email: m.email ?? '',
              present: false
            })) || []
          );
        }
      }
      setShowScanner(false);
    } catch (error) {
      console.error('QR scan error:', error);
    }
  };

  const handleAttendanceUpdate = async () => {
    try {
      const presentMembers = attendanceList.filter((m) => m.present);
      console.log('Marking attendance for:', presentMembers);
      setSelectedTeam(null);
      setAttendanceList([]);
    } catch (error) {
      console.error('Attendance update error:', error);
    }
  };

  const handleTicketUpdate = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    try {
      await HelpTicket.update(ticketId, { status });
      loadHelpTickets();
    } catch (error) {
      console.error('Ticket update error:', error);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    try {
      const socialData = {
        uploaded_by: user.id,
        file_url: URL.createObjectURL(file),
        caption: 'Event photo by coordinator'
      };
      await Social.create(socialData);
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  };

  if (loading) {
    return <PageLoading text="Loading coordinator dashboard..." />;
  }

  if (!user || user.role !== 'coordinator') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/40 border-gray-700 p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400">Coordinator access required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Coordinator Dashboard - <span className="text-green-400">{user.full_name}</span>
            </h1>
            <p className="text-gray-400">
              Manage participants, gate entry, and event coordination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-white text-sm sm:text-base">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                    Coordinator Badge
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {qrCode ? (
                      <Image
                        src={qrCode}
                        alt="Coordinator QR Code"
                        width={128}
                        height={128}
                        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-lg"
                        unoptimized
                        priority
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg flex items-center justify-center mx-auto">
                        <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-green-500/50" />
                      </div>
                    )}
                    <div className="text-center">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-lg sm:text-xl font-bold text-white">
                          {user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-white font-bold text-sm sm:text-base truncate">{user.full_name}</h3>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs sm:text-sm">
                        Coordinator
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="gate" className="w-full">
                {/* Desktop Tabs */}
                <TabsList className="hidden md:grid w-full grid-cols-6 bg-gray-800/40 mb-6 sm:mb-8 h-12 sm:h-16">
                  <TabsTrigger value="gate" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Gate Entry</div>
                      <div className="text-xs opacity-70 hidden sm:block">Attendance</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Participants</div>
                      <div className="text-xs opacity-70 hidden sm:block">Management</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Help Tickets</div>
                      <div className="text-xs opacity-70 hidden sm:block">Support</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="accommodation" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Accommodation</div>
                      <div className="text-xs opacity-70 hidden sm:block">Rooms</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Analytics</div>
                      <div className="text-xs opacity-70 hidden sm:block">Stats</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Social</div>
                      <div className="text-xs opacity-70 hidden sm:block">Photos</div>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                {/* Mobile Tabs - Scrollable */}
                <TabsList className="md:hidden flex w-full bg-gray-800/40 mb-6 h-12 overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="gate" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Gate Entry
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Participants
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Help Tickets
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Social
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gate" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">QR Scanner</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <p className="text-gray-400 text-sm sm:text-base">Scan participant QR codes for gate entry</p>
                          <Button 
                            onClick={() => setShowScanner('gate')}
                            className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Start QR Scanner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">Meal Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <p className="text-gray-400 text-sm sm:text-base">Distribute meals to participants</p>
                          <Button 
                            onClick={() => setShowScanner('meal')}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-sm sm:text-base"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Meal Scanner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">Workshop Attendance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <select 
                            value={workshopSession} 
                            onChange={(e) => setWorkshopSession(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2 text-sm"
                          >
                            <option value="session1">Session 1</option>
                            <option value="session2">Session 2</option>
                            <option value="session3">Session 3</option>
                          </select>
                          <Button 
                            onClick={() => setShowScanner('workshop')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Workshop Scanner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">Manual Entry</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <Label className="text-gray-300 text-sm sm:text-base">Team ID</Label>
                          <Input 
                            placeholder="Enter team ID"
                            className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                          />
                          <Button className="w-full text-sm sm:text-base">
                            <Users className="w-4 h-4 mr-2" />
                            Find Team
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedTeam && (
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">
                          Team Attendance - {selectedTeam.team_id}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300">Select team members present:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const allSelected = attendanceList.every(m => m.present);
                                setAttendanceList(attendanceList.map(m => ({ ...m, present: !allSelected })));
                              }}
                            >
                              Select All
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {attendanceList.map((member, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                                <Checkbox
                                  checked={member.present}
                                  onCheckedChange={(checked) => {
                                    setAttendanceList(attendanceList.map((m, i) => 
                                      i === index ? { ...m, present: !!checked } : m
                                    ));
                                  }}
                                  className="flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm sm:text-base truncate">{member.name}</p>
                                  <p className="text-gray-400 text-xs sm:text-sm truncate">{member.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button onClick={handleAttendanceUpdate} className="w-full">
                            <CheckSquare className="w-4 h-4 mr-2" />
                            Mark Attendance
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="competitions" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-white text-sm sm:text-base">Competition Check-in</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <select 
                          value={competitionType} 
                          onChange={(e) => setCompetitionType(e.target.value)}
                          className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="Hackathon">Hackathon</option>
                          <option value="Pitch">Startup Pitch</option>
                        </select>
                        <Button 
                          onClick={() => setShowScanner('competition')}
                          className="w-full bg-red-600 hover:bg-red-700 text-sm sm:text-base"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Competition Scanner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="accommodation" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-white text-sm sm:text-base">Accommodation Management</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <select 
                          value={accommodationAction} 
                          onChange={(e) => setAccommodationAction(e.target.value)}
                          className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2 text-sm"
                        >
                          <option value="checkin">Check-in</option>
                          <option value="checkout">Check-out</option>
                        </select>
                        {accommodationAction === 'checkin' && (
                          <Input
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="Room Number (e.g., M101, F201)"
                            className="bg-gray-700 border-gray-600 text-white text-sm"
                          />
                        )}
                        <Button 
                          onClick={() => setShowScanner('accommodation')}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Accommodation Scanner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  {analytics && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">{analytics.overview.total_participants}</div>
                            <div className="text-sm text-gray-400">Total Participants</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">{analytics.overview.present_today}</div>
                            <div className="text-sm text-gray-400">Present Today</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-400">{analytics.daily.meals_distributed}</div>
                            <div className="text-sm text-gray-400">Meals Distributed</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">{analytics.daily.accommodation_occupied}</div>
                            <div className="text-sm text-gray-400">Rooms Occupied</div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white text-sm">Workshop Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {Object.entries(analytics.tracks.workshops).map(([track, count]) => (
                              <div key={track} className="flex justify-between py-2">
                                <span className="text-gray-300">{track}</span>
                                <span className="text-white font-medium">{count as number}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white text-sm">Competition Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {Object.entries(analytics.tracks.competitions).map(([track, count]) => (
                              <div key={track} className="flex justify-between py-2">
                                <span className="text-gray-300">{track}</span>
                                <span className="text-white font-medium">{count as number}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="participants" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Registered Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(participants || []).map((participant, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-white font-medium text-sm sm:text-base truncate">{participant.team_id}</h3>
                                <p className="text-gray-400 text-sm sm:text-base truncate">{participant.college}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                  {participant.team_size} members • {participant.ticket_type}
                                </p>
                              </div>
                              <Badge className={`flex-shrink-0 text-xs sm:text-sm ${
                                participant.status === 'confirmed' 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : 'bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {participant.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Help Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(helpTickets || []).map((ticket, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                              <h3 className="text-white font-medium text-sm sm:text-base truncate">{ticket.title}</h3>
                              <Badge className={`flex-shrink-0 text-xs sm:text-sm ${
                                ticket.status === 'resolved' 
                                  ? 'bg-green-500/10 text-green-400'
                                  : ticket.status === 'in_progress'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm mb-3">{ticket.description}</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleTicketUpdate(ticket.id, 'in_progress')}
                                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                              >
                                In Progress
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleTicketUpdate(ticket.id, 'resolved')}
                                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                              >
                                Resolve
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Event Photo Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer text-sm sm:text-base">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Event Photo
                          </Button>
                        </label>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                          Upload official event photos for social
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {showScanner && (
          <QRScanner
            title={
              showScanner === 'meal' ? 'Meal Distribution Scanner' : 
              showScanner === 'workshop' ? 'Workshop Attendance Scanner' : 
              showScanner === 'accommodation' ? 'Accommodation Scanner' :
              'Gate Entry Scanner'
            }
            description={
              showScanner === 'meal' ? 'Scan participant QR codes for meal distribution' : 
              showScanner === 'workshop' ? 'Scan participant QR codes for workshop attendance' : 
              showScanner === 'accommodation' ? 'Scan participant QR codes for accommodation check-in/out' :
              'Scan participant QR codes for gate entry'
            }
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}