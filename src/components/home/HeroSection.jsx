'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Calendar, MapPin, Search, ChevronDown } from 'lucide-react';

export default function HomeHeroSection({ featuredEvents = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Simulating background images if none provided
  const backgrounds = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg',
    '/images/hero-bg-3.jpg',
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate slides
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % backgrounds.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Amélioré: animation de fondu enchaîné plus fluide
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1.0] // Courbe d'accélération élégante
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    }
  };

  // Featured event to display (if any)
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null;

  return (
    <section className="relative min-h-[650px] md:min-h-[700px] h-[85vh] overflow-hidden bg-gradient-to-r from-violet-900/90 via-indigo-800/80 to-purple-900/90">
      {/* Animated Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-indigo-800/80 to-purple-900/90 z-10"></div>
          
          {/* Pattern Overlay */}
          <motion.div 
            className="absolute inset-0 z-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0px 0px', '100px 100px'],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 20, 
              ease: "linear" 
            }}
            style={{
              backgroundImage: 'url("/images/pattern-dots.svg")',
              backgroundSize: '30px'
            }}
          />
          
          <Image 
            src={backgrounds[activeSlide]}
            alt="Événements backdrop"
            fill
            quality={90}
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Animated Shapes */}
      <motion.div 
        className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-purple-500/20 filter blur-[80px] z-0"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-[20%] w-80 h-80 rounded-full bg-blue-500/20 filter blur-[80px] z-0"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-1/3 left-[15%] w-72 h-72 rounded-full bg-fuchsia-500/20 filter blur-[90px] z-0"
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Main Content - Marges améliorées */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-[1400px] h-full flex flex-col justify-center relative z-20 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Left Content (Main Heading) - Titre réduit */}
          <motion.div
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 shadow-lg"
            >
              Bienvenue sur EventEz
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
            >
              <span className="block">Organisez des</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-pink-300 to-fuchsia-300">
                événements inoubliables
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
            >
              Découvrez la plateforme qui révolutionne l'organisation d'événements au Cameroun. Du concept à la réalisation.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-5"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  href="/register-organizer" 
                  className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
                >
                  Créer un événement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  href="/events" 
                  variant="outline" 
                  className="border-2 border-white/80 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium backdrop-blur-sm"
                >
                  Explorer les événements
                </Button>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              variants={itemVariants}
              className="hidden md:flex items-center gap-2 text-white/70 mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
            >
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
                <motion.div 
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ 
                    y: [0, 12, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <span>Faire défiler pour découvrir</span>
            </motion.div>
          </motion.div>

          {/* Right Content (Featured Event) */}
          <motion.div 
            className="lg:col-span-2 relative"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {featuredEvent ? (
              <motion.div
                variants={itemVariants}
                className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 overflow-hidden shadow-2xl"
              >
                {/* Gradient backgrounds */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">Événement à la une</div>
                  <h3 className="text-white text-xl font-bold mb-3">{featuredEvent.title}</h3>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <Image 
                      src={featuredEvent.banner_image || "/images/placeholder-event.jpg"} 
                      alt={featuredEvent.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover w-[120px] h-[80px]"
                    />
                    <div>
                      <div className="flex items-center text-white/80 text-sm mb-1">
                        <Calendar className="mr-2 h-4 w-4 text-violet-300" />
                        {new Date(featuredEvent.start_date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-violet-300" />
                        {featuredEvent.location_city}
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/events/${featuredEvent.id}`} 
                    className="inline-block w-full text-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Voir les détails
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 overflow-hidden shadow-2xl h-[300px]"
              >
                {/* Gradient backgrounds */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-3">Prochains événements</h3>
                    <p className="text-white/70 mb-6">Découvrez notre sélection d'événements à venir</p>
                    
                    <Link href="/events">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                      >
                        <Search className="mr-2 h-5 w-5" />
                        Découvrir les événements
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Stat Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 text-center"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-white text-3xl font-bold mb-1">10K+</div>
                <div className="text-violet-200 text-sm">Événements</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 text-center"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.2 }}>
                <div className="text-white text-3xl font-bold mb-1">500K+</div>
                <div className="text-violet-200 text-sm">Participants</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center">
        <div className="flex space-x-3">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-300 ${
                index === activeSlide
                  ? 'w-10 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Wave Decoration at Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path fill="white" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path fill="white" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path fill="white" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}