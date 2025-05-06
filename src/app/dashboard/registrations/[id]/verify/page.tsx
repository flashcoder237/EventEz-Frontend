'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { registrationsAPI } from '@/lib/api';
import { Registration } from 'types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

export default function VerifyRegistrationPage() {
  const params = useParams();
  const registrationId = params.id;

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm', { locale: fr });
  };

  useEffect(() => {
    async function fetchRegistrationDetails() {
      setLoading(true);
      setError(null);
      try {
        const registrationResponse = await registrationsAPI.getRegistration(registrationId);
        setRegistration(registrationResponse.data);
        console.log(registrationResponse.data);
        
      } catch (err) {
        setError("Impossible de vérifier ce billet. Veuillez réessayer ou contacter l'organisateur.");
      } finally {
        setLoading(false);
      }
    }

    if (registrationId) {
      fetchRegistrationDetails();
    }
  }, [registrationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        <span className="ml-3 text-purple-700 font-medium">Vérification du billet en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Vérification échouée</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="text-gray-600 bg-gray-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gray-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Billet non trouvé</h2>
          <p>Les informations de ce billet ne sont pas disponibles.</p>
        </div>
      </div>
    );
  }

  const isConfirmed = registration.status === "confirmed";
  const statusColor = isConfirmed ? "green" : registration.status === "pending" ? "yellow" : "red";
  const statusText = isConfirmed ? "Valide" : registration.status === "pending" ? "En attente" : "Invalide";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* En-tête avec le statut */}
        <div className={statusColor ==="yellow" ? "bg-yellow-500 text-white p-6 text-center": `bg-${statusColor}-800 text-white p-6 text-center` }>
          <div className="mb-3 flex justify-center">
            <div className={`rounded-full bg-${statusColor}-100 p-3`}>
              {isConfirmed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-${statusColor}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : registration.status === "pending" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-${statusColor}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-${statusColor}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold">Statut du billet: {statusText}</h1>
          <p className="text-sm mt-1">Référence: {registration.reference_code}</p>
        </div>

        {/* Corps avec les détails */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">Informations de l'événement</h2>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium">{registration.event_detail?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Date: {formatDate(registration.event_detail?.start_date)}
              </p>
              <p className="text-sm text-gray-600">
                Horaires: {formatTime(registration.event_detail?.start_date)} - {formatTime(registration.event_detail?.end_date)}
              </p>
              <p className="text-sm text-gray-600">
                Lieu: {registration.event_detail?.location_city}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">Détails des billets</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-2">Type</th>
                    <th className="pb-2 text-center">Qté</th>
                  </tr>
                </thead>
                <tbody>
                  {registration.tickets?.map((ticket, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{ticket.ticket_type_name}</td>
                      <td className="py-2 text-center">{ticket.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isConfirmed && (
            <div className="flex justify-center">
              <div className={`px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium text-sm flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ce billet a été vérifié
              </div>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-600">
          <p>Vérifié le {format(new Date(), 'PPP à HH:mm', { locale: fr })}</p>
          <p>Powered by EventEz</p>
        </div>
      </div>
    </div>
  );
}