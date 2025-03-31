'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Check, X, AlertTriangle, ArrowLeft, Loader } from 'lucide-react';
import { registrationsAPI, paymentsAPI } from '@/lib/api';

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
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?redirect=/events/${params.id}/register/payment/processing?registration=${searchParams.registration}&payment=${searchParams.payment}&method=${searchParams.method}`);
    }
  }, [status, router, params.id, searchParams]);
  
  // Simuler le traitement du paiement
  useEffect(() => {
    if (!searchParams.payment || !searchParams.method) {
      setProcessingStatus('failed');
      setError('Informations de paiement manquantes');
      return;
    }
    
    // Simuler la progression
    const interval = setInterval(() => {
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
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Définir la fonction de vérification du statut
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payments/process?id=${searchParams.payment}`);
        const data = await response.json();
        
        if (data.success) {
          if (data.data.status === 'completed') {
            clearInterval(interval);
            setProgress(100);
            setProcessingStatus('success');
            
            try {
              // Mettre à jour le statut de l'inscription pour la marquer comme confirmée
              await registrationsAPI.patchRegistration(searchParams.registration, {
                status: 'confirmed',
                payment_status: 'paid'
              });
            } catch (updateError) {
              console.error("Erreur lors de la mise à jour de l'inscription:", updateError);
            }
            
            // Rediriger après un délai
            setTimeout(() => {
              router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
            }, 2000);
          } else if (data.data.status === 'failed') {
            clearInterval(interval);
            setProcessingStatus('failed');
            setError('Le paiement a échoué. Veuillez réessayer.');
            
            try {
              // Mettre à jour le statut du paiement pour indiquer l'échec
              await paymentsAPI.patchPayment(searchParams.payment, {
                status: 'failed'
              });
            } catch (updateError) {
              console.error("Erreur lors de la mise à jour du statut de paiement:", updateError);
            }
          }
        } else {
          console.error('Erreur lors de la vérification du statut:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
      }
    };
    
    // Vérifier le statut immédiatement
    checkStatus();
    
    // Puis vérifier périodiquement
    const statusInterval = setInterval(checkStatus, 3000);
    
    // Simuler un résultat après un délai maximum (30 secondes)
    const timeout = setTimeout(async () => {
      clearInterval(interval);
      clearInterval(statusInterval);
      
      // 80% de chance de succès, 20% d'échec (pour simuler des erreurs aléatoires)
      const success = Math.random() > 0.2;
      
      if (success) {
        setProgress(100);
        setProcessingStatus('success');
        
        try {
          // Mettre à jour le statut de l'inscription pour la marquer comme confirmée
          await registrationsAPI.patchRegistration(searchParams.registration, {
            status: 'confirmed',
            payment_status: 'paid'
          });
          
          // Mettre à jour le statut du paiement
          await paymentsAPI.patchPayment(searchParams.payment, {
            status: 'completed'
          });
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'inscription après paiement:", error);
        }
        
        // Rediriger après un délai
        setTimeout(() => {
          router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
        }, 2000);
      } else {
        setProcessingStatus('failed');
        setError('Le délai de paiement a expiré. Veuillez réessayer.');
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
      clearTimeout(timeout);
    };
  }, [searchParams, router, params.id]);
  
  // Instructions spécifiques à la méthode de paiement
  const getMethodInstructions = () => {
    switch (searchParams.method) {
      case 'mtn_money':
        return (
          <div className="bg-yellow-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-yellow-800 mb-2">Instructions MTN Mobile Money :</h3>
            <ol className="space-y-2 text-yellow-700 text-sm">
              <li>1. Vérifiez votre téléphone pour une notification de paiement MTN.</li>
              <li>2. Confirmez la transaction en saisissant votre code PIN MTN Money.</li>
              <li>3. Ne fermez pas cette page pendant le traitement.</li>
            </ol>
          </div>
        );
      case 'orange_money':
        return (
          <div className="bg-yellow-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-yellow-800 mb-2">Instructions Orange Money :</h3>
            <ol className="space-y-2 text-yellow-700 text-sm">
              <li>1. Vérifiez votre téléphone pour une notification de paiement Orange.</li>
              <li>2. Confirmez la transaction en saisissant votre code secret Orange Money.</li>
              <li>3. Ne fermez pas cette page pendant le traitement.</li>
            </ol>
          </div>
        );
      case 'credit_card':
        return (
          <div className="bg-blue-50 p-4 rounded-lg text-left mt-6">
            <h3 className="font-medium text-blue-800 mb-2">Traitement du paiement par carte :</h3>
            <p className="text-blue-700 text-sm">
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
                  <Loader className="h-10 w-10 text-primary animate-spin" />
                </div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                  style={{ 
                    transform: `rotate(${progress * 3.6}deg)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                ></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              Traitement du paiement en cours
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {processingMessage || 'Initialisation du paiement...'}
            </p>
            
            {/* Barre de progression */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
              ></div>
            </div>
            
            {/* Instructions spécifiques à la méthode de paiement */}
            {getMethodInstructions()}
            
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
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
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
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <X className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
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