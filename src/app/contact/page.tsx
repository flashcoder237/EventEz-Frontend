// ContactPage.jsx (Composant principal)
'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/contact/HeroSection';
import ContactCards from '@/components/contact/ContactCards';
import ContactFormSection from '@/components/contact/ContactFormSection';
import FaqSection from '@/components/contact/FaqSection';
import CtaSection from '@/components/contact/CtaSection';

export default function ContactPage() {
  const [animationTriggered, setAnimationTriggered] = useState({});

  useEffect(() => {
    // Configuration de l'Intersection Observer pour les animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimationTriggered(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observer les sections pour les animations
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <ContactCards animationTriggered={animationTriggered} />
      <ContactFormSection animationTriggered={animationTriggered} />
      <FaqSection animationTriggered={animationTriggered} />
      <CtaSection />
    </MainLayout>
  );
}