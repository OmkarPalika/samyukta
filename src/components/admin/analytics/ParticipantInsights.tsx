'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Utensils, Home, UserCheck, Building2, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface InsightData {
  name: string;
  count: number;
  percentage: number;
}

interface ParticipantInsightsData {
  foodPreferences: InsightData[];
  accommodationPreferences: InsightData[];
  accommodationByGender: InsightData[];
  genderDistribution: InsightData[];
  teamLeadOrganizations: InsightData[];
  organizationTypes: InsightData[];
  roleDistribution: InsightData[];
  totalParticipants: number;
  accommodationStats: {
    totalRequested: number;
    maleRequested: number;
    femaleRequested: number;
    otherRequested: number;
  };
}

interface ParticipantInsightsProps {
  data: ParticipantInsightsData;
  loading?: boolean;
}

const chartConfig = {
  food: {
    label: "Food Preferences",
    color: "#10B981", // Green
  },
  accommodation: {
    label: "Accommodation",
    color: "#3B82F6", // Blue
  },
  gender: {
    label: "Gender Distribution",
    color: "#8B5CF6", // Purple
  },
  organization: {
    label: "Organization Types",
    color: "#F59E0B", // Amber
  },
  role: {
    label: "Role Distribution",
    color: "#EF4444", // Red
  },
} as const;

const COLORS = [
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export function ParticipantInsights({ data, loading }: ParticipantInsightsProps) {
  const [viewType, setViewType] = useState<'food' | 'accommodation' | 'accommodation-gender' | 'gender' | 'organization' | 'role'>('food');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const chartData = useMemo(() => {
    let currentData: InsightData[] = [];
    
    switch (viewType) {
      case 'food':
        currentData = data?.foodPreferences || [];
        break;
      case 'accommodation':
        currentData = data?.accommodationPreferences || [];
        break;
      case 'accommodation-gender':
        currentData = data?.accommodationByGender || [];
        break;
      case 'gender':
        currentData = data?.genderDistribution || [];
        break;
      case 'organization':
        currentData = data?.organizationTypes || [];
        break;
      case 'role':
        currentData = data?.roleDistribution || [];
        break;
    }

    return currentData.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));
  }, [data, viewType]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return <Utensils className="h-5 w-5 text-green-400" />;
      case 'accommodation': return <Home className="h-5 w-5 text-blue-400" />;
      case 'accommodation-gender': return <Home className="h-5 w-5 text-cyan-400" />;
      case 'gender': return <Users className="h-5 w-5 text-purple-400" />;
      case 'organization': return <Building2 className="h-5 w-5 text-amber-400" />;
      case 'role': return <Briefcase className="h-5 w-5 text-red-400" />;
      default: return <Users className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'food': return 'Food Preferences';
      case 'accommodation': return 'Accommodation Needs';
      case 'accommodation-gender': return 'Accommodation by Gender';
      case 'gender': return 'Gender Distribution';
      case 'organization': return 'Organization Types';
      case 'role': return 'Role Categories';
      default: return 'Participant Insights';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-400" />
            Participant Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-700/30 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Accommodation Summary Card - Show when viewing accommodation data */}
      {(viewType === 'accommodation' || viewType === 'accommodation-gender') && data.accommodationStats && (
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <Home className="h-5 w-5 text-blue-400" />
              Accommodation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {data.accommodationStats.totalRequested}
                </div>
                <div className="text-xs text-gray-400">
                  Total Requests
                </div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {data.accommodationStats.maleRequested}
                </div>
                <div className="text-xs text-gray-400">
                  Male
                </div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-pink-400">
                  {data.accommodationStats.femaleRequested}
                </div>
                <div className="text-xs text-gray-400">
                  Female
                </div>
              </div>
              <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {data.accommodationStats.otherRequested}
                </div>
                <div className="text-xs text-gray-400">
                  Other
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Main Chart */}
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <span className="flex-shrink-0">{getIcon(viewType)}</span>
              <span className="truncate">{getTitle(viewType)}</span>
            </CardTitle>
            <div className="flex gap-2">
              <Select value={chartType} onValueChange={(value: 'pie' | 'bar') => setChartType(value)}>
                <SelectTrigger className="w-16 sm:w-20 bg-gray-700 border-gray-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewType} onValueChange={(value: 'food' | 'accommodation' | 'accommodation-gender' | 'gender' | 'organization' | 'role') => setViewType(value)}>
                <SelectTrigger className="w-32 sm:w-40 bg-gray-700 border-gray-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="accommodation-gender">Accom. by Gender</SelectItem>
                  <SelectItem value="gender">Gender</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-400">
            Total Participants: {data.totalParticipants} • Showing {chartData.length} categories
            {viewType === 'accommodation-gender' && data.accommodationStats && (
              <span className="ml-2">• Total Accommodation Requests: {data.accommodationStats.totalRequested}</span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72 mx-auto w-full">
              {chartType === 'pie' ? (
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [
                      `${value} participants (${((value / data.totalParticipants) * 100).toFixed(1)}%)`,
                      name
                    ]}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    outerRadius="75%"
                    fill="#8884d8"
                    dataKey="count"
                    stroke="#1F2937"
                    strokeWidth={2}
                  >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value} participants`, 'Count']}
                />
                <Bar
                  dataKey="count"
                  className="hover:opacity-80 transition-opacity"
                  radius={[4, 4, 0, 0]}
                  fill="#8884d8"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-white text-base sm:text-lg">Insights Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Top Categories */}
            <div>
              <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Top {getTitle(viewType)}</h4>
              <div className="space-y-2">
                {chartData.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0`} style={{ backgroundColor: item.fill }} />
                      <span className="text-sm text-gray-300 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-medium text-white">{item.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-400">
                  {chartData.length}
                </div>
                <div className="text-xs text-gray-400">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  {chartData[0]?.count || 0}
                </div>
                <div className="text-xs text-gray-400">
                  Most Common
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}