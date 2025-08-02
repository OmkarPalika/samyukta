'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/entities/User';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Trophy,
  RefreshCw} from 'lucide-react';

// Import analytics components
import { RegistrationChart } from '@/components/admin/analytics/RegistrationChart';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { DemographicsChart } from '@/components/admin/analytics/DemographicsChart';
import { ParticipationChart } from '@/components/admin/analytics/ParticipationChart';
import { TeamSizeAnalysis } from '@/components/admin/analytics/TeamSizeAnalysis';
import { ParticipantInsights } from '@/components/admin/analytics/ParticipantInsights';
import { ExportTools } from '@/components/admin/analytics/ExportTools';

// Chart component types
interface RevenueDataPoint {
  date: string;
  amount: number;
  cumulative: number;
  transactions: number;
  pending: number;
}

interface DemographicDataPoint {
  name: string;
  count: number;
  percentage: number;
}

interface DemographicsData {
  colleges: DemographicDataPoint[];
  departments: DemographicDataPoint[];
  years: DemographicDataPoint[];
  tracks: DemographicDataPoint[];
  totalUsers: number;
}

interface ParticipationData {
  workshops: {
    cloud: { 
      teams: { registered: number; attended: number };
      members: { registered: number; attended: number };
      completion_rate: number;
    };
    ai: { 
      teams: { registered: number; attended: number };
      members: { registered: number; attended: number };
      completion_rate: number;
    };
  };
  competitions: {
    hackathon: { 
      teams: { registered: number; submitted: number };
      members: { registered: number; submitted: number };
      submission_rate: number;
    };
    pitch: { 
      teams: { registered: number; submitted: number };
      members: { registered: number; submitted: number };
      submission_rate: number;
    };
  };
  overall: {
    teams: {
      total_teams: number;
      workshop_teams: number;
      competition_teams: number;
      combo_teams: number;
    };
    members: {
      total_members: number;
      workshop_members: number;
      competition_members: number;
      combo_members: number;
    };
  };
}

interface AnalyticsData {
  registrationTrends: {
    data: Array<{ 
      date: string; 
      teams: number; 
      members: number;
      cumulativeTeams: number;
      cumulativeMembers: number;
    }>;
    totalTeams: number;
    totalMembers: number;
    teamGrowth: number;
    memberGrowth: number;
  };
  revenueData: {
    data: RevenueDataPoint[];
    total: number;
    confirmed: number;
    pending: number;
    growth: number;
    totalRevenue: number;
    pendingRevenue: number;
  };
  demographics: DemographicsData;
  participation: ParticipationData;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [teamAnalysisData, setTeamAnalysisData] = useState<{
    teamSizeDistribution: Array<{
      _id: number;
      count: number;
      total_members: number;
      total_revenue: number;
      workshop_teams: number;
      competition_teams: number;
      combo_teams: number;
    }>;
    ticketTypeAnalysis: Array<{
      workshop_track: string;
      competition_track: string;
      teams: number;
      revenue: number;
      team_sizes: Record<string, number>;
    }>;
    summary: {
      totalTeams: number;
      totalMembers: number;
      avgTeamSize: number;
      totalRevenue: number;
      revenuePerTeam: number;
      revenuePerMember: number;
    };
  } | null>(null);
  const [teamAnalysisLoading, setTeamAnalysisLoading] = useState(false);
  const [participantInsightsData, setParticipantInsightsData] = useState<{
    foodPreferences: Array<{ name: string; count: number; percentage: number }>;
    accommodationPreferences: Array<{ name: string; count: number; percentage: number }>;
    accommodationByGender: Array<{ name: string; count: number; percentage: number }>;
    genderDistribution: Array<{ name: string; count: number; percentage: number }>;
    teamLeadOrganizations: Array<{ name: string; count: number; percentage: number }>;
    organizationTypes: Array<{ name: string; count: number; percentage: number }>;
    roleDistribution: Array<{ name: string; count: number; percentage: number }>;
    totalParticipants: number;
    accommodationStats: {
      totalRequested: number;
      maleRequested: number;
      femaleRequested: number;
      otherRequested: number;
    };
  } | null>(null);
  const [participantInsightsLoading, setParticipantInsightsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('7d');
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    }
  }, [router]);

  const loadAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?type=overview&range=${dateRange}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  } , [dateRange]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);


  const loadTeamAnalysisData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    setTeamAnalysisLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?type=team-size-analysis`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team analysis data');
      }

      const data = await response.json();
      setTeamAnalysisData(data);
    } catch (error) {
      console.error('Error loading team analysis data:', error);
      toast.error('Failed to load team analysis data');
    } finally {
      setTeamAnalysisLoading(false);
    }
  }, [currentUser]);

  const loadParticipantInsightsData = useCallback(async () => {
    if (!currentUser) return;
    
    setParticipantInsightsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics?type=participant-insights', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load participant insights data');
      }
      
      const data = await response.json();
      setParticipantInsightsData(data);
    } catch (error) {
      console.error('Error loading participant insights data:', error);
      toast.error('Failed to load participant insights data');
    } finally {
      setParticipantInsightsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadAnalyticsData();
      loadTeamAnalysisData();
      loadParticipantInsightsData();
    }
  }, [currentUser, dateRange, loadAnalyticsData, loadTeamAnalysisData, loadParticipantInsightsData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadAnalyticsData(), loadTeamAnalysisData(), loadParticipantInsightsData()]);
    setRefreshing(false);
    toast.success('Analytics data refreshed');
  };

  const handleExport = async (type: string, format: string, filters: { dateRange: string; includeFields: Record<string, boolean> }) => {
    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `samyukta_${type}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  if (loading && !analyticsData) {
    return (
      <AdminLayout 
        title="Analytics Dashboard"
        subtitle="View detailed analytics and insights"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Analytics & Reports"
      subtitle="Comprehensive insights and data analysis for Samyukta 2025"
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <div className="h-full overflow-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header - Mobile First */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-400 flex-shrink-0" />
                <span className="truncate">Analytics & Reports</span>
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                Comprehensive insights and data analysis for Samyukta 2025
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Select value={dateRange} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setDateRange(value)}>
                <SelectTrigger className="w-full sm:w-36 lg:w-40 bg-gray-700 border-gray-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="bg-gray-800/40 border-gray-700">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Total Members</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                    {analyticsData?.registrationTrends?.data?.slice(-1)[0]?.cumulativeMembers || 0}
                  </p>
                  <p className="text-green-400 text-xs">
                    +{analyticsData?.registrationTrends?.data?.slice(-7).reduce((sum: number, d: { members: number }) => sum + d.members, 0) || 0} this week
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Total Revenue</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                    ₹{(analyticsData?.revenueData?.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-green-400 text-xs">
                    ₹{(analyticsData?.revenueData?.pendingRevenue || 0).toLocaleString()} pending
                  </p>
                </div>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Total Participants</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                    {analyticsData?.demographics?.totalUsers || 0}
                  </p>
                  <p className="text-blue-400 text-xs">
                    {analyticsData?.demographics?.colleges?.length || 0} colleges
                  </p>
                </div>
                <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Event Participation</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                    {analyticsData?.participation?.overall?.members?.total_members || 0}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{analyticsData?.participation?.overall?.teams?.total_teams || 0} teams</span>
                    <span>•</span>
                    <span className="text-yellow-400">{analyticsData?.participation?.overall?.members?.combo_members || 0} combo</span>
                  </div>
                </div>
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs - Mobile First */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-max grid-cols-6 bg-gray-800/40 mb-4 sm:mb-6 h-auto">
              <TabsTrigger 
                value="overview" 
                className="text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="registrations" 
                className="text-gray-400 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Registrations
              </TabsTrigger>
              <TabsTrigger 
                value="revenue" 
                className="text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="demographics" 
                className="text-gray-400 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Demographics
              </TabsTrigger>
              <TabsTrigger 
                value="team-analysis" 
                className="text-gray-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Teams
              </TabsTrigger>
              <TabsTrigger 
                value="participant-insights" 
                className="text-gray-400 data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Insights
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="text-gray-400 data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs px-2 py-2 whitespace-nowrap"
              >
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <RegistrationChart 
                data={analyticsData?.registrationTrends?.data || []} 
                loading={loading}
              />
              <RevenueChart 
                data={analyticsData?.revenueData?.data || []}
                totalRevenue={analyticsData?.revenueData?.totalRevenue || 0}
                pendingRevenue={analyticsData?.revenueData?.pendingRevenue || 0}
                loading={loading}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <DemographicsChart 
                data={analyticsData?.demographics || { colleges: [], departments: [], years: [], tracks: [], totalUsers: 0 }}
                loading={loading}
              />
              <ParticipationChart 
                data={analyticsData?.participation || { 
                  workshops: { 
                    cloud: { teams: { registered: 0, attended: 0 }, members: { registered: 0, attended: 0 }, completion_rate: 0 }, 
                    ai: { teams: { registered: 0, attended: 0 }, members: { registered: 0, attended: 0 }, completion_rate: 0 } 
                  },
                  competitions: { 
                    hackathon: { teams: { registered: 0, submitted: 0 }, members: { registered: 0, submitted: 0 }, submission_rate: 0 }, 
                    pitch: { teams: { registered: 0, submitted: 0 }, members: { registered: 0, submitted: 0 }, submission_rate: 0 } 
                  },
                  overall: { 
                    teams: { total_teams: 0, workshop_teams: 0, competition_teams: 0, combo_teams: 0 },
                    members: { total_members: 0, workshop_members: 0, competition_members: 0, combo_members: 0 }
                  }
                }}
                loading={loading}
              />
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4 sm:space-y-6">
            <RegistrationChart 
              data={analyticsData?.registrationTrends?.data || []} 
              loading={loading}
            />
            <ParticipationChart 
              data={(analyticsData?.participation as ParticipationData) || { 
                workshops: { cloud: { registered: 0, attended: 0, completion_rate: 0 }, ai: { registered: 0, attended: 0, completion_rate: 0 } },
                competitions: { hackathon: { registered: 0, active: 0, submitted: 0 }, pitch: { registered: 0, active: 0, submitted: 0 } },
                overall: { total_participants: 0, workshop_participants: 0, competition_participants: 0, combo_participants: 0 }
              }}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4 sm:space-y-6">
            <RevenueChart 
              data={(analyticsData?.revenueData?.data as RevenueDataPoint[]) || []}
              totalRevenue={analyticsData?.revenueData?.totalRevenue || 0}
              pendingRevenue={analyticsData?.revenueData?.pendingRevenue || 0}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4 sm:space-y-6">
            <DemographicsChart 
              data={analyticsData?.demographics || { 
                colleges: [], 
                departments: [], 
                years: [], 
                tracks: [], 
                totalUsers: 0 
              }}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="team-analysis" className="space-y-4 sm:space-y-6">
            <TeamSizeAnalysis 
              data={teamAnalysisData || {
                teamSizeDistribution: [],
                ticketTypeAnalysis: [],
                summary: {
                  totalTeams: 0,
                  totalMembers: 0,
                  avgTeamSize: 0,
                  totalRevenue: 0,
                  revenuePerTeam: 0,
                  revenuePerMember: 0
                }
              }}
              loading={teamAnalysisLoading}
            />
          </TabsContent>

          <TabsContent value="participant-insights" className="space-y-4 sm:space-y-6">
            <ParticipantInsights 
              data={participantInsightsData || {
                foodPreferences: [],
                accommodationPreferences: [],
                accommodationByGender: [],
                genderDistribution: [],
                teamLeadOrganizations: [],
                organizationTypes: [],
                roleDistribution: [],
                totalParticipants: 0,
                accommodationStats: {
                  totalRequested: 0,
                  maleRequested: 0,
                  femaleRequested: 0,
                  otherRequested: 0
                }
              }}
              loading={participantInsightsLoading}
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-4 sm:space-y-6">
            <ExportTools onExport={handleExport} />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}