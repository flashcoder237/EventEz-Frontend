// src/components/events/detail/EventTabs.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import EventDetailsTab from './tabs/EventDetailsTab';
import EventTicketsTab from './tabs/EventTicketsTab';
import EventLocationTab from './tabs/EventLocationTab';
import EventOrganizerTab from './tabs/EventOrganizerTab';
import EventReviewsTab from './tabs/EventReviewsTab';
import EventRegistrationTab from './tabs/EventRegistrationTab';
import { Event, TicketType, FormField, Feedback } from '@/types';

interface EventTabsProps {
  event: Event;
  ticketTypes?: TicketType[];
  formFields?: FormField[];
  feedbacks?: Feedback[];
}

// Définir tous les onglets possibles pour validation
const validTabs = ['details', 'tickets', 'registration', 'location', 'organizer', 'reviews'];

export default function EventTabs({ 
  event, 
  ticketTypes = [], 
  formFields = [], 
  feedbacks = [] 
}: EventTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const isBilletterie = event.event_type === 'billetterie';

  // Récupérer l'onglet actif depuis l'URL au chargement de la page
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Mettre à jour l'URL lorsque l'onglet actif change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Mettre à jour l'URL avec l'onglet sélectionné
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    
    // Remplacer l'URL sans causer de navigation complète (préserve l'historique)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
      <TabsList className="mb-2">
        <TabsTrigger value="details" id="tab-details">Détails</TabsTrigger>
        {isBilletterie && <TabsTrigger value="tickets" id="tab-tickets">Billets</TabsTrigger>}
        {!isBilletterie && <TabsTrigger value="registration" id="tab-registration">Inscription</TabsTrigger>}
        <TabsTrigger value="location" id="tab-location">Lieu</TabsTrigger>
        <TabsTrigger value="organizer" id="tab-organizer">Organisateur</TabsTrigger>
        <TabsTrigger value="reviews" id="tab-reviews">Avis ({feedbacks.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="pt-6 animate-fade-in">
        <div id="details">
          <EventDetailsTab event={event} />
        </div>
      </TabsContent>
      
      {isBilletterie && (
        <TabsContent value="tickets" className="pt-6 animate-fade-in">
          <div id="tickets">
            <EventTicketsTab ticketTypes={ticketTypes} event={event} />
          </div>
        </TabsContent>
      )}
      
      {!isBilletterie && (
        <TabsContent value="registration" className="pt-6 animate-fade-in">
          <div id="registration">
            <EventRegistrationTab formFields={formFields} />
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="location" className="pt-6 animate-fade-in">
        <div id="location">
          <EventLocationTab event={event} />
        </div>
      </TabsContent>
      
      <TabsContent value="organizer" className="pt-6 animate-fade-in">
        <div id="organizer">
          <EventOrganizerTab event={event} />
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="pt-6 animate-fade-in">
        <div id="reviews">
          <EventReviewsTab feedbacks={feedbacks} event={event} />
        </div>
      </TabsContent>
    </Tabs>
  );
}