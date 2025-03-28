// src/components/events/detail/EventHero.tsx
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
  const isBilletterie = event.event_type === 'billetterie';
  
  // Fonction de rendu pour les éléments de métadonnées
  const renderMetaItem = (icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-gray-200">{text}</span>
    </div>
  );

  return (
    <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
      <div className="aspect-[21/9] relative">
        {event.banner_image ? (
          <div>
            <Image 
            src={event.banner_image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjY2NjYyIvPjwvc3ZnPg=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          </div>
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
      
      {/* Event meta info */}
      <div className="absolute bottom-0 left-0 w-full px-6 py-8 text-white z-40">
        <div className="flex flex-wrap gap-3 mb-3">
          <Badge 
            variant={isBilletterie ? "info" : "success"} 
            className="px-3 py-1"
          >
            {isBilletterie ? 'Billetterie' : 'Inscription'}
          </Badge>
          
          <Badge variant="secondary" className="px-3 py-1">
            {event.category.name}
          </Badge>
          
          {event.is_featured && (
            <Badge variant="warning" className="px-3 py-1 bg-amber-500">
              En vedette
            </Badge>
          )}
        </div>
        {event.banner_image && (
          <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">
          {event.title}
        </h1> 
        ) }
        
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-white">
          {renderMetaItem(
            <Calendar className="h-5 w-5 text-white" />,
            formatDate(event.start_date, 'long')
          )}
          
          {renderMetaItem(
            <Clock className="h-5 w-5 " />,
            `${new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
          )}
          
          {renderMetaItem(
            <MapPin className="h-5 w-5 "/>,
            `${event.location_name}, ${event.location_city}`
          )}
          
          {renderMetaItem(
            <Users className="h-5 w-5 text-gray" />,
            `${event.registration_count} inscrit${event.registration_count !== 1 ? 's' : ''}`
          )}
        </div>
      </div>
    </div>
  );
}