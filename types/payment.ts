import { Registration } from './registration';

export interface Payment {
  id: string;
  registration: string;
  registration_details?: Registration;
  user: string | number;
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
  payment_gateway_response?: any;
}

export interface PaymentCreate {
  registration: string;
  amount: number;
  currency: string;
  payment_method: 'mtn_money' | 'orange_money' | 'credit_card' | 'paypal' | 'bank_transfer';
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  is_usage_based: boolean;
  storage_amount?: number;
  duration_days?: number;
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

export interface Refund {
  id: number;
  payment: string;
  payment_details: string; // JSON représentation du paiement
  amount: number;
  reason: string;
  status: 'requested' | 'processing' | 'completed' | 'rejected';
  requested_at: string;
  processed_at?: string;
  processed_by?: string | number;
  transaction_id?: string;
  notes?: string;
}