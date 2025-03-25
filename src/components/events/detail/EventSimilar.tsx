// src/components/events/detail/EventSimilar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { eventsAPI } from '@/lib/api';

interface EventSimilarProps {
  currentEvent: Event;
}

export default function EventSimilar({ currentEvent }: EventSimilarProps) {
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarEvents = async () => {
      try {
        // Trouver des événements similaires basés sur la catégorie
        const response = await eventsAPI.getEvents({ 
          category: currentEvent.category.id,
          status: 'validated',
          limit: 3
        });
        
        // Filtrer pour exclure l'événement actuel
        const filteredEvents = response.data.results.filter(
          (event: Event) => event.id !== currentEvent.id
        );
        
        setSimilarEvents(filteredEvents.slice(0, 2));
      } catch (error) {
        console.error('Erreur lors du chargement des événements similaires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarEvents();
  }, [currentEvent.id, currentEvent.category.id]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Événements similaires</h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="bg-gray-200 h-16 w-16 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Événements similaires</h3>
        <div className="text-center py-6">
          <p className="text-gray-500 mb-3">Aucun événement similaire trouvé.</p>
          <Button
            href={`/events?category=${currentEvent.category.id}`}
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            Explorer {currentEvent.category.name}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="font-bold text-lg mb-4">Événements similaires</h3>
      <div className="space-y-4">
        {similarEvents.map(event => (
          <Link 
            key={event.id} 
            href={`/events/${event.id}`}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
              {event.banner_image ? (
                <Image
                  src={event.banner_image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
              <p className="text-xs text-gray-500">
                {formatDate(event.start_date, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500 truncate">{event.location_city}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
        
        <div className="pt-2 text-center">
          <Button
            href={`/events?category=${currentEvent.category.id}`}
            variant="outline"
            size="sm"
            className="w-full inline-flex items-center justify-center"
          >
            Voir plus d'événements
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}