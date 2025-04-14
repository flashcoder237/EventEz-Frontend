'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Event, TicketType, FormField, Feedback } from '@/types';
import { useSearchParams } from 'next/navigation';

// Importer les composants modulaires
import { EventHero } from './detail/EventHero';
import EventTabs from './detail/EventTabs';
import EventActions from './detail/EventActions';
import EventSocialShare from './detail/EventSocialShare';
import EventSimilar from './detail/EventSimilar';
import EventTabLinks from './detail/EventTabLinks';

interface EventDetailProps {
  event: Event;
  ticketTypes?: TicketType[];
  formFields?: FormField[];
  feedbacks?: Feedback[];
}

export default function EventDetail({ 
  event, 
  ticketTypes = [],
  formFields = [], 
  feedbacks = [] 
}: EventDetailProps) {
  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      // Pas besoin de rediriger ici, l'événement peut être consulté par tous
    },
  });
  
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  return (
    <div className="max-w-6xl mx-auto pt-10">
      {/* Hero Section avec l'image de l'événement */}
      <EventHero event={event} />
      
      {/* Tags de navigation rapide */}
      <div className="invisible hidden">
        <EventTabLinks 
          event={event} 
          activeTab={activeTab} 
          feedbacksCount={feedbacks.length}
          
        />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contenu principal avec les onglets */}
        <div className="w-full lg:w-2/3">
          <EventTabs 
            event={event}
            ticketTypes={ticketTypes}
            formFields={formFields}
            feedbacks={feedbacks}
          />
        </div>
        
        {/* Sidebar avec les actions, partage et événements similaires */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Informations et actions principales */}
          <EventActions 
            event={event}
            ticketTypes={ticketTypes}
            formFields={formFields}
          />
          
          {/* Options de partage social */}
          <EventSocialShare eventTitle={event.title} />
          
          {/* Événements similaires */}
          <EventSimilar currentEvent={event} />
        </div>
      </div>
    </div>
  );
}