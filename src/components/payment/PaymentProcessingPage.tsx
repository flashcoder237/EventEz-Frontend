// src/components/payment/PaymentProcessingPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Check, X, AlertTriangle, ArrowLeft, Loader, Phone, RefreshCcw } from 'lucide-react';
import { registrationsAPI, paymentsAPI, ticketTypesAPI } from '@/lib/api';
import { paymentVerificationService } from '@/lib/services/paymentVerificationService';

interface PaymentProcessingProps {
  params: { id: string };
  searchParams: {
    registration: string;
    payment: string;
    method: string;
  };
}

export default function PaymentProcessingPage({ params, searchParams }: PaymentProcessingProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [verificationCount, setVerificationCount] = useState(0);
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?redirect=/events/${params.id}/register/payment/processing?registration=${searchParams.registration}&payment=${searchParams.payment}&method=${searchParams.method}`);
    }
  }, [status, router, params.id, searchParams]);
  
  // Arrêter la vérification périodique si on quitte la page
  useEffect(() => {
    return () => {
      paymentVerificationService.stopVerification();
    };
  }, []);
  
  // Démarrer la vérification du paiement
  useEffect(() => {
    if (!searchParams.payment || !searchParams.method || status !== 'authenticated') {
      return;
    }
    
    // Simuler la progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        // Mettre à jour le message en fonction de la progression
        if (newProgress > 20 && newProgress < 40) {
          setProcessingMessage('Vérification des informations...');
        } else if (newProgress > 40 && newProgress < 60) {
          setProcessingMessage('Connexion à la passerelle de paiement...');
        } else if (newProgress > 60 && newProgress < 80) {
          setProcessingMessage('Traitement de la transaction...');
        } else if (newProgress > 80) {
          setProcessingMessage('Finalisation du paiement...');
        }
        
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    // Démarrer la vérification du paiement
    paymentVerificationService.startVerification(
      searchParams.payment,
      5000, // Vérifier toutes les 5 secondes
      () => {
        // À chaque vérification
        setVerificationCount(prev => prev + 1);
      },
      async () => {
        // En cas de succès
        clearInterval(progressInterval);
        setProgress(100);
        setProcessingStatus('success');
        
        try {
          // Récupérer les informations de l'inscription
          const registrationResponse = await registrationsAPI.getRegistration(searchParams.registration);
          const registration = registrationResponse.data;
          
          // IMPORTANT: Mettre à jour les quantités de billets
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
                // Continuer même en cas d'erreur
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour des données après paiement:', error);
        }
        
        // Rediriger après un court délai
        setTimeout(() => {
          router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
        }, 2000);
      },
      (error) => {
        // En cas d'échec
        clearInterval(progressInterval);
        setProcessingStatus('failed');
        setError(error.message || 'Le paiement a échoué');
      },
      () => {
        // En cas de timeout
        clearInterval(progressInterval);
        setProcessingStatus('failed');
        setError('Le délai de paiement a expiré. Veuillez réessayer.');
      }
    );
    
    return () => {
      clearInterval(progressInterval);
      paymentVerificationService.stopVerification();
    };
  }, [searchParams, params.id, router, status]);
  
  // Fonction pour vérifier manuellement le statut
  const checkStatusManually = async () => {
    try {
      setProcessingMessage('Vérification manuelle du statut...');
      
      const result = await paymentVerificationService.checkPaymentStatus(searchParams.payment);
      
      if (result.success && result.data.status === 'completed') {
        setProgress(100);
        setProcessingStatus('success');
        
        // Rediriger après un court délai
        setTimeout(() => {
          router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
        }, 1500);
      } else if (result.success && result.data.status === 'failed') {
        setProcessingStatus('failed');
        setError('Le paiement a échoué. Veuillez réessayer.');
      } else {
        setProcessingMessage('Paiement toujours en attente. Vérifiez votre téléphone.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification manuelle:', error);
      setProcessingMessage('Erreur lors de la vérification. Réessayez.');
    }
  };
  
  // Instructions spécifiques à la méthode de paiement
  const getMethodInstructions = () => {
    switch (searchParams.method) {
      case 'mtn_money':
        return (
          <div className="bg-yellow-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-yellow-800 mb-2">Instructions MTN Mobile Money :</h3>
            <ol className="space-y-2 text-yellow-700 text-sm">
              <li>1. Vérifiez votre téléphone pour une notification de paiement MTN.</li>
              <li>2. Composez <strong>*126#</strong> sur votre téléphone pour accéder à votre menu MTN MoMo.</li>
              <li>3. Sélectionnez "Payer une facture" puis "Paiements".</li>
              <li>4. Confirmez la transaction en saisissant votre code PIN MTN Money.</li>
              <li>5. Ne fermez pas cette page pendant le traitement.</li>
            </ol>
          </div>
        );
      case 'orange_money':
        return (
          <div className="bg-orange-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-orange-800 mb-2">Instructions Orange Money :</h3>
            <ol className="space-y-2 text-orange-700 text-sm">
              <li>1. Vérifiez votre téléphone pour une notification de paiement Orange.</li>
              <li>2. Composez <strong>#144#</strong> sur votre téléphone pour accéder à votre menu Orange Money.</li>
              <li>3. Sélectionnez "Paiement marchand" puis validez.</li>
              <li>4. Confirmez la transaction en saisissant votre code secret Orange Money.</li>
              <li>5. Ne fermez pas cette page pendant le traitement.</li>
            </ol>
          </div>
        );
      case 'credit_card':
        return (
          <div className="bg-indigo-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-indigo-800 mb-2">Traitement du paiement par carte :</h3>
            <p className="text-indigo-700 text-sm">
              Votre paiement par carte est en cours de traitement. Veuillez patienter pendant que nous sécurisons votre transaction.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
      >
        {processingStatus === 'processing' && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                  {searchParams.method === 'mtn_money' || searchParams.method === 'orange_money' ? (
                    <Phone className={`h-10 w-10 ${searchParams.method === 'mtn_money' ? 'text-yellow-500' : 'text-orange-500'}`} />
                  ) : (
                    <Loader className="h-10 w-10 text-primary animate-spin" />
                  )}
                </div>
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-transparent ${
                    searchParams.method === 'mtn_money' 
                      ? 'border-t-yellow-500' 
                      : searchParams.method === 'orange_money'
                        ? 'border-t-orange-500'
                        : 'border-t-primary'
                  }`}
                  style={{ 
                    transform: `rotate(${progress * 3.6}deg)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                ></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              {searchParams.method === 'mtn_money' || searchParams.method === 'orange_money'
                ? 'En attente de confirmation mobile'
                : 'Traitement du paiement en cours'
              }
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {processingMessage || 'Initialisation du paiement...'}
            </p>
            
            {/* Barre de progression */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
              <motion.div 
                className={`h-full ${
                  searchParams.method === 'mtn_money' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                    : searchParams.method === 'orange_money'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600'
                }`}
                style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                animate={{ 
                  background: searchParams.method === 'mtn_money' || searchParams.method === 'orange_money' 
                    ? [
                      'linear-gradient(90deg, rgb(234 179 8) 0%, rgb(202 138 4) 100%)',
                      'linear-gradient(90deg, rgb(202 138 4) 0%, rgb(234 179 8) 100%)',
                      'linear-gradient(90deg, rgb(234 179 8) 0%, rgb(202 138 4) 100%)'
                    ]
                    : [
                      'linear-gradient(90deg, rgb(124 58 237) 0%, rgb(99 102 241) 100%)',
                      'linear-gradient(90deg, rgb(99 102 241) 0%, rgb(124 58 237) 100%)',
                      'linear-gradient(90deg, rgb(124 58 237) 0%, rgb(99 102 241) 100%)'
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>
            </div>
            
            {/* Compteur de vérifications pour mobile */}
            {(searchParams.method === 'mtn_money' || searchParams.method === 'orange_money') && (
              <div className="text-xs text-gray-500 mb-4">
                Vérifications: {verificationCount} | Attente de votre confirmation...
              </div>
            )}
            
            {/* Instructions spécifiques à la méthode de paiement */}
            {getMethodInstructions()}
            
            {/* Bouton de vérification manuelle pour mobile */}
            {(searchParams.method === 'mtn_money' || searchParams.method === 'orange_money') && verificationCount > 2 && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="inline-flex items-center"
                  onClick={checkStatusManually}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  J'ai déjà confirmé sur mon téléphone
                </Button>
              </div>
            )}
            
            {/* Bouton d'annulation */}
            <div className="mt-8">
              <Button
                variant="outline"
                className="text-gray-500 dark:text-gray-400"
                onClick={() => router.push(`/events/${params.id}/register/payment?registration=${searchParams.registration}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Annuler et retourner
              </Button>
            </div>
          </div>
        )}
        
        {processingStatus === 'success' && (
          <div>
            <div className="flex justify-center mb-6">
              <motion.div 
                className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Paiement réussi !
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Votre paiement a été traité avec succès. Vous allez être redirigé vers la page de confirmation.
            </p>
            
            <div className="animate-pulse">
              <Loader className="mx-auto h-6 w-6 text-primary animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Redirection en cours...
              </p>
            </div>
          </div>
        )}
        
        {processingStatus === 'failed' && (
          <div>
            <div className="flex justify-center mb-6">
              <motion.div 
                className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <X className="h-16 w-16 text-red-600 dark:text-red-400" />
              </motion.div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Paiement échoué
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Une erreur est survenue lors du traitement de votre paiement.
            </p>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-300 mb-8 flex items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push(`/events/${params.id}/register/payment?registration=${searchParams.registration}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retourner au paiement
              </Button>
              
              <Button
                onClick={() => router.push(`/events/${params.id}`)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              >
                Retour à l'événement
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}