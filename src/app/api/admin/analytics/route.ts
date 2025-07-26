import { NextRequest, NextResponse } from 'next/server';
import { getDbPromise } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/server-auth';
import { Db } from 'mongodb';

// Type definitions

interface DailyRegistrationData {
  _id: string;
  count: number;
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

interface OverallStats {
  _id: null;
  total_participants: number;
  workshop_participants: number;
  competition_participants: number;
  combo_participants: number;
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
      default:
        return await getOverviewData(db, startDate, now);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getRegistrationTrends(db: Db, startDate: Date, endDate: Date) {
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
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const dailyRegistrations = await db.collection('registrations').aggregate(pipeline).toArray() as DailyRegistrationData[];
  
  // Fill missing dates and calculate cumulative
  const data = [];
  let cumulative = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dailyRegistrations.find((d: DailyRegistrationData) => d._id === dateStr);
    const count = dayData ? dayData.count : 0;
    cumulative += count;
    
    data.push({
      date: dateStr,
      count,
      cumulative
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return NextResponse.json({ 
    data,
    total: cumulative,
    growth: data.length > 1 ? ((data[data.length - 1].count - data[data.length - 2].count) / Math.max(data[data.length - 2].count, 1)) * 100 : 0
  });
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
  // Workshop participation
  const workshopStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: "$workshop_track",
        registered: { $sum: 1 },
        // Assuming attendance tracking exists
        attended: { $sum: { $cond: ["$workshop_attended", 1, 0] } }
      }
    }
  ]).toArray() as WorkshopStats[];

  // Competition participation
  const competitionStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: "$competition_track",
        registered: { $sum: 1 },
        // Assuming submission tracking exists
        submitted: { $sum: { $cond: ["$competition_submitted", 1, 0] } }
      }
    }
  ]).toArray() as CompetitionStats[];

  // Overall participation stats
  const overallStats = await db.collection('registrations').aggregate([
    {
      $group: {
        _id: null,
        total_participants: { $sum: 1 },
        workshop_participants: {
          $sum: { $cond: [{ $ne: ["$workshop_track", "None"] }, 1, 0] }
        },
        competition_participants: {
          $sum: { $cond: [{ $ne: ["$competition_track", "None"] }, 1, 0] }
        },
        combo_participants: {
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
  ]).toArray() as OverallStats[];

  const cloudWorkshop = workshopStats.find((w: WorkshopStats) => w._id === 'Cloud') || { _id: 'Cloud', registered: 0, attended: 0 };
  const aiWorkshop = workshopStats.find((w: WorkshopStats) => w._id === 'AI') || { _id: 'AI', registered: 0, attended: 0 };
  const hackathon = competitionStats.find((c: CompetitionStats) => c._id === 'Hackathon') || { _id: 'Hackathon', registered: 0, submitted: 0 };
  const pitch = competitionStats.find((c: CompetitionStats) => c._id === 'Pitch') || { _id: 'Pitch', registered: 0, submitted: 0 };

  return NextResponse.json({
    workshops: {
      cloud: {
        registered: cloudWorkshop.registered,
        attended: cloudWorkshop.attended,
        completion_rate: cloudWorkshop.registered > 0 ? (cloudWorkshop.attended / cloudWorkshop.registered) * 100 : 0
      },
      ai: {
        registered: aiWorkshop.registered,
        attended: aiWorkshop.attended,
        completion_rate: aiWorkshop.registered > 0 ? (aiWorkshop.attended / aiWorkshop.registered) * 100 : 0
      }
    },
    competitions: {
      hackathon: {
        registered: hackathon.registered,
        active: hackathon.registered, // Assuming all registered are active
        submitted: hackathon.submitted
      },
      pitch: {
        registered: pitch.registered,
        active: pitch.registered,
        submitted: pitch.submitted
      }
    },
    overall: overallStats[0] || {
      total_participants: 0,
      workshop_participants: 0,
      competition_participants: 0,
      combo_participants: 0
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