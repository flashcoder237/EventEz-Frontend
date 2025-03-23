// Réexporter tous les types pour un import plus facile
export * from './events';
export * from './registration';
export * from './payment';
export * from './analytics';
export * from './notification';

// Types pour les profils d'utilisateurs
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: 'user' | 'organizer' | 'admin';
  organizer_type?: 'individual' | 'organization' | null;
  company_name?: string;
  registration_number?: string;
  is_verified: boolean;
  billing_address?: string;
  organizer_profile?: OrganizerProfile;
}

export interface OrganizerProfile {
  description?: string;
  logo?: string;
  website?: string;
  verified_status: boolean;
  rating: number;
  event_count: number;
}

// Types pour l'enregistrement des utilisateurs
export interface UserRegistration {
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
}

export interface OrganizerRegistration extends UserRegistration {
  organizer_type: 'individual' | 'organization';
  company_name?: string;
  registration_number?: string;
}

export interface AnalyticsDashboardSummary {
  event_summary: {
    total_events: number;
    upcoming_events: number;
    ongoing_events: number;
    avg_fill_rate: number;
    event_types?: any[];
    categories?: any[];
  };
  revenue_summary: {
    total_revenue: number;
    avg_transaction: number;
    payment_count?: number;
    revenue_by_method?: any[];
  };
  registration_summary: {
    summary: {
      total_registrations: number;
      confirmed_registrations?: number;
      conversion_rate: number;
    };
    registration_types?: any[];
    trends?: {
      interval: string;
      data: any[];
    };
  };
}