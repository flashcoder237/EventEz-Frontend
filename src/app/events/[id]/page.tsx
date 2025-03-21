// app/events/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import EventDetail from '@/components/events/EventDetail';
import { eventsAPI, feedbackAPI } from '@/lib/api';

type Props = {
  params: { id: string }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const event = await eventsAPI.getEvent(params.id);
    
    return {
      title: `${event.data.title} | EventEz`,
      description: event.data.short_description || event.data.description.substring(0, 160),
      openGraph: {
        images: event.data.banner_image ? [event.data.banner_image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Événement non trouvé | EventEz',
    };
  }
}

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getEventData(id: string) {
  try {
    // Obtenir les détails de l'événement
    const eventResponse = await eventsAPI.getEvent(id);
    
    // Obtenir les types de billets si c'est un événement avec billetterie
    let ticketTypes = [];
    if (eventResponse.data.event_type === 'billetterie') {
      try {
        const ticketTypesResponse = await eventsAPI.getTicketTypes(id);
        ticketTypes = ticketTypesResponse.data.results || [];
      } catch (ticketError) {
        console.error('Erreur lors de la récupération des types de billets:', ticketError);
        // Continue with empty ticketTypes array
      }
    }
    
    // Obtenir les champs de formulaire si c'est un événement avec inscription personnalisée
    let formFields = [];
    if (eventResponse.data.event_type === 'inscription') {
      try {
        const formFieldsResponse = await eventsAPI.getFormFields(id);
        formFields = formFieldsResponse.data.results || [];
      } catch (formError) {
        console.error('Erreur lors de la récupération des champs de formulaire:', formError);
        // Continue with empty formFields array
      }
    }
    
    // Obtenir les avis
    let feedbacks = [];
    try {
      const feedbacksResponse = await feedbackAPI.getFeedbacks(id);
      feedbacks = feedbacksResponse.data.results || [];
    } catch (feedbackError) {
      console.error('Erreur lors de la récupération des avis:', feedbackError);
      // Continue with empty feedbacks array
    }
    
    return {
      event: eventResponse.data,
      ticketTypes,
      formFields,
      feedbacks
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