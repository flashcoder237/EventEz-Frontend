// src/components/payment/ClientPaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from './PaymentForm';
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
        setRegistration(registrationResponse.data);

        // Calculer le montant total si nécessaire
        if (initialTotalAmount === 0 && registrationResponse.data.tickets && registrationResponse.data.tickets.length > 0) {
          const calculatedTotal = registrationResponse.data.tickets.reduce((acc, ticket) => {
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
  }, [eventId, registrationId, initialTotalAmount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <h2 className="text-red-600 text-lg font-bold mb-4">Erreur</h2>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!event || !registration) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <h2 className="text-yellow-700 text-lg font-bold mb-4">Chargement des données...</h2>
        <p className="text-yellow-600">Veuillez patienter pendant le chargement des informations de paiement.</p>
      </div>
    );
  }

  return (
    <PaymentForm 
      event={event}
      registration={registration}
      totalAmount={totalAmount}
    />
  );
}