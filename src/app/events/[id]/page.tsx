// app/events/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import EventDetail from '@/components/events/EventDetail';
import { eventsAPI, feedbackAPI } from '@/lib/api';

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getEventData(id: string) {
  try {
    // Obtenir les détails de l'événement
    const eventResponse = await eventsAPI.getEvent(id);
    
    // Obtenir les types de billets si c'est un événement avec billetterie
    let ticketTypes = [];
    if (eventResponse.data.event_type === 'billetterie') {
      const ticketTypesResponse = await eventsAPI.getTicketTypes(id);
      ticketTypes = ticketTypesResponse.data.results || [];
    }
    
    // Obtenir les champs de formulaire si c'est un événement avec inscription personnalisée
    let formFields = [];
    if (eventResponse.data.event_type === 'inscription') {
      const formFieldsResponse = await eventsAPI.getFormFields(id);
      formFields = formFieldsResponse.data.results || [];
    }
    
    // Obtenir les avis
    const feedbacksResponse = await feedbackAPI.getFeedbacks(id);
    
    return {
      event: eventResponse.data,
      ticketTypes,
      formFields,
      feedbacks: feedbacksResponse.data.results || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'événement:', error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventData = await getEventData(params.id);
  
  // Si l'événement n'est pas trouvé, retourner une page 404
  if (!eventData) {
    notFound();
  }
  
  const { event, ticketTypes, formFields, feedbacks } = eventData;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Chargement...</div>}>
          <EventDetail 
            event={event}
            ticketTypes={ticketTypes}
            formFields={formFields}
            feedbacks={feedbacks}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}