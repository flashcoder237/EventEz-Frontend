// src/lib/services/mobilePaymentService.ts
import { ticketTypesAPI } from '@/lib/api';
import axios from 'axios';

// Configuration des API
const MTN_API_URL = process.env.MTN_API_URL || 'https://sandbox.momoapi.mtn.com';
const MTN_API_KEY = process.env.MTN_API_KEY;
const MTN_API_USER = process.env.MTN_API_USER;
const MTN_API_SECRET = process.env.MTN_API_SECRET;

const ORANGE_API_URL = process.env.ORANGE_API_URL || 'https://api.orange.com/orange-money-webpay';
const ORANGE_API_KEY = process.env.ORANGE_API_KEY;
const ORANGE_MERCHANT_ID = process.env.ORANGE_MERCHANT_ID;

// Interfaces pour les réponses
interface MtnPaymentResponse {
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  externalId: string;
  financialTransactionId?: string;
  reason?: string;
}

interface OrangePaymentResponse {
  status: 'INITIATED' | 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  payToken: string;
  txnid?: string;
  message?: string;
}

/**
 * Service pour gérer les paiements mobiles avec MTN MoMo et Orange Money
 */
export const mobilePaymentService = {
  /**
   * Initier un paiement avec MTN Mobile Money
   * @param phoneNumber Numéro de téléphone du client
   * @param amount Montant du paiement
   * @param currency Devise (par défaut XAF)
   * @param externalId ID externe pour référence
   * @param payerMessage Message à afficher au client
   * @param payeeNote Note pour le merchant
   */
  async initiatePaymentMTN(
    phoneNumber: string,
    amount: number,
    currency: string = 'XAF',
    externalId: string,
    payerMessage: string = 'Paiement pour EventEz',
    payeeNote: string = 'Achat de billets'
  ): Promise<MtnPaymentResponse> {
    try {
      // Étape 1: Obtenir un token d'accès
      const authResponse = await axios.post(
        `${MTN_API_URL}/collection/token/`,
        {},
        {
          headers: {
            'Ocp-Apim-Subscription-Key': MTN_API_KEY,
            'Authorization': `Basic ${Buffer.from(`${MTN_API_USER}:${MTN_API_SECRET}`).toString('base64')}`
          }
        }
      );
      
      const accessToken = authResponse.data.access_token;
      
      // Étape 2: Créer une référence de transaction UUID
      const referenceId = crypto.randomUUID();
      
      // Étape 3: Initialiser la requête de paiement
      const paymentResponse = await axios.post(
        `${MTN_API_URL}/collection/v1_0/requesttopay`,
        {
          amount: amount.toString(),
          currency,
          externalId,
          payer: {
            partyIdType: 'MSISDN',
            partyId: phoneNumber
          },
          payerMessage,
          payeeNote
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'Ocp-Apim-Subscription-Key': MTN_API_KEY,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Si la requête réussit, vérifier le statut
      if (paymentResponse.status === 202) {
        // La requête a été acceptée, mais le paiement est en attente
        // On doit maintenant interroger l'API pour vérifier le statut
        return {
          status: 'PENDING',
          externalId,
          financialTransactionId: referenceId
        };
      }
      
      throw new Error('La requête de paiement MTN a échoué');
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement MTN:', error);
      return {
        status: 'FAILED',
        externalId,
        reason: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Vérifier le statut d'un paiement MTN MoMo
   * @param referenceId ID de référence de la transaction
   */
  async checkMTNPaymentStatus(referenceId: string): Promise<MtnPaymentResponse> {
    try {
      // Obtenir un token d'accès
      const authResponse = await axios.post(
        `${MTN_API_URL}/collection/token/`,
        {},
        {
          headers: {
            'Ocp-Apim-Subscription-Key': MTN_API_KEY,
            'Authorization': `Basic ${Buffer.from(`${MTN_API_USER}:${MTN_API_SECRET}`).toString('base64')}`
          }
        }
      );
      
      const accessToken = authResponse.data.access_token;
      
      // Vérifier le statut du paiement
      const statusResponse = await axios.get(
        `${MTN_API_URL}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Ocp-Apim-Subscription-Key': MTN_API_KEY,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
          }
        }
      );
      
      // Analyser la réponse
      const paymentStatus = statusResponse.data.status;
      
      return {
        status: paymentStatus === 'SUCCESSFUL' ? 'SUCCESSFUL' : 
                paymentStatus === 'FAILED' ? 'FAILED' : 'PENDING',
        externalId: statusResponse.data.externalId,
        financialTransactionId: statusResponse.data.financialTransactionId,
        reason: paymentStatus === 'FAILED' ? statusResponse.data.reason : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du paiement MTN:', error);
      return {
        status: 'FAILED',
        externalId: 'unknown',
        reason: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Initier un paiement avec Orange Money
   * @param phoneNumber Numéro de téléphone du client
   * @param amount Montant du paiement
   * @param externalId ID externe pour référence
   * @param description Description du paiement
   */
  async initiatePaymentOrange(
    phoneNumber: string,
    amount: number,
    externalId: string,
    description: string = 'Paiement pour EventEz'
  ): Promise<OrangePaymentResponse> {
    try {
      // Obtenir un token d'accès
      const authResponse = await axios.post(
        'https://api.orange.com/oauth/v3/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${ORANGE_MERCHANT_ID}:${ORANGE_API_KEY}`).toString('base64')}`
          }
        }
      );
      
      const accessToken = authResponse.data.access_token;
      
      // Initialiser le paiement
      const paymentResponse = await axios.post(
        `${ORANGE_API_URL}/v1/webpayment`,
        {
          merchant_key: ORANGE_MERCHANT_ID,
          currency: 'XAF',
          order_id: externalId,
          amount: amount.toString(),
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
          notif_url: `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/orange-money`,
          lang: 'fr',
          reference: externalId,
          description,
          payment_method: 'ORANGE_MONEY',
          subscriber_msisdn: phoneNumber
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Analyser la réponse
      if (paymentResponse.data.status === 'SUCCESS') {
        return {
          status: 'INITIATED',
          payToken: paymentResponse.data.pay_token,
          txnid: paymentResponse.data.txnid
        };
      }
      
      return {
        status: 'FAILED',
        payToken: '',
        message: paymentResponse.data.message || 'Échec de l\'initialisation du paiement Orange Money'
      };
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement Orange Money:', error);
      return {
        status: 'FAILED',
        payToken: '',
        message: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Vérifier le statut d'un paiement Orange Money
   * @param payToken Token de paiement
   */
  async checkOrangePaymentStatus(payToken: string): Promise<OrangePaymentResponse> {
    try {
      // Obtenir un token d'accès
      const authResponse = await axios.post(
        'https://api.orange.com/oauth/v3/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${ORANGE_MERCHANT_ID}:${ORANGE_API_KEY}`).toString('base64')}`
          }
        }
      );
      
      const accessToken = authResponse.data.access_token;
      
      // Vérifier le statut du paiement
      const statusResponse = await axios.get(
        `${ORANGE_API_URL}/v1/webpayment/${payToken}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      // Analyser la réponse
      const status = statusResponse.data.status;
      
      return {
        status: status === 'SUCCESS' ? 'SUCCESSFUL' : 
                status === 'FAILED' ? 'FAILED' : 'PENDING',
        payToken,
        txnid: statusResponse.data.txnid,
        message: status === 'FAILED' ? statusResponse.data.message : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du paiement Orange Money:', error);
      return {
        status: 'FAILED',
        payToken,
        message: error.response?.data?.message || error.message
      };
    }
  }
};