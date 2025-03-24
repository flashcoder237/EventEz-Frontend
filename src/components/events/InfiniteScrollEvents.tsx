'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import EventGrid from './EventGrid';
import EventListView from './EventListView';
import ViewSelector from './ViewSelector';
import { Button } from '../ui/Button';
import { eventsAPI } from '@/lib/api';
import { ChevronUp, ChevronDown, ArrowUp } from 'lucide-react';

interface InfiniteScrollEventsProps {
  initialEvents: Event[];
  totalEvents: number;
  searchParams: Record<string, string>;
}

export default function InfiniteScrollEvents({
  initialEvents,
  totalEvents,
  searchParams
}: InfiniteScrollEventsProps) {
  console.log("InfiniteScrollEvents - Initial Events:", initialEvents.length);
  
  const EVENTS_PER_PAGE = 9;
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  
  // S'assurer que nous avons les événements initiaux
  useEffect(() => {
    console.log("Setting initial events:", initialEvents.length);
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);
  
  // Pour savoir si on a atteint la fin
  const hasMoreEvents = events.length < totalEvents;
  
  // Référence pour savoir combien d'événements sont actuellement visibles
  const visibleEventsCount = Math.min(page * EVENTS_PER_PAGE, events.length);

  // Chargement de plus d'événements
  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMoreEvents) return;
    
    setLoading(true);
    console.log("Loading more events from offset:", events.length);
    
    try {
      const response = await eventsAPI.getEvents({
        ...searchParams,
        status: 'validated',
        limit: EVENTS_PER_PAGE,
        offset: events.length
      });
      
      console.log("API response:", response.data.results?.length || 0, "events");
      
      if (response.data.results?.length) {
        setEvents(prevEvents => [...prevEvents, ...response.data.results]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de plus d\'événements:', error);
    } finally {
      setLoading(false);
    }
  }, [events.length, hasMoreEvents, loading, searchParams]);

  // Réduire le nombre d'événements affichés
  const showLessEvents = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      // Défilement automatique vers le haut de la section
      window.scrollTo({
        top: document.getElementById('events-section')?.offsetTop || 0,
        behavior: 'smooth'
      });
    }
  };

  // Défilement vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Surveillance du défilement pour afficher/masquer le bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Charger la préférence de vue au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('eventViewPreference') as 'grid' | 'list' | 'calendar' | null;
      if (savedView) {
        setViewMode(savedView);
      }
    }
  }, []);

  // Afficher tous les événements ou seulement ceux de la page actuelle
  const displayedEvents = events.slice(0, page * EVENTS_PER_PAGE);
  
  // Debug display
  console.log("DisplayedEvents:", displayedEvents.length);
  console.log("ViewMode:", viewMode);

  return (
    <div id="events-section">
      {/* Sélecteur de vue */}
      <div className="flex justify-end mb-4">
        <ViewSelector
          currentView={viewMode}
          onChange={(view) => {
            setViewMode(view);
            if (typeof window !== 'undefined') {
              localStorage.setItem('eventViewPreference', view);
            }
          }}
        />
      </div>
      
      {/* Affichage du nombre d'événements pour le débug */}
      {events.length === 0 && (
        <div className="bg-yellow-50 p-4 mb-4 rounded-lg">
          <p className="text-yellow-700">
            Aucun événement à afficher. Veuillez vérifier les filtres ou réessayer.
          </p>
        </div>
      )}
      
      {/* Affichage des événements selon le mode sélectionné */}
      {viewMode === 'grid' && (
        <EventGrid events={displayedEvents} loading={loading} />
      )}
      
      {viewMode === 'list' && (
        <EventListView events={displayedEvents} loading={loading} />
      )}
      
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">
            La vue calendrier sera bientôt disponible !
          </p>
        </div>
      )}
      
      {/* Actions de défilement */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        {page > 1 && (
          <Button
            onClick={showLessEvents}
            variant="outline"
            className="w-48 flex items-center justify-center"
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            Voir moins
          </Button>
        )}
        
        {hasMoreEvents && (
          <Button
            onClick={loadMoreEvents}
            disabled={loading}
            className="w-48 flex items-center justify-center bg-primary"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </span>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Voir plus
              </>
            )}
          </Button>
        )}
        
        {/* Compteur d'événements */}
        <p className="text-gray-600 text-sm">
          Affichage de {visibleEventsCount} sur {totalEvents} événements
        </p>
      </div>
      
      {/* Bouton retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary-dark transition-all duration-300 z-50"
          aria-label="Retour en haut"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}