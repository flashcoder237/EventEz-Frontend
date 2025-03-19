// HeroSection.jsx mis à jour avec la nouvelle palette de couleurs
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection({ backgrounds = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {backgrounds.map((bg, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <Image 
            src={bg}
            alt="Événements au Cameroun"
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Découvrez des <span className="text-gradient">événements</span> exceptionnels
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-delayed text-white">
            La première plateforme de gestion d'événements au Cameroun adaptée à tous vos besoins
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-delayed-more">
            <Button 
              href="/events" 
              variant="default" 
              size="xl"
              className="rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0"
            >
              Explorer les événements
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              href="/register-organizer" 
              variant="outline" 
              size="xl"
              className="rounded-full px-8 py-6 text-lg font-medium bg-transparent text-white border-white hover:bg-white/20 transition-all shadow-lg"
            >
              Devenir organisateur
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <div className="flex space-x-2">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
