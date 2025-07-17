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
import { Calendar } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function SchedulePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  if (loading) {
    return <PageLoading text="Loading schedule..." />;
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
            <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Event Schedule</h2>
          </div>

          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Day 1 - March 15, 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Opening Ceremony</h4>
                    <Badge className="bg-blue-500/10 text-blue-400">9:00 AM - 10:30 AM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Main Auditorium</p>
                  <p className="text-gray-400 text-xs mt-1">Welcome address and keynote speech</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">AI Workshop</h4>
                    <Badge className="bg-green-500/10 text-green-400">11:00 AM - 1:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Tech Lab 1</p>
                  <p className="text-gray-400 text-xs mt-1">Introduction to machine learning concepts</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Lunch Break</h4>
                    <Badge className="bg-yellow-500/10 text-yellow-400">1:00 PM - 2:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Cafeteria</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Hackathon Kickoff</h4>
                    <Badge className="bg-red-500/10 text-red-400">2:30 PM - 4:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Innovation Hub</p>
                  <p className="text-gray-400 text-xs mt-1">Problem statements and team formation</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Cultural Performance</h4>
                    <Badge className="bg-purple-500/10 text-purple-400">6:00 PM - 8:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Open Air Theater</p>
                  <p className="text-gray-400 text-xs mt-1">Music and dance performances</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Day 2 - March 16, 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Hackathon Continues</h4>
                    <Badge className="bg-blue-500/10 text-blue-400">9:00 AM - 12:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Innovation Hub</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Cloud Computing Workshop</h4>
                    <Badge className="bg-green-500/10 text-green-400">10:00 AM - 12:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Tech Lab 2</p>
                  <p className="text-gray-400 text-xs mt-1">AWS and Azure fundamentals</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Lunch Break</h4>
                    <Badge className="bg-yellow-500/10 text-yellow-400">12:00 PM - 1:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Cafeteria</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Startup Pitch Competition</h4>
                    <Badge className="bg-red-500/10 text-red-400">2:00 PM - 4:30 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Main Auditorium</p>
                  <p className="text-gray-400 text-xs mt-1">Innovative startup ideas presentation</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Award Ceremony</h4>
                    <Badge className="bg-purple-500/10 text-purple-400">5:30 PM - 7:00 PM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Main Auditorium</p>
                  <p className="text-gray-400 text-xs mt-1">Prizes and closing remarks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">My Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">Your personalized schedule based on registrations:</p>

                <div className="p-3 bg-gray-700/30 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">AI Workshop</h4>
                    <Badge className="bg-green-500/10 text-green-400">Day 1, 11:00 AM</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Tech Lab 1</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">Hackathon</h4>
                    <Badge className="bg-red-500/10 text-red-400">Day 1-2</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Innovation Hub</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent border-gray-600 text-gray-300 hover:text-blue-400"
                  onClick={() => router.push('/events')}
                >
                  View Full Event Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}