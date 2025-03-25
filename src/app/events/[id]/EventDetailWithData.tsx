// app/events/[id]/EventDetailWithData.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import EventDetail from '@/components/events/EventDetail';
import { eventsAPI, feedbacksAPI,ticketTypesAPI} from '@/lib/api';
import { FaSpinner } from 'react-icons/fa';

export default function EventDetailWithData({ 
  event, 
  initialTicketTypes = [],
  initialFormFields = [],
  initialFeedbacks = []
}) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [ticketTypes, setTicketTypes] = useState(initialTicketTypes);
  const [formFields, setFormFields] = useState(initialFormFields);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  useEffect(() => {
    // Fonction pour charger les données supplémentaires
    const loadAdditionalData = async () => {
      if (!event) return;
      
      setLoading(true);
      
      try {
        // Charger les données selon le type d'événement
        if (event.event_type === 'billetterie') {
          try {
            const ticketTypesResponse = await ticketTypesAPI.getTicketTypes({ event: event.id });
            setTicketTypes(ticketTypesResponse.data?.results || []);
          } catch (error) {
            console.error('Erreur lors du chargement des billets:', error);
          }
        } else {
          try {
            // Dans la plupart des cas, vous n'avez pas besoin de cet appel puisque event contient déjà form_fields
            // Mais si vous avez besoin de les actualiser, voici la bonne façon de faire l'appel
            // const formFieldsResponse = await eventsAPI.getFormFields({ event: event.id });
            setFormFields(event.form_fields);
            console.log(event.form_fields);
            
          } catch (error) {
            console.error('Erreur lors du chargement des champs:', error);
          }
        }
        
        // Charger les feedbacks si nécessaire
        try {
          const feedbacksResponse = await feedbacksAPI.getFeedbacks({ event: event.id });
          setFeedbacks(feedbacksResponse.data?.results || []);
        } catch (error) {
          console.error('Erreur lors du chargement des avis:', error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données supplémentaires:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdditionalData();
  }, [event]);

  if (loading && (ticketTypes.length === 0 && formFields.length === 0)) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-primary h-8 w-8 mr-2" />
        <span>Chargement des détails...</span>
      </div>
    );
  }

  return (
    <EventDetail 
      event={event}
      feedbacks={feedbacks}
      ticketTypes = {ticketTypes}
      formFields = {event.form_fields}
    />
  );
}