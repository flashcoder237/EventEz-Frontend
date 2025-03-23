// app/events/[id]/register/page.tsx
import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import { eventsAPI } from '@/lib/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getRegistrationData(id: string) {
  try {
    // Obtenir les détails de l'événement
    const eventResponse = await eventsAPI.getEvent(id);
    const event = eventResponse.data;
    
    // Vérifier si l'événement est validé et n'est pas terminé
    const eventHasPassed = new Date(event.end_date) < new Date();
    const registrationDeadlinePassed = event.registration_deadline 
      ? new Date(event.registration_deadline) < new Date() 
      : false;
    
    if (event.status !== 'validated' || eventHasPassed || registrationDeadlinePassed) {
      return null;
    }
    
    // Obtenir les données nécessaires selon le type d'événement
    if (event.event_type === 'billetterie') {
      const ticketTypesResponse = await eventsAPI.getTicketTypes(id);
      return {
        event,
        ticketTypes: ticketTypesResponse.data.results || []
      };
    } else {
      const formFieldsResponse = await eventsAPI.getFormFields(id);
      return {
        event,
        formFields: formFieldsResponse.data.results || []
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'inscription:', error);
    return null;
  }
}

export default async function EventRegisterPage({ params }: { params: { id: string } }) {
  // Vérifier si l'utilisateur est connecté
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Rediriger vers la page de connexion
    redirect(`/login?redirect=/events/${params.id}/register`);
  }
  
  const registrationData = await getRegistrationData(params.id);
  
  // Si l'événement n'est pas trouvé ou n'est pas disponible pour inscription
  if (!registrationData) {
    notFound();
  }
  
  const { event, ticketTypes, formFields } = registrationData;
  
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg">
            {event.event_type === 'billetterie' 
              ? 'Acheter des billets' 
              : 'Formulaire d\'inscription'
            }
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Chargement...</div>}>
          <EventRegistrationForm 
            event={event}
            ticketTypes={ticketTypes}
            formFields={formFields}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}