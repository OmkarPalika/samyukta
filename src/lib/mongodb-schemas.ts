import { Db, ObjectId } from 'mongodb';

// MongoDB Schema Definitions
export interface UserSchema {
  _id?: ObjectId;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'coordinator' | 'participant';
  college?: string;
  track?: string;
  year?: string;
  dept?: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RegistrationSchema {
  _id?: ObjectId;
  team_id: string;
  college: string;
  team_size: number;
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  registration_code?: string;
  qr_code_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMemberSchema {
  _id?: ObjectId;
  registration_id: string;
  participant_id?: string;
  passkey?: string;
  full_name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  year: string;
  department: string;
  college?: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  is_club_lead?: boolean;
  club_name?: string;
  present?: boolean;
  qr_code_url?: string;
  created_at: Date;
}

export interface WorkshopSchema {
  _id?: ObjectId;
  name: string;
  track: 'Cloud' | 'AI';
  instructor: string;
  description: string;
  schedule: Date;
  duration_hours: number;
  capacity: number;
  enrolled: number;
  materials_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface WorkshopAttendanceSchema {
  _id?: ObjectId;
  workshop_id: string;
  participant_id: string;
  check_in_time?: Date;
  completion_status: 'registered' | 'attended' | 'completed';
  certificate_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CompetitionSchema {
  _id?: ObjectId;
  name: string;
  description: string;
  category: 'Hackathon' | 'Pitch' | 'Design' | 'Gaming';
  max_team_size: number;
  min_team_size: number;
  registration_fee: number;
  slots_available: number;
  slots_filled: number;
  registration_deadline: Date;
  competition_date: Date;
  status: 'open' | 'closed' | 'ongoing' | 'completed';
  requirements: string[];
  prizes: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CompetitionRegistrationSchema {
  _id?: ObjectId;
  competition_id: string;
  user_id: string;
  team_id?: string;
  registration_type: 'individual' | 'team';
  transaction_id: string;
  payment_screenshot_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface HelpTicketSchema {
  _id?: ObjectId;
  submitted_by: string;
  assigned_to?: string;
  title: string;
  description?: string;
  response?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachment_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SocialItemSchema {
  _id?: ObjectId;
  uploaded_by: string;
  caption: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface GameSchema {
  _id?: ObjectId;
  user_id: string;
  action: 'qr_scan' | 'suspect_added';
  data?: string;
  suspect_id?: string;
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PitchRatingSchema {
  _id?: ObjectId;
  pitch_team_id: string;
  voter_id: string;
  rating: number; // 1-5
  comment?: string;
  pitch_round: string;
  created_at: Date;
  updated_at: Date;
}

export interface SessionSchema {
  _id?: ObjectId;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
}

// Database initialization
export async function initializeDatabase(db: Db) {
  try {
    // Create collections with indexes
    await Promise.all([
      // Users collection
      db.collection('users').createIndexes([
        { key: { email: 1 }, unique: true, name: 'email_unique' },
        { key: { role: 1 } },
        { key: { created_at: -1 } }
      ]),

    // Registrations collection
    db.collection('registrations').createIndexes([
      { key: { team_id: 1 }, unique: true },
      { key: { college: 1 } },
      { key: { status: 1 } },
      { key: { ticket_type: 1 } },
      { key: { workshop_track: 1 } },
      { key: { competition_track: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Team members collection
    db.collection('team_members').createIndexes([
      { key: { registration_id: 1 } },
      { key: { email: 1 } },
      { key: { participant_id: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Workshops collection
    db.collection('workshops').createIndexes([
      { key: { track: 1 } },
      { key: { status: 1 } },
      { key: { schedule: 1 } },
      { key: { instructor: 1 } }
    ]),

    // Workshop attendance collection
    db.collection('workshop_attendance').createIndexes([
      { key: { workshop_id: 1, participant_id: 1 }, unique: true },
      { key: { completion_status: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Competitions collection
    db.collection('competitions').createIndexes([
      { key: { category: 1 } },
      { key: { status: 1 } },
      { key: { registration_deadline: 1 } },
      { key: { competition_date: 1 } }
    ]),

    // Competition registrations collection
    db.collection('competition_registrations').createIndexes([
      { key: { competition_id: 1, user_id: 1 }, unique: true },
      { key: { status: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Help tickets collection
    db.collection('help_tickets').createIndexes([
      { key: { submitted_by: 1 } },
      { key: { assigned_to: 1 } },
      { key: { status: 1 } },
      { key: { priority: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Social items collection
    db.collection('social_items').createIndexes([
      { key: { uploaded_by: 1 } },
      { key: { status: 1 } },
      { key: { category: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Games collection
    db.collection('games').createIndexes([
      { key: { user_id: 1 } },
      { key: { action: 1 } },
      { key: { timestamp: -1 } }
    ]),

    // Pitch ratings collection
    db.collection('pitch_ratings').createIndexes([
      { key: { pitch_team_id: 1, voter_id: 1 }, unique: true },
      { key: { pitch_round: 1 } },
      { key: { rating: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Sessions collection
    db.collection('sessions').createIndexes([
      { key: { session_token: 1 }, unique: true },
      { key: { user_id: 1 } },
      { key: { expires_at: 1 }, expireAfterSeconds: 0 }
    ])
  ]);

  console.log('Database collections and indexes created successfully');
  } catch (error: unknown) {
    // If the error is about index already existing, we can safely ignore it
    if (error && typeof error === 'object' && 'code' in error && 'codeName' in error && error.code === 85 && error.codeName === 'IndexOptionsConflict') {
    } else {
      // For other errors, we should still throw
      throw error;
    }
  }
}

// Collection getters
export function getCollections(db: Db) {
  return {
    users: db.collection<UserSchema>('users'),
    registrations: db.collection<RegistrationSchema>('registrations'),
    teamMembers: db.collection<TeamMemberSchema>('team_members'),
    workshops: db.collection<WorkshopSchema>('workshops'),
    workshopAttendance: db.collection<WorkshopAttendanceSchema>('workshop_attendance'),
    competitions: db.collection<CompetitionSchema>('competitions'),
    competitionRegistrations: db.collection<CompetitionRegistrationSchema>('competition_registrations'),
    helpTickets: db.collection<HelpTicketSchema>('help_tickets'),
    socialItems: db.collection<SocialItemSchema>('social_items'),
    games: db.collection<GameSchema>('games'),
    pitchRatings: db.collection<PitchRatingSchema>('pitch_ratings'),
    sessions: db.collection<SessionSchema>('sessions')
  };
}