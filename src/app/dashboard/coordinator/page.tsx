'use client';

import { useState, useEffect } from 'react';
import { User, UserData } from '@/entities/User';
import { Registration, RegistrationResponse } from '@/entities/Registration';
import { HelpTicket, HelpTicketResponse } from '@/entities/HelpTicket';
import { Gallery } from '@/entities/Gallery';
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

export default function CoordinatorDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [participants, setParticipants] = useState<RegistrationResponse[]>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicketResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<RegistrationResponse | null>(null);
  const [attendanceList, setAttendanceList] = useState<Array<{id: string; name: string; email: string; present: boolean}>>([]);

  useEffect(() => {
    loadUserData();
    loadParticipants();
    loadHelpTickets();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
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
      setParticipants(data);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const loadHelpTickets = async () => {
    try {
      const data = await HelpTicket.getAll();
      setHelpTickets(data);
    } catch (error) {
      console.error('Error loading help tickets:', error);
    }
  };

  const handleGateEntry = async (data: QRPayload) => {
    try {
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
      setShowScanner(false);
    } catch (error) {
      console.error('Gate entry error:', error);
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
      const galleryData = {
        uploaded_by: user.id,
        file_url: URL.createObjectURL(file),
        caption: 'Event photo by coordinator',
        status: 'approved' as const
      };
      await Gallery.create(galleryData);
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
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
        <div className="container-responsive section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">
              Coordinator Dashboard - <span className="text-green-400">{user.full_name}</span>
            </h1>
            <p className="text-gray-400">
              Manage participants, gate entry, and event coordination
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="space-y-6">
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <QrCode className="w-5 h-5 mr-2 text-green-400" />
                    Coordinator Badge
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    {qrCode ? (
                      <Image
                        src={qrCode}
                        alt="Coordinator QR Code"
                        width={128}
                        height={128}
                        className="w-32 h-32 mx-auto rounded-lg"
                        unoptimized
                        priority
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mx-auto">
                        <QrCode className="w-24 h-24 text-green-500/50" />
                      </div>
                    )}
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-xl font-bold text-white">
                          {user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-white font-bold">{user.full_name}</h3>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        Coordinator
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="gate" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800/40 mb-8 h-16">
                  <TabsTrigger value="gate" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold">Gate Entry</div>
                      <div className="text-xs opacity-70">Attendance</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold">Participants</div>
                      <div className="text-xs opacity-70">Management</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold">Help Tickets</div>
                      <div className="text-xs opacity-70">Support</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold">Gallery</div>
                      <div className="text-xs opacity-70">Photos</div>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gate" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">QR Scanner</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-400">Scan participant QR codes for gate entry</p>
                          <Button 
                            onClick={() => setShowScanner(true)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Start QR Scanner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Manual Entry</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Label className="text-gray-300">Team ID</Label>
                          <Input 
                            placeholder="Enter team ID"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button className="w-full">
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
                              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                <Checkbox
                                  checked={member.present}
                                  onCheckedChange={(checked) => {
                                    setAttendanceList(attendanceList.map((m, i) => 
                                      i === index ? { ...m, present: !!checked } : m
                                    ));
                                  }}
                                />
                                <div className="flex-1">
                                  <p className="text-white font-medium">{member.name}</p>
                                  <p className="text-gray-400 text-sm">{member.email}</p>
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

                <TabsContent value="participants" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Registered Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {participants.map((participant, index) => (
                          <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-white font-medium">{participant.team_id}</h3>
                                <p className="text-gray-400">{participant.college}</p>
                                <p className="text-gray-400 text-sm">
                                  {participant.team_size} members • {participant.ticket_type}
                                </p>
                              </div>
                              <Badge className={`${
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
                        {helpTickets.map((ticket, index) => (
                          <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white font-medium">{ticket.title}</h3>
                              <Badge className={`${
                                ticket.status === 'resolved' 
                                  ? 'bg-green-500/10 text-green-400'
                                  : ticket.status === 'in_progress'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{ticket.description}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleTicketUpdate(ticket.id, 'in_progress')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                In Progress
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleTicketUpdate(ticket.id, 'resolved')}
                                className="bg-green-600 hover:bg-green-700"
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

                <TabsContent value="gallery" className="space-y-6">
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
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Event Photo
                          </Button>
                        </label>
                        <p className="text-gray-400 text-sm mt-2">
                          Upload official event photos for the gallery
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
            title="Gate Entry Scanner"
            description="Scan participant QR codes for gate entry"
            onScan={handleGateEntry}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}