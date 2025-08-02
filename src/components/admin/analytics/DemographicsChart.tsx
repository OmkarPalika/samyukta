'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Users, GraduationCap, Building, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DemographicData {
  colleges: { name: string; count: number; percentage: number }[];
  departments: { name: string; count: number; percentage: number }[];
  years: { name: string; count: number; percentage: number }[];
  tracks: { name: string; count: number; percentage: number }[];
  totalUsers: number; // This represents total participants
}

interface DemographicsChartProps {
  data: DemographicData;
  loading?: boolean;
}

const chartConfig = {
  colleges: {
    label: "Colleges/Organizations",
    color: "#3B82F6", // Blue
  },
  departments: {
    label: "Departments/Degrees",
    color: "#10B981", // Green
  },
  years: {
    label: "Roles",
    color: "#8B5CF6", // Purple
  },
  tracks: {
    label: "Tracks",
    color: "#F59E0B", // Amber
  },
} as const;

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export function DemographicsChart({ data, loading }: DemographicsChartProps) {
  const [viewType, setViewType] = useState<'colleges' | 'departments' | 'years' | 'tracks'>('colleges');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Safety check for data
  const safeData = useMemo(() => {
    return {
      colleges: data?.colleges || [],
      departments: data?.departments || [],
      years: data?.years || [],
      tracks: data?.tracks || [],
      totalUsers: Number.isFinite(data?.totalUsers) ? data.totalUsers : 0 // This represents total participants
    };
  }, [data]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'colleges': return <Building className="h-5 w-5 text-blue-400" />;
      case 'departments': return <GraduationCap className="h-5 w-5 text-green-400" />;
      case 'years': return <Users className="h-5 w-5 text-purple-400" />;
      case 'tracks': return <MapPin className="h-5 w-5 text-orange-400" />;
      default: return <Users className="h-5 w-5 text-gray-400" />;
    }
  };

  const getColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  const chartData = useMemo(() => {
    const dataArray = safeData[viewType] || [];
    // Ensure all items have valid count and percentage values
    return dataArray.map((item, index) => ({
      ...item,
      name: item.name || 'Unknown',
      count: Number.isFinite(item.count) && item.count >= 0 ? item.count : 0,
      percentage: Number.isFinite(item.percentage) && item.percentage >= 0 ? item.percentage : 0,
      fill: COLORS[index % COLORS.length],
    })).slice(0, 10); // Limit to top 10 for better visualization
  }, [safeData, viewType]);

  const getCurrentData = () => chartData;

  if (loading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Participant Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-700/30 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const currentData = getCurrentData();

  return (
    <Card className="bg-gray-800/40 border-gray-700">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <span className="flex-shrink-0">{getIcon(viewType)}</span>
            <span className="truncate">Participant Demographics</span>
          </CardTitle>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: 'pie' | 'bar') => setChartType(value)}>
              <SelectTrigger className="w-20 sm:w-24 bg-gray-700 border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={viewType} onValueChange={(value: 'colleges' | 'departments' | 'years' | 'tracks') => setViewType(value)}>
              <SelectTrigger className="w-32 sm:w-40 bg-gray-700 border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="colleges">Colleges</SelectItem>
                <SelectItem value="departments">Departments</SelectItem>
                <SelectItem value="years">Roles</SelectItem>
                <SelectItem value="tracks">Tracks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-400">
          Total Participants: {data.totalUsers} • Showing top {chartData.length} {viewType}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Chart Visualization */}
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72 mx-auto w-full">
              {chartType === 'pie' ? (
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [
                      `${value} participants (${((value / data.totalUsers) * 100).toFixed(1)}%)`,
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
                <ChartLegend content={<ChartLegendContent />} />
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

          {/* Summary Stats */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">Distribution Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400">
                  {currentData.length}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  Total {viewType}
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                  {Number.isFinite(currentData[0]?.count) ? currentData[0].count : 0}
                </div>
                <div className="text-xs text-gray-400">
                  Highest Count
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">
                  {currentData.length > 0 && safeData.totalUsers > 0
                    ? Math.round(safeData.totalUsers / currentData.length)
                    : 0}
                </div>
                <div className="text-xs text-gray-400">
                  Average per {viewType.slice(0, -1)}
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400">
                  {Number.isFinite(currentData[0]?.percentage) ? currentData[0].percentage.toFixed(1) : '0.0'}%
                </div>
                <div className="text-xs text-gray-400">
                  Top Share
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Highlight */}
          <div className="mt-4">
            <h4 className="text-white font-medium mb-3">Top 3 {viewType.charAt(0).toUpperCase() + viewType.slice(1)}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentData.slice(0, 3).map((item, index) => (
                <div key={item.name} className="bg-gray-700/30 rounded-lg p-3 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">#{index + 1}</span>
                    <Badge className={`${getColor(index)} text-white border-0`}>
                      {Number.isFinite(item.percentage) ? item.percentage.toFixed(1) : '0.0'}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 truncate">{item.name}</div>
                  <div className="text-lg font-bold text-white">{Number.isFinite(item.count) ? item.count : 0} participants</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}