// src/components/payment/ClientPaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { PaymentPage } from './form/index'; // Importer depuis le fichier index
import { eventsAPI, registrationsAPI } from '@/lib/api';

interface ClientPaymentFormProps {
  eventId: string;
  registrationId: string;
  initialTotalAmount?: number;
}

export default function ClientPaymentForm({
  eventId,
  registrationId,
  initialTotalAmount = 0
}: ClientPaymentFormProps) {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les détails de l'événement
        const eventResponse = await eventsAPI.getEvent(eventId);
        setEvent(eventResponse.data);

        // Récupérer les détails de l'inscription
        const registrationResponse = await registrationsAPI.getRegistration(registrationId);
        const registrationData = registrationResponse.data;
        setRegistration(registrationData);
        
        // Vérifier si l'inscription est déjà confirmée ou payée
        if (registrationData.status === 'confirmed' || registrationData.payment_status === 'paid') {
          // Rediriger vers la page de confirmation
          router.replace(`/events/${eventId}/register/confirmation?registration=${registrationId}`);
          return;
        }

        // Calculer le montant total si nécessaire
        if (initialTotalAmount === 0 && registrationData.tickets && registrationData.tickets.length > 0) {
          const calculatedTotal = registrationData.tickets.reduce((acc, ticket) => {
            return acc + ticket.total_price;
          }, 0);
          setTotalAmount(calculatedTotal);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données de paiement. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, registrationId, initialTotalAmount, router]);

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-gray-600">Chargement de vos informations de paiement...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 p-6 rounded-lg text-center shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-red-600 text-lg font-bold mb-4">Erreur</h2>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          Retour
        </button>
      </motion.div>
    );
  }

  if (!event || !registration) {
    return (
      <motion.div 
        className="bg-yellow-50 p-6 rounded-lg text-center shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-yellow-700 text-lg font-bold mb-4">Chargement des données...</h2>
        <p className="text-yellow-600">Veuillez patienter pendant le chargement des informations de paiement.</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-yellow-300 h-3 w-3"></div>
            <div className="rounded-full bg-yellow-300 h-3 w-3"></div>
            <div className="rounded-full bg-yellow-300 h-3 w-3"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <PaymentPage 
      event={event}
      registration={registration}
      totalAmount={totalAmount}
    />
  );
}