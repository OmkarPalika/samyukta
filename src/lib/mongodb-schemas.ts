import { Db, ObjectId } from 'mongodb';

// MongoDB Schema Definitions
export interface UserSchema {
  _id?: ObjectId;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'coordinator' | 'participant' | 'volunteer';
  phone?: string;
  mobile_number?: string; // New field for mobile number
  whatsapp?: string;
  college?: string;
  track?: string;
  // Academic Information
  academic?: {
    year: string;
    department: string;
  };
  year?: string; // Keep for backward compatibility
  dept?: string; // Keep for backward compatibility
  // Position and Committee
  position?: string;
  committee?: string;
  designation?: string; // Keep for backward compatibility
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    in_app: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface RegistrationSchema {
  _id?: ObjectId;
  team_id: string;
  college: string;
  team_size: number;
  ticket_type: 'Combo' | 'Custom' | 'startup_only';
  workshop_track: 'Cloud' | 'AI' | 'Cybersecurity' | 'None' | null;
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
  gender?: string;
  accommodation: boolean;
  accommodation_room?: string;
  accommodation_status?: 'checked_in' | 'checked_out';
  food_preference: 'veg' | 'non-veg';
  is_club_lead?: boolean;
  club_name?: string;
  present?: boolean;
  qr_code?: string;
  qr_code_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkshopSchema {
  _id?: ObjectId;
  name: string;
  track: 'Cloud' | 'AI' | 'Cybersecurity';
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
  // Startup Pitch specific fields
  startup_name?: string;
  pitch_category?: string;
  brief_description?: string;
  problem_statement?: string;
  target_market?: string;
  current_stage?: string;
  team_size?: string;
  funding_status?: string;
  pitch_deck_url?: string;
  demo_url?: string;
  team_members?: string[]; // Array of team member names
  external_members?: string[]; // Array of external member names
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
  team_id?: string;
  action: 'qr_scan' | 'suspect_added' | 'imposter_guess';
  game_type?: 'qr_quest' | 'imposter_hunt';
  data?: string;
  suspect_id?: string;
  qr_id?: string;
  guessed_imposter_id?: string;
  is_correct?: boolean;
  actual_imposter_id?: string;
  points_earned?: number;
  bonus_completed?: boolean;
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ImposterTeamSchema {
  _id?: ObjectId;
  team_id: string;
  college: string;
  member_ids: string[];
  imposter_id: string;
  imposter_name: string;
  is_active: boolean;
  created_at: Date;
}

export interface QRQuestLocationSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  location: string;
  points: number;
  bonus_question?: string;
  bonus_answer?: string;
  bonus_points?: number;
  hint?: string;
  is_active: boolean;
  created_at: Date;
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

export interface CompetitionCheckinSchema {
  _id?: ObjectId;
  participant_id: string;
  participant_name: string;
  team_id: string;
  competition_type: string;
  checkin_time: Date;
  date: string;
  created_at?: Date;
}

export interface SessionSchema {
  _id?: ObjectId;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
  user_agent?: string;
  ip_address?: string;
}

export interface MealSchema {
  _id?: ObjectId;
  participant_id: string;
  participant_name: string;
  meal_type: string;
  food_preference: 'veg' | 'non-veg';
  distributed_at: Date;
  date: string;
}

export interface WorkshopAttendanceLogSchema {
  _id?: ObjectId;
  participant_id: string;
  participant_name: string;
  workshop_track: string;
  workshop_session: string;
  action: string;
  timestamp: Date;
  date: string;
}

export interface AccommodationLogSchema {
  _id?: ObjectId;
  participant_id: string;
  participant_name: string;
  gender: string;
  action: 'checkin' | 'checkout';
  room_number?: string;
  timestamp: Date;
  date: string;
}

// New schemas for webpage management, email templates, and notifications
export interface WebpageContentSchema {
  _id?: ObjectId;
  type: 'speaker' | 'sponsor' | 'team' | 'event' | 'general';
  title: string;
  content: Record<string, unknown>; // JSON content based on type
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface EmailTemplateSchema {
  _id?: ObjectId;
  name: string;
  type: 'announcement' | 'alert' | 'reminder' | 'welcome' | 'confirmation' | 'custom';
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[]; // List of template variables like {{name}}, {{event_date}}
  created_by: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface EmailCampaignSchema {
  _id?: ObjectId;
  name: string;
  template_id: string;
  recipients: {
    type: 'all' | 'role' | 'custom';
    filters?: {
      roles?: string[];
      colleges?: string[];
      tracks?: string[];
      custom_emails?: string[];
    };
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at?: Date;
  sent_at?: Date;
  stats?: {
    total_recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationSchema {
  _id?: ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipients: {
    type: 'all' | 'role' | 'custom';
    filters?: {
      roles?: string[];
      colleges?: string[];
      tracks?: string[];
      user_ids?: string[];
    };
  };
  channels: ('in_app' | 'email' | 'sms' | 'push')[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_at?: Date;
  sent_at?: Date;
  expires_at?: Date;
  action_url?: string;
  action_text?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserNotificationSchema {
  _id?: ObjectId;
  notification_id: string;
  user_id: string;
  read: boolean;
  read_at?: Date;
  clicked: boolean;
  clicked_at?: Date;
  created_at: Date;
}

export interface EmailTrackingSchema {
  _id?: ObjectId;
  notification_id?: string;
  campaign_id?: string;
  user_id: string;
  email: string;
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  timestamp: Date;
  user_agent?: string;
  ip_address?: string;
  click_url?: string;
  created_at: Date;
}

export interface PushSubscriptionSchema {
  _id?: ObjectId;
  user_id: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  user_agent?: string;
  created_at: Date;
  updated_at: Date;
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

    // Competition checkins collection
    db.collection('competition_checkins').createIndexes([
      { key: { participant_id: 1, competition_type: 1, date: 1 }, unique: true },
      { key: { team_id: 1 } },
      { key: { competition_type: 1 } },
      { key: { checkin_time: -1 } }
    ]),

    // Sessions collection
    db.collection('sessions').createIndexes([
      { key: { session_token: 1 }, unique: true },
      { key: { user_id: 1 } },
      { key: { expires_at: 1 }, expireAfterSeconds: 0 }
    ]),

    // Meals collection
    db.collection('meals').createIndexes([
      { key: { participant_id: 1, meal_type: 1, date: 1 }, unique: true },
      { key: { distributed_at: -1 } }
    ]),

    // Workshop attendance logs collection
    db.collection('workshop_attendance_logs').createIndexes([
      { key: { participant_id: 1, workshop_session: 1, date: 1 } },
      { key: { workshop_track: 1 } },
      { key: { timestamp: -1 } }
    ]),

    // Accommodation logs collection
    db.collection('accommodation_logs').createIndexes([
      { key: { participant_id: 1, action: 1, date: 1 } },
      { key: { room_number: 1 } },
      { key: { timestamp: -1 } }
    ]),

    // Webpage content collection
    db.collection('webpage_content').createIndexes([
      { key: { type: 1 } },
      { key: { status: 1 } },
      { key: { created_by: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Email templates collection
    db.collection('email_templates').createIndexes([
      { key: { type: 1 } },
      { key: { is_active: 1 } },
      { key: { created_by: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Email campaigns collection
    db.collection('email_campaigns').createIndexes([
      { key: { template_id: 1 } },
      { key: { status: 1 } },
      { key: { created_by: 1 } },
      { key: { scheduled_at: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Notifications collection
    db.collection('notifications').createIndexes([
      { key: { type: 1 } },
      { key: { priority: 1 } },
      { key: { status: 1 } },
      { key: { created_by: 1 } },
      { key: { scheduled_at: 1 } },
      { key: { created_at: -1 } }
    ]),

    // User notifications collection
    db.collection('user_notifications').createIndexes([
      { key: { notification_id: 1, user_id: 1 }, unique: true },
      { key: { user_id: 1, read: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Email tracking collection
    db.collection('email_tracking').createIndexes([
      { key: { notification_id: 1 } },
      { key: { campaign_id: 1 } },
      { key: { user_id: 1 } },
      { key: { event_type: 1 } },
      { key: { timestamp: -1 } }
    ]),

    // Push subscriptions collection
    db.collection('push_subscriptions').createIndexes([
      { key: { user_id: 1 } },
      { key: { 'subscription.endpoint': 1 }, unique: true },
      { key: { created_at: -1 } }
    ]),

    // Imposter teams collection
    db.collection('imposter_teams').createIndexes([
      { key: { team_id: 1 }, unique: true },
      { key: { imposter_id: 1 } },
      { key: { is_active: 1 } },
      { key: { college: 1 } },
      { key: { created_at: -1 } }
    ]),

    // QR Quest locations collection
    db.collection('qr_quest_locations').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { is_active: 1 } },
      { key: { points: 1 } },
      { key: { created_at: -1 } }
    ]),

    // Game statistics collection
    db.collection('game_statistics').createIndexes([
      { key: { type: 1 } },
      { key: { updated_at: -1 } }
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
    competitionCheckins: db.collection<CompetitionCheckinSchema>('competition_checkins'),
    helpTickets: db.collection<HelpTicketSchema>('help_tickets'),
    socialItems: db.collection<SocialItemSchema>('social_items'),
    games: db.collection<GameSchema>('games'),
    pitchRatings: db.collection<PitchRatingSchema>('pitch_ratings'),
    sessions: db.collection<SessionSchema>('sessions'),
    meals: db.collection<MealSchema>('meals'),
    workshopAttendanceLogs: db.collection<WorkshopAttendanceLogSchema>('workshop_attendance_logs'),
    accommodationLogs: db.collection<AccommodationLogSchema>('accommodation_logs'),
    webpageContent: db.collection<WebpageContentSchema>('webpage_content'),
    emailTemplates: db.collection<EmailTemplateSchema>('email_templates'),
    emailCampaigns: db.collection<EmailCampaignSchema>('email_campaigns'),
    notifications: db.collection<NotificationSchema>('notifications'),
    userNotifications: db.collection<UserNotificationSchema>('user_notifications'),
    emailTracking: db.collection<EmailTrackingSchema>('email_tracking'),
    pushSubscriptions: db.collection<PushSubscriptionSchema>('push_subscriptions'),
    imposterTeams: db.collection<ImposterTeamSchema>('imposter_teams'),
    qrQuestLocations: db.collection<QRQuestLocationSchema>('qr_quest_locations'),
    gameStatistics: db.collection('game_statistics')
  };
}