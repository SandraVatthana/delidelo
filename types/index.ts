// Types GameCrush

export interface User {
  id: string
  email: string
  pseudo: string
  avatar_url?: string
  age?: number
  city?: string
  intentions: ('friends' | 'love' | 'network')[]
  created_at: string
  is_premium: boolean
  premium_until?: string
  messages_remaining: number
  coach_remaining: number
}

export interface UserProfile {
  user_id: string
  childhood_game?: string
  ideal_evening?: string
  three_words?: string[]
}

export interface Season {
  id: string
  name: string
  theme?: string
  starts_at: string
  ends_at: string
  is_active: boolean
}

export interface Challenge {
  id: string
  season_id: string
  type: 'poem' | 'association' | 'mythology' | 'manege' | 'ancient_game'
  title: string
  description?: string
  points: number
  data: Record<string, unknown>
}

export interface ChallengeParticipation {
  id: string
  user_id: string
  challenge_id: string
  response: Record<string, unknown>
  points_earned: number
  completed_at: string
}

export interface ManegeSession {
  id: string
  user_id: string
  candidates: string[]
  current_question: number
  hearts: Record<string, number>
  status: 'in_progress' | 'revealed' | 'matched'
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  sent_at: string
  read_at?: string
}

export interface VirtualGift {
  id: string
  sender_id: string
  receiver_id: string
  type: 'rose' | 'bouquet' | 'eternal'
  message?: string
  price: number
  sent_at: string
}

export interface Partner {
  id: string
  name: string
  type: 'cafe' | 'florist' | 'bakery' | 'spa' | 'restaurant' | 'escape_game'
  address: string
  city: string
  logo_url?: string
  commission_rate: number
  is_active: boolean
}

export interface PartnerProduct {
  id: string
  partner_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_available: boolean
}

export interface MysteryGift {
  id: string
  sender_id: string
  receiver_id: string
  partner_id: string
  product_name: string
  price: number
  commission: number
  status: 'pending' | 'accepted' | 'declined' | 'redeemed'
  qr_code?: string
  accepted_at?: string
  redeemed_at?: string
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  season_id: string
  total_points: number
  rank: number
}

export interface LoveCrushGame {
  id: string
  user_id: string
  opponent_id?: string
  mode: 'solo' | 'duel'
  score: number
  opponent_score?: number
  winner_id?: string
  played_at: string
}

export interface FirstDateOffer {
  id: string
  partner_id: string
  name: string
  description?: string
  price_per_person: number
  duration?: string
  includes?: string[]
  is_available: boolean
}

export interface FirstDateBooking {
  id: string
  offer_id: string
  initiator_id: string
  invited_id: string
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  proposed_date?: string
  confirmation_code?: string
  total_price: number
  commission: number
  created_at: string
  accepted_at?: string
  completed_at?: string
}

export interface LoveBoxProduct {
  id: string
  name: string
  description?: string
  price: number
  contents: string[]
  image_url?: string
  is_available: boolean
}

export interface LoveBoxOrder {
  id: string
  user_id: string
  partner_user_id?: string
  first_date_booking_id?: string
  product_id: string
  delivery_type: 'postal' | 'partner_pickup'
  delivery_address?: string
  partner_id?: string
  status: 'pending' | 'paid' | 'shipped' | 'ready_for_pickup' | 'delivered' | 'picked_up'
  tracking_number?: string
  total_price: number
  created_at: string
  shipped_at?: string
  delivered_at?: string
}

export interface SuccessStory {
  id: string
  user1_id: string
  user2_id?: string
  story: string
  photo_url?: string
  display_names: string
  location?: string
  matched_via?: string
  first_date_location?: string
  status?: 'together' | 'engaged' | 'married'
  is_public: boolean
  is_approved: boolean
  submitted_at: string
  approved_at?: string
}

// Types pour l'onboarding
export interface OnboardingData {
  pseudo: string
  age?: number
  city?: string
  intentions: ('friends' | 'love' | 'network')[]
  childhood_game?: string
  ideal_evening?: string
  three_words?: string[]
}

// Types pour le Coach Love
export interface CoachSuggestion {
  type: 'message_inspiration' | 'signal_decoder' | 'bio_tip' | 'moment_key'
  content: string
  options?: string[]
}

export interface SignalAnalysis {
  temperature: 'hot' | 'warm' | 'cold'
  emoji: string
  explanation: string
  suggestions?: string[]
}
