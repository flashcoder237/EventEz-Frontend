'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Calendar, 
  Users,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicEventBanner from '@/components/events/DynamicEventBanner';


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

function FeaturedEventsSection({ events }) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Si moins de 3 événements, on les affiche tous
  const displayEvents = events.length > 3 ? events.slice(0, 3) : events;

  const handleNextEvent = () => {
    setActiveEventIndex((prev) => 
      prev === displayEvents.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevEvent = () => {
    setActiveEventIndex((prev) => 
      prev === 0 ? displayEvents.length - 1 : prev - 1
    );
  };

  const activeEvent = displayEvents[activeEventIndex];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Événements à la une
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Découvrez les événements les plus passionnants et prometteurs du moment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Main Event Display - Desktop & Mobile */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {activeEvent.banner_image ? (
                  // If there's a banner image, display it
                  <Image 
                  src={activeEvent.banner_image || "/images/placeholder-image.png"}
                  alt={activeEvent.title}
                  width={800}
                  height={400}
                  className="w-full h-48 md:h-64 lg:h-80 object-cover"
                />
                ) : (
                  // If no banner image, create a dynamic artistic banner
                  <div>
                    <DynamicEventBanner 
              
                      title={activeEvent.title} 
                      category={activeEvent.category?.name} 
                      eventType={activeEvent.event_type} 
                      onInteract={() => {
                        // Handle event interaction
                        console.log('Event interaction triggered');
                      }}
                    />
                  </div>
                )}
              
                
                <div className="p-4 md:p-6 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-violet font-medium">
                      {activeEvent.category?.name || 'Événement'}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-violet" />
                      {formatDate(activeEvent.start_date)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {activeEvent.title}
                  </h3>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-violet" />
                      <span className="text-sm">{activeEvent.location_city}</span>
                    </div>
                    
                    <Link 
                      href={`/events/${activeEvent.id}`}
                      className="flex items-center text-violet hover:underline"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Mobile */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 md:hidden z-20">
              <button 
                onClick={handlePrevEvent}
                className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button 
                onClick={handleNextEvent}
                className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Event List - Desktop Only */}
          <div className="hidden md:block space-y-4">
            {displayEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                onClick={() => setActiveEventIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  cursor-pointer rounded-xl p-4 transition-all duration-300
                  ${activeEventIndex === index 
                    ? 'bg-violet/10 border border-violet/20' 
                    : 'bg-white hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center">
                  <Image 
                    src={event.banner_image || "/images/placeholder-image.png"}
                    alt={event.title}
                    width={60}
                    height={48}
                    className="w-20 h-16 object-cover rounded-lg mr-4"
                  />
                  
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                      {event.title}
                    </h4>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-violet" />
                        {event.location_city}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-violet" />
                        {formatDate(event.start_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="text-center mt-6">
              <Link 
                href="/events?featured=true"
                className="text-violet hover:underline flex items-center justify-center"
              >
                Voir tous les événements
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Mobile Event List - Carousel Dots */}
          <div className="md:hidden flex justify-center mt-4 space-x-2">
            {displayEvents.map((_, index) => (
              <div 
                key={index}
                className={`
                  h-2 w-2 rounded-full transition-all duration-300
                  ${activeEventIndex === index 
                    ? 'bg-violet w-6' 
                    : 'bg-gray-300'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedEventsSection;