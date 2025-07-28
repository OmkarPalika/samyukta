import { NextRequest, NextResponse } from 'next/server';
import { getDbPromise } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/server-auth';
import { Db, Document } from 'mongodb';

// Type definitions
interface DailyTeamData {
  _id: string;
  teams: number;
}

interface DailyMemberData {
  _id: string;
  members: number;
}

interface TicketTypeStat {
  _id: {
    team_size: number;
    workshop_track: string;
    competition_track: string;
  };
  teams: number;
  revenue: number;
  team_sizes: number;
}

interface TicketTypeAccumulator {
  [key: string]: {
    workshop_track: string;
    competition_track: string;
    teams: number;
    revenue: number;
    team_sizes: Record<string, number>;
  };
}

interface DailyRevenueData {
  _id: string;
  amount: number;
  transactions: number;
  pending: number;
}

interface AggregationResult {
  _id: string | null;
  count: number;
}

interface RevenueAggregationResult {
  _id: null;
  total: number;
}

interface WorkshopStats {
  _id: string;
  registered: number;
  attended: number;
}

interface CompetitionStats {
  _id: string;
  registered: number;
  submitted: number;
}

interface TeamSizeStats {
  _id: number;
  count: number;
  total_members: number;
  total_revenue: number;
}

interface TeamStat {
  _id: string;
  registered_teams: number;
  attended_teams: number;
  submitted_teams: number;
}

interface MemberStat {
  _id: string;
  registered_members: number;
  attended_members: number;
  submitted_members: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const range = searchParams.get('range') || '30d';

    // Check admin authentication
    const { authorized } = await requireAdmin(request);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDbPromise();
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate = new Date('2024-01-01'); // All time
    }

    switch (type) {
      case 'registration-trends':
        return await getRegistrationTrends(db, startDate, now);
      case 'revenue':
        return await getRevenueData(db, startDate, now);
      case 'demographics':
        return await getDemographicsData(db);
      case 'participation':
        return await getParticipationData(db);
      case 'team-size-analysis':
        return await getTeamSizeAnalysis(db);
      default:
        return await getOverviewData(db, startDate, now);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getRegistrationTrends(db: Db, startDate: Date, endDate: Date) {
  // Get team registrations by date
  const teamPipeline = [
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
        },
        teams: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  // Get member registrations by date (based on team registration date)
  const memberPipeline = [
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
        },
        members: { $sum: { $size: "$members" } }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const [dailyTeams, dailyMembers] = await Promise.all([
    db.collection('registrations').aggregate(teamPipeline).toArray(),
    db.collection('registrations').aggregate(memberPipeline).toArray()
  ]);
  
  // Fill missing dates and calculate cumulative for both teams and members
  const data = [];
  let cumulativeTeams = 0;
  let cumulativeMembers = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const teamData = dailyTeams.find((d) => d._id === dateStr) as DailyTeamData | undefined;
    const memberData = dailyMembers.find((d) => d._id === dateStr) as DailyMemberData | undefined;
    const teamCount = teamData ? teamData.teams : 0;
    const memberCount = memberData ? memberData.members : 0;
    
    cumulativeTeams += teamCount;
    cumulativeMembers += memberCount;
    
    data.push({
      date: dateStr,
      teams: teamCount,
      members: memberCount,
      cumulativeTeams,
      cumulativeMembers
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return NextResponse.json({ 
    data,
    totalTeams: cumulativeTeams,
    totalMembers: cumulativeMembers,
    teamGrowth: data.length > 1 ? ((data[data.length - 1].teams - data[data.length - 2].teams) / Math.max(data[data.length - 2].teams, 1)) * 100 : 0,
    memberGrowth: data.length > 1 ? ((data[data.length - 1].members - data[data.length - 2].members) / Math.max(data[data.length - 2].members, 1)) * 100 : 0
  });
}

async function getTeamSizeAnalysis(db: Db) {
  try {
    // Get team size statistics
    const teamSizePipeline = [
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $addFields: {
        team_size: { $size: "$members" }
      }
    },
    {
      $group: {
        _id: "$team_size",
        count: { $sum: 1 },
        total_members: { $sum: "$team_size" },
        total_revenue: { $sum: "$total_amount" },
        workshop_teams: {
          $sum: { $cond: [{ $and: [{ $ne: ["$workshop_track", null] }, { $ne: ["$workshop_track", ""] }, { $ne: ["$workshop_track", "None"] }] }, 1, 0] }
        },
        competition_teams: {
          $sum: { $cond: [{ $and: [{ $ne: ["$competition_track", null] }, { $ne: ["$competition_track", ""] }, { $ne: ["$competition_track", "None"] }] }, 1, 0] }
        },
        combo_teams: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$workshop_track", null] },
                  { $ne: ["$workshop_track", ""] },
                  { $ne: ["$workshop_track", "None"] },
                  { $ne: ["$competition_track", null] },
                  { $ne: ["$competition_track", ""] },
                  { $ne: ["$competition_track", "None"] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ];

  // Get ticket type breakdown by team size
  const ticketTypePipeline = [
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $addFields: {
        team_size: { $size: "$members" }
      }
    },
    {
      $group: {
        _id: {
          team_size: "$team_size",
          workshop_track: "$workshop_track",
          competition_track: "$competition_track"
        },
        teams: { $sum: 1 },
        revenue: { $sum: "$total_amount" },
        team_sizes: { $sum: 1 }
      }
    },
    { $sort: { "_id.team_size": 1 } }
  ];

  // Check if there are any registrations first
  const registrationCount = await db.collection('registrations').countDocuments();
  
  if (registrationCount === 0) {
    return NextResponse.json({
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
    });
  }

  // Check if there are team_members entries
  const teamMemberCount = await db.collection('team_members').countDocuments();
  console.log(`Registration count: ${registrationCount}, Team member count: ${teamMemberCount}`);

  const [teamSizeStatsResult, ticketTypeStats] = await Promise.all([
    db.collection('registrations').aggregate(teamSizePipeline).toArray(),
    db.collection('registrations').aggregate(ticketTypePipeline).toArray()
  ]);
  
  const teamSizeStats = teamSizeStatsResult as TeamSizeStats[];

  // Calculate totals with null checks
  const totalTeams = teamSizeStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
  const totalMembers = teamSizeStats.reduce((sum, stat) => sum + (stat.total_members || 0), 0);
  const totalRevenue = teamSizeStats.reduce((sum, stat) => sum + (stat.total_revenue || 0), 0);
  const avgTeamSize = totalTeams > 0 ? totalMembers / totalTeams : 0;

  // Process ticket type data
  const ticketTypes = ticketTypeStats.reduce((acc: TicketTypeAccumulator, item) => {
    const typedItem = item as TicketTypeStat;
    const key = `${typedItem._id.workshop_track}-${typedItem._id.competition_track}`;
    if (!acc[key]) {
      acc[key] = {
        workshop_track: typedItem._id.workshop_track,
        competition_track: typedItem._id.competition_track,
        teams: 0,
        revenue: 0,
        team_sizes: {}
      };
    }
    acc[key].teams += typedItem.teams;
    acc[key].revenue += typedItem.revenue;
    const teamSize = typedItem._id.team_size.toString();
    acc[key].team_sizes[teamSize] = (acc[key].team_sizes[teamSize] || 0) + typedItem.teams;
    return acc;
  }, {});

  return NextResponse.json({
    teamSizeDistribution: teamSizeStats,
    ticketTypeAnalysis: Object.values(ticketTypes),
    summary: {
      totalTeams,
      totalMembers,
      avgTeamSize: Math.round(avgTeamSize * 100) / 100,
      totalRevenue,
      revenuePerTeam: totalTeams > 0 ? Math.round((totalRevenue / totalTeams) * 100) / 100 : 0,
      revenuePerMember: totalMembers > 0 ? Math.round((totalRevenue / totalMembers) * 100) / 100 : 0
    }
  });
  } catch (error) {
    console.error('Team size analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze team size data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getRevenueData(db: Db, startDate: Date, endDate: Date) {
  const pipeline = [
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
        },
        amount: { $sum: "$total_amount" },
        transactions: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [
              { $in: ["$status", ["pending", "pending_review"]] },
              "$total_amount",
              0
            ]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const dailyRevenue = await db.collection('registrations').aggregate(pipeline).toArray() as DailyRevenueData[];
  
  // Calculate totals from all registrations
  const totalRevenue = await db.collection('registrations').aggregate([
    { $group: { _id: null, total: { $sum: "$total_amount" } } }
  ]).toArray() as RevenueAggregationResult[];

  const pendingRevenue = await db.collection('registrations').aggregate([
    { $match: { status: { $in: ["pending", "pending_review"] } } },
    { $group: { _id: null, total: { $sum: "$total_amount" } } }
  ]).toArray() as RevenueAggregationResult[];

  // Fill missing dates and calculate cumulative
  const data = [];
  let cumulative = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dailyRevenue.find((d: DailyRevenueData) => d._id === dateStr);
    const amount = dayData ? dayData.amount : 0;
    const transactions = dayData ? dayData.transactions : 0;
    const pending = dayData ? dayData.pending : 0;
    cumulative += amount;
    
    data.push({
      date: dateStr,
      amount,
      cumulative,
      transactions,
      pending
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return NextResponse.json({
    data,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingRevenue: pendingRevenue[0]?.total || 0
  });
}

async function getDemographicsData(db: Db) {
  // Get college/organization distribution from team_members (participants)
  // Use custom_organization if available, otherwise use organization, fallback to college
  const colleges = await db.collection('team_members').aggregate([
    {
      $addFields: {
        display_college: {
          $cond: {
            if: { $and: [{ $ne: ["$custom_organization", null] }, { $ne: ["$custom_organization", ""] }] },
            then: "$custom_organization",
            else: {
              $cond: {
                if: { $and: [{ $ne: ["$organization", null] }, { $ne: ["$organization", ""] }, { $ne: ["$organization", "College/University"] }] },
                then: "$organization",
                else: "$college"
              }
            }
          }
        }
      }
    },
    {
      $match: {
        display_college: { $exists: true, $nin: [null, ""] }
      }
    },
    { $group: { _id: "$display_college", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]).toArray() as AggregationResult[];

  // Get department/degree distribution from team_members (participants)
  // Use custom_degree if available, otherwise use degree, fallback to department
  const departments = await db.collection('team_members').aggregate([
    {
      $addFields: {
        display_department: {
          $cond: {
            if: { $and: [{ $ne: ["$custom_degree", null] }, { $ne: ["$custom_degree", ""] }] },
            then: "$custom_degree",
            else: {
              $cond: {
                if: { $and: [{ $ne: ["$degree", null] }, { $ne: ["$degree", ""] }] },
                then: "$degree",
                else: "$department"
              }
            }
          }
        }
      }
    },
    {
      $match: {
        display_department: { $exists: true, $nin: [null, ""] }
      }
    },
    { $group: { _id: "$display_department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 15 }
  ]).toArray() as AggregationResult[];

  // Get role distribution from team_members (participants)
  // Use custom_role if available, otherwise use role, fallback to year for students
  const years = await db.collection('team_members').aggregate([
    {
      $addFields: {
        display_role: {
          $cond: {
            if: { $and: [{ $ne: ["$custom_role", null] }, { $ne: ["$custom_role", ""] }] },
            then: "$custom_role",
            else: {
              $cond: {
                if: { $and: [{ $ne: ["$role", null] }, { $ne: ["$role", ""] }, { $ne: ["$role", "Student"] }] },
                then: "$role",
                else: { $concat: ["Student - ", "$year"] }
              }
            }
          }
        }
      }
    },
    {
      $match: {
        display_role: { $exists: true, $nin: [null, ""] }
      }
    },
    { $group: { _id: "$display_role", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray() as AggregationResult[];

  // Get track distribution from team_members (participants)
  // Note: team_members might not have track field, so we'll get it from registrations
  const tracks = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: {
          workshop: "$workshop_track",
          competition: "$competition_track"
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: {
          $switch: {
            branches: [
              {
                case: { $and: [
                  { $ne: ["$_id.workshop", "None"] },
                  { $ne: ["$_id.competition", "None"] }
                ]},
                then: "Both (Workshop + Competition)"
              },
              {
                case: { $ne: ["$_id.workshop", "None"] },
                then: { $concat: ["Workshop: ", "$_id.workshop"] }
              },
              {
                case: { $ne: ["$_id.competition", "None"] },
                then: { $concat: ["Competition: ", "$_id.competition"] }
              }
            ],
            default: "None"
          }
        },
        count: 1
      }
    },
    { $group: { _id: "$_id", count: { $sum: "$count" } } },
    { $sort: { count: -1 } }
  ]).toArray() as AggregationResult[];

  const totalParticipants = await db.collection('team_members').countDocuments();

  // Calculate percentages
  const formatData = (data: AggregationResult[]) => 
    data.map(item => ({
      name: item._id || 'Unknown', // Fallback for any remaining null values
      count: item.count,
      percentage: totalParticipants > 0 ? (item.count / totalParticipants) * 100 : 0
    }));

  return NextResponse.json({
    colleges: formatData(colleges),
    departments: formatData(departments),
    years: formatData(years),
    tracks: formatData(tracks),
    totalUsers: totalParticipants // This represents total participants now
  });
}

async function getParticipationData(db: Db) {
  // Workshop participation by teams
  const workshopTeamStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: "$workshop_track",
        registered_teams: { $sum: 1 },
        // Assuming attendance tracking exists
        attended_teams: { $sum: { $cond: ["$workshop_attended", 1, 0] } }
      }
    }
  ]).toArray() as WorkshopStats[];

  // Workshop participation by members
  const workshopMemberStats = await db.collection('registrations').aggregate([
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $group: {
        _id: "$workshop_track",
        registered_members: { $sum: { $size: "$members" } },
        attended_members: { 
          $sum: { 
            $cond: [
              "$workshop_attended", 
              { $size: "$members" }, 
              0
            ] 
          } 
        }
      }
    }
  ]).toArray();

  // Competition participation by teams
  const competitionTeamStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: "$competition_track",
        registered_teams: { $sum: 1 },
        submitted_teams: { $sum: { $cond: ["$competition_submitted", 1, 0] } }
      }
    }
  ]).toArray() as CompetitionStats[];

  // Competition participation by members
  const competitionMemberStats = await db.collection('registrations').aggregate([
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $group: {
        _id: "$competition_track",
        registered_members: { $sum: { $size: "$members" } },
        submitted_members: { 
          $sum: { 
            $cond: [
              "$competition_submitted", 
              { $size: "$members" }, 
              0
            ] 
          } 
        }
      }
    }
  ]).toArray();

  // Overall participation stats (teams)
  const overallTeamStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: null,
        total_teams: { $sum: 1 },
        workshop_teams: {
          $sum: { $cond: [{ $ne: ["$workshop_track", "None"] }, 1, 0] }
        },
        competition_teams: {
          $sum: { $cond: [{ $ne: ["$competition_track", "None"] }, 1, 0] }
        },
        combo_teams: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$workshop_track", "None"] },
                  { $ne: ["$competition_track", "None"] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]).toArray();

  // Overall participation stats (members)
  const overallMemberStats = await db.collection('registrations').aggregate([
    {
      $lookup: {
        from: 'team_members',
        localField: 'team_id',
        foreignField: 'registration_id',
        as: 'members'
      }
    },
    {
      $group: {
        _id: null,
        total_members: { $sum: { $size: "$members" } },
        workshop_members: {
          $sum: { 
            $cond: [
              { $ne: ["$workshop_track", "None"] }, 
              { $size: "$members" }, 
              0
            ] 
          }
        },
        competition_members: {
          $sum: { 
            $cond: [
              { $ne: ["$competition_track", "None"] }, 
              { $size: "$members" }, 
              0
            ] 
          }
        },
        combo_members: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$workshop_track", "None"] },
                  { $ne: ["$competition_track", "None"] }
                ]
              },
              { $size: "$members" },
              0
            ]
          }
        }
      }
    }
  ]).toArray();

  // Helper function to safely find stats
  const findTeamStat = (stats: Document[], id: string): TeamStat => {
    const found = stats.find((s) => s._id === id);
    return found ? found as TeamStat : { _id: id, registered_teams: 0, attended_teams: 0, submitted_teams: 0 };
  };
  
  const findMemberStat = (stats: Document[], id: string): MemberStat => {
    const found = stats.find((s) => s._id === id);
    return found ? found as MemberStat : { _id: id, registered_members: 0, attended_members: 0, submitted_members: 0 };
  };

  const cloudWorkshopTeams = findTeamStat(workshopTeamStats, 'Cloud');
  const aiWorkshopTeams = findTeamStat(workshopTeamStats, 'AI');
  const hackathonTeams = findTeamStat(competitionTeamStats, 'Hackathon');
  const pitchTeams = findTeamStat(competitionTeamStats, 'Pitch');

  const cloudWorkshopMembers = findMemberStat(workshopMemberStats, 'Cloud');
  const aiWorkshopMembers = findMemberStat(workshopMemberStats, 'AI');
  const hackathonMembers = findMemberStat(competitionMemberStats, 'Hackathon');
  const pitchMembers = findMemberStat(competitionMemberStats, 'Pitch');

  return NextResponse.json({
    workshops: {
      cloud: {
        teams: {
          registered: cloudWorkshopTeams.registered_teams,
          attended: cloudWorkshopTeams.attended_teams
        },
        members: {
          registered: cloudWorkshopMembers.registered_members,
          attended: cloudWorkshopMembers.attended_members
        },
        completion_rate: cloudWorkshopMembers.registered_members > 0 ? 
          (cloudWorkshopMembers.attended_members / cloudWorkshopMembers.registered_members) * 100 : 0
      },
      ai: {
        teams: {
          registered: aiWorkshopTeams.registered_teams,
          attended: aiWorkshopTeams.attended_teams
        },
        members: {
          registered: aiWorkshopMembers.registered_members,
          attended: aiWorkshopMembers.attended_members
        },
        completion_rate: aiWorkshopMembers.registered_members > 0 ? 
          (aiWorkshopMembers.attended_members / aiWorkshopMembers.registered_members) * 100 : 0
      }
    },
    competitions: {
      hackathon: {
        teams: {
          registered: hackathonTeams.registered_teams,
          submitted: hackathonTeams.submitted_teams
        },
        members: {
          registered: hackathonMembers.registered_members,
          submitted: hackathonMembers.submitted_members
        },
        submission_rate: hackathonMembers.registered_members > 0 ? 
          (hackathonMembers.submitted_members / hackathonMembers.registered_members) * 100 : 0
      },
      pitch: {
        teams: {
          registered: pitchTeams.registered_teams,
          submitted: pitchTeams.submitted_teams
        },
        members: {
          registered: pitchMembers.registered_members,
          submitted: pitchMembers.submitted_members
        },
        submission_rate: pitchMembers.registered_members > 0 ? 
          (pitchMembers.submitted_members / pitchMembers.registered_members) * 100 : 0
      }
    },
    overall: {
      teams: overallTeamStats[0] || {
        total_teams: 0,
        workshop_teams: 0,
        competition_teams: 0,
        combo_teams: 0
      },
      members: overallMemberStats[0] || {
        total_members: 0,
        workshop_members: 0,
        competition_members: 0,
        combo_members: 0
      }
    }
  });
}

async function getOverviewData(db: Db, startDate: Date, endDate: Date) {
  const [registrationTrends, revenueData, demographics, participation] = await Promise.all([
    getRegistrationTrends(db, startDate, endDate),
    getRevenueData(db, startDate, endDate),
    getDemographicsData(db),
    getParticipationData(db)
  ]);

  return NextResponse.json({
    registrationTrends: await registrationTrends.json(),
    revenueData: await revenueData.json(),
    demographics: await demographics.json(),
    participation: await participation.json()
  });
}
