'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, DollarSign, Target, TrendingUp } from 'lucide-react';

interface TeamSizeStats {
  _id: number;
  count: number;
  total_members: number;
  total_revenue: number;
  workshop_teams: number;
  competition_teams: number;
  combo_teams: number;
}

interface TicketTypeAnalysis {
  workshop_track: string;
  competition_track: string;
  teams: number;
  revenue: number;
  team_sizes: Record<string, number>;
}

interface TeamAnalysisSummary {
  totalTeams: number;
  totalMembers: number;
  avgTeamSize: number;
  totalRevenue: number;
  revenuePerTeam: number;
  revenuePerMember: number;
}

interface TeamSizeAnalysisProps {
  data: {
    teamSizeDistribution: TeamSizeStats[];
    ticketTypeAnalysis: TicketTypeAnalysis[];
    summary: TeamAnalysisSummary;
  };
  loading: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10B981", // Green for revenue
  },
  teams: {
    label: "Teams", 
    color: "#3B82F6", // Blue for teams
  },
  members: {
    label: "Members",
    color: "#8B5CF6", // Purple for members
  },
} as const;

export function TeamSizeAnalysis({ data, loading }: TeamSizeAnalysisProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-800/40 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { teamSizeDistribution, ticketTypeAnalysis, summary } = data;

  // Prepare data for charts
  const teamSizeChartData = teamSizeDistribution.map(item => ({
    teamSize: `${item._id} members`,
    teams: item.count,
    members: item.total_members,
    revenue: item.total_revenue,
    avgRevenuePerTeam: item.count > 0 ? Math.round(item.total_revenue / item.count) : 0
  }));

  const ticketTypeChartData = ticketTypeAnalysis.map(item => ({
    name: item.workshop_track === 'None' ? 
      (item.competition_track === 'None' ? 'None' : `Competition: ${item.competition_track}`) :
      (item.competition_track === 'None' ? `Workshop: ${item.workshop_track}` : `Both (${item.workshop_track} + ${item.competition_track})`),
    teams: item.teams,
    revenue: item.revenue,
    avgRevenue: item.teams > 0 ? Math.round(item.revenue / item.teams) : 0
  }));

  const revenueByTeamSizeData = teamSizeDistribution.map(item => ({
    teamSize: item._id,
    totalRevenue: item.total_revenue,
    revenuePerMember: item.total_members > 0 ? Math.round(item.total_revenue / item.total_members) : 0
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Teams</p>
                <p className="text-2xl font-bold text-white">{summary.totalTeams}</p>
                <p className="text-xs text-gray-400">Registered teams</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-white">{summary.totalMembers}</p>
                <p className="text-xs text-gray-400">All participants</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Team Size</p>
                <p className="text-2xl font-bold text-white">{summary.avgTeamSize}</p>
                <p className="text-xs text-gray-400">Members per team</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{summary.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">All registrations</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Team Size Distribution */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Team Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamSizeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="teamSize" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name) => [
                      name === 'teams' ? `${value} teams` :
                      name === 'members' ? `${value} members` :
                      `₹${value.toLocaleString()}`,
                      name === 'teams' ? 'Teams' :
                      name === 'members' ? 'Members' :
                      name === 'revenue' ? 'Revenue' :
                      'Avg Revenue/Team'
                    ]}
                  />
                  <Bar dataKey="teams" fill="#3B82F6" name="teams" />
                  <Bar dataKey="members" fill="#10B981" name="members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Team Size */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue by Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByTeamSizeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="teamSize" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Team Size', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name) => [
                      `₹${value.toLocaleString()}`,
                      name === 'totalRevenue' ? 'Total Revenue' : 'Revenue per Member'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalRevenue" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    name="totalRevenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenuePerMember" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    name="revenuePerMember"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Type Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ticket Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketTypeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="teams"
                  >
                    {ticketTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value) => [
                      `${value} teams`,
                      'Teams'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue by Ticket Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={ticketTypeChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  type="number" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#9CA3AF" 
                  fontSize={10}
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : `${value} teams`,
                    name === 'revenue' ? 'Revenue' : 'Teams'
                  ]}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-revenue)"
                  radius={[0, 4, 4, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Detailed Team Size Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3">Team Size</th>
                  <th className="px-6 py-3">Teams</th>
                  <th className="px-6 py-3">Total Members</th>
                  <th className="px-6 py-3">Revenue</th>
                  <th className="px-6 py-3">Revenue/Team</th>
                  <th className="px-6 py-3">Revenue/Member</th>
                  <th className="px-6 py-3">Workshop Teams</th>
                  <th className="px-6 py-3">Competition Teams</th>
                  <th className="px-6 py-3">Combo Teams</th>
                </tr>
              </thead>
              <tbody>
                {teamSizeDistribution.map((item) => (
                  <tr key={item._id} className="bg-gray-800/20 border-b border-gray-700">
                    <td className="px-6 py-4 font-medium text-white">{item._id} members</td>
                    <td className="px-6 py-4">{item.count}</td>
                    <td className="px-6 py-4">{item.total_members}</td>
                    <td className="px-6 py-4">₹{item.total_revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{item.count > 0 ? Math.round(item.total_revenue / item.count).toLocaleString() : 0}</td>
                    <td className="px-6 py-4">₹{item.total_members > 0 ? Math.round(item.total_revenue / item.total_members).toLocaleString() : 0}</td>
                    <td className="px-6 py-4">{item.workshop_teams}</td>
                    <td className="px-6 py-4">{item.competition_teams}</td>
                    <td className="px-6 py-4">{item.combo_teams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}