// src/app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { paymentsAPI, registrationsAPI, ticketTypesAPI } from '@/lib/api';

// Fonction d'utilitaire pour valider les signatures de webhook
const validateSignature = (payload: any, signature: string, secret: string): boolean => {
  // Implémentation de la validation de signature - à adapter selon la passerelle de paiement
  // Cette fonction devrait vérifier que la signature correspond au payload et au secret
  // Pour simplifier, nous retournons true pour l'instant
  return true;
};

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const data = await request.json();
    
    // Vérifier le type de webhook (MTN ou Orange)
    const provider = request.headers.get('X-Payment-Provider');
    const signature = request.headers.get('X-Signature') || '';
    
    let paymentId: string;
    let paymentStatus: 'completed' | 'failed';
    let transactionId: string;
    
    // Valider et traiter selon le fournisseur
    if (provider === 'mtn_money') {
      // Valider la signature MTN
      if (!validateSignature(data, signature, process.env.MTN_WEBHOOK_SECRET || '')) {
        return NextResponse.json(
          { error: 'Signature invalide' },
          { status: 403 }
        );
      }
      
      // Extraire les informations du paiement MTN
      paymentId = data.externalId;
      paymentStatus = data.status === 'SUCCESSFUL' ? 'completed' : 'failed';
      transactionId = data.financialTransactionId;
    } 
    else if (provider === 'orange_money') {
      // Valider la signature Orange
      if (!validateSignature(data, signature, process.env.ORANGE_WEBHOOK_SECRET || '')) {
        return NextResponse.json(
          { error: 'Signature invalide' },
          { status: 403 }
        );
      }
      
      // Extraire les informations du paiement Orange
      paymentId = data.order_id;
      paymentStatus = data.status === 'SUCCESS' ? 'completed' : 'failed';
      transactionId = data.txnid;
    }
    else {
      return NextResponse.json(
        { error: 'Fournisseur de paiement non pris en charge' },
        { status: 400 }
      );
    }
    
    // Mettre à jour le paiement dans la base de données
    try {
      // Récupérer les informations du paiement
      const paymentResponse = await paymentsAPI.getPayment(paymentId);
      const payment = paymentResponse.data;
      
      // Mettre à jour le statut du paiement
      await paymentsAPI.patchPayment(paymentId, {
        status: paymentStatus,
        transaction_id: transactionId,
        payment_date: new Date().toISOString()
      });
      
      // Si le paiement est réussi, mettre à jour l'inscription
      if (paymentStatus === 'completed') {
        const registrationId = payment.registration;
        
        // Mettre à jour le statut de l'inscription
        await registrationsAPI.patchRegistration(registrationId, {
          status: 'confirmed',
          payment_status: 'paid',
          confirmed_at: new Date().toISOString()
        });
        
        // Décrémenter le nombre de billets disponibles
        const registrationResponse = await registrationsAPI.getRegistration(registrationId);
        const registration = registrationResponse.data;
        
        // Si l'inscription contient des billets, mettre à jour les quantités vendues
        if (registration.tickets && registration.tickets.length > 0) {
          for (const ticket of registration.tickets) {
            // Récupérer les informations du type de billet
            const ticketTypeResponse = await ticketTypesAPI.getTicketType(ticket.ticket_type);
            const ticketType = ticketTypeResponse.data;
            
            // Mettre à jour la quantité vendue
            await ticketTypesAPI.patchTicketType(ticket.ticket_type, {
              quantity_sold: ticketType.quantity_sold + ticket.quantity
            });
          }
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erreur lors du traitement du webhook de paiement:', error);
      return NextResponse.json(
        { error: 'Erreur interne du serveur' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du traitement du webhook de paiement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Route pour tester la connectivité du webhook
  return NextResponse.json({ message: 'Webhook endpoint pour les paiements mobiles' });
}