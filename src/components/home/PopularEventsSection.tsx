  'use client';

  import React, { useState } from 'react';
  import Link from 'next/link';
  import Image from 'next/image';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
    MapPin, 
    Calendar, 
    Users,
    ChevronDown,
    ChevronUp
  } from 'lucide-react';
  import { Button } from '@/components/ui/Button';
  import { EventList } from '@/types/events';
  import DynamicEventBanner from '@/components/events/DynamicEventBanner';

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  interface PopularEventsSectionProps {
    events: EventList[];
  }

  const PopularEventsSection: React.FC<PopularEventsSectionProps> = ({ events }) => {
    const [visibleEvents, setVisibleEvents] = useState(6);

    const handleLoadMore = () => {
      setVisibleEvents(prev => 
        prev + 6 > events.length ? events.length : prev + 6
      );
    };

    const handleShowLess = () => {
      setVisibleEvents(6);
    };

    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Événements tendances
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Découvrez les événements les plus populaires et attendus du moment.
            </p>
          </div>
          
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, visibleEvents).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    href={`/events/${event.id}`}
                    className="group"
                  >
                    <motion.div 
                      whileHover={{ 
                        scale: 1.03, 
                        transition: { duration: 0.2 } 
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3]">
                        {event.banner_image ? (
                          // If there's a banner image, display it
                          <Image 
                            src={event.banner_image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          // If no banner image, create a dynamic artistic banner
                          <div className="absolute inset-0 overflow-hidden">
                            <DynamicEventBanner 
                              title={event.title} 
                              category={event.category?.name} 
                              eventType={event.event_type} 
                              onInteract={() => {
                                // Handle event interaction
                                console.log('Event interaction triggered');
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 z-20">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            {event.category?.name || 'Événement'}
                          </span>
                        </div>
                        
                        {event.is_featured && (
                          <div className="absolute top-3 right-3 z-20">
                            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              En vedette
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 z-20">
                          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                            <Calendar className="h-4 w-4 text-violet-600" />
                            {formatDate(event.start_date)}
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Découvrir
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center text-gray-500 mb-3">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-violet-600" />
                          <span className="text-sm truncate">{event.location_city}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                          {event.short_description || 'Aucune description disponible'}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="font-bold text-violet-600 text-lg">
                            {event.ticket_price_range || 'Gratuit'}
                          </span>
                          
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Users className="h-4 w-4" />
                            <span>{event.registration_count} inscriptions</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <div className="text-center mt-8 md:mt-12">
            {visibleEvents < events.length ? (
              <Button 
                onClick={handleLoadMore}
                variant="outline"
                className="rounded-full px-6 md:px-8 py-2 md:py-3 border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors mr-4"
              >
                Voir plus d'événements
                <ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            ) : events.length > 6 && (
              <Button 
                onClick={handleShowLess}
                variant="outline"
                className="rounded-full px-6 md:px-8 py-2 md:py-3 border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors"
              >
                Voir moins d'événements
                <ChevronUp className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  };

  export default PopularEventsSection;