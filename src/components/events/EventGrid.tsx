'use client';

import { useRef, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface EventGridProps {
  events: Event[];
  loading?: boolean;
}

export default function EventGrid({ events, loading = false }: EventGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Animation lorsque de nouveaux événements sont ajoutés
  useEffect(() => {
    if (gridRef.current && !loading && events.length > 0) {
      // Animer subtilement l'apparition des nouveaux éléments
      const newElements = gridRef.current.querySelectorAll('[data-new="true"]');
      newElements.forEach(el => {
        // Retirer l'attribut pour éviter de les animer à nouveau
        setTimeout(() => {
          el.removeAttribute('data-new');
        }, 600);
      });
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 lg:px-16" ref={gridRef}>
      {events.map((event, index) => (
        <div 
          key={event.id} 
          className="opacity-0 animate-fade-in" 
          style={{ 
            animationDelay: `${Math.min(index * 0.1, 0.5)}s`,
            animationFillMode: 'forwards'
          }}
          data-new={events.length > 3 && index >= events.length - 3 ? "true" : "false"}
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}