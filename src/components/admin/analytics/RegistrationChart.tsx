'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ComposedChart } from 'recharts';

interface RegistrationData {
  date: string;
  count: number;
  cumulative: number;
}

interface RegistrationChartProps {
  data: RegistrationData[];
  loading?: boolean;
}

const chartConfig = {
  daily: {
    label: "Daily Registrations",
    color: "#3B82F6", // Blue
  },
  cumulative: {
    label: "Cumulative Total",
    color: "#10B981", // Green
  },
} as const;

export function RegistrationChart({ data, loading }: RegistrationChartProps) {
  const [viewType, setViewType] = useState<'daily' | 'cumulative' | 'combined'>('combined');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

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
      daily: item.count,
      cumulative: item.cumulative,
      fullDate: item.date,
    }));
  }, [data, timeRange]);

  const totalRegistrations = data[data.length - 1]?.cumulative || 0;
  const weeklyGrowth = data.slice(-7).reduce((sum, d) => sum + d.count, 0);

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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Registration Trends
          </CardTitle>
          <div className="flex gap-2">
            <Select value={viewType} onValueChange={(value: 'daily' | 'cumulative' | 'combined') => setViewType(value)}>
              <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="cumulative">Cumulative</SelectItem>
                <SelectItem value="combined">Combined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
              <SelectTrigger className="w-24 bg-gray-700 border-gray-600 text-white">
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
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Total: {totalRegistrations.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {data.length} days tracked
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            +{weeklyGrowth} this week
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewType === 'daily' && (
          <ChartContainer config={chartConfig} className="h-80">
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
                dataKey="daily" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ChartContainer>
        )}
        
        {viewType === 'cumulative' && (
          <ChartContainer config={chartConfig} className="h-80">
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
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )}

        {viewType === 'combined' && (
          <ChartContainer config={chartConfig} className="h-80">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
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
                yAxisId="left"
                dataKey="daily" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}