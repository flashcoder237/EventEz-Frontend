// src/app/events/[id]/register/confirmation/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { eventsAPI, registrationsAPI } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default async function RegistrationConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { registration: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  if (!searchParams.registration) {
    redirect(`/events/${params.id}`);
  }
  
  // Charger les détails de l'inscription
  const registrationData = await registrationsAPI.getRegistration(searchParams.registration);
  
  // Vérifier si l'inscription est confirmée
  if (registrationData.data.status !== 'confirmed' && registrationData.data.payment_status !== 'paid') {
    // Si l'inscription nécessite un paiement et n'est pas encore payée, rediriger vers la page de paiement
    if (registrationData.data.requires_payment) {
      redirect(`/events/${params.id}/register/payment?registration=${searchParams.registration}`);
    }
    
    // Si l'inscription est gratuite mais pas encore confirmée, mettre à jour son statut
    if (!registrationData.data.requires_payment) {
      try {
        await registrationsAPI.patchRegistration(searchParams.registration, {
          status: 'confirmed'
        });
      } catch (error) {
        console.error("Erreur lors de la confirmation de l'inscription gratuite:", error);
      }
    }
  }
  
  const eventData = await eventsAPI.getEvent(params.id);
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Inscription confirmée!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Votre inscription à l'événement {eventData.data.title} a été confirmée avec succès.
          </p>
          
          {/* Détails de l'inscription */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            {/* Afficher les détails pertinents de l'inscription */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Détails de l'inscription :</h3>
              <p className="text-gray-600">
                <strong>Référence :</strong> {registrationData.data.reference_code || searchParams.registration}
              </p>
              <p className="text-gray-600">
                <strong>Date :</strong> {new Date(registrationData.data.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              {registrationData.data.tickets && registrationData.data.tickets.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Billets :</h4>
                  <ul className="list-disc list-inside text-gray-600 pl-2">
                    {registrationData.data.tickets.map((ticket: any, index: number) => (
                      <li key={index}>
                        {ticket.ticket_type_name} x{ticket.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Informations importantes */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-indigo-700 text-sm">
                Un email de confirmation contenant tous les détails de votre inscription vous a été envoyé.
                Conservez précieusement cette référence pour accéder à votre billet.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/dashboard/registrations/${searchParams.registration}`}>
              Voir les détails de mon inscription
            </Button>
            
            <Button href="/" variant="outline">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}