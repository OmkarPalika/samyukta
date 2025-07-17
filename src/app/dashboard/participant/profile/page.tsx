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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Linkedin, Instagram, Globe, QrCode } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageLoading } from '@/components/shared/Loading';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    linkedin: '',
    instagram: '',
    portfolio: ''
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
        setProfileData({
          linkedin: currentUser.linkedin || '',
          instagram: currentUser.instagram || '',
          portfolio: currentUser.portfolio || ''
        });
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    try {
      // Profile update would be handled by API endpoint
      // await User.updateProfile(user.id, profileData);
      setUser({ ...user, ...profileData });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <PageLoading text="Loading profile..." />;
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
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Profile</CardTitle>
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
                  
                  {/* QR Code section moved from dashboard */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-white font-medium mb-4 text-center">Your QR Code</h4>
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-lg flex items-center justify-center mx-auto">
                      <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500/50" />
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm text-center mt-3">
                      Use this QR code for games and networking
                    </p>
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

            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Full Name</Label>
                    <Input 
                      value={user.full_name} 
                      disabled 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">Email</Label>
                    <Input 
                      value={user.email} 
                      disabled 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">College</Label>
                    <Input 
                      value={user.college || 'ANITS'} 
                      disabled 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">Department</Label>
                    <Input 
                      value={user.dept || 'Computer Science'} 
                      disabled 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-sm">Year</Label>
                    <Input 
                      value={user.year || '3rd Year'} 
                      disabled 
                      className="bg-gray-700 border-gray-600 text-white mt-1" 
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent border-gray-600 text-gray-300 hover:text-red-400"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}