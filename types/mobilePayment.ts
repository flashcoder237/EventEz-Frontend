// src/types/mobilePayment.ts
/**
 * Types pour les paiements mobiles (MTN MoMo et Orange Money)
 */

export type MobilePaymentProvider = 'mtn_money' | 'orange_money';

export type MobilePaymentStatus = 'PENDING' | 'INITIATED' | 'SUCCESSFUL' | 'FAILED';

export type ProcessingStatus = 'waiting' | 'verifying' | 'success' | 'failed';

// Interface commune pour les réponses de paiement mobile
export interface MobilePaymentResponse {
  success: boolean;
  status: MobilePaymentStatus;
  transactionId?: string;
  message?: string;
}

// Réponse spécifique à MTN MoMo
export interface MTNPaymentResponse extends MobilePaymentResponse {
  externalId: string;
  financialTransactionId?: string;
  reason?: string;
}

// Réponse spécifique à Orange Money
export interface OrangePaymentResponse extends MobilePaymentResponse {
  payToken: string;
  txnid?: string;
}

// Modèle de requête pour initier un paiement mobile
export interface MobilePaymentRequest {
  phoneNumber: string;
  amount: number;
  externalId: string;
  description?: string;
  currency?: string;
}

// Configuration des API de paiement mobile
export interface MTNMoMoConfig {
  apiUrl: string;
  apiKey: string;
  apiUser: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
}

export interface OrangeMoneyConfig {
  apiUrl: string;
  apiKey: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

// Webhooks de notification de paiement
export interface MobilePaymentWebhookPayload {
  provider: MobilePaymentProvider;
  status: MobilePaymentStatus;
  transaction_id: string;
  external_id: string;
  amount: number;
  currency: string;
  payment_date: string;
  phone_number?: string;
  signature?: string;
}