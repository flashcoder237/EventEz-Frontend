// src/components/payment/PaymentSuccess.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Calendar, MapPin, Download, Share2, Copy, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
// Note: Nous utiliserons une représentation simple d'un QR code
// puisque qrcode.react n'est pas disponible par défaut

interface PaymentSuccessProps {
  event: any;
  registration: any;
}

export default function PaymentSuccess({ event, registration }: PaymentSuccessProps) {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

  // Générer un lien de référence pour le billet
  const ticketRefLink = `${window.location.origin}/tickets/${registration.reference_code}`;

  // Gérer la copie du lien du billet
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ticketRefLink);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (err) {
      console.error('Impossible de copier le lien:', err);
    }
  };

  // Simuler l'envoi d'un email de confirmation
  const handleSendEmail = () => {
    setShowEmailSent(true);
    setTimeout(() => setShowEmailSent(false), 3000);
  };
  
  // Format pour la date
  const eventDate = new Date(event.start_date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
        <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-6">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Paiement confirmé !</h1>
        <p className="text-xl">Votre inscription à l'événement a été confirmée avec succès.</p>
      </div>
      
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{event.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar className="h-6 w-6 text-green-600 mr-3 mt-1" />
              <div>
                <p className="font-medium text-gray-800">Date et heure</p>
                <p className="text-gray-600">{formattedDate}</p>
                <p className="text-gray-600">{formattedTime}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-green-600 mr-3 mt-1" />
              <div>
                <p className="font-medium text-gray-800">Lieu</p>
                <p className="text-gray-600">{event.location_name}</p>
                <p className="text-gray-600">{event.location_city}, {event.location_country}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ticket Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Détails de votre réservation</h3>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Confirmé
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Numéro de référence</p>
            <p className="font-bold text-gray-800">{registration.reference_code}</p>
          </div>
          
          {/* Tickets purchased */}
          {registration.tickets && registration.tickets.length > 0 && (
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Billets</h4>
              <div className="space-y-2">
                {registration.tickets.map((ticket: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{ticket.ticket_type_name} × {ticket.quantity}</span>
                    <span className="font-medium">{(ticket.total_price).toLocaleString()} XAF</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="border border-gray-200 p-3 bg-white rounded-lg mb-2">
                {/* Simple QR code representation */}
                <div className="h-32 w-32 bg-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Code QR: {registration.reference_code}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">À présenter lors de l'événement</p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Télécharger mes billets
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleCopyLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
            
            {showCopiedTooltip && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                Lien copié !
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleSendEmail}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            
            {showEmailSent && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                Email envoyé !
              </div>
            )}
          </div>
        </div>
        
        {/* Additional information */}
        <div className="mt-8 bg-indigo-50 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-indigo-800">
              Vous recevrez également un email de confirmation contenant toutes les informations de votre réservation.
              Veuillez vérifier votre dossier de spam si vous ne le trouvez pas dans votre boîte de réception.
            </p>
          </div>
        </div>
        
        {/* Return to events button */}
        <div className="mt-8 text-center">
          <Link href="/events">
            <Button variant="outline">
              Parcourir d'autres événements
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
  
  // Format pour l'heure
  const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });