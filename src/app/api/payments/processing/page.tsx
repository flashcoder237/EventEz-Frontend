// src/app/events/[id]/register/payment/processing/page.tsx
// SANS la directive 'use client'

import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import MainLayout from '@/components/layout/MainLayout';
import ClientProcessingComponent from '@/components/payment/ClientProcessingComponent';

// Métadonnées (côté serveur)
export async function generateMetadata({ params }) {
  return {
    title: 'Traitement du paiement | EventEz',
    description: 'Votre paiement est en cours de traitement'
  };
}

// Page serveur qui rend un composant client
export default async function ProcessingPage({ params, searchParams }) {
  // Vérification d'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect('/login');
  }

  return (
    <MainLayout>
      <Suspense fallback={<div>Chargement...</div>}>
        <ClientProcessingComponent 
          eventId={params.id}
          registration={searchParams.registration}
          payment={searchParams.payment}
          method={searchParams.method}
        />
      </Suspense>
    </MainLayout>
  );
}