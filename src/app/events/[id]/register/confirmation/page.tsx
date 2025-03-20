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