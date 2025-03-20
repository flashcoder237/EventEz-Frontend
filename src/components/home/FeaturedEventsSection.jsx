// components/home/FeaturedEventsSection.jsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Calendar, MapPin, Users, Heart } from 'lucide-react';

export default function FeaturedEventsSection({ events = [] }) {
  // Fonction locale pour formater la date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const slideCount = Math.ceil(events.length / 3);
  
  const handleNextSlide = () => {
    if (currentSlide < slideCount - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setCurrentSlide(0);
    }
  };
  
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      setCurrentSlide(slideCount - 1);
    }
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Sélection spéciale</span>
            <h2 className="text-3xl font-bold mt-2">Événements en vedette</h2>
          </div>
          
          <Link href="/events?featured=true" className="text-primary font-medium mt-4 md:mt-0 group flex items-center">
            Voir tous les événements en vedette
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="relative">
          <div 
            ref={containerRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: slideCount }).map((_, slideIndex) => (
                <div key={slideIndex} className="min-w-full flex flex-col md:flex-row gap-6">
                  {events.slice(slideIndex * 3, (slideIndex + 1) * 3).map((event, index) => (
                    <Link 
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block flex-1 group"
                    >
                      <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl">
                        <div className="relative">
                          {/* Badge de date */}
                          <div className="absolute bottom-0 left-0 z-20 m-4">
                            <div className="bg-primary shadow-lg rounded-lg overflow-hidden">
                              <div className="bg-primary-dark px-3 py-1 text-xs text-white font-bold text-center uppercase">
                                {new Date(event.start_date).toLocaleDateString('fr-FR', {month: 'short'})}
                              </div>
                              <div className="px-3 py-2 text-white text-center font-bold">
                                {new Date(event.start_date).getDate()}
                              </div>
                            </div>
                          </div>
                          
                          {/* Image avec overlay */}
                          <div className="aspect-video relative">
                            <Image 
                              src={event.banner_image || "/images/placeholder-image.png"}
                              // src={event.banner_image || `/images/event-featured-${((slideIndex * 3 + index) % 3) + 1}.jpg`}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-x-105 w-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                          </div>
                          
                          {/* Badge d'intérêt */}
                          <div className="absolute top-3 right-3">
                            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                              <Heart className="h-3 w-3 text-primary" fill="currentColor" />
                              <span>{(Math.floor(Math.random() * 50) + 10)}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span className="text-sm truncate">{event.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-300">
                              <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span className="text-sm">{Math.floor(Math.random() * 100) + 20} participants</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
                            {event.short_description || "Un événement à ne pas manquer ! Rejoignez-nous pour une expérience inoubliable."}
                          </p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                            <span className="text-primary font-bold">
                              {event.price ? `${event.price} XAF` : 'Gratuit'}
                            </span>
                            
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/20 text-primary">
                              {event.category?.name || 'Événement'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={handlePrevSlide}
            className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-white text-gray-900 hover:text-primary rounded-full p-3 shadow-lg transition-all transform hover:scale-105"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleNextSlide}
            className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-white text-gray-900 hover:text-primary rounded-full p-3 shadow-lg transition-all transform hover:scale-105"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}