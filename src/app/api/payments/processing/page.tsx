'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { paymentsAPI, eventsAPI, registrationsAPI } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

export default function PaymentProcessingPage({ 
  params,
  searchParams
}: { 
  params: { id: string };
  searchParams: { 
    registration: string;
    payment: string;
    method: string;
  }
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [event, setEvent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  // Vérifier si les paramètres nécessaires sont présents
  useEffect(() => {
    if (!searchParams.registration || !searchParams.payment) {
      router.replace(`/events/${params.id}`);
    }
  }, [searchParams, params.id, router]);
  
  // Charger les détails de l'événement
  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const eventResponse = await eventsAPI.getEvent(params.id);
        setEvent(eventResponse.data);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'événement:', err);
        setError('Impossible de charger les détails de l\'événement.');
      }
    };
    
    loadEventDetails();
  }, [params.id]);
  
  // Vérifier périodiquement le statut du paiement
  useEffect(() => {
    if (!searchParams.payment) return;
    
    const checkPaymentStatus = async () => {
      try {
        const paymentResponse = await paymentsAPI.getPayment(searchParams.payment);
        setPayment(paymentResponse.data);
        
        if (paymentResponse.data.status === 'completed') {
          setStatus('success');
          // Arrêter la vérification périodique
          return true;
        } else if (paymentResponse.data.status === 'failed' || paymentResponse.data.status === 'cancelled') {
          setStatus('failed');
          setError('Le paiement a échoué ou a été annulé.');
          // Arrêter la vérification périodique
          return true;
        }
        
        // Continuer la vérification
        return false;
      } catch (err) {
        console.error('Erreur lors de la vérification du statut du paiement:', err);
        setError('Erreur lors de la vérification du paiement.');
        setStatus('failed');
        return true;
      }
    };
    
    // Vérifier immédiatement
    checkPaymentStatus();
    
    // Vérifier toutes les 5 secondes
    const interval = setInterval(async () => {
      const shouldStop = await checkPaymentStatus();
      if (shouldStop) {
        clearInterval(interval);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [searchParams.payment]);
  
  // Rediriger automatiquement vers la page de confirmation en cas de succès
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, params.id, searchParams.registration, router]);
  
  // Gérer le bouton de retour
  const handleBack = () => {
    if (status === 'processing') {
      // Si le paiement est en cours, annuler le paiement
      if (searchParams.payment) {
        paymentsAPI.patchPayment(searchParams.payment, { status: 'cancelled' })
          .then(() => {
            router.replace(`/events/${params.id}/register/payment?registration=${searchParams.registration}`);
          })
          .catch((err) => {
            console.error('Erreur lors de l\'annulation du paiement:', err);
            router.replace(`/events/${params.id}/register/payment?registration=${searchParams.registration}`);
          });
      } else {
        router.replace(`/events/${params.id}/register/payment?registration=${searchParams.registration}`);
      }
    } else if (status === 'failed') {
      // Si le paiement a échoué, retourner à la page de paiement
      router.replace(`/events/${params.id}/register/payment?registration=${searchParams.registration}`);
    } else {
      // Si le paiement est réussi, aller à la page de confirmation
      router.replace(`/events/${params.id}/register/confirmation?registration=${searchParams.registration}`);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaSpinner className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">Traitement du paiement en cours</h1>
              <p className="text-gray-600 mb-8">
                Votre paiement est en cours de traitement. Veuillez ne pas fermer cette page.
              </p>
              {searchParams.method === 'mtn_money' || searchParams.method === 'orange_money' ? (
                <div className="bg-yellow-50 p-4 rounded-lg text-left mb-8">
                  <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
                  <p className="text-yellow-700 mb-2">
                    1. Vérifiez votre téléphone pour une demande de confirmation de paiement.
                  </p>
                  <p className="text-yellow-700 mb-2">
                    2. Validez le paiement en entrant votre code PIN {searchParams.method === 'mtn_money' ? 'MTN Money' : 'Orange Money'}.
                  </p>
                  <p className="text-yellow-700">
                    3. Attendez la confirmation sur cette page.
                  </p>
                </div>
              ) : null}
              <Button
                variant="outline"
                onClick={handleBack}
                className="inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Annuler et retourner
              </Button>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaCheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">Paiement réussi!</h1>
              <p className="text-gray-600 mb-8">
                Votre paiement a été traité avec succès. Vous allez être redirigé vers la page de confirmation.
              </p>
              <Button onClick={handleBack}>
                Voir ma confirmation
              </Button>
            </>
          )}
          
          {status === 'failed' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <FaTimesCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">Paiement échoué</h1>
              <p className="text-gray-600 mb-4">
                Une erreur est survenue lors du traitement de votre paiement.
              </p>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-8">
                  {error}
                </div>
              )}
              <Button onClick={handleBack}>
                Réessayer
              </Button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}