'use client';

import Image from 'next/image';
import { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
import DynamicEventBanner from '../DynamicEventBanner';

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  // Variables
  const isBilletterie = event.event_type === 'billetterie';
  const startTime = new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(event.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      {/* SECTION BANNIÈRE - séparée clairement du contenu */}
      <div className="relative">
        {/* Image ou bannière dynamique avec hauteur fixe */}
        <div className="w-full h-60 sm:h-68 md:h-76 lg:h-84 relative">
          {event.banner_image ? (
            <Image 
              src={event.banner_image}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <DynamicEventBanner 
              title={event.title}
              category={event.category.name}
              eventType={event.event_type}
              isFeatured={event.is_featured}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
      
      {/* SECTION CONTENU - complètement séparée de la bannière */}
      <div className="relative p-4 bg-white">
        
        {/* Grille d'informations - ajustée pour mieux s'adapter aux mobiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-violet-600" />
            <span className="text-sm text-gray-700">{formatDate(event.start_date, 'long')}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-violet-600" />
            <span className="text-sm text-gray-700">{startTime} - {endTime}</span>
          </div>  
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-violet-600" />
            <span className="text-sm text-gray-700 break-words">{event.location_name}, {event.location_city}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 mt-0.5 flex-shrink-0 text-violet-600" />
            <span className="text-sm text-gray-700">
              {event.registration_count} inscrit{event.registration_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}