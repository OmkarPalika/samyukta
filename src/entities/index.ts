// Export all entities for easy importing
export * from './User';
export * from './Game';
export * from './HelpTicket';
export * from './PitchRating';
export * from './Gallery';
export * from './Registration';

// Re-export commonly used types
export type {
  // User types
  UserData,
  UserResponse,
  LoginCredentials,
} from './User';

export type {
  // Game types
  GameData,
  GameResponse,
  GameCreateRequest,
} from './Game';

export type {
  // HelpTicket types
  HelpTicketData,
  HelpTicketResponse,
  HelpTicketCreateRequest,
  HelpTicketUpdateRequest,
} from './HelpTicket';

export type {
  // PitchRating types
  PitchRatingData,
  PitchRatingResponse,
  PitchRatingCreateRequest,
  PitchTeamScore,
} from './PitchRating';

export type {
  // Gallery types
  GalleryData,
  GalleryResponse,
  GalleryCreateRequest,
  GalleryFilters,
} from './Gallery';

export type {
  // Registration types
  RegistrationData,
  RegistrationResponse,
  RegistrationCreateRequest,
  RegistrationUpdateRequest,
  RegistrationFilters,
  RegistrationStats,
  TeamMember,
} from './Registration';

// Export the main classes
export { User } from './User';
export { Game } from './Game';
export { HelpTicket } from './HelpTicket';
export { PitchRating } from './PitchRating';
export { Gallery } from './Gallery';
export { Registration } from './Registration';