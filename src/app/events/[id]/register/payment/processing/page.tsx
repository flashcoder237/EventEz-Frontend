// src/app/events/[id]/register/payment/processing/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import PaymentProcessingPage from '@/components/payment/PaymentProcessingPage';

export default function ProcessingPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const registration = searchParams.get('registration');
  const payment = searchParams.get('payment');
  const method = searchParams.get('method');

  // Assembler les paramètres pour le composant
  const processingParams = {
    registration: registration || '',
    payment: payment || '',
    method: method || ''
  };

  return (
    <PaymentProcessingPage 
      params={params} 
      searchParams={processingParams} 
    />
  );
}