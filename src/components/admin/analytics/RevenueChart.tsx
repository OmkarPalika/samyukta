'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { DollarSign, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Bar, ComposedChart } from 'recharts';

interface RevenueData {
  date: string;
  amount: number;
  cumulative: number;
  transactions: number;
  pending: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  totalRevenue: number;
  pendingRevenue: number;
  loading?: boolean;
}

const chartConfig = {
  daily: {
    label: "Daily Revenue",
    color: "#10B981", // Green
  },
  cumulative: {
    label: "Cumulative Revenue",
    color: "#8B5CF6", // Purple
  },
  pending: {
    label: "Pending Revenue",
    color: "#F59E0B", // Amber
  },
  confirmed: {
    label: "Confirmed Revenue",
    color: "#10B981", // Green
  },
} as const;

export function RevenueChart({ data, totalRevenue, pendingRevenue, loading }: RevenueChartProps) {
  const [viewType, setViewType] = useState<'daily' | 'cumulative' | 'breakdown'>('breakdown');

  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      daily: item.amount,
      cumulative: item.cumulative,
      pending: item.pending || 0,
      confirmed: item.amount - (item.pending || 0),
      transactions: item.transactions,
      fullDate: item.date,
    }));
  }, [data]);

  const totalTransactions = data.reduce((sum, d) => sum + d.transactions, 0);
  const avgTransactionValue = totalRevenue / totalTransactions || 0;

  if (loading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Revenue Analytics
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
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
            <span className="truncate">Revenue Analytics</span>
          </CardTitle>
          <Select value={viewType} onValueChange={(value: 'daily' | 'cumulative' | 'breakdown') => setViewType(value)}>
            <SelectTrigger className="w-full sm:w-36 bg-gray-700 border-gray-600 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="cumulative">Cumulative</SelectItem>
              <SelectItem value="breakdown">Breakdown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Revenue Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
          <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">Total Revenue</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-white">₹{totalRevenue.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">Pending</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-white">₹{pendingRevenue.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">Transactions</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-white">{totalTransactions}</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">Avg. Value</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-white">₹{Math.round(avgTransactionValue)}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewType === 'daily' && (
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72 w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="daily" 
                stroke="#10B981"
                fill="url(#dailyGradient)"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#ffffff" }}
              />
            </AreaChart>
          </ChartContainer>
          </div>
        )}
        
        {viewType === 'cumulative' && (
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72 w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#8B5CF6"
                fill="url(#cumulativeGradient)"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2, fill: "#ffffff" }}
              />
            </AreaChart>
          </ChartContainer>
          </div>
        )}

        {viewType === 'breakdown' && (
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 md:h-64 lg:h-72 w-full">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString()}`, 
                  name === 'confirmed' ? 'Confirmed' : name === 'pending' ? 'Pending' : name
                ]}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
                dataKey="confirmed" 
                stackId="revenue"
                fill="#10B981"
                radius={[0, 0, 4, 4]}
                className="hover:opacity-80 transition-opacity"
              />
              <Bar 
                dataKey="pending" 
                stackId="revenue"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </ComposedChart>
          </ChartContainer>
          </div>
        )}

        {/* Payment Status Breakdown */}
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
          <h4 className="text-white font-medium mb-3">Payment Status Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Confirmed: ₹{(totalRevenue - pendingRevenue).toLocaleString()}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Pending: ₹{pendingRevenue.toLocaleString()}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Success Rate: {Math.round(((totalRevenue - pendingRevenue) / totalRevenue) * 100)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}