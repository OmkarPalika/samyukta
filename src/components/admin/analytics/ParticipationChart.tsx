'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Trophy, Code, Users, Target } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart } from 'recharts';

interface ParticipationData {
  workshops: {
    cloud: { registered: number; attended: number; completion_rate: number };
    ai: { registered: number; attended: number; completion_rate: number };
  };
  competitions: {
    hackathon: { registered: number; active: number; submitted: number };
    pitch: { registered: number; active: number; submitted: number };
  };
  overall: {
    total_participants: number;
    workshop_participants: number;
    competition_participants: number;
    combo_participants: number;
  };
}

interface ParticipationChartProps {
  data: ParticipationData;
  loading?: boolean;
}

const chartConfig = {
  workshops: {
    label: "Workshops",
    color: "#10B981", // Green
  },
  competitions: {
    label: "Competitions", 
    color: "#F59E0B", // Amber
  },
  combo: {
    label: "Combo Participants",
    color: "#8B5CF6", // Purple
  },
} as const;

const COLORS = [
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#EF4444', // Red
];

export function ParticipationChart({ data, loading }: ParticipationChartProps) {
  const [viewType, setViewType] = useState<'workshops' | 'competitions' | 'overview'>('overview');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const chartData = useMemo(() => {
    const overviewData = [
      {
        name: 'Workshop Only',
        value: data.overall.workshop_participants,
        fill: COLORS[0],
        percentage: Math.round((data.overall.workshop_participants / data.overall.total_participants) * 100)
      },
      {
        name: 'Competition Only', 
        value: data.overall.competition_participants,
        fill: COLORS[1],
        percentage: Math.round((data.overall.competition_participants / data.overall.total_participants) * 100)
      },
      {
        name: 'Combo (Both)',
        value: data.overall.combo_participants,
        fill: COLORS[2],
        percentage: Math.round((data.overall.combo_participants / data.overall.total_participants) * 100)
      }
    ];

    const workshopChartData = [
      {
        name: 'Cloud Computing',
        registered: data.workshops.cloud.registered,
        attended: data.workshops.cloud.attended,
        completion_rate: data.workshops.cloud.completion_rate,
        noShows: data.workshops.cloud.registered - data.workshops.cloud.attended,
      },
      {
        name: 'AI/ML',
        registered: data.workshops.ai.registered,
        attended: data.workshops.ai.attended,
        completion_rate: data.workshops.ai.completion_rate,
        noShows: data.workshops.ai.registered - data.workshops.ai.attended,
      }
    ];

    const competitionChartData = [
      {
        name: 'Hackathon',
        registered: data.competitions.hackathon.registered,
        active: data.competitions.hackathon.active,
        submitted: data.competitions.hackathon.submitted,
        inactive: data.competitions.hackathon.registered - data.competitions.hackathon.active,
      },
      {
        name: 'Startup Pitch',
        registered: data.competitions.pitch.registered,
        active: data.competitions.pitch.active,
        submitted: data.competitions.pitch.submitted,
        inactive: data.competitions.pitch.registered - data.competitions.pitch.active,
      }
    ];

    return { overviewData, workshopChartData, competitionChartData };
  }, [data]);

  if (loading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Event Participation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-700/30 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const workshopData = [
    {
      name: 'Cloud Computing (AWS)',
      registered: data.workshops.cloud.registered,
      attended: data.workshops.cloud.attended,
      completion_rate: data.workshops.cloud.completion_rate,
      icon: '☁️'
    },
    {
      name: 'AI/ML (Google)',
      registered: data.workshops.ai.registered,
      attended: data.workshops.ai.attended,
      completion_rate: data.workshops.ai.completion_rate,
      icon: '🤖'
    }
  ];

  const competitionData = [
    {
      name: 'Hackathon',
      registered: data.competitions.hackathon.registered,
      active: data.competitions.hackathon.active,
      submitted: data.competitions.hackathon.submitted,
      icon: '💻'
    },
    {
      name: 'Startup Pitch',
      registered: data.competitions.pitch.registered,
      active: data.competitions.pitch.active,
      submitted: data.competitions.pitch.submitted,
      icon: '🚀'
    }
  ];

  return (
    <Card className="bg-gray-800/40 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Event Participation
          </CardTitle>
          <div className="flex gap-2">
            {viewType === 'overview' && (
              <Select value={chartType} onValueChange={(value: 'pie' | 'bar') => setChartType(value)}>
                <SelectTrigger className="w-24 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={viewType} onValueChange={(value: 'workshops' | 'competitions' | 'overview') => setViewType(value)}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="workshops">Workshops</SelectItem>
                <SelectItem value="competitions">Competitions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewType === 'overview' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{data.overall.total_participants}</div>
                <div className="text-sm text-gray-400">Total Participants</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <Code className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{data.overall.workshop_participants}</div>
                <div className="text-sm text-gray-400">Workshop Attendees</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{data.overall.competition_participants}</div>
                <div className="text-sm text-gray-400">Competition Participants</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{data.overall.combo_participants}</div>
                <div className="text-sm text-gray-400">Combo Participants</div>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Participation Distribution</h4>
              <ChartContainer config={chartConfig} className="h-80">
                {chartType === 'pie' ? (
                  <PieChart>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number, name: string) => [
                        `${value} participants (${((value / data.overall.total_participants) * 100).toFixed(1)}%)`,
                        name
                      ]}
                    />
                    <Pie
                      data={chartData.overviewData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#1F2937"
                      strokeWidth={2}
                    >
                      {chartData.overviewData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <BarChart data={chartData.overviewData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
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
                      formatter={(value: number) => [`${value} participants`, 'Count']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                )}
              </ChartContainer>
            </div>
          </div>
        )}

        {viewType === 'workshops' && (
          <div className="space-y-6">
            <ChartContainer config={chartConfig} className="h-80">
              <ComposedChart data={chartData.workshopChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
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
                  formatter={(value: number, name: string) => [
                    `${value} participants`,
                    name === 'registered' ? 'Registered' : 
                    name === 'attended' ? 'Attended' : 'No-shows'
                  ]}
                />
                <Bar 
                  dataKey="attended" 
                  stackId="a" 
                  fill={COLORS[0]} 
                  radius={[0, 0, 4, 4]}
                  className="hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="noShows" 
                  stackId="a" 
                  fill={COLORS[1]} 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </ComposedChart>
            </ChartContainer>

            {/* Workshop Details */}
            <div className="space-y-4">
              {workshopData.map((workshop) => (
                <div key={workshop.name} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{workshop.icon}</span>
                      <h4 className="text-white font-medium">{workshop.name}</h4>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {workshop.completion_rate.toFixed(1)}% completion
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{workshop.registered}</div>
                      <div className="text-xs text-gray-400">Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{workshop.attended}</div>
                      <div className="text-xs text-gray-400">Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">
                        {workshop.registered - workshop.attended}
                      </div>
                      <div className="text-xs text-gray-400">No-shows</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(workshop.attended / workshop.registered) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewType === 'competitions' && (
          <div className="space-y-6">
            <ChartContainer config={chartConfig} className="h-80">
              <ComposedChart data={chartData.competitionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
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
                  formatter={(value: number, name: string) => [
                    `${value} participants`,
                    name === 'registered' ? 'Registered' : 
                    name === 'active' ? 'Active' : 
                    name === 'submitted' ? 'Submitted' : 'Inactive'
                  ]}
                />
                <Bar 
                  dataKey="submitted" 
                  stackId="a" 
                  fill={COLORS[2]} 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="active" 
                  stackId="a" 
                  fill={COLORS[1]} 
                  className="hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="inactive" 
                  stackId="a" 
                  fill={COLORS[3]} 
                  radius={[0, 0, 4, 4]}
                  className="hover:opacity-80 transition-opacity"
                />
              </ComposedChart>
            </ChartContainer>

            {/* Competition Details */}
            <div className="space-y-4">
              {competitionData.map((competition) => (
                <div key={competition.name} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{competition.icon}</span>
                      <h4 className="text-white font-medium">{competition.name}</h4>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {Math.round((competition.submitted / competition.registered) * 100)}% submission rate
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{competition.registered}</div>
                      <div className="text-xs text-gray-400">Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{competition.active}</div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">{competition.submitted}</div>
                      <div className="text-xs text-gray-400">Submitted</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Active Participation</span>
                      <span className="text-white">{Math.round((competition.active / competition.registered) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(competition.active / competition.registered) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Submission Rate</span>
                      <span className="text-white">{Math.round((competition.submitted / competition.registered) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(competition.submitted / competition.registered) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}