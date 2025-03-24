'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ChevronRight, Users, Calendar, CreditCard, Globe, Database, Shield } from 'lucide-react';

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  const teamMembers = [
    {
      name: "Jean Kpoumie",
      role: "Fondateur & CEO",
      image: "/images/team-1.jpg",
      bio: "Entrepreneur en série avec une passion pour la technologie et les événements."
    },
    {
      name: "Marie Atangana",
      role: "Directrice Marketing",
      image: "/images/team-2.jpg",
      bio: "Spécialiste en marketing digital avec plus de 8 ans d'expérience."
    },
    {
      name: "Paul Tchoufa",
      role: "Directeur Technique",
      image: "/images/team-3.jpg",
      bio: "Ingénieur logiciel passionné par la création de solutions innovantes."
    },
    {
      name: "Sophie Nkoulou",
      role: "Responsable des Opérations",
      image: "/images/team-4.jpg",
      bio: "Experte en gestion d'événements et en expérience client."
    }
  ];
  
  const faqs = [
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

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-violet-600 to-violet-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Notre mission: Révolutionner l'organisation d'événements au Cameroun
            </h1>
            <p className="text-xl md:text-2xl text-violet-100 mb-8 leading-relaxed">
              Nous créons des outils adaptés aux réalités locales pour faciliter la gestion d'événements
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button href="/register-organizer" className="bg-white text-violet-700 hover:bg-gray-100">
                Devenir organisateur
              </Button>
              <Button href="/contact" variant="outline" className="border-white text-white hover:bg-white/10">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Notre histoire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/about-story.jpg" 
                  alt="L'équipe EventEz" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
                Notre Histoire
              </div>
              <h2 className="text-3xl font-bold text-gray-900">De l'idée à la plateforme leader</h2>
              <p className="text-gray-700 leading-relaxed">
                EventEz est né d'un constat simple : l'organisation d'événements au Cameroun et en Afrique en général présente des défis uniques qui nécessitent des solutions adaptées. Lancée en 2023, notre plateforme a été conçue par une équipe d'entrepreneurs camerounais passionnés par la technologie et les événements.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Face aux difficultés de gestion des inscriptions, des paiements et de la communication lors d'événements locaux, nous avons développé une solution qui prend en compte les réalités du marché africain : connexion internet parfois instable, prévalence des paiements mobiles, et besoin de flexibilité.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aujourd'hui, EventEz s'est imposé comme le leader de la gestion d'événements au Cameroun, avec plus de 10,000 événements organisés et 500,000+ participants. Notre mission reste la même : simplifier l'organisation d'événements pour permettre aux créateurs de se concentrer sur ce qui compte vraiment - créer des expériences mémorables.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nos valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs fondamentales</h2>
            <p className="text-gray-700 leading-relaxed">
              Chez EventEz, nos valeurs guident chacune de nos décisions et façonnent notre approche du service client.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation locale</h3>
              <p className="text-gray-700">
                Nous développons des solutions technologiques adaptées aux réalités africaines, en prenant en compte les infrastructures locales et les habitudes des utilisateurs.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Confiance et transparence</h3>
              <p className="text-gray-700">
                Nous bâtissons des relations de confiance avec nos utilisateurs grâce à une tarification transparente et une communication ouverte sur notre fonctionnement.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibilité</h3>
              <p className="text-gray-700">
                Nous nous efforçons de rendre la technologie événementielle accessible à tous, des grands organisateurs aux plus petites associations, avec des outils simples et puissants.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Notre équipe */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <p className="text-gray-700 leading-relaxed">
              Découvrez les visionnaires qui transforment le secteur événementiel au Cameroun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm">{member.bio}</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-violet-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-gradient-to-r from-violet-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir EventEz</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre plateforme offre des avantages uniques pour la gestion d'événements en Afrique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion d'événements simplifiée</h3>
                <p className="text-gray-700">
                  Notre interface intuitive vous permet de configurer votre événement en quelques minutes, avec des outils de personnalisation avancés pour répondre à tous vos besoins.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Paiements Mobile Money intégrés</h3>
                <p className="text-gray-700">
                  Acceptez facilement les paiements via MTN Mobile Money et Orange Money, les méthodes de paiement les plus utilisées au Cameroun et dans la région.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analytiques détaillées</h3>
                <p className="text-gray-700">
                  Accédez à des statistiques en temps réel sur vos ventes, vos inscriptions et l'engagement des participants pour optimiser vos futures stratégies.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurité et fiabilité</h3>
                <p className="text-gray-700">
                  Nous avons mis en place des mesures de sécurité avancées pour protéger vos données et garantir une expérience sans faille pour vous et vos participants.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button href="/register-organizer" className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0">
              Commencer gratuitement
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-gray-700 leading-relaxed">
              Tout ce que vous devez savoir sur EventEz et notre plateforme.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`px-6 py-4 bg-gray-50 transition-all duration-300 ${
                    expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible overflow-hidden'
                  }`}
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Vous avez d'autres questions?</p>
            <Button href="/contact" variant="outline">
              Contactez-nous
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à découvrir EventEz?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers d'organisateurs qui font confiance à EventEz pour leurs événements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              href="/register" 
              variant="default" 
              className="bg-white text-violet-700 hover:bg-gray-100"
            >
              Créer un compte
            </Button>
            <Button 
              href="/events" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Explorer les événements
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}