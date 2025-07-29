// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  mobile_number?: string; // New field for mobile number
  whatsapp?: string;
  role: 'admin' | 'coordinator' | 'participant' | 'volunteer';
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
  created_at?: string;
  updated_at?: string;
}

export interface LoginUser extends User {
  password: string;
}

export interface UserResponse extends User {
  token?: string;
  session_id?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  passkey?: string;
}

// Competition Types
export interface Competition {
  id: string;
  name: string;
  description: string;
  category: 'Hackathon' | 'Pitch' | 'Design' | 'Gaming';
  max_team_size: number;
  min_team_size: number;
  registration_fee: number;
  slots_available: number;
  slots_filled: number;
  registration_deadline: string;
  competition_date: string;
  status: 'open' | 'closed' | 'ongoing' | 'completed';
  requirements: string[];
  prizes: string[];
}

export interface CompetitionRegistration {
  id?: string;
  competition_id: string;
  user_id: string;
  team_id?: string;
  registration_type: 'individual' | 'team';
  transaction_id: string;
  payment_screenshot_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface UserCompetitionData {
  competition: Competition;
  registration: CompetitionRegistration;
  team_members?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

// Registration Types
export interface TeamMember {
  id?: string;
  participant_id?: string;
  passkey?: string;
  full_name: string;
  name?: string; // Alias for full_name
  email: string;
  phone?: string;
  whatsapp: string;
  year: string;
  department: string;
  dept?: string; // Alias for department
  college?: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  present?: boolean; // For attendance tracking
}

// Legacy type alias for TeamMember
export type RegistrationMember = TeamMember;

export interface RegistrationData {
  team_id?: string;
  college: string;
  team_size?: number;
  members: TeamMember[];
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'Cybersecurity' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status?: 'completed' | 'pending_review';
}

export interface RegistrationCreateRequest {
  college: string;
  members: TeamMember[];
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'Cybersecurity' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
}

export interface RegistrationUpdateRequest {
  college?: string;
  members?: TeamMember[];
  ticket_type?: 'Combo' | 'Custom';
  workshop_track?: 'Cloud' | 'AI' | 'Cybersecurity' | 'None';
  competition_track?: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status?: 'completed' | 'pending_review';
}

export interface RegistrationResponse extends Omit<RegistrationData, 'status'> {
  id: string;
  team_id: string;
  team_size: number;
  total_amount: number;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  created_at: string;
  updated_at: string;
  team_leader?: TeamMember;
  registration_code?: string;
  qr_code_url?: string;
}

export interface RegistrationFilters {
  college?: string;
  ticket_type?: 'Combo' | 'Custom';
  workshop_track?: 'Cloud' | 'AI' | 'Cybersecurity' | 'None';
  competition_track?: 'Hackathon' | 'Pitch' | 'None';
  status?: 'completed' | 'pending_review';
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Legacy interface for backward compatibility
export interface RegistrationRequest extends Omit<RegistrationCreateRequest, 'workshop_track' | 'competition_track'> {
  workshop_track?: 'Cloud Computing' | 'AI & ML' | 'Cybersecurity';
  competition_track?: 'Hackathon' | 'Startup Pitch';
}

// Help Ticket Types
export interface HelpTicket {
  id: string;
  title: string;
  description: string;
  submitted_by: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at?: string;
  attachment_url?: string;
}

// Social Types
export interface SocialItem {
  id: string;
  uploaded_by: string;
  caption: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  category?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  tags?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  channels: string[];
  recipients: {
    type: 'all' | 'role' | 'custom';
    count?: number;
    criteria?: Record<string, unknown>;
    filters?: {
      roles?: string[];
      colleges?: string[];
      departments?: string[];
      user_ids?: string[];
    };
  };
  scheduled_at?: string;
  sent_at?: string;
  expires_at?: string;
  action_url?: string;
  action_text?: string;
  created_at: string;
  created_by: string;
}

export interface NotificationStats {
  total_sent: number;
  total_delivered: number;
  total_read: number;
  total_clicked: number;
  delivery_rate: number;
  read_rate: number;
  click_rate: number;
  sent_change?: number;
  delivered_change?: number;
  read_rate_change?: number;
  click_rate_change?: number;
}

// Game Types
export interface GameAction {
  id: string;
  userId: string;
  action: 'qr_scan' | 'suspect_added';
  data?: string;
  suspectId?: string;
  timestamp: string;
}

export interface GameStats {
  totalScans: number;
  activePlayers: number;
  totalSuspects: number;
}

// Pitch Rating Types
export interface PitchRating {
  id: string;
  pitch_team_id: string;
  voter_id: string;
  rating: number; // 1-5
  comment?: string;
  pitch_round: string;
  created_at: string;
  updated_at?: string;
}

export interface PitchTeamScore {
  team_id: string;
  team_name: string;
  average_rating: number;
  total_votes: number;
  ratings_breakdown: Record<string, number>;
  comments: Array<{
    rating: number;
    comment: string;
    voter_name: string;
  }>;
}

// Registration Stats Types
export interface RegistrationStats {
  total_registrations: number;
  total_participants?: number;
  cloud_workshop?: number;
  ai_workshop?: number;
  hackathon_entries?: number;
  pitch_entries?: number;
  max_total?: number;
  max_cloud?: number;
  max_ai?: number;
  remaining_total?: number;
  remaining_cloud?: number;
  remaining_ai?: number;
  direct_join_available?: boolean;
  direct_join_hackathon_price?: number;
  direct_join_pitch_price?: number;
  by_status?: Record<string, number>;
  by_ticket_type?: Record<string, number>;
  by_workshop_track?: Record<string, number>;
  by_competition_track?: Record<string, number>;
  by_college?: Array<{ college: string; count: number }>;
  accommodation_requests?: number;
  food_preferences?: Record<string, number>;
  total_revenue?: number;
}

// Game Entity Types
export interface GameCreateRequest {
  userId: string;
  action: 'qr_scan' | 'suspect_added';
  data?: string;
  suspectId?: string;
}

export interface GameResponse extends GameAction {
  created_at?: string;
  updated_at?: string;
}

// Help Ticket Entity Types
export interface HelpTicketCreateRequest {
  submitted_by: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachment_url?: string;
}

export interface HelpTicketUpdateRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  attachment_url?: string;
}

export interface HelpTicketResponse extends HelpTicket {
  submitter_details?: {
    full_name: string;
    email: string;
  };
  assignee_details?: {
    full_name: string;
    email: string;
  };
}

// Social Entity Types
export interface SocialCreateRequest {
  uploaded_by: string;
  file_url: string;
  caption: string;
}

export interface SocialResponse extends SocialItem {
  uploader_details?: {
    full_name: string;
    email: string;
  };
}

// Pitch Rating Entity Types
export interface PitchRatingCreateRequest {
  pitch_team_id: string;
  voter_id: string;
  rating: number; // 1-5
  comment?: string;
  pitch_round: string;
}

export interface PitchRatingUpdateRequest {
  rating?: number; // 1-5
  comment?: string;
  pitch_round?: string;
}

export interface PitchRatingResponse extends PitchRating {
  voter_details?: {
    full_name: string;
    email: string;
  };
  team_details?: {
    team_name: string;
    members: Array<{
      full_name: string;
      email: string;
    }>;
  };
}



// Workshop Types
export interface Workshop {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface WorkshopAttendance {
  id: string;
  workshop_id: string;
  participant_id: string;
  check_in_time?: Date;
  completion_status: 'registered' | 'attended' | 'completed';
  certificate_url?: string;
  created_at: string;
}

export interface WorkshopCreateRequest {
  name: string;
  track: 'Cloud' | 'AI';
  instructor: string;
  description: string;
  schedule: Date;
  duration_hours: number;
  capacity: number;
  materials_url?: string;
}

// Interactive Map Types
export interface MapLocation {
  id: string;
  name: string;
  type: 'venue' | 'transport' | 'accommodation' | 'food' | 'landmark';
  coordinates: { lat: number; lng: number };
  description: string;
  icon: string; // Icon name or component
  color: string;
  distance?: string;
  estimatedTime?: string;
}

// Speaker Types
export interface Speaker {
  id: string;
  name: string;
  designation: string;
  company: string;
  bio: string;
  track: string;
  session: string;
  day: string;
  time: string;
  expertise: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface SpeakerTrack {
  name: string;
  color: string;
}

export interface SpeakingBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface SpeakersStatus {
  isReady: boolean;
  message: string;
  expectedUpdateDate: string;
}

// Registration Form Types
export interface RegistrationFormMember {
  fullName: string;
  email: string;
  whatsapp: string;
  year: string;
  department: string;
  accommodation: boolean;
  foodPreference: 'veg' | 'non-veg';
  isClubLead?: boolean;
  clubName?: string;
}

export interface RegistrationFormData {
  college: string;
  customCollege: string;
  teamSize: number;
  members: RegistrationFormMember[];
  tickets: {
    combo: boolean;
    workshop: string;
    competition: string;
  };
  memberTracks: Array<{
    workshopTrack: string;
    competitionTrack: string;
  }>;
  payment: {
    transactionId: string;
    screenshot: File | null;
  };
}

export interface CompletedRegistrationData {
  team_id: string;
  college: string;
  members: Array<{
    participant_id: string;
    passkey: string;
    full_name: string;
    email: string;
    whatsapp: string;
    year: string;
    department: string;
    accommodation: boolean;
    food_preference: string;
    workshop_track: string;
    competition_track: string;
  }>;
  ticket_type: string;
  workshop_track: string;
  competition_track: string;
  total_amount: number;
  transaction_id: string;
  payment_screenshot_url: string;
}

// Webpage Management Types
export interface WebpageContent {
  id: string;
  type: 'speaker' | 'sponsor' | 'team' | 'event' | 'general';
  title: string;
  content: Record<string, unknown>; // JSON content based on type
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SpeakerContent {
  name: string;
  designation: string;
  company: string;
  bio: string;
  image_url?: string;
  track: string;
  session: string;
  day: string;
  time: string;
  expertise: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface SponsorContent {
  name: string;
  logo_url: string;
  website?: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  description?: string;
  benefits?: string[];
}

export interface TeamMemberContent {
  name: string;
  role: string;
  department?: string;
  image_url?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    email?: string;
  };
}

export interface EventContent {
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image_url?: string;
  registration_required: boolean;
  max_participants?: number;
  current_participants?: number;
}




// Email Management Types
export interface EmailTemplate {
  id: string;
  name: string;
  type: 'announcement' | 'alert' | 'reminder' | 'confirmation' | 'welcome';
  subject: string;
  html_content: string;
  text_content?: string;
  variables?: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  template_id: string;
  recipients: {
    type: 'role' | 'custom' | 'all';
    filters?: {
      roles?: string[];
      custom_emails?: string[];
    };
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  stats?: {
    total_recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  sent_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}


export interface UserNotification {
  id: string;
  notification_id: string;
  user_id: string;
  read: boolean;
  read_at?: string;
  clicked: boolean;
  clicked_at?: string;
  created_at: string;
}

export interface NotificationStats {
  total_sent: number;
  total_delivered: number;
  total_read: number;
  total_clicked: number;
  delivery_rate: number;
  read_rate: number;
  click_rate: number;
}