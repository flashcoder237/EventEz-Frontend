// src/app/events/[id]/register/payment/page.tsx
// PAS de directive 'use client'

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import MainLayout from '@/components/layout/MainLayout';
import ClientPaymentForm from '@/components/payment/ClientPaymentForm';

// Page serveur simple
export default async function PaymentPage({ params, searchParams }: {
  params: { id: string };
  searchParams: { registration: string };
}) {
  // Vérifier que l'utilisateur est connecté
  const session = await getServerSession(authOptions);
  
  if (!session) {
    const redirectUrl = `/events/${params.id}/register/payment`;
    const registrationParam = searchParams.registration ? `?registration=${searchParams.registration}` : '';
    const fullRedirectUrl = `${redirectUrl}${registrationParam}`;
    return redirect(`/login?redirect=${encodeURIComponent(fullRedirectUrl)}`);
  }
  
  // Vérifier que l'ID d'inscription est présent
  if (!searchParams.registration) {
    return redirect(`/events/${params.id}/register`);
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ClientPaymentForm 
          eventId={params.id}
          registrationId={searchParams.registration}
        />
      </div>
    </MainLayout>
  );
}