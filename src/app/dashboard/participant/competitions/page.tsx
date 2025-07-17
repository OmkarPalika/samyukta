'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { Competition } from '@/entities/Competition';
import { User as UserType, Competition as CompetitionData, UserCompetitionData } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Plus, Upload } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function CompetitionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
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

  const availableCompetitions = useMemo(() => 
    competitions.filter(comp => 
      !userCompetitions.some(uc => uc.competition.id === comp.id)
    ), 
    [competitions, userCompetitions]
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
        loadCompetitions(currentUser.id);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  const loadCompetitions = async (userId: string) => {
    try {
      const [allCompetitions, userComps] = await Promise.all([
        Competition.getAll(),
        Competition.getUserCompetitions(userId)
      ]);
      setCompetitions(allCompetitions.filter(c => c.status === 'open'));
      setUserCompetitions(userComps);
    } catch (error) {
      console.error('Failed to load competitions:', error);
    }
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
        loadCompetitions(user.id);
      }, 2000);
    } catch (error) {
      setJoinMessage('Failed to join competition. Please try again.');
      console.error('Failed to join competition:', error);
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return <PageLoading text="Loading competitions..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center lg:hidden">
              <Trophy className="w-5 h-5 mr-2 text-orange-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Competitions</h2>
            </div>
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
        </div>
      </div>
    </DashboardLayout>
  );
}