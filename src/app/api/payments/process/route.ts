// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { paymentsAPI, registrationsAPI, ticketTypesAPI } from '@/lib/api';
import { mobilePaymentService } from '@/lib/services/mobilePaymentService';

export async function POST(request: NextRequest) {
  // Vérifier si l'utilisateur est authentifié
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentification requise' },
      { status: 401 }
    );
  }
  
  try {
    // Récupérer les données de la requête
    const requestData = await request.json();
    
    // Vérifier si les données requises sont présentes
    if (!requestData.paymentId || !requestData.method) {
      return NextResponse.json(
        { error: 'Données de paiement incomplètes' },
        { status: 400 }
      );
    }
    
    // Récupérer les informations du paiement
    const paymentResponse = await paymentsAPI.getPayment(requestData.paymentId);
    const payment = paymentResponse.data;
    
    // Récupérer les informations de l'inscription
    const registrationResponse = await registrationsAPI.getRegistration(payment.registration);
    const registration = registrationResponse.data;
    
    // Initialiser le traitement selon la méthode de paiement
    let paymentResult;
    
    switch (requestData.method) {
      case 'mtn_money':
        // Vérifier que le numéro de téléphone est présent
        if (!requestData.phoneNumber) {
          return NextResponse.json(
            { error: 'Numéro de téléphone requis pour le paiement MTN Money' },
            { status: 400 }
          );
        }
        
        // Initialiser le paiement MTN
        paymentResult = await mobilePaymentService.initiatePaymentMTN(
          requestData.phoneNumber,
          payment.amount,
          payment.currency,
          payment.id,
          `Paiement pour ${registration.event_detail?.title || 'événement'}`,
          `Inscription #${registration.reference_code}`
        );
        
        // Mettre à jour le statut du paiement
        await paymentsAPI.patchPayment(payment.id, {
          status: 'processing',
          billing_phone: requestData.phoneNumber
        });
        
        return NextResponse.json({
          success: true,
          data: {
            id: payment.id,
            status: paymentResult.status === 'SUCCESSFUL' ? 'completed' : 
                    paymentResult.status === 'FAILED' ? 'failed' : 'processing',
            transaction_id: paymentResult.financialTransactionId || '',
            message: paymentResult.reason || 'Transaction en cours de traitement'
          }
        });
        
      case 'orange_money':
        // Vérifier que le numéro de téléphone est présent
        if (!requestData.phoneNumber) {
          return NextResponse.json(
            { error: 'Numéro de téléphone requis pour le paiement Orange Money' },
            { status: 400 }
          );
        }
        
        // Initialiser le paiement Orange
        paymentResult = await mobilePaymentService.initiatePaymentOrange(
          requestData.phoneNumber,
          payment.amount,
          payment.id,
          `Paiement pour ${registration.event_detail?.title || 'événement'}`
        );
        
        // Mettre à jour le statut du paiement
        await paymentsAPI.patchPayment(payment.id, {
          status: 'processing',
          billing_phone: requestData.phoneNumber
        });
        
        return NextResponse.json({
          success: true,
          data: {
            id: payment.id,
            status: paymentResult.status === 'SUCCESSFUL' ? 'completed' : 
                    paymentResult.status === 'FAILED' ? 'failed' : 'processing',
            transaction_id: paymentResult.txnid || '',
            message: paymentResult.message || 'Transaction en cours de traitement',
            pay_token: paymentResult.payToken
          }
        });
        
      case 'credit_card':
        // Simuler un traitement de carte de crédit
        // Dans une implémentation réelle, vous utiliseriez ici une passerelle de paiement
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mettre à jour le statut du paiement
        await paymentsAPI.patchPayment(payment.id, {
          status: 'completed',
          transaction_id: `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          payment_date: new Date().toISOString()
        });
        
        // Mettre à jour le statut de l'inscription
        await registrationsAPI.patchRegistration(registration.id, {
          status: 'confirmed',
          payment_status: 'paid',
          confirmed_at: new Date().toISOString()
        });
        
        // IMPORTANT: Décrémenter le nombre de billets disponibles
        if (registration.tickets && registration.tickets.length > 0) {
          for (const ticket of registration.tickets) {
            // Uniquement une fois le paiement confirmé
            try {
              // Récupérer les informations du type de billet
              const ticketTypeResponse = await ticketTypesAPI.getTicketType(ticket.ticket_type);
              const ticketType = ticketTypeResponse.data;
              
              // Mettre à jour la quantité vendue
              await ticketTypesAPI.patchTicketType(ticket.ticket_type, {
                quantity_sold: ticketType.quantity_sold + ticket.quantity
              });
            } catch (ticketError) {
              console.error('Erreur lors de la mise à jour des quantités de billets:', ticketError);
              // Continue le traitement même si une erreur survient ici
            }
          }
        }
        
        return NextResponse.json({
          success: true,
          data: {
            id: payment.id,
            status: 'completed',
            transaction_id: `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            processed_at: new Date().toISOString()
          }
        });
        
      case 'bank_transfer':
        // Mettre à jour le statut du paiement en attente
        await paymentsAPI.patchPayment(payment.id, {
          status: 'pending'
        });
        
        return NextResponse.json({
          success: true,
          data: {
            id: payment.id,
            status: 'pending',
            message: 'Veuillez effectuer le virement bancaire en suivant les instructions.'
          }
        });
        
      default:
        return NextResponse.json(
          { error: 'Méthode de paiement non prise en charge' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Récupérer l'ID du paiement dans les paramètres de requête
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get('id');
  
  if (!paymentId) {
    return NextResponse.json(
      { error: 'ID de paiement manquant' },
      { status: 400 }
    );
  }
  
  try {
    // Récupérer les informations du paiement
    const paymentResponse = await paymentsAPI.getPayment(paymentId);
    const payment = paymentResponse.data;
    
    // Vérifier le statut du paiement en fonction de la méthode
    if (payment.status === 'processing') {
      let updatedStatus = payment.status;
      
      // Vérifier le statut pour les paiements mobiles
      if (payment.payment_method === 'mtn_money' && payment.transaction_id) {
        const mtnStatus = await mobilePaymentService.checkMTNPaymentStatus(payment.transaction_id);
        
        if (mtnStatus.status === 'SUCCESSFUL') {
          updatedStatus = 'completed';
          
          // Mettre à jour l'inscription et les billets
          await handleSuccessfulPayment(payment);
        } else if (mtnStatus.status === 'FAILED') {
          updatedStatus = 'failed';
        }
      } else if (payment.payment_method === 'orange_money' && payment.transaction_id) {
        const orangeStatus = await mobilePaymentService.checkOrangePaymentStatus(payment.transaction_id);
        
        if (orangeStatus.status === 'SUCCESSFUL') {
          updatedStatus = 'completed';
          
          // Mettre à jour l'inscription et les billets
          await handleSuccessfulPayment(payment);
        } else if (orangeStatus.status === 'FAILED') {
          updatedStatus = 'failed';
        }
      }
      
      // Mettre à jour le statut si nécessaire
      if (updatedStatus !== payment.status) {
        await paymentsAPI.patchPayment(payment.id, {
          status: updatedStatus,
          payment_date: updatedStatus === 'completed' ? new Date().toISOString() : undefined
        });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          id: payment.id,
          status: updatedStatus,
          transaction_id: payment.transaction_id,
          processed_at: payment.payment_date
        }
      });
    }
    
    // Pour les paiements déjà complétés ou échoués
    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        transaction_id: payment.transaction_id,
        processed_at: payment.payment_date
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du paiement' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour gérer un paiement réussi
async function handleSuccessfulPayment(payment) {
  try {
    // Récupérer l'inscription associée au paiement
    const registrationResponse = await registrationsAPI.getRegistration(payment.registration);
    const registration = registrationResponse.data;
    
    // Mettre à jour le statut de l'inscription
    await registrationsAPI.patchRegistration(registration.id, {
      status: 'confirmed',
      payment_status: 'paid',
      confirmed_at: new Date().toISOString()
    });
    
    // Décrémenter le nombre de billets disponibles
    if (registration.tickets && registration.tickets.length > 0) {
      for (const ticket of registration.tickets) {
        try {
          // Récupérer les informations du type de billet
          const ticketTypeResponse = await ticketTypesAPI.getTicketType(ticket.ticket_type);
          const ticketType = ticketTypeResponse.data;
          
          // Mettre à jour la quantité vendue
          await ticketTypesAPI.patchTicketType(ticket.ticket_type, {
            quantity_sold: ticketType.quantity_sold + ticket.quantity
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des quantités de billets:', error);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error);
    throw error;
  }
}