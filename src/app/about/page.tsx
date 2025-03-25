'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle, 
  ChevronRight, 
  Users, 
  Calendar, 
  CreditCard, 
  Globe, 
  Database, 
  Shield, 
  Plus, 
  Minus,
  ArrowRight,
  Heart,
  BarChart2
} from 'lucide-react';

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('histoire');
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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

  const achievements = [
    { number: '10,000+', text: 'Événements organisés' },
    { number: '500,000+', text: 'Participants' },
    { number: '250+', text: 'Partenaires' },
    { number: '98%', text: 'Satisfaction client' }
  ];

  return (
    <MainLayout>
      {/* Hero Section avec vidéo ou animation de fond */}
      <section className="relative overflow-hidden py-32 md:py-40">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 to-purple-900/90 z-10"></div>
        <div className="absolute inset-0">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/events-background.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20">
              À propos d'EventEz
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Nous réinventons <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">l'organisation d'événements</span> au Cameroun
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              Découvrez notre histoire, notre équipe et notre mission de créer des solutions événementielles adaptées aux réalités africaines.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/register-organizer" className="bg-white text-violet-900 hover:bg-gray-100 px-6 py-3 rounded-full text-lg">
                Rejoindre EventEz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button href="#notre-histoire" variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-full text-lg">
                Notre histoire
              </Button>
            </div>
          </div>
        </div>

        {/* Forme décorative */}
        <div className="absolute bottom-0 left-0 w-full h-20 z-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 90C840 100 960 110 1080 105C1200 100 1320 80 1380 70L1440 60V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>
      
      {/* Section Chiffres Clés */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-3xl md:text-4xl font-bold text-violet-600 mb-2">{item.number}</div>
                <div className="text-gray-600">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Notre histoire et valeurs - Avec onglets */}
      <section id="notre-histoire" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              Notre Entreprise
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Notre histoire et nos valeurs</h2>
          </div>
          
          {/* Navigation tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white">
              <button 
                onClick={() => setActiveTab('histoire')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'histoire' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Notre Histoire
              </button>
              <button 
                onClick={() => setActiveTab('valeurs')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'valeurs' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Nos Valeurs
              </button>
              <button 
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'mission' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Notre Mission
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="max-w-5xl mx-auto">
            {activeTab === 'histoire' && (
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-5/12">
                  <div className="relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <Image 
                      src="/images/about-story.jpg" 
                      alt="L'équipe EventEz" 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                      <p className="text-sm font-medium text-violet-800">Fondée en 2023</p>
                      <p className="text-xs text-gray-600">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-7/12 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">De l'idée à la plateforme leader</h3>
                  <p className="text-gray-700 leading-relaxed">
                    EventEz est né d'un constat simple : l'organisation d'événements au Cameroun et en Afrique en général présente des défis uniques qui nécessitent des solutions adaptées. Lancée en 2023, notre plateforme a été conçue par une équipe d'entrepreneurs camerounais passionnés par la technologie et les événements.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Face aux difficultés de gestion des inscriptions, des paiements et de la communication lors d'événements locaux, nous avons développé une solution qui prend en compte les réalités du marché africain : connexion internet parfois instable, prévalence des paiements mobiles, et besoin de flexibilité.
                  </p>
                  
                  <div className="pt-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Notre parcours</h4>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-violet-600 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Identification du problème</p>
                          <p className="text-sm text-gray-600">Analyse des défis uniques du marché événementiel africain</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-violet-600 text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Développement de la plateforme</p>
                          <p className="text-sm text-gray-600">Création d'une solution adaptée aux réalités locales</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-violet-600 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Croissance et expansion</p>
                          <p className="text-sm text-gray-600">Aujourd'hui, leader de la gestion d'événements au Cameroun</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'valeurs' && (
              <div>
                <div className="text-center mb-10">
                  <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Chez EventEz, nos valeurs fondamentales guident chacune de nos décisions et façonnent notre approche du service client.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                    <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-full flex items-center justify-center mb-6">
                      <Heart className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation locale</h3>
                    <p className="text-gray-700">
                      Nous développons des solutions technologiques adaptées aux réalités africaines, en prenant en compte les infrastructures locales et les habitudes des utilisateurs.
                    </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                    <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-full flex items-center justify-center mb-6">
                      <Shield className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Confiance et transparence</h3>
                    <p className="text-gray-700">
                      Nous bâtissons des relations de confiance avec nos utilisateurs grâce à une tarification transparente et une communication ouverte sur notre fonctionnement.
                    </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                    <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-full flex items-center justify-center mb-6">
                      <Globe className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibilité</h3>
                    <p className="text-gray-700">
                      Nous nous efforçons de rendre la technologie événementielle accessible à tous, des grands organisateurs aux plus petites associations, avec des outils simples et puissants.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'mission' && (
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Notre mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Nous avons pour mission de démocratiser l'accès aux technologies événementielles de pointe au Cameroun et dans toute l'Afrique, en offrant des solutions adaptées aux réalités locales.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nous croyons fermement que les événements sont des catalyseurs de changement social, économique et culturel. Notre ambition est de faciliter la création et la gestion de ces expériences transformatrices à travers notre technologie.
                  </p>
                  
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Nos objectifs d'impact</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Faciliter l'économie événementielle locale</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Réduire les barrières technologiques pour les organisateurs</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Promouvoir la culture et les talents africains</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Créer des emplois dans le secteur technologique</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border-8 border-white">
                    <Image 
                      src="/images/mission-video-poster.jpg" 
                      alt="Notre mission" 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg group">
                        <span className="ml-1 w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-violet-600 group-hover:border-l-violet-800 transition-colors"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Notre équipe */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              Notre Équipe
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Les visionnaires derrière EventEz</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Rencontrez les personnes passionnées qui transforment le secteur événementiel au Cameroun.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4 shadow-lg">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <p className="mb-4">{member.bio}</p>
                      <div className="flex gap-3">
                        {Object.keys(member.socialLinks).map((platform) => (
                          <Link 
                            key={platform} 
                            href={member.socialLinks[platform]}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                          >
                            <span className="sr-only">{platform}</span>
                            {platform === 'linkedin' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                            {platform === 'twitter' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.126 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>}
                            {platform === 'github' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-violet-600">{member.role}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/careers" className="inline-flex items-center text-violet-600 font-medium group">
              Rejoignez notre équipe 
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Pourquoi nous choisir - avec statistiques */}
      <section className="py-20 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              Nos Avantages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir EventEz</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Notre plateforme offre des avantages uniques pour la gestion d'événements en Afrique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-5 items-start group p-6 rounded-xl hover:bg-white transition-colors">
              <div className="w-14 h-14 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Gestion d'événements simplifiée</h3>
                <p className="text-gray-700 mb-4">
                  Notre interface intuitive vous permet de configurer votre événement en quelques minutes, avec des outils de personnalisation avancés.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">92%</span>
                    <span className="text-sm text-gray-500">Gain de temps</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">87%</span>
                    <span className="text-sm text-gray-500">Facilité d'utilisation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-5 items-start group p-6 rounded-xl hover:bg-white transition-colors">
              <div className="w-14 h-14 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Paiements Mobile Money intégrés</h3>
                <p className="text-gray-700 mb-4">
                  Acceptez facilement les paiements via MTN Mobile Money et Orange Money, les méthodes de paiement les plus utilisées dans la région.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">99%</span>
                    <span className="text-sm text-gray-500">Taux de succès</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">30s</span>
                    <span className="text-sm text-gray-500">Temps de traitement</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-5 items-start group p-6 rounded-xl hover:bg-white transition-colors">
              <div className="w-14 h-14 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-2xl flex items-center justify-center flex-shrink-0">
                <BarChart2 className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Analytiques détaillées</h3>
                <p className="text-gray-700 mb-4">
                  Accédez à des statistiques en temps réel sur vos ventes, vos inscriptions et l'engagement des participants.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">15+</span>
                    <span className="text-sm text-gray-500">Métriques clés</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">100%</span>
                    <span className="text-sm text-gray-500">Données exploitables</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-5 items-start group p-6 rounded-xl hover:bg-white transition-colors">
              <div className="w-14 h-14 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Sécurité et fiabilité</h3>
                <p className="text-gray-700 mb-4">
                  Nous avons mis en place des mesures de sécurité avancées pour protéger vos données et garantir une expérience sans faille.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">99.9%</span>
                    <span className="text-sm text-gray-500">Temps de fonctionnement</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-violet-600">SSL</span>
                    <span className="text-sm text-gray-500">Cryptage avancé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button href="/register-organizer" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Témoignages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              Témoignages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Découvrez l'expérience de ceux qui utilisent EventEz pour leurs événements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "EventEz a révolutionné la façon dont nous organisons nos conférences tech. La billetterie mobile money nous a permis d'atteindre un public beaucoup plus large."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image src="/images/testimonial-1.jpg" alt="David Mbarga" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">David Mbarga</p>
                  <p className="text-sm text-gray-600">Fondateur, TechHub Cameroun</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Le mode hors ligne d'EventEz a sauvé notre festival ! Malgré des problèmes de connexion sur le site, nous avons pu scanner les billets sans aucun souci."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image src="/images/testimonial-2.jpg" alt="Élise Nguema" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Élise Nguema</p>
                  <p className="text-sm text-gray-600">Directrice, Festival Douala Art</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "L'équipe de support d'EventEz est exceptionnelle. Ils comprennent vraiment les défis spécifiques à l'organisation d'événements en Afrique."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image src="/images/testimonial-3.jpg" alt="François Kamga" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">François Kamga</p>
                  <p className="text-sm text-gray-600">Organisateur, Business Summit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ - Accordéon amélioré */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur EventEz et notre plateforme.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-content-${index}`}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    {expandedFaq === index ? (
                      <Minus className="h-5 w-5 text-violet-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                </button>
                <div 
                  id={`faq-content-${index}`}
                  className={`px-6 py-4 bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
                    expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible overflow-hidden py-0'
                  }`}
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-700 mb-6">Vous ne trouvez pas la réponse à votre question?</p>
            <Button href="/contact" variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50 px-6 py-3 rounded-full">
              Contactez notre équipe
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Plus interactif */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 z-0"></div>
        
        {/* Formes décoratives */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="absolute top-0 left-0 opacity-10" width="100%" height="100%" viewBox="0 0 800 800">
              <defs>
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à révolutionner vos événements?</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Rejoignez les milliers d'organisateurs qui font confiance à EventEz pour leurs événements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                href="/register" 
                variant="default" 
                className="bg-white text-violet-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-shadow px-8 py-4 rounded-full text-lg"
              >
                Créer un compte gratuitement
              </Button>
              <Button 
                href="/demo" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg"
              >
                Demander une démo
              </Button>
            </div>
            
            <div className="mt-12 text-white/80 text-sm">
              <p>Pas encore prêt? <Link href="/events" className="text-white underline">Explorez les événements</Link> sur notre plateforme.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}