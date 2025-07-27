'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

interface RegistrationData {
  date: string;
  teams: number;
  members: number;
  cumulativeTeams: number;
  cumulativeMembers: number;
}

interface RegistrationChartProps {
  data: RegistrationData[];
  loading?: boolean;
}

const chartConfig = {
  teams: {
    label: "Teams",
    color: "#3B82F6", // Blue
  },
  members: {
    label: "Members",
    color: "#10B981", // Green
  },
  cumulativeTeams: {
    label: "Cumulative Teams",
    color: "#8B5CF6", // Purple
  },
  cumulativeMembers: {
    label: "Cumulative Members",
    color: "#F59E0B", // Orange
  },
} as const;

export function RegistrationChart({ data, loading }: RegistrationChartProps) {
  const [viewType, setViewType] = useState<'teams' | 'members' | 'combined' | 'cumulative'>('combined');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    let filteredData = data;
    if (timeRange === '7d') {
      filteredData = data.slice(-7);
    } else if (timeRange === '30d') {
      filteredData = data.slice(-30);
    }

    return filteredData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      teams: item.teams,
      members: item.members,
      cumulativeTeams: item.cumulativeTeams,
      cumulativeMembers: item.cumulativeMembers,
      fullDate: item.date,
    }));
  }, [data, timeRange]);

  const totalTeams = data[data.length - 1]?.cumulativeTeams || 0;
  const totalMembers = data[data.length - 1]?.cumulativeMembers || 0;
  const weeklyMemberGrowth = data.slice(-7).reduce((sum, d) => sum + d.members, 0);

  if (loading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Registration Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-700/30 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/40 border-gray-700">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
            <span className="truncate">Registration Trends</span>
          </CardTitle>
          <div className="flex gap-2">
            <Select value={viewType} onValueChange={(value: 'teams' | 'members' | 'combined' | 'cumulative') => setViewType(value)}>
              <SelectTrigger className="w-full sm:w-36 bg-gray-700 border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="teams">Teams Only</SelectItem>
                <SelectItem value="members">Members Only</SelectItem>
                <SelectItem value="combined">Daily Combined</SelectItem>
                <SelectItem value="cumulative">Cumulative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
              <SelectTrigger className="w-20 sm:w-24 bg-gray-700 border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Teams: {totalTeams.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Members: {totalMembers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{data.length} days tracked</span>
            <span className="sm:hidden">{data.length} days</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">+{weeklyMemberGrowth} members this week</span>
            <span className="sm:hidden">+{weeklyMemberGrowth} weekly</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewType === 'teams' && (
          <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <Bar 
                dataKey="teams" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ChartContainer>
        )}

        {viewType === 'members' && (
          <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <Bar 
                dataKey="members" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ChartContainer>
        )}

        {viewType === 'combined' && (
          <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
                dataKey="teams" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <Bar 
                dataKey="members" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ChartContainer>
        )}
        
        {viewType === 'cumulative' && (
          <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line 
                type="monotone" 
                dataKey="cumulativeTeams" 
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeMembers" 
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )}


      </CardContent>
    </Card>
  );
}