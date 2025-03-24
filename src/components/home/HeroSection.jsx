'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection({ backgrounds = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Variantes pour l'animation des slides
  const slideVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  // Animation en cascade pour le contenu textuel
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {/* Overlay pour intensifier le contraste */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image 
            src={backgrounds[currentSlide]}
            alt="Événements au Cameroun"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={textVariants}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-lg"
          >
            Vivez l'expérience <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">événementielle</span>
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="text-xl md:text-2xl mb-10 text-white drop-shadow-md"
          >
            Découvrez une plateforme unique pour vivre et organiser des événements inoubliables.
          </motion.p>
          <motion.div
            variants={textVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button 
              href="/events" 
              variant="default" 
              size="xl"
              className="rounded-full px-10 py-5 text-lg font-medium shadow-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 transition transform hover:scale-105"
            >
              Explorer
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              href="/register-organizer" 
              variant="outline" 
              size="xl"
              className="rounded-full px-10 py-5 text-lg font-medium bg-transparent text-white border-white hover:bg-white/20 transition transform hover:scale-105 shadow-2xl"
            >
              Organiser
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicateurs de slide animés */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
        <div className="flex space-x-4">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition transform ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
