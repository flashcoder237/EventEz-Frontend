import { Event } from './events';

export interface Registration {
  id: string;
  event: string;
  event_detail?: Event;
  user: string | number;
  registration_type: 'billetterie' | 'inscription';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  reference_code: string;
  form_data?: Record<string, any>;
  form_data_size?: number;
  tickets?: TicketPurchase[];
}

export interface RegistrationCreate {
  event: string;
  registration_type: 'billetterie' | 'inscription';
  form_data?: Record<string, any>;
  tickets?: Array<{
    ticket_type: number;
    quantity: number;
    discount_code?: string;
  }>;
}

export interface TicketPurchase {
  id: number;
  registration: string;
  ticket_type: number;
  ticket_type_name: string;
  quantity: number;
  unit_price: number;
  discount_code?: number;
  discount_amount: number;
  total_price: number;
  qr_code?: string;
  is_checked_in: boolean;
  checked_in_at?: string;
}

export interface Discount {
  id: number;
  event: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  times_used: number;
  applicable_ticket_types: number[];
}

export interface EventFeedback {
  id: number;
  event: string;
  user: string | number;
  user_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  is_featured: boolean;
  event_details: {
    title: string;
    slug: string;
    start_date: string;
  };
}

export interface EventFlag {
  id: number;
  event: string;
  user: string | number;
  user_name: string;
  reason: 'inappropriate' | 'misleading' | 'scam' | 'duplicate' | 'other';
  description: string;
  created_at: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolution_notes?: string;
  event_details: {
    title: string;
    slug: string;
    organizer: string;
  };
}

export interface EventValidation {
  id: number;
  event: string;
  user: string | number;
  user_name: string;
  created_at: string;
  notes: string;
  event_details: {
    title: string;
    slug: string;
  };
}