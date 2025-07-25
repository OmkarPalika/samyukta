'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/entities/User';
import { Registration } from '@/entities/Registration';
import { Game } from '@/entities/Game';
import { HelpTicket } from '@/entities/HelpTicket';
import { Social } from '@/entities/Social';
import { User as UserType, RegistrationResponse, HelpTicketResponse, SocialResponse, GameStats } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { QRGenerator } from '@/lib/qr-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Users, Trophy, HelpCircle, Camera, Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { PageLoading } from '@/components/shared/Loading';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({ totalScans: 0, activePlayers: 0, totalSuspects: 0 });
  const [helpTickets, setHelpTickets] = useState<HelpTicketResponse[]>([]);
  const [socialItems, setSocialItems] = useState<SocialResponse[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    totalTickets: 0,
    totalPhotos: 0
  });

  useEffect(() => {
    loadUserData();
    loadAllData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.id) {
        const qr = await QRGenerator.generateAdminQR({
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

  const loadAllData = async () => {
    try {
      const [usersData, registrationsData, ticketsData, socialData] = await Promise.all([
        User.getAll().catch(() => []),
        Registration.getAll().catch(() => []),
        HelpTicket.getAll().catch(() => []),
        Social.getAll().catch(() => [])
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
      setHelpTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setSocialItems(Array.isArray(socialData) ? socialData : []);

      setStats({
        totalUsers: usersData.length,
        totalRegistrations: registrationsData.length,
        totalTickets: ticketsData.length,
        totalPhotos: socialData.length
      });

      // Load game statistics
      const gameStatsData = await Game.getStats();
      setGameStats(gameStatsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await User.updateRole(userId, newRole);
      loadAllData();
    } catch (error) {
      console.error('Role update error:', error);
    }
  };

  const handlePasswordReset = async (userId: string) => {
    try {
      await User.resetPassword(userId);
      alert('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  const handleSocialModeration = async (itemId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, action })
      });
      if (response.ok) loadAllData();
    } catch (error) {
      console.error('Social moderation error:', error);
    }
  };

  if (loading) {
    return <PageLoading text="Loading admin dashboard..." />;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/40 border-gray-700 p-8">
          <CardContent className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400">Administrator access required.</p>
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
              Admin Dashboard - <span className="text-red-400">{user.full_name}</span>
            </h1>
            <p className="text-gray-400">
              Complete system administration and analytics
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <Card className="bg-gray-800/40 border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Users</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Registrations</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalRegistrations}</p>
                  </div>
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Help Tickets</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalTickets}</p>
                  </div>
                  <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Social Photos</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalPhotos}</p>
                  </div>
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-white text-sm sm:text-base">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-400" />
                    Admin Badge
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {qrCode ? (
                      <Image
                        src={qrCode}
                        alt="Admin QR Code"
                        width={128}
                        height={128}
                        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg flex items-center justify-center mx-auto">
                        <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-red-500/50" />
                      </div>
                    )}
                    <div className="text-center">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2">
                        <AvatarFallback className="bg-gradient-to-r from-red-500 to-pink-500 text-lg sm:text-xl font-bold text-white">
                          {user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-white font-bold text-sm sm:text-base truncate">{user.full_name}</h3>
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs sm:text-sm">
                        Administrator
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="users" className="w-full">
                {/* Desktop Tabs */}
                <TabsList className="hidden md:grid w-full grid-cols-5 bg-gray-800/40 mb-6 sm:mb-8 h-12 sm:h-16">
                  <TabsTrigger value="users" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Users</div>
                      <div className="text-xs opacity-70 hidden sm:block">Management</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="registrations" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Registrations</div>
                      <div className="text-xs opacity-70 hidden sm:block">Control</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Games</div>
                      <div className="text-xs opacity-70 hidden sm:block">Analytics</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Tickets</div>
                      <div className="text-xs opacity-70 hidden sm:block">Support</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white h-full">
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">Social</div>
                      <div className="text-xs opacity-70 hidden sm:block">Moderation</div>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                {/* Mobile Tabs - Scrollable */}
                <TabsList className="md:hidden flex w-full bg-gray-800/40 mb-6 h-12 overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="users" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="registrations" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Registrations
                  </TabsTrigger>
                  <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Games
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Tickets
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex-shrink-0 px-4 text-sm">
                    Social
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">User Management</CardTitle>
                        <Button
                          onClick={() => window.location.href = '/dashboard/admin/user-management'}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Advanced Management
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.map((userData, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm sm:text-base">
                                    {userData.full_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-white font-medium text-sm sm:text-base truncate">{userData.full_name}</h3>
                                  <p className="text-gray-400 text-xs sm:text-sm truncate">{userData.email}</p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
                                <Select
                                  value={userData.role || 'participant'}
                                  onValueChange={(value) => handleRoleChange(userData.id, value)}
                                >
                                  <SelectTrigger className="w-full sm:w-32 bg-gray-700 border-gray-600 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="participant">Participant</SelectItem>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePasswordReset(userData.id)}
                                  className="text-xs sm:text-sm whitespace-nowrap"
                                >
                                  Reset Password
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="registrations" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Registration Control</CardTitle>
                        <Button
                          onClick={() => router.push('/dashboard/admin/registration-management')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Manage Registrations
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {registrations.map((registration, index) => (
                          <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-white font-medium">{registration.team_id}</h3>
                                <p className="text-gray-400">{registration.college}</p>
                                <p className="text-gray-400 text-sm">
                                  {registration.team_size} members • ₹{registration.total_amount}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={`${
                                  registration.status === 'confirmed' 
                                    ? 'bg-green-500/10 text-green-400' 
                                    : registration.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {registration.status}
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="games" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">QR Quest Leaderboard</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-2 sm:space-y-3">
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
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                      <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-white text-sm sm:text-base">Game Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm sm:text-base">Total QR Scans:</span>
                            <span className="text-white text-sm sm:text-base">{gameStats.totalScans || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm sm:text-base">Active Players:</span>
                            <span className="text-white text-sm sm:text-base">{gameStats.activePlayers || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm sm:text-base">Imposter Suspects:</span>
                            <span className="text-white text-sm sm:text-base">{gameStats.totalSuspects || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">All Help Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {helpTickets.map((ticket, index) => (
                          <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-white font-medium">{ticket.title}</h3>
                                <p className="text-gray-400 text-sm">by {ticket.submitted_by}</p>
                              </div>
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
                            <p className="text-gray-400 text-sm">{ticket.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Social Moderation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {socialItems.map((item, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                            <div className="aspect-square bg-gray-600 rounded mb-2 flex items-center justify-center">
                              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            </div>
                            <p className="text-white text-xs sm:text-sm font-medium truncate">{item.caption}</p>
                            <p className="text-gray-400 text-xs truncate">by {item.uploaded_by}</p>
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleSocialModeration(item.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 flex-1 text-xs"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSocialModeration(item.id, 'reject')}
                                variant="outline"
                                className="flex-1 text-xs"
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}