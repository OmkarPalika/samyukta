import { NextRequest, NextResponse } from 'next/server';
import { getDbPromise } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/server-auth';
import { Db } from 'mongodb';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Type definitions
interface UserDocument {
  _id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  college?: string;
  dept?: string;
  year?: string;
  track?: string;
  role?: string;
  registration_status?: string;
  payment_status?: string;
  amount_paid?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface RegistrationDocument {
  _id: string;
  team_id?: string;
  college?: string;
  team_size?: number;
  total_amount?: number;
  transaction_id?: string;
  status?: string;
  workshop_track?: string;
  competition_track?: string;
  payment_method?: string;
  created_at?: Date;
  updated_at?: Date;
  members: TeamMemberDocument[];
}

interface TeamMemberDocument {
  participant_id?: string;
  passkey?: string;
  full_name: string;
  email: string;
  whatsapp?: string;
  gender?: string;
  role?: string;
  custom_role?: string;
  organization?: string;
  custom_organization?: string;
  college?: string;
  degree?: string;
  custom_degree?: string;
  year?: string;
  department?: string;
  stream?: string;
  accommodation?: boolean;
  food_preference?: string;
  workshop_track?: string;
  competition_track?: string;
  is_club_lead?: boolean;
  club_name?: string;
  club_designation?: string;
  present?: boolean;
  created_at?: Date;
}

interface IncludeFields {
  personal?: boolean;
  contact?: boolean;
  academic?: boolean;
  registration?: boolean;
  payment?: boolean;
  timestamps?: boolean;
  team?: boolean;
  members?: boolean;
  preferences?: boolean;
  tracks?: boolean;
}

// Analytics specific interfaces
interface StatusBreakdown {
  _id: string;
  count: number;
}

interface RevenueAnalytics {
  _id: null;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  avgAmount: number;
}

interface CollegeDepartmentStats {
  _id: string;
  count: number;
}

interface TrackStats {
  _id: null;
  workshopTracks: (string | null)[];
  competitionTracks: (string | null)[];
}

interface TeamAnalytics {
  _id: null;
  avgTeamSize: number;
  totalTeams: number;
  teamSizeDistribution: number[];
}

interface TeamSizeDistribution {
  _id: number;
  count: number;
}

interface DailyRegistrations {
  _id: string;
  count: number;
}

interface MemberRecord {
  _id: string;
  team_id?: string;
  college?: string;
  team_size?: number;
  total_amount?: number;
  transaction_id?: string;
  status?: string;
  workshop_track?: string;
  competition_track?: string;
  payment_method?: string;
  created_at?: Date;
  updated_at?: Date;
  members: TeamMemberDocument;
}

export async function POST(request: NextRequest) {
  try {
    const { exportType, exportFormat, dateRange, includeFields } = await request.json();

    // Check admin authentication
    const { authorized } = await requireAdmin(request);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDbPromise();

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
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

    let data: Record<string, unknown>[] = [];
    let headers: string[] = [];

    switch (exportType) {
      case 'users':
        ({ data, headers } = await exportUsers(db, includeFields, startDate, now));
        break;
      case 'registrations':
        ({ data, headers } = await exportRegistrations(db, includeFields, startDate, now));
        break;
      case 'detailed-members':
        ({ data, headers } = await exportDetailedMembers(db, includeFields, startDate, now));
        break;
      case 'analytics':
        ({ data, headers } = await exportAnalytics(db, includeFields, startDate, now));
        break;
      case 'revenue':
        ({ data, headers } = await exportRevenue(db, includeFields, startDate, now));
        break;
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    // Generate file based on format
    switch (exportFormat) {
      case 'csv':
        return generateCSV(data, headers, exportType);
      case 'excel':
        return await generateExcel(data, headers, exportType);
      case 'pdf':
        return generatePDF(data, headers, exportType);
      default:
        return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function exportUsers(db: Db, includeFields: IncludeFields, startDate: Date, endDate: Date) {
  const pipeline: Record<string, unknown>[] = [
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    }
  ];

  const users = await db.collection('users').aggregate(pipeline).toArray() as UserDocument[];
  
  const headers: string[] = [];
  if (includeFields.personal) headers.push('Name', 'Email');
  if (includeFields.contact) headers.push('Phone', 'WhatsApp');
  if (includeFields.academic) headers.push('College', 'Department', 'Year', 'Track');
  if (includeFields.registration) headers.push('Role', 'Registration Status');
  if (includeFields.payment) headers.push('Payment Status', 'Amount Paid');
  if (includeFields.timestamps) headers.push('Created At', 'Updated At');

  const data = users.map((user: UserDocument) => {
    const row: Record<string, unknown> = {};
    if (includeFields.personal) {
      row['Name'] = user.full_name || '';
      row['Email'] = user.email || '';
    }
    if (includeFields.contact) {
      row['Phone'] = user.phone || '';
      row['WhatsApp'] = user.whatsapp || '';
    }
    if (includeFields.academic) {
      row['College'] = user.college || '';
      row['Department'] = user.dept || '';
      row['Year'] = user.year || '';
      row['Track'] = user.track || '';
    }
    if (includeFields.registration) {
      row['Role'] = user.role || 'participant';
      row['Registration Status'] = user.registration_status || 'pending';
    }
    if (includeFields.payment) {
      row['Payment Status'] = user.payment_status || 'pending';
      row['Amount Paid'] = user.amount_paid || 0;
    }
    if (includeFields.timestamps) {
      row['Created At'] = user.created_at ? new Date(user.created_at).toISOString() : '';
      row['Updated At'] = user.updated_at ? new Date(user.updated_at).toISOString() : '';
    }
    return row;
  });

  return { data, headers };
}

async function exportRegistrations(db: Db, includeFields: IncludeFields, startDate: Date, endDate: Date) {
  const pipeline: Record<string, unknown>[] = [
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
    }
  ];

  const registrations = await db.collection('registrations').aggregate(pipeline).toArray() as RegistrationDocument[];
  
  const headers: string[] = [];
  if (includeFields.team) headers.push('Team ID', 'College', 'Team Size');
  if (includeFields.members) {
    headers.push(
      'Member Names', 'Member Emails', 'Member WhatsApp', 'Member Genders', 
      'Member Roles', 'Member Colleges', 'Member Departments', 'Member Years',
      'Member Degrees', 'Member Streams', 'Participant IDs', 'Passkeys'
    );
  }
  if (includeFields.payment) headers.push('Total Amount', 'Transaction ID', 'Payment Status');
  if (includeFields.preferences) headers.push('Food Preferences', 'Accommodation Required');
  if (includeFields.tracks) headers.push('Workshop Track', 'Competition Track');
  if (includeFields.timestamps) headers.push('Registration Date', 'Last Updated');

  const data = registrations.map((reg: RegistrationDocument) => {
    const row: Record<string, unknown> = {};
    if (includeFields.team) {
      row['Team ID'] = reg.team_id || '';
      row['College'] = reg.college || '';
      row['Team Size'] = reg.team_size || 0;
    }
    if (includeFields.members) {
      row['Member Names'] = reg.members.map((m: TeamMemberDocument) => m.full_name).join(', ');
      row['Member Emails'] = reg.members.map((m: TeamMemberDocument) => m.email).join(', ');
      row['Member WhatsApp'] = reg.members.map((m: TeamMemberDocument) => m.whatsapp || '').join(', ');
      row['Member Genders'] = reg.members.map((m: TeamMemberDocument) => m.gender || '').join(', ');
      row['Member Roles'] = reg.members.map((m: TeamMemberDocument) => m.role || '').join(', ');
      row['Member Colleges'] = reg.members.map((m: TeamMemberDocument) => m.college || '').join(', ');
      row['Member Departments'] = reg.members.map((m: TeamMemberDocument) => m.department || '').join(', ');
      row['Member Years'] = reg.members.map((m: TeamMemberDocument) => m.year || '').join(', ');
      row['Member Degrees'] = reg.members.map((m: TeamMemberDocument) => m.degree || '').join(', ');
      row['Member Streams'] = reg.members.map((m: TeamMemberDocument) => m.stream || '').join(', ');
      row['Participant IDs'] = reg.members.map((m: TeamMemberDocument) => m.participant_id || '').join(', ');
      row['Passkeys'] = reg.members.map((m: TeamMemberDocument) => m.passkey || '').join(', ');
    }
    if (includeFields.payment) {
      row['Total Amount'] = reg.total_amount || 0;
      row['Transaction ID'] = reg.transaction_id || '';
      row['Payment Status'] = reg.status || 'pending';
    }
    if (includeFields.preferences) {
      const vegCount = reg.members.filter((m: TeamMemberDocument) => m.food_preference === 'veg').length;
      const nonVegCount = reg.members.filter((m: TeamMemberDocument) => m.food_preference === 'non-veg').length;
      row['Food Preferences'] = `Veg: ${vegCount}, Non-Veg: ${nonVegCount}`;
      
      const accommodationCount = reg.members.filter((m: TeamMemberDocument) => m.accommodation).length;
      row['Accommodation Required'] = `${accommodationCount}/${reg.team_size}`;
    }
    if (includeFields.tracks) {
      row['Workshop Track'] = reg.workshop_track || 'None';
      row['Competition Track'] = reg.competition_track || 'None';
    }
    if (includeFields.timestamps) {
      row['Registration Date'] = reg.created_at ? new Date(reg.created_at).toISOString() : '';
      row['Last Updated'] = reg.updated_at ? new Date(reg.updated_at).toISOString() : '';
    }
    return row;
  });

  return { data, headers };
}

async function exportDetailedMembers(db: Db, includeFields: IncludeFields, startDate: Date, endDate: Date) {
  const pipeline: Record<string, unknown>[] = [
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
      $unwind: '$members'  // This creates one row per member
    }
  ];

  const memberRecords = await db.collection('registrations').aggregate(pipeline).toArray() as MemberRecord[];
  
  const headers: string[] = [];
  
  // Team information
  if (includeFields.team) {
    headers.push('Team ID', 'Team College', 'Team Size', 'Team Workshop Track', 'Team Competition Track');
  }
  
  // Member details
  if (includeFields.members) {
    headers.push(
      'Participant ID', 'Passkey', 'Full Name', 'Email', 'WhatsApp', 'Gender', 
      'Role', 'Custom Role', 'Organization', 'Custom Organization', 'College', 
      'Degree', 'Custom Degree', 'Year', 'Department', 'Stream', 'Is Club Lead',
      'Club Name', 'Club Designation', 'Present Status'
    );
  }
  
  // Preferences
  if (includeFields.preferences) {
    headers.push('Food Preference', 'Accommodation Required');
  }
  
  // Payment info (from team)
  if (includeFields.payment) {
    headers.push('Team Total Amount', 'Transaction ID', 'Payment Status');
  }
  
  // Timestamps
  if (includeFields.timestamps) {
    headers.push('Member Created At', 'Team Registration Date');
  }

  const data = memberRecords.map((record: MemberRecord) => {
    const reg = record;
    const member = record.members;
    const row: Record<string, unknown> = {};
    
    if (includeFields.team) {
      row['Team ID'] = reg.team_id || '';
      row['Team College'] = reg.college || '';
      row['Team Size'] = reg.team_size || 0;
      row['Team Workshop Track'] = reg.workshop_track || 'None';
      row['Team Competition Track'] = reg.competition_track || 'None';
    }
    
    if (includeFields.members) {
      row['Participant ID'] = member.participant_id || '';
      row['Passkey'] = member.passkey || '';
      row['Full Name'] = member.full_name || '';
      row['Email'] = member.email || '';
      row['WhatsApp'] = member.whatsapp || '';
      row['Gender'] = member.gender || '';
      row['Role'] = member.role || '';
      row['Custom Role'] = member.custom_role || '';
      row['Organization'] = member.organization || '';
      row['Custom Organization'] = member.custom_organization || '';
      row['College'] = member.college || '';
      row['Degree'] = member.degree || '';
      row['Custom Degree'] = member.custom_degree || '';
      row['Year'] = member.year || '';
      row['Department'] = member.department || '';
      row['Stream'] = member.stream || '';
      row['Is Club Lead'] = member.is_club_lead ? 'Yes' : 'No';
      row['Club Name'] = member.club_name || '';
      row['Club Designation'] = member.club_designation || '';
      row['Present Status'] = member.present ? 'Present' : 'Absent';
    }
    
    if (includeFields.preferences) {
      row['Food Preference'] = member.food_preference || '';
      row['Accommodation Required'] = member.accommodation ? 'Yes' : 'No';
    }
    
    if (includeFields.payment) {
      row['Team Total Amount'] = reg.total_amount || 0;
      row['Transaction ID'] = reg.transaction_id || '';
      row['Payment Status'] = reg.status || 'pending';
    }
    
    if (includeFields.timestamps) {
      row['Member Created At'] = member.created_at ? new Date(member.created_at).toISOString() : '';
      row['Team Registration Date'] = reg.created_at ? new Date(reg.created_at).toISOString() : '';
    }
    
    return row;
  });

  return { data, headers };
}

async function exportAnalytics(db: Db, includeFields: IncludeFields, startDate: Date, endDate: Date) {
  const data: Record<string, unknown>[] = [];
  const headers = ['Category', 'Metric', 'Value', 'Period', 'Details'];

  // Calculate the period string
  const periodStr = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // 1. Registration Analytics
  if (includeFields.registration !== false) {
    const totalRegistrations = await db.collection('registrations').countDocuments({
      created_at: { $gte: startDate, $lte: endDate }
    });

    const allTimeRegistrations = await db.collection('registrations').countDocuments();

    // Registration status breakdown
    const statusBreakdown = await db.collection('registrations').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray() as StatusBreakdown[];

    data.push({
      Category: 'Registration',
      Metric: 'Total Registrations',
      Value: totalRegistrations,
      Period: periodStr,
      Details: `All time: ${allTimeRegistrations}`
    });

    statusBreakdown.forEach((status: StatusBreakdown) => {
      data.push({
        Category: 'Registration',
        Metric: `${status._id || 'Unknown'} Status`,
        Value: status.count,
        Period: periodStr,
        Details: `${((status.count / totalRegistrations) * 100).toFixed(1)}% of total`
      });
    });
  }

  // 2. Revenue Analytics
  if (includeFields.payment !== false) {
    const revenueData = await db.collection('registrations').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total_amount' },
          paidRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'confirmed'] },
                '$total_amount',
                0
              ]
            }
          },
          pendingRevenue: {
            $sum: {
              $cond: [
                { $in: ['$status', ['pending', 'pending_review']] },
                '$total_amount',
                0
              ]
            }
          },
          avgAmount: { $avg: '$total_amount' }
        }
      }
    ]).toArray() as RevenueAnalytics[];

    const revenue = revenueData[0] || { _id: null, totalRevenue: 0, paidRevenue: 0, pendingRevenue: 0, avgAmount: 0 };

    data.push({
      Category: 'Revenue',
      Metric: 'Total Revenue',
      Value: `₹${revenue.totalRevenue || 0}`,
      Period: periodStr,
      Details: 'All registration amounts'
    });

    data.push({
      Category: 'Revenue',
      Metric: 'Confirmed Revenue',
      Value: `₹${revenue.paidRevenue || 0}`,
      Period: periodStr,
      Details: `${revenue.totalRevenue > 0 ? ((revenue.paidRevenue / revenue.totalRevenue) * 100).toFixed(1) : 0}% of total`
    });

    data.push({
      Category: 'Revenue',
      Metric: 'Pending Revenue',
      Value: `₹${revenue.pendingRevenue || 0}`,
      Period: periodStr,
      Details: `${revenue.totalRevenue > 0 ? ((revenue.pendingRevenue / revenue.totalRevenue) * 100).toFixed(1) : 0}% of total`
    });

    data.push({
      Category: 'Revenue',
      Metric: 'Average Amount per Registration',
      Value: `₹${Math.round(revenue.avgAmount || 0)}`,
      Period: periodStr,
      Details: 'Mean registration amount'
    });
  }

  // 3. Demographics Analytics
  if (includeFields.academic !== false) {
    // College distribution
    const topColleges = await db.collection('users').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray() as CollegeDepartmentStats[];

    const totalUsers = await db.collection('users').countDocuments({
      created_at: { $gte: startDate, $lte: endDate }
    });

    topColleges.forEach((college: CollegeDepartmentStats, index: number) => {
      data.push({
        Category: 'Demographics',
        Metric: `Top College #${index + 1}`,
        Value: college._id || 'Not specified',
        Period: periodStr,
        Details: `${college.count} users (${totalUsers > 0 ? ((college.count / totalUsers) * 100).toFixed(1) : 0}%)`
      });
    });

    // Department distribution
    const topDepartments = await db.collection('users').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$dept', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]).toArray() as CollegeDepartmentStats[];

    topDepartments.forEach((dept: CollegeDepartmentStats, index: number) => {
      data.push({
        Category: 'Demographics',
        Metric: `Top Department #${index + 1}`,
        Value: dept._id || 'Not specified',
        Period: periodStr,
        Details: `${dept.count} users (${totalUsers > 0 ? ((dept.count / totalUsers) * 100).toFixed(1) : 0}%)`
      });
    });
  }

  // 4. Track Analytics
  if (includeFields.tracks !== false) {
    const trackStats = await db.collection('registrations').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          workshopTracks: {
            $push: {
              $cond: [
                { $ne: ['$workshop_track', 'None'] },
                '$workshop_track',
                null
              ]
            }
          },
          competitionTracks: {
            $push: {
              $cond: [
                { $ne: ['$competition_track', 'None'] },
                '$competition_track',
                null
              ]
            }
          }
        }
      }
    ]).toArray() as TrackStats[];

    if (trackStats.length > 0) {
      const workshopCount = trackStats[0].workshopTracks.filter((t: string | null): t is string => t !== null).length;
      const competitionCount = trackStats[0].competitionTracks.filter((t: string | null): t is string => t !== null).length;
      const totalRegistrations = await db.collection('registrations').countDocuments({
        created_at: { $gte: startDate, $lte: endDate }
      });

      data.push({
        Category: 'Participation',
        Metric: 'Workshop Participation',
        Value: workshopCount,
        Period: periodStr,
        Details: `${totalRegistrations > 0 ? ((workshopCount / totalRegistrations) * 100).toFixed(1) : 0}% of registrations`
      });

      data.push({
        Category: 'Participation',
        Metric: 'Competition Participation',
        Value: competitionCount,
        Period: periodStr,
        Details: `${totalRegistrations > 0 ? ((competitionCount / totalRegistrations) * 100).toFixed(1) : 0}% of registrations`
      });

      // Workshop track breakdown
      const workshopBreakdown = await db.collection('registrations').aggregate([
        { 
          $match: { 
            created_at: { $gte: startDate, $lte: endDate },
            workshop_track: { $ne: 'None' }
          } 
        },
        { $group: { _id: '$workshop_track', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray() as CollegeDepartmentStats[];

      workshopBreakdown.forEach((track: CollegeDepartmentStats) => {
        data.push({
          Category: 'Workshop Tracks',
          Metric: track._id,
          Value: track.count,
          Period: periodStr,
          Details: `${workshopCount > 0 ? ((track.count / workshopCount) * 100).toFixed(1) : 0}% of workshop participants`
        });
      });

      // Competition track breakdown
      const competitionBreakdown = await db.collection('registrations').aggregate([
        { 
          $match: { 
            created_at: { $gte: startDate, $lte: endDate },
            competition_track: { $ne: 'None' }
          } 
        },
        { $group: { _id: '$competition_track', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray() as CollegeDepartmentStats[];

      competitionBreakdown.forEach((track: CollegeDepartmentStats) => {
        data.push({
          Category: 'Competition Tracks',
          Metric: track._id,
          Value: track.count,
          Period: periodStr,
          Details: `${competitionCount > 0 ? ((track.count / competitionCount) * 100).toFixed(1) : 0}% of competition participants`
        });
      });
    }
  }

  // 5. Team Analytics
  if (includeFields.team !== false) {
    const teamStats = await db.collection('registrations').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          avgTeamSize: { $avg: '$team_size' },
          totalTeams: { $sum: 1 },
          teamSizeDistribution: {
            $push: '$team_size'
          }
        }
      }
    ]).toArray() as TeamAnalytics[];

    if (teamStats.length > 0) {
      const stats = teamStats[0];
      
      data.push({
        Category: 'Team Analytics',
        Metric: 'Total Teams',
        Value: stats.totalTeams,
        Period: periodStr,
        Details: 'Number of registered teams'
      });

      data.push({
        Category: 'Team Analytics',
        Metric: 'Average Team Size',
        Value: Math.round((stats.avgTeamSize || 0) * 10) / 10,
        Period: periodStr,
        Details: 'Mean members per team'
      });

      // Team size distribution
      const sizeDistribution = await db.collection('registrations').aggregate([
        { $match: { created_at: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$team_size', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray() as TeamSizeDistribution[];

      sizeDistribution.forEach((size: TeamSizeDistribution) => {
        data.push({
          Category: 'Team Size Distribution',
          Metric: `${size._id} Member Teams`,
          Value: size.count,
          Period: periodStr,
          Details: `${stats.totalTeams > 0 ? ((size.count / stats.totalTeams) * 100).toFixed(1) : 0}% of teams`
        });
      });
    }
  }

  // 6. Temporal Analytics (Registration trends)
  if (includeFields.timestamps !== false) {
    const dailyRegistrations = await db.collection('registrations').aggregate([
      { $match: { created_at: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray() as DailyRegistrations[];

    if (dailyRegistrations.length > 0) {
      const maxDay = dailyRegistrations.reduce((max, day) => 
        day.count > max.count ? day : max
      );

      const minDay = dailyRegistrations.reduce((min, day) => 
        day.count < min.count ? day : min
      );

      data.push({
        Category: 'Trends',
        Metric: 'Peak Registration Day',
        Value: maxDay._id,
        Period: periodStr,
        Details: `${maxDay.count} registrations`
      });

      data.push({
        Category: 'Trends',
        Metric: 'Lowest Registration Day',
        Value: minDay._id,
        Period: periodStr,
        Details: `${minDay.count} registrations`
      });

      const avgDaily = dailyRegistrations.reduce((sum, day) => sum + day.count, 0) / dailyRegistrations.length;
      
      data.push({
        Category: 'Trends',
        Metric: 'Average Daily Registrations',
        Value: Math.round(avgDaily * 10) / 10,
        Period: periodStr,
        Details: `Over ${dailyRegistrations.length} active days`
      });
    }
  }

  return { data, headers };
}

async function exportRevenue(db: Db, _includeFields: IncludeFields, startDate: Date, endDate: Date) {
  const pipeline: Record<string, unknown>[] = [
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    }
  ];

  const transactions = await db.collection('registrations').aggregate(pipeline).toArray() as RegistrationDocument[];
  
  const headers = ['Date', 'Team ID', 'Amount', 'Status', 'Transaction ID', 'Payment Method'];
  const data = transactions.map((txn: RegistrationDocument) => ({
    'Date': txn.created_at ? new Date(txn.created_at).toLocaleDateString() : '',
    'Team ID': txn.team_id || '',
    'Amount': `₹${txn.total_amount || 0}`,
    'Status': txn.status || 'pending',
    'Transaction ID': txn.transaction_id || '',
    'Payment Method': txn.payment_method || 'UPI'
  }));

  return { data, headers };
}

function generateCSV(data: Record<string, unknown>[], headers: string[], exportType: string) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="samyukta_${exportType}_${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}

async function generateExcel(data: Record<string, unknown>[], headers: string[], exportType: string) {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    
    // Add headers with styling
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data rows
    data.forEach(row => {
      const rowData = headers.map(header => row[header] || '');
      worksheet.addRow(rowData);
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });
    
    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="samyukta_${exportType}_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Excel generation error:', error);
    // Fallback to CSV
    return generateCSV(data, headers, exportType);
  }
}

function generatePDF(data: Record<string, unknown>[], headers: string[], exportType: string) {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Samyukta ${exportType.charAt(0).toUpperCase() + exportType.slice(1)} Report`, 20, 20);
    
    // Add timestamp
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);
    
    // Prepare table data
    const tableData = data.map(row => 
      headers.map(header => String(row[header] || ''))
    );
    
    // Add table
    autoTable(doc, {
      startY: 50,
      head: [headers],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 50, left: 10, right: 10 },
      theme: 'striped',
    });
    
    // Add footer - simplified approach without page numbers for now
    doc.setFontSize(10);
    doc.text(
      `Generated by Samyukta Dashboard`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="samyukta_${exportType}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback to CSV
    return generateCSV(data, headers, exportType);
  }
}