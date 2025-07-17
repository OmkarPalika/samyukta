'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { Game } from '@/entities/Game';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRScanner from '@/components/dashboard/QRScanner';
import { QRPayload } from '@/lib/qr-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Trophy, Camera, Target, Users } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function GamesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState({ qrQuest: 0, imposterSuspects: 0 });

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

  if (loading) {
    return <PageLoading text="Loading games..." />;
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
            <QrCode className="w-5 h-5 mr-2 text-green-400" />
            <h2 className="text-xl font-bold text-white">Interactive Games</h2>
          </div>

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

          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 w-full max-w-full mt-6">
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
    </DashboardLayout>
  );
}