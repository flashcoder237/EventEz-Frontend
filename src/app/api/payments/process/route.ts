// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

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
    
    // Simuler le traitement du paiement en fonction de la méthode
    let processingTime = 2000; // temps de base en millisecondes
    let success = true;
    
    // Simuler différents temps de traitement et taux de réussite selon la méthode
    switch (requestData.method) {
      case 'mtn_money':
        processingTime = 3000;
        success = Math.random() > 0.1; // 10% de chance d'échouer
        break;
        
      case 'orange_money':
        processingTime = 2500;
        success = Math.random() > 0.1; // 10% de chance d'échouer
        break;
        
      case 'credit_card':
        processingTime = 1500;
        success = Math.random() > 0.05; // 5% de chance d'échouer
        break;
        
      case 'bank_transfer':
        processingTime = 1000;
        success = true; // toujours réussi car vérifié manuellement
        break;
        
      default:
        success = Math.random() > 0.2; // 20% de chance d'échouer pour les méthodes inconnues
    }
    
    // Simuler le délai de traitement
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Si le paiement échoue, renvoyer une erreur
    if (!success) {
      return NextResponse.json(
        { error: 'Le paiement a été refusé. Veuillez réessayer ou utiliser une autre méthode de paiement.' },
        { status: 400 }
      );
    }
    
    // Créer un identifiant de transaction unique
    const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Retourner une réponse de succès avec les détails du paiement
    return NextResponse.json({
      success: true,
      data: {
        id: requestData.paymentId,
        status: 'completed',
        transaction_id: transactionId,
        processed_at: new Date().toISOString(),
        payment_method: requestData.method,
        amount: requestData.amount || 0,
        currency: requestData.currency || 'XAF',
        message: `Paiement traité avec succès via ${requestData.method.replace('_', ' ').toUpperCase()}`
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}

// Endpoint GET pour vérifier le statut d'un paiement
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
    // Simuler la vérification du statut du paiement
    // Dans une application réelle, vous interrogeriez votre base de données ou votre passerelle de paiement
    
    // États possibles : 'pending', 'processing', 'completed', 'failed', 'cancelled'
    // Simulons ici une distribution aléatoire des états pour tester différents scénarios
    const possibleStatuses = ['pending', 'processing', 'completed', 'completed', 'completed', 'failed'];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    return NextResponse.json({
      success: true,
      data: {
        id: paymentId,
        status: randomStatus,
        transaction_id: randomStatus === 'completed' ? `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}` : null,
        processed_at: randomStatus === 'completed' ? new Date().toISOString() : null,
        message: `Le paiement est actuellement ${randomStatus === 'pending' ? 'en attente' : 
                 randomStatus === 'processing' ? 'en cours de traitement' : 
                 randomStatus === 'completed' ? 'complété' : 
                 randomStatus === 'failed' ? 'échoué' : 'annulé'}`
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération du statut du paiement:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du statut du paiement' },
      { status: 500 }
    );
  }
}