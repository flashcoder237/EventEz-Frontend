'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils/dateUtils';
import { Calendar, MapPin, Users, Clock, ChevronRight, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';

interface EventListViewProps {
  events: Event[];
  loading?: boolean;
}

export default function EventListView({ events, loading = false }: EventListViewProps) {
  if (loading && events.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-4">
            <div className="flex">
              <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <div className="space-y-4 px-4 md:px-8 lg:px-16">
      <AnimatePresence initial={false}>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: Math.min(0.05 * (index % 10), 0.5),
              ease: [0.25, 0.1, 0.25, 1.0] 
            }}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
          >
            <Link href={`/events/${event.id}`} className="flex flex-col sm:flex-row">
              {/* Image de l'événement */}
              <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                {event.banner_image ? (
                  <Image
                    src={event.banner_image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                    <Calendar className="h-10 w-10 text-primary/50" />
                  </div>
                )}
                
                {/* Badge du type d'événement */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={event.event_type === 'billetterie' ? "info" : "success"}
                    className="text-xs font-medium px-2 py-0.5"
                  >
                    {event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
                  </Badge>
                </div>
              </div>
              
              {/* Informations de l'événement */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {event.short_description || event.description}
                      </p>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1 text-primary/70" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 text-primary/70" />
                      <span className="truncate">{event.location_city}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1 text-primary/70" />
                      <span>{new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1 text-primary/70" />
                      <span>{event.registration_count} inscrit{event.registration_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-xs text-gray-500">{event.category.name}</span>
                  </div>
                  
                  {event.event_type === 'billetterie' && event.ticket_price_range && (
                    <div className="text-sm font-semibold text-primary">
                      {event.ticket_price_range}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Indicateur de chargement amélioré - bien visible */}
      {loading && (
        <div className="py-4 flex justify-center">
          <LoadingSpinner size="md" text="Chargement des événements..." />
        </div>
      )}
    </div>
  );
}