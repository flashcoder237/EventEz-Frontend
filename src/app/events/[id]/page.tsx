// app/events/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { eventsAPI } from '@/lib/api';
import EventDetailWithData from './EventDetailWithData'; // Ajout de l'import ici

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props) {
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

// Cette fonction s'exécute côté serveur pour obtenir les données de base
async function getEventData(id: string) {
  try {
    // Obtenir les détails de l'événement - cet appel fonctionne sans authentification
    const eventResponse = await eventsAPI.getEvent(id);
    const event = eventResponse.data;
    
    // Nous retournons seulement les données de base de l'événement
    return {
      event,
      // Les tableaux vides seront remplis côté client
      ticketTypes: [],
      formFields: [],
      feedbacks: []
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
          <EventDetailWithData 
            event={event}
            initialTicketTypes={ticketTypes}
            initialFormFields={formFields}
            initialFeedbacks={feedbacks}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}