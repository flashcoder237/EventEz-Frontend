'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import EventGrid from './EventGrid';
import EventListView from './EventListView';
import ViewSelector from './ViewSelector';
import { Button } from '../ui/Button';
import { eventsAPI } from '@/lib/api';
import { ChevronUp, ChevronDown, ArrowUp } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

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
  // Nombre d'événements par vague de chargement
  const EVENTS_PER_WAVE = 5;
  
  const [allLoadedEvents, setAllLoadedEvents] = useState<Event[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWave, setCurrentWave] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  
  // Pour savoir si on a atteint la fin
  const hasMoreLoadedEvents = visibleEvents.length < allLoadedEvents.length;
  const hasMoreServerEvents = allLoadedEvents.length < totalEvents;

  // Réinitialiser les événements quand les filtres changent (searchParams)
  useEffect(() => {
    // Réinitialiser l'état
    setAllLoadedEvents(initialEvents || []);
    setVisibleEvents(initialEvents.slice(0, EVENTS_PER_WAVE) || []);
    setCurrentWave(1);
    
    // Scroll vers le haut quand les filtres changent
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialEvents, searchParams]);
  
  // Charger plus d'événements depuis le serveur
  const loadMoreFromServer = useCallback(async () => {
    if (loading || !hasMoreServerEvents) return;
    
    setLoading(true);
    
    try {
      const response = await eventsAPI.getEvents({
        ...searchParams,
        status: 'validated',
        limit: EVENTS_PER_WAVE,
        offset: allLoadedEvents.length
      });
      
      if (response.data.results?.length) {
        const newEvents = response.data.results;
        setAllLoadedEvents(prev => [...prev, ...newEvents]);
        
        // Si tous les événements visibles sont déjà affichés, ajouter les nouveaux à l'affichage
        if (!hasMoreLoadedEvents) {
          setVisibleEvents(prev => [...prev, ...newEvents]);
          setCurrentWave(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de plus d\'événements:', error);
    } finally {
      setLoading(false);
    }
  }, [allLoadedEvents.length, hasMoreLoadedEvents, hasMoreServerEvents, loading, searchParams]);

  // Afficher plus d'événements déjà chargés
  const showMoreEvents = () => {
    if (hasMoreLoadedEvents) {
      const nextWave = currentWave + 1;
      setVisibleEvents(allLoadedEvents.slice(0, nextWave * EVENTS_PER_WAVE));
      setCurrentWave(nextWave);
    } else if (hasMoreServerEvents) {
      // Si tous les événements chargés sont déjà visibles, charger depuis le serveur
      loadMoreFromServer();
    }
  };

  // Réduire le nombre d'événements affichés
  const showLessEvents = () => {
    if (currentWave > 1) {
      const prevWave = currentWave - 1;
      setVisibleEvents(allLoadedEvents.slice(0, prevWave * EVENTS_PER_WAVE));
      setCurrentWave(prevWave);
      
      // Défilement automatique vers le haut de la section
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
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
      
      {/* Affichage si aucun événement n'est trouvé */}
      {totalEvents === 0 && !loading && (
        <div className="bg-yellow-50 p-4 mb-4 rounded-lg">
          <p className="text-yellow-700">
            Aucun événement ne correspond à vos critères de recherche. Veuillez modifier vos filtres ou réessayer.
          </p>
        </div>
      )}
      
      {/* Affichage des événements selon le mode sélectionné */}
      {totalEvents > 0 && viewMode === 'grid' && (
        <EventGrid events={visibleEvents} loading={loading && visibleEvents.length === 0} />
      )}
      
      {totalEvents > 0 && viewMode === 'list' && (
        <EventListView events={visibleEvents} loading={loading && visibleEvents.length === 0} />
      )}
      
      {totalEvents > 0 && viewMode === 'calendar' && (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">
            La vue calendrier sera bientôt disponible !
          </p>
        </div>
      )}
      
      {/* Actions de défilement - ne les afficher que s'il y a des événements */}
      {totalEvents > 0 && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          {currentWave > 1 && (
            <Button
              onClick={showLessEvents}
              variant="outline"
              className="w-48 flex items-center justify-center"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Voir moins
            </Button>
          )}
          
          {(hasMoreLoadedEvents || hasMoreServerEvents) && (
            <Button
              onClick={showMoreEvents}
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
            Affichage de {visibleEvents.length} sur {totalEvents} événements
          </p>
        </div>
      )}
      
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