// Testimonials Section mis à jour
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Client Satisfait 1",
      role: "Organisateur d'événements",
      image: "/images/testimonial-1.jpg",
      text: "Cette plateforme a complètement transformé notre façon d'organiser des événements. L'interface est intuitive et les outils sont puissants. Un vrai gain de temps et d'efficacité!"
    },
    {
      id: 2,
      name: "Client Satisfait 2",
      role: "Organisateur d'événements",
      image: "/images/testimonial-2.jpg",
      text: "Organiser un festival n'a jamais été aussi simple. La billetterie est fiable et les rapports nous permettent de suivre les ventes en temps réel. Je recommande vivement!"
    },
    {
      id: 3,
      name: "Client Satisfait 3",
      role: "Organisateur d'événements",
      image: "/images/testimonial-3.jpg",
      text: "Les outils d'analyse nous ont permis d'optimiser nos événements et d'augmenter notre rentabilité. Le support client est également très réactif."
    },
    {
      id: 4,
      name: "Client Satisfait 4",
      role: "Organisateur d'événements",
      image: "/images/testimonial-4.jpg",
      text: "La capacité de personnaliser les formulaires d'inscription a vraiment fait la différence pour nos événements spécialisés. Très satisfait des fonctionnalités offertes."
    },
    {
      id: 5,
      name: "Client Satisfait 5",
      role: "Organisateur d'événements",
      image: "/images/testimonial-5.jpg",
      text: "Interface fluide, excellente expérience utilisateur et un système qui simplifie vraiment la vie des organisateurs et des participants. Bravo!"
    }
  ];

  // Déterminer combien de témoignages afficher par slide selon la largeur de l'écran
  const getSlidesPerView = (width) => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Auto-play slides
    const interval = setInterval(() => {
      const slidesPerView = getSlidesPerView(window.innerWidth);
      const maxSlide = Math.ceil(testimonials.length / slidesPerView) - 1;
      setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [testimonials.length]);
  
  const slidesPerView = getSlidesPerView(windowWidth);
  const maxSlide = Math.ceil(testimonials.length / slidesPerView) - 1;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Témoignages</span>
          <h2 className="text-4xl font-bold mt-2 text-white">Ils nous font confiance</h2>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100 / slidesPerView}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="px-3"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                        <Image 
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-white/70 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/90 italic">"{testimonial.text}"</p>
                    
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-yellow-400 fill-current" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}