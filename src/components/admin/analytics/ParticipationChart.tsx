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
  const [showMembers, setShowMembers] = useState(true);

  const chartData = useMemo(() => {
    const totalParticipants = showMembers ? data.overall.members.total_members : data.overall.teams.total_teams;
    const workshopParticipants = showMembers ? data.overall.members.workshop_members : data.overall.teams.workshop_teams;
    const competitionParticipants = showMembers ? data.overall.members.competition_members : data.overall.teams.competition_teams;
    const comboParticipants = showMembers ? data.overall.members.combo_members : data.overall.teams.combo_teams;
    
    const overviewData = [
      {
        name: 'Workshop Only',
        value: workshopParticipants - comboParticipants,
        fill: COLORS[0],
        percentage: totalParticipants > 0 ? Math.round(((workshopParticipants - comboParticipants) / totalParticipants) * 100) : 0
      },
      {
        name: 'Competition Only', 
        value: competitionParticipants - comboParticipants,
        fill: COLORS[1],
        percentage: totalParticipants > 0 ? Math.round(((competitionParticipants - comboParticipants) / totalParticipants) * 100) : 0
      },
      {
        name: 'Combo (Both)',
        value: comboParticipants,
        fill: COLORS[2],
        percentage: totalParticipants > 0 ? Math.round((comboParticipants / totalParticipants) * 100) : 0
      }
    ];

    const workshopChartData = [
      {
        name: 'Cloud Computing',
        registered: showMembers ? data.workshops.cloud.members.registered : data.workshops.cloud.teams.registered,
        attended: showMembers ? data.workshops.cloud.members.attended : data.workshops.cloud.teams.attended,
        completion_rate: data.workshops.cloud.completion_rate,
        noShows: (showMembers ? data.workshops.cloud.members.registered : data.workshops.cloud.teams.registered) - 
                 (showMembers ? data.workshops.cloud.members.attended : data.workshops.cloud.teams.attended),
        teams: data.workshops.cloud.teams.registered,
        members: data.workshops.cloud.members.registered,
      },
      {
        name: 'AI/ML',
        registered: showMembers ? data.workshops.ai.members.registered : data.workshops.ai.teams.registered,
        attended: showMembers ? data.workshops.ai.members.attended : data.workshops.ai.teams.attended,
        completion_rate: data.workshops.ai.completion_rate,
        noShows: (showMembers ? data.workshops.ai.members.registered : data.workshops.ai.teams.registered) - 
                 (showMembers ? data.workshops.ai.members.attended : data.workshops.ai.teams.attended),
        teams: data.workshops.ai.teams.registered,
        members: data.workshops.ai.members.registered,
      }
    ];

    const competitionChartData = [
      {
        name: 'Hackathon',
        registered: showMembers ? data.competitions.hackathon.members.registered : data.competitions.hackathon.teams.registered,
        submitted: showMembers ? data.competitions.hackathon.members.submitted : data.competitions.hackathon.teams.submitted,
        submission_rate: data.competitions.hackathon.submission_rate,
        notSubmitted: (showMembers ? data.competitions.hackathon.members.registered : data.competitions.hackathon.teams.registered) - 
                      (showMembers ? data.competitions.hackathon.members.submitted : data.competitions.hackathon.teams.submitted),
        teams: data.competitions.hackathon.teams.registered,
        members: data.competitions.hackathon.members.registered,
      },
      {
        name: 'Startup Pitch',
        registered: showMembers ? data.competitions.pitch.members.registered : data.competitions.pitch.teams.registered,
        submitted: showMembers ? data.competitions.pitch.members.submitted : data.competitions.pitch.teams.submitted,
        submission_rate: data.competitions.pitch.submission_rate,
        notSubmitted: (showMembers ? data.competitions.pitch.members.registered : data.competitions.pitch.teams.registered) - 
                      (showMembers ? data.competitions.pitch.members.submitted : data.competitions.pitch.teams.submitted),
        teams: data.competitions.pitch.teams.registered,
        members: data.competitions.pitch.members.registered,
      }
    ];

    return { overviewData, workshopChartData, competitionChartData };
  }, [data, showMembers]);

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



  return (
    <Card className="bg-gray-800/40 border-gray-700">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
            <span className="truncate">Event Participation</span>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={showMembers ? 'members' : 'teams'} onValueChange={(value) => setShowMembers(value === 'members')}>
              <SelectTrigger className="w-20 sm:w-24 bg-gray-700 border-gray-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="members">Members</SelectItem>
              </SelectContent>
            </Select>
            {viewType === 'overview' && (
              <Select value={chartType} onValueChange={(value: 'pie' | 'bar') => setChartType(value)}>
                <SelectTrigger className="w-16 sm:w-20 bg-gray-700 border-gray-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={viewType} onValueChange={(value: 'workshops' | 'competitions' | 'overview') => setViewType(value)}>
              <SelectTrigger className="w-28 sm:w-36 bg-gray-700 border-gray-600 text-white text-sm">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-gray-700/30 rounded-lg p-2 sm:p-4 text-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{showMembers ? data.overall.members.total_members : data.overall.teams.total_teams}</div>
                <div className="text-xs sm:text-sm text-gray-400">Total {showMembers ? 'Members' : 'Teams'}</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-2 sm:p-4 text-center">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{showMembers ? data.overall.members.workshop_members : data.overall.teams.workshop_teams}</div>
                <div className="text-xs sm:text-sm text-gray-400">Workshop {showMembers ? 'Members' : 'Teams'}</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-2 sm:p-4 text-center">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{showMembers ? data.overall.members.competition_members : data.overall.teams.competition_teams}</div>
                <div className="text-xs sm:text-sm text-gray-400">Competition {showMembers ? 'Members' : 'Teams'}</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-2 sm:p-4 text-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{showMembers ? data.overall.members.combo_members : data.overall.teams.combo_teams}</div>
                <div className="text-xs sm:text-sm text-gray-400">Combo {showMembers ? 'Members' : 'Teams'}</div>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">Participation Distribution</h4>
              <div className="w-full overflow-hidden">
                <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
                  {chartType === 'pie' ? (
                    <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: number, name: string) => {
                          const total = showMembers ? data.overall.members.total_members : data.overall.teams.total_teams;
                          return [
                            `${value} ${showMembers ? 'members' : 'teams'} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                            name
                          ];
                        }}
                      />
                      <Pie
                        data={chartData.overviewData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius="75%"
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
                  <BarChart data={chartData.overviewData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
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
          </div>
        )}

        {viewType === 'workshops' && (
          <div className="space-y-6">
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
                <ComposedChart data={chartData.workshopChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
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
            </div>

            {/* Workshop Details */}
            <div className="space-y-4">
              {[
                {
                  name: 'Cloud Computing (AWS)',
                  teams: data.workshops.cloud.teams.registered,
                  members: data.workshops.cloud.members.registered,
                  teamsAttended: data.workshops.cloud.teams.attended,
                  membersAttended: data.workshops.cloud.members.attended,
                  completion_rate: data.workshops.cloud.completion_rate,
                  icon: '☁️'
                },
                {
                  name: 'AI/ML (Google)',
                  teams: data.workshops.ai.teams.registered,
                  members: data.workshops.ai.members.registered,
                  teamsAttended: data.workshops.ai.teams.attended,
                  membersAttended: data.workshops.ai.members.attended,
                  completion_rate: data.workshops.ai.completion_rate,
                  icon: '🤖'
                }
              ].map((workshop) => (
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
                      <div className="text-xl font-bold text-blue-400">{showMembers ? workshop.members : workshop.teams}</div>
                      <div className="text-xs text-gray-400">Registered {showMembers ? 'Members' : 'Teams'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{showMembers ? workshop.membersAttended : workshop.teamsAttended}</div>
                      <div className="text-xs text-gray-400">Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">
                        {showMembers ? (workshop.members - workshop.membersAttended) : (workshop.teams - workshop.teamsAttended)}
                      </div>
                      <div className="text-xs text-gray-400">No-shows</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${showMembers 
                          ? (workshop.membersAttended / workshop.members) * 100 
                          : (workshop.teamsAttended / workshop.teams) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewType === 'competitions' && (
          <div className="space-y-6">
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80">
                <ComposedChart data={chartData.competitionChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
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
            </div>

            {/* Competition Details */}
            <div className="space-y-4">
              {[
                {
                  name: 'Hackathon',
                  teams: data.competitions.hackathon.teams.registered,
                  members: data.competitions.hackathon.members.registered,
                  teamsSubmitted: data.competitions.hackathon.teams.submitted,
                  membersSubmitted: data.competitions.hackathon.members.submitted,
                  submission_rate: data.competitions.hackathon.submission_rate,
                  icon: '💻'
                },
                {
                  name: 'Startup Pitch',
                  teams: data.competitions.pitch.teams.registered,
                  members: data.competitions.pitch.members.registered,
                  teamsSubmitted: data.competitions.pitch.teams.submitted,
                  membersSubmitted: data.competitions.pitch.members.submitted,
                  submission_rate: data.competitions.pitch.submission_rate,
                  icon: '🚀'
                }
              ].map((competition) => (
                <div key={competition.name} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{competition.icon}</span>
                      <h4 className="text-white font-medium">{competition.name}</h4>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {competition.submission_rate.toFixed(1)}% submission rate
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{showMembers ? competition.members : competition.teams}</div>
                      <div className="text-xs text-gray-400">Registered {showMembers ? 'Members' : 'Teams'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{showMembers ? competition.membersSubmitted : competition.teamsSubmitted}</div>
                      <div className="text-xs text-gray-400">Submitted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">
                        {showMembers ? (competition.members - competition.membersSubmitted) : (competition.teams - competition.teamsSubmitted)}
                      </div>
                      <div className="text-xs text-gray-400">Pending</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Submission Rate</span>
                      <span className="text-white">{competition.submission_rate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${showMembers 
                            ? (competition.membersSubmitted / competition.members) * 100 
                            : (competition.teamsSubmitted / competition.teams) * 100}%` 
                        }}
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