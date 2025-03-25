'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';

// Composants sections
import HeroSection from '@/components/about/HeroSection';
import StatsSection from '@/components/about/StatsSection';
import TabsSection from '@/components/about/TabsSection';
import TeamSection from '@/components/about/TeamSection';
import AdvantagesSection from '@/components/about/AdvantagesSection';
import TestimonialsSection from '@/components/about/TestimonialsSection';
import FaqSection from '@/components/about/FaqSection';
import CtaSection from '@/components/about/CtaSection';

// Types
import { TeamMember, FaqItem, Achievement, Advantage } from '@/types/about';

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('histoire');
  const [isScrolled, setIsScrolled] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState<Record<string, boolean>>({});
  
  // Refs pour observer les sections
  const sectionsRef = {
    stats: useRef(null),
    histoire: useRef(null),
    team: useRef(null),
    advantages: useRef(null),
    testimonials: useRef(null),
    faq: useRef(null),
    cta: useRef(null)
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Configuration de l'Intersection Observer pour les animations
    const observerOptions = {
      threshold: 0.1,
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
    
    // Observer toutes les sections pour les animations
    Object.values(sectionsRef).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      Object.values(sectionsRef).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);
  
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  // Données
  const teamMembers: TeamMember[] = [
    {
      name: "Jean Kpoumie",
      role: "Fondateur & CEO",
      image: "/images/team-1.jpg",
      bio: "Entrepreneur en série avec une passion pour la technologie et les événements.",
      socialLinks: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Marie Atangana",
      role: "Directrice Marketing",
      image: "/images/team-2.jpg",
      bio: "Spécialiste en marketing digital avec plus de 8 ans d'expérience.",
      socialLinks: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Paul Tchoufa",
      role: "Directeur Technique",
      image: "/images/team-3.jpg",
      bio: "Ingénieur logiciel passionné par la création de solutions innovantes.",
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Sophie Nkoulou",
      role: "Responsable des Opérations",
      image: "/images/team-4.jpg",
      bio: "Experte en gestion d'événements et en expérience client.",
      socialLinks: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];
  
  const faqs: FaqItem[] = [
    {
      question: "Qu'est-ce qu'EventEz?",
      answer: "EventEz est une plateforme complète de gestion d'événements au Cameroun. Nous permettons aux organisateurs de créer, gérer et promouvoir leurs événements, tout en offrant aux participants une expérience fluide pour découvrir et s'inscrire à des événements."
    },
    {
      question: "Comment fonctionne la billetterie sur EventEz?",
      answer: "Notre système de billetterie permet aux organisateurs de créer différents types de billets (standard, VIP, early bird, etc.), de définir des quotas et des périodes de vente, et d'accepter les paiements via MTN Mobile Money, Orange Money et d'autres méthodes de paiement locales. Les participants reçoivent leurs billets par email et peuvent les présenter à l'entrée de l'événement via QR code."
    },
    {
      question: "Quels types d'événements peut-on organiser sur EventEz?",
      answer: "EventEz s'adapte à tous types d'événements : concerts, conférences, séminaires, ateliers, expositions, événements sportifs, mariages, et bien plus encore. Notre plateforme est suffisamment flexible pour répondre aux besoins de divers formats d'événements."
    },
    {
      question: "Comment EventEz se rémunère-t-il?",
      answer: "Nous appliquons un modèle de tarification transparent basé sur une commission sur les ventes de billets (pour les événements payants) ou sur un forfait d'utilisation pour les événements gratuits. Consultez notre page de tarification pour plus de détails."
    },
    {
      question: "Puis-je personnaliser mes formulaires d'inscription?",
      answer: "Absolument! EventEz permet aux organisateurs de créer des formulaires d'inscription entièrement personnalisés avec différents types de champs (texte, sélection, date, etc.), des champs obligatoires ou optionnels, et même des logiques conditionnelles pour adapter l'expérience des participants."
    },
    {
      question: "EventEz fonctionne-t-il uniquement au Cameroun?",
      answer: "Bien que notre focus principal soit le Cameroun, notre plateforme est accessible et utilisable partout en Afrique. Nous comprenons les réalités locales et proposons des méthodes de paiement adaptées à chaque région."
    }
  ];

  const achievements: Achievement[] = [
    { number: '10,000+', text: 'Événements organisés' },
    { number: '500,000+', text: 'Participants' },
    { number: '250+', text: 'Partenaires' },
    { number: '98%', text: 'Satisfaction client' }
  ];

  const advantages: Advantage[] = [
    {
      icon: 'Calendar',
      title: "Gestion d'événements simplifiée",
      description: "Notre interface intuitive vous permet de configurer votre événement en quelques minutes, avec des outils de personnalisation avancés.",
      stats: [
        { value: "92%", label: "Gain de temps" },
        { value: "87%", label: "Facilité d'utilisation" }
      ]
    },
    {
      icon: 'CreditCard',
      title: "Paiements Mobile Money intégrés",
      description: "Acceptez facilement les paiements via MTN Mobile Money et Orange Money, les méthodes de paiement les plus utilisées dans la région.",
      stats: [
        { value: "99%", label: "Taux de succès" },
        { value: "30s", label: "Temps de traitement" }
      ]
    },
    {
      icon: 'BarChart2',
      title: "Analytiques détaillées",
      description: "Accédez à des statistiques en temps réel sur vos ventes, vos inscriptions et l'engagement des participants.",
      stats: [
        { value: "15+", label: "Métriques clés" },
        { value: "100%", label: "Données exploitables" }
      ]
    },
    {
      icon: 'Shield',
      title: "Sécurité et fiabilité",
      description: "Nous avons mis en place des mesures de sécurité avancées pour protéger vos données et garantir une expérience sans faille.",
      stats: [
        { value: "99.9%", label: "Temps de fonctionnement" },
        { value: "SSL", label: "Cryptage avancé" }
      ]
    }
  ];

  const testimonials = [
    {
      quote: "EventEz a révolutionné la façon dont nous organisons nos conférences tech. La billetterie mobile money nous a permis d'atteindre un public beaucoup plus large.",
      name: "David Mbarga",
      role: "Fondateur, TechHub Cameroun",
      image: "/images/testimonial-1.jpg"
    },
    {
      quote: "Le mode hors ligne d'EventEz a sauvé notre festival ! Malgré des problèmes de connexion sur le site, nous avons pu scanner les billets sans aucun souci.",
      name: "Élise Nguema",
      role: "Directrice, Festival Douala Art",
      image: "/images/testimonial-2.jpg"
    },
    {
      quote: "L'équipe de support d'EventEz est exceptionnelle. Ils comprennent vraiment les défis spécifiques à l'organisation d'événements en Afrique.",
      name: "François Kamga",
      role: "Organisateur, Business Summit",
      image: "/images/testimonial-3.jpg"
    }
  ];

  return (
    <MainLayout>
      <HeroSection />
      
      <div id="stats-section" ref={sectionsRef.stats}>
        <StatsSection 
          achievements={achievements} 
          animationTriggered={animationTriggered["stats-section"]}
        />
      </div>
      
      <div id="notre-histoire" ref={sectionsRef.histoire}>
        <TabsSection 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          animationTriggered={animationTriggered["notre-histoire"]}
        />
      </div>
      
      <div id="team-section" ref={sectionsRef.team}>
        <TeamSection 
          teamMembers={teamMembers} 
          animationTriggered={animationTriggered["team-section"]}
        />
      </div>
      
      <div id="advantages-section" ref={sectionsRef.advantages}>
        <AdvantagesSection 
          advantages={advantages} 
          animationTriggered={animationTriggered["advantages-section"]}
        />
      </div>
      
      <div id="testimonials-section" ref={sectionsRef.testimonials}>
        <TestimonialsSection 
          testimonials={testimonials} 
          animationTriggered={animationTriggered["testimonials-section"]}
        />
      </div>
      
      <div id="faq-section" ref={sectionsRef.faq}>
        <FaqSection 
          faqs={faqs} 
          expandedFaq={expandedFaq} 
          toggleFaq={toggleFaq}
          animationTriggered={animationTriggered["faq-section"]}
        />
      </div>
      
      <div id="cta-section" ref={sectionsRef.cta}>
        <CtaSection 
          animationTriggered={animationTriggered["cta-section"]}
        />
      </div>
    </MainLayout>
  );
}