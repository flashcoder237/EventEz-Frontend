// components/events/EventGrid.tsx
'use client';

import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Users, 
  TicketCheck,
  ChevronRight 
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

// Type definitions for event data
interface Event {
  id: string;
  title: string;
  short_description?: string;
  banner_image?: string;
  start_date: string;
  end_date: string;
  city: string;
  event_type: 'billetterie' | 'inscription';
  category?: { 
    id: number; 
    name: string; 
  } | string;
  max_participants?: number;
  registration_count?: number;
  price_range?: {
    min: number;
    max: number;
  };
}

// Props for EventGrid component
interface EventGridProps {
  events: Event[];
  loading?: boolean;
}

export default function EventGrid({ events, loading = false }: EventGridProps) {
  // If loading, render skeleton loaders
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-md animate-pulse"
          >
            <div className="h-48 bg-gray-300 rounded-t-xl"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no events, show empty state
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <div className="mb-6">
          <Users className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Aucun événement trouvé
        </h2>
        <p className="text-gray-600 mb-6">
          Il n'y a pas d'événements correspondant à vos critères de recherche.
        </p>
        <Button href="/events">Réinitialiser les filtres</Button>
      </div>
    );
  }

  // Render events grid
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        // Handle different category formats
        const categoryName = typeof event.category === 'object' 
          ? event.category?.name 
          : event.category;

        return (
          <div 
            key={event.id} 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow group"
          >
            {/* Event Banner Image */}
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <Image 
                src={event.banner_image || '/images/default-event-banner.jpg'} 
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {categoryName && (
                <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {categoryName}
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>

              {event.short_description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.short_description}
                </p>
              )}

              {/* Event Meta Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">
                    {new Date(event.start_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{event.city}</span>
                </div>

                {event.event_type === 'billetterie' && (
                  <div className="flex items-center text-gray-600">
                    <TicketCheck className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">
                      {event.price_range 
                        ? `À partir de ${event.price_range.min} FCFA` 
                        : 'Billets disponibles'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.registration_count || 0} participants
                </div>
                
                <Button 
                  href={`/events/${event.id}`} 
                  size="sm"
                >
                  Détails & Inscription
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}