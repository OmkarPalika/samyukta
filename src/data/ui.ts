// UI Constants and Configuration
export const UI_CONFIG = {
  // Color Schemes
  colors: {
    primary: {
      blue: "from-blue-500 to-cyan-500",
      violet: "from-violet-500 to-purple-500", 
      pink: "from-pink-500 to-rose-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-400 to-amber-500",
      red: "from-red-400 to-rose-500",
      yellow: "from-yellow-400 to-amber-500"
    },
    backgrounds: {
      blue: "bg-blue-500/10",
      violet: "bg-violet-500/10",
      pink: "bg-pink-500/10",
      green: "bg-green-500/10",
      orange: "bg-orange-500/10",
      red: "bg-red-500/10",
      yellow: "bg-yellow-500/10"
    },
    text: {
      blue: "text-blue-400",
      violet: "text-violet-400",
      pink: "text-pink-400",
      green: "text-green-400",
      orange: "text-orange-400",
      red: "text-red-400",
      yellow: "text-yellow-400"
    },
    borders: {
      blue: "border-blue-500/20",
      violet: "border-violet-500/20",
      pink: "border-pink-500/20",
      green: "border-green-500/20",
      orange: "border-orange-500/20",
      red: "border-red-500/20",
      yellow: "border-yellow-500/20"
    }
  },

  // Event Type Colors for Timeline
  event_types: {
    ceremony: "from-yellow-500 to-orange-500",
    workshop: "from-blue-500 to-cyan-500",
    game: "from-green-500 to-emerald-500",
    cultural: "from-purple-500 to-violet-500",
    competition: "from-red-500 to-pink-500",
    networking: "from-cyan-500 to-blue-500",
    visit: "from-pink-500 to-rose-500",
    break: "from-gray-500 to-gray-600",
    logistics: "from-indigo-500 to-purple-500"
  },

  // Animation Delays
  animations: {
    stagger_delay: 0.1,
    card_delay: 0.05,
    section_delay: 0.2
  },

  // Responsive Breakpoints (for reference)
  breakpoints: {
    sm: "640px",
    md: "768px", 
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  }
} as const;

// Common Badge Configurations
export const BADGE_CONFIGS = {
  early_bird: {
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: "Star",
    text: "Early Bird Pricing Active"
  },
  limited_slots: {
    className: "bg-red-500/10 text-red-400 border-red-500/20", 
    icon: "Clock",
    text: "Limited Slots Available"
  },
  best_value: {
    className: "bg-gradient-to-r from-yellow-400 to-orange-400 text-black",
    icon: "Star",
    text: "Best Value"
  }
} as const;