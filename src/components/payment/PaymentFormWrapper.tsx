// src/components/payment/PaymentFormWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from './PaymentForm';
import { eventsAPI, registrationsAPI } from '@/lib/api';

interface PaymentFormWrapperProps {
  eventId: string;
  registrationId: string;
}

export default function PaymentFormWrapper({ eventId, registrationId }: PaymentFormWrapperProps) {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'ID d'inscription est présent
    if (!registrationId) {
      router.push(`/events/${eventId}/register`);
      return;
    }

    // Charger les données nécessaires
    const loadData = async () => {
      try {
        setLoading(true);

        // Récupérer les détails de l'événement
        const eventResponse = await eventsAPI.getEvent(eventId);
        const eventData = eventResponse.data;
        setEvent(eventData);

        // Récupérer les détails de l'inscription
        const registrationResponse = await registrationsAPI.getRegistration(registrationId);
        const registrationData = registrationResponse.data;
        setRegistration(registrationData);

        // Vérifier que l'inscription correspond à l'événement
        if (registrationData.event !== eventId) {
          setError('Cette inscription ne correspond pas à cet événement');
          return;
        }

        // Vérifier si le statut de l'inscription est déjà confirmé
        if (registrationData.status === 'confirmed') {
          // Rediriger vers la page de confirmation
          router.push(`/events/${eventId}/register/confirmation?registration=${registrationId}`);
          return;
        }

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, registrationId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <h2 className="text-red-600 text-lg font-bold mb-4">Erreur</h2>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => router.push(`/events/${eventId}`)}
          className="mt-4 bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-dark"
        >
          Retourner à l'événement
        </button>
      </div>
    );
  }

  if (!event || !registration) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <h2 className="text-yellow-600 text-lg font-bold mb-4">Information introuvable</h2>
        <p className="text-yellow-700">Les détails de l'événement ou de l'inscription n'ont pas pu être chargés.</p>
        <button 
          onClick={() => router.push(`/events/${eventId}`)}
          className="mt-4 bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-dark"
        >
          Retourner à l'événement
        </button>
      </div>
    );
  }

  // Calculer le montant total à payer si nécessaire
  let totalAmount = 0;
  if (registration.tickets && registration.tickets.length > 0) {
    totalAmount = registration.tickets.reduce((acc: number, ticket: any) => {
      return acc + ticket.total_price;
    }, 0);
  }

  return (
    <PaymentForm 
      event={event} 
      registration={registration} 
      totalAmount={totalAmount}
    />
  );
}