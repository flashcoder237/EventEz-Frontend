'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { registrationsAPI, eventsAPI, usersAPI } from '@/lib/api';
import { Registration, Event, User } from 'types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

export default function RegistrationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const registrationId = params.id;

  

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm', { locale: fr });
  };
  
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownloadPDF = () => {
    // Cette fonction serait implémentée avec une bibliothèque comme jsPDF ou en utilisant une API backend
    alert("La fonctionnalité de téléchargement PDF sera bientôt disponible");
  };

  // Fonction pour générer l'URL de vérification vers votre application
  const getVerificationUrl = () => {
    // Utilisation du format d'URL spécifié
    return `http://localhost:3000/dashboard/registrations/${registrationId}/verify`;
  };

  useEffect(() => {
    async function fetchRegistrationDetails() {
      setLoading(true);
      setError(null);
      try {
        const registrationResponse = await registrationsAPI.getRegistration(registrationId);
        setRegistration(registrationResponse.data);
        
        if (registrationResponse.data.user) {
          const getUserResponse = await usersAPI.getUser(registrationResponse.data.user);
          setUser(getUserResponse.data);
        }
        
        if (registrationResponse.data.event) {
          const getEventResponse = await eventsAPI.getEvent(registrationResponse.data.event);
          setEvent(getEventResponse.data);
        }
      } catch (err) {
        setError(err.message);
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
        <span className="ml-3 text-purple-700 font-medium">Chargement des détails de l'inscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => router.back()}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-600 bg-gray-50 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-2">Inscription non trouvée</h2>
          <p>Les détails de cette inscription ne sont pas disponibles.</p>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => router.back()}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Composant personnalisé pour le QR code avec logo
  const QRCode = ({ value, size = 150 }) => {
    return (
      <div className="relative">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&format=svg&qzone=1&margin=0&bgcolor=FFFFFF&color=5B21B6`} 
          alt="QR Code"
          className="rounded-lg"
          width={size}
          height={size}
        />
      </div>
    );
  };
  

  return (
    <div className={`bg-gray-50 min-h-screen ${isPrinting ? 'print:bg-white print:p-0' : 'py-8'}`}>
      <div className="w-full flex justify-center items-center">
        {!isPrinting && (
          <button
            className="w-full max-w-3xl mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow flex items-center justify-center"
            onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour
          </button>
        )}
      </div>
      
      <div className={`max-w-3xl mx-auto bg-white ${isPrinting ? '' : 'shadow-lg'} rounded-lg overflow-hidden print:shadow-none`}>
        {/* En-tête avec logos */}
        <div className="bg-purple-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              {/* Logo de votre application */}
              <div className="mr-4 p-2 rounded-md">
                <Image 
                  src="/images/logo-bg.png" // Chemin vers le logo de votre application
                  alt="Logo Application"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FACTURE</h1>
                <p className="text-purple-200">Référence: {registration.reference_code}</p>
              </div>
            </div>
            <div className="text-right flex items-center">
              <div>
                <p className="font-semibold text-xl">{event?.organizer?.company_name}</p>
                <p className="text-purple-200">{event?.organizer?.email}</p>
                <p className="text-purple-200">{event?.organizer?.phone_number}</p>
              </div>
              {/* Logo de l'organisateur */}
              {event?.organizer?.logo_url && 
              <div className="ml-4 bg-white p-2 rounded-md">
                <Image 
                  src={event?.organizer?.logo_url || "/images/placeholder-logo.png"} // Logo de l'organisateur ou un placeholder
                  alt="Logo Organisateur"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              }
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6">
          {/* Section client et facturation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Informations du client */}
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4">Client</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-lg">{user?.last_name} {user?.first_name}</p>
                <p className="text-gray-700">{user?.billing_address}</p>
                {user?.company_name && <p className="text-gray-700">{user.company_name}</p>}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-600">Email: <span className="text-gray-800">{user?.email}</span></p>
                  <p className="text-gray-600">Téléphone: <span className="text-gray-800">{user?.phone_number}</span></p>
                </div>
              </div>
            </div>

            {/* Détails de la facture */}
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4">Informations de la Facture</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">Numéro de facture:</p>
                    <p className="font-medium">{registration.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date d'émission:</p>
                    <p className="font-medium">{formatDate(registration.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Statut:</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      registration.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : registration.status === "pending" 
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {registration.status === "confirmed" 
                        ? "Confirmé" 
                        : registration.status === "pending"
                          ? "En attente"
                          : registration.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Date de confirmation:</p>
                    <p className="font-medium">{registration.confirmed_at ? formatDate(registration.confirmed_at) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'événement */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Détails de l'Événement</h2>
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{registration.event_detail?.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{formatDate(registration.event_detail?.start_date)}</span></p>
                  <p className="text-gray-600">Horaires: <span className="font-medium text-gray-800">{formatTime(registration.event_detail?.start_date)} - {formatTime(registration.event_detail?.end_date)}</span></p>
                </div>
                <div>
                  <p className="text-gray-600">Lieu: <span className="font-medium text-gray-800">{registration.event_detail?.location_city}</span></p>
                  <p className="text-gray-600">Organisateur: <span className="font-medium text-gray-800">{registration.event_detail?.organizer_name}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Table des tickets */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Détails des Billets</h2>
            <div className="overflow-x-auto shadow-sm rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="py-3 px-4 font-semibold text-sm border-b text-purple-800">Type de Billet</th>
                    <th className="py-3 px-4 font-semibold text-sm border-b text-right text-purple-800">Prix Unitaire</th>
                    <th className="py-3 px-4 font-semibold text-sm border-b text-center text-purple-800">Quantité</th>
                    <th className="py-3 px-4 font-semibold text-sm border-b text-right text-purple-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {registration.tickets?.map((ticket, index) => (
                    <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-4 px-4">{ticket.ticket_type_name}</td>
                      <td className="py-4 px-4 text-right">{formatMoney(ticket.unit_price)}</td>
                      <td className="py-4 px-4 text-center">{ticket.quantity}</td>
                      <td className="py-4 px-4 text-right">{formatMoney(ticket.total_price)}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-bold">
                    <td colSpan={2} className="py-4 px-4 text-right">Total</td>
                    <td className="py-4 px-4 text-center">{registration.tickets?.reduce((acc, ticket) => acc + parseInt(ticket.quantity), 0)}</td>
                    <td className="py-4 px-4 text-right">{formatMoney(registration.tickets?.reduce((acc, ticket) => acc + parseFloat(ticket.total_price), 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Code avec logo amélioré qui renvoie vers votre application */}
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <QRCode 
                value={getVerificationUrl()}
                size={180}
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">Scannez ce code pour vérifier l'authenticité de votre billet</p>
            <p className="text-sm font-semibold text-purple-700">{registration.reference_code}</p>
          </div>

          {/* Notes & Conditions */}
          <div className="mb-8 text-sm text-gray-600 border-t pt-4">
            <h3 className="font-semibold mb-2 text-purple-700">Conditions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Veuillez présenter votre code QR à l'entrée de l'événement</li>
              <li>Cette facture sert de preuve d'achat</li>
              <li>Les billets ne sont ni échangeables ni remboursables sauf annulation de l'événement</li>
              <li>L'organisateur se réserve le droit de refuser l'entrée en cas de non-respect des conditions générales</li>
            </ul>
          </div>

          {/* Boutons d'action - visible uniquement quand on n'imprime pas */}
          {!isPrinting && (
            <div className="flex flex-wrap justify-end gap-4 pt-4 border-t">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-6 11v-4h6v4H7z"></path>
                </svg>
                Imprimer
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Télécharger PDF
              </button>
              <button 
                onClick={() => window.location.href = `mailto:?subject=Facture ${registration.reference_code}&body=Veuillez trouver ci-joint votre facture pour l'événement ${registration.event_detail?.title}`}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Envoyer par email
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
          <p className="mb-2">Pour toute question, veuillez contacter notre service client au {event?.organizer?.phone_number || '+237 655 123 456'}</p>
          <p className="font-medium">{event?.organizer?.company_name || 'CamerEvents SARL'} - {event?.organizer?.registration_number || 'RC/YAO/2022/B/1234'} - IFU: {event?.organizer?.tax_id || 'P087600324355X'}</p>
        </div>
      </div>
      
      {/* Styles spécifiques pour l'impression */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 0.5cm;
          }
          button, .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}