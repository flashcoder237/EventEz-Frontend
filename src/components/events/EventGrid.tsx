// components/events/EventGrid.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
  loading?: boolean;
}

export default function EventGrid({ events, loading = false }: EventGridProps) {
  console.log("EventGrid - Events:", events.length);
  
  const gridRef = useRef<HTMLDivElement>(null);

  // Animation lorsque de nouveaux événements sont ajoutés
  useEffect(() => {
    if (gridRef.current && !loading) {
      // Non-blocking log
      console.log("Grid rendered with", events.length, "events");
    }
  }, [events.length, loading]);

  if (loading && events.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 inline-block max-w-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Aucun événement trouvé</h3>
          <p className="mt-2 text-sm text-gray-600">
            Essayez de modifier vos critères de recherche ou revenez plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={gridRef}>
      {events.map((event, index) => {
        // Debug log pour chaque événement
        console.log(`Rendering event ${index}:`, event.id, event.title);
        
        return (
          <div key={event.id}>
            <EventCard event={event} />
          </div>
        );
      })}
      
      {/* Indicateur de chargement en bas de la grille */}
      {loading && events.length > 0 && (
        <div className="col-span-full flex justify-center py-4">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Chargement...</span>
          </div>
        </div>
      )}
    </div>
  );
}