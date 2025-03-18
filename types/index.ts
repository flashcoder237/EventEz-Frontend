// types/index.ts

// Extension du type Session de NextAuth
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: 'user' | 'organizer' | 'admin';
    };
  }
  
  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: 'user' | 'organizer' | 'admin';
  }
}

// Types pour les événements
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  event_type: 'billetterie' | 'inscription';
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  location_name: string;
  location_address: string;
  location_city: string;
  location_country: string;
  banner_image?: string;
  status: 'draft' | 'published' | 'validated' | 'completed' | 'cancelled';
  is_featured: boolean;
  view_count: number;
  registration_count: number;
  category: Category;
  tags: Tag[];
  organizer: User;
  organizer_name?: string;
  ticket_price_range?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TicketType {
  id: number;
  event: string;
  name: string;
  description: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
  available_quantity: number;
  sales_start: string;
  sales_end: string;
  is_visible: boolean;
  max_per_order: number;
  min_per_order: number;
}

export interface FormField {
  id: number;
  event: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'select' | 'checkbox' | 'radio' | 'file';
  required: boolean;
  placeholder: string;
  help_text: string;
  options: string;
  order: number;
}

export interface Registration {
  id: string;
  event: string;
  event_detail: Event;
  user: string;
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

export interface Payment {
  id: string;
  registration: string;
  user: string;
  amount: number;
  currency: string;
  payment_method: 'mtn_money' | 'orange_money' | 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transaction_id?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  is_usage_based: boolean;
  storage_amount: number;
  duration_days: number;
  invoice?: Invoice;
  registration_details?: Registration;
}

export interface Invoice {
  id: number;
  payment: string;
  invoice_number: string;
  generated_at: string;
  due_date?: string;
  billing_period_start?: string;
  billing_period_end?: string;
  pdf_file?: string;
}

export interface Feedback {
  id: number;
  event: string;
  user: string;
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
  user: string;
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
  user: string;
  user_name: string;
  created_at: string;
  notes: string;
  event_details: {
    title: string;
    slug: string;
  };
}

export interface Notification {
  id: string;
  user: string;
  title: string;
  message: string;
  notification_type: 'event_update' | 'registration_confirmation' | 'payment_confirmation' | 'event_reminder' | 'system_message' | 'custom_message';
  related_object_id?: string;
  related_object_type?: string;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  is_read: boolean;
  is_sent: boolean;
  created_at: string;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  extra_data?: Record<string, any>;
}

export interface AnalyticsDashboardSummary {
  event_summary: {
    total_events: number;
    upcoming_events: number;
    ongoing_events: number;
    completed_events: number;
    event_types: Array<{ event_type: string; count: number }>;
    categories: Array<{ category__name: string; count: number }>;
    avg_fill_rate: number;
    events_details: Array<{
      id: string;
      title: string;
      registrations_count: number;
      max_capacity: number;
      fill_rate: number;
    }>;
  };
  revenue_summary: {
    total_revenue: number;
    avg_transaction: number;
    payment_count: number;
    revenue_by_method: Array<{
      payment_method: string;
      total: number;
      count: number;
      percentage: number;
    }>;
    revenue_distribution: {
      usage_based_revenue: number;
      ticket_sales_revenue: number;
      usage_percentage: number;
      ticket_percentage: number;
    };
    revenue_by_period: {
      type: 'daily' | 'monthly';
      data: Array<{
        period: string;
        total: number;
        count: number;
      }>;
    };
  };
  registration_summary: {
    summary: {
      total_registrations: number;
      confirmed_registrations: number;
      pending_registrations: number;
      cancelled_registrations: number;
      conversion_rate: number;
    };
    registration_types: Array<{
      registration_type: string;
      count: number;
      percentage: number;
    }>;
    trends: {
      interval: string;
      data: Array<{
        period: string;
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
      }>;
    };
  };
}

export interface AnalyticsReport {
  id: number;
  title: string;
  description?: string;
  report_type: 'event_performance' | 'revenue_summary' | 'user_activity' | 'registration_trends' | 'payment_analysis' | 'custom';
  data: Record<string, any>;
  filters: Record<string, any>;
  created_at: string;
  updated_at: string;
  generated_by: string;
  event?: string;
  is_scheduled: boolean;
  schedule_frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  last_run?: string;
  next_run?: string;
  email_on_generation: boolean;
  export_format: 'pdf' | 'csv' | 'json';
}