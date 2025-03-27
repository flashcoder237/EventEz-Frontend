'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, Info } from 'lucide-react';
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
        const response = await eventsAPI.getEvents({ 
          category: currentEvent.category.id,
          status: 'validated',
          limit: 3
        });
        
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

  // Loading State
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6"
      >
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
          Événements similaires
        </h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-16 w-16 rounded-md"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // No Similar Events
  if (similarEvents.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6"
      >
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
          Événements similaires
        </h3>
        <div className="text-center py-6">
          <Info className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            Aucun événement similaire trouvé.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              href={`/events?category=${currentEvent.category.id}`}
              variant="outline"
              size="sm"
              className="inline-flex items-center"
            >
              Explorer {currentEvent.category.name}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Similar Events List
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6"
    >
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
        Événements similaires
      </h3>
      <div className="space-y-4">
        <AnimatePresence>
          {similarEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Link 
                href={`/events/${event.id}`}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                  {event.banner_image ? (
                    <Image
                      src={event.banner_image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(event.start_date, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {event.location_city}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="pt-2 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              href={`/events?category=${currentEvent.category.id}`}
              variant="outline"
              size="sm"
              className="w-full inline-flex items-center justify-center"
            >
              Voir plus d'événements
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}