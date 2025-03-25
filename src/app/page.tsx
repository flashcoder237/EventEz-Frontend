import Image from 'next/image';
import Link from 'next/link';
import { eventsAPI,categoriesAPI } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  Search, 
  MapPin,
  ChevronDown
} from 'lucide-react';

// Importations des composants côté client
import HeroSection from '@/components/home/HeroSection';
import FeaturedEventsSection from '@/components/home/FeaturedEventsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PopularEventsSection from '@/components/home/PopularEventsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import StatsSection from '@/components/home/StatsSection';
import PartnersSection from '@/components/home/PartnersSection';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';
import ModernSearchSection from '@/components/home/ModernSearchSection';

// Fonction pour obtenir les données de la page d'accueil
async function getHomePageData() {
  try {
    // Obtenir les événements en vedette
    const featuredEventsResponse = await eventsAPI.getEvents({
      is_featured: true,
      status: 'validated',
      limit: 6
    });
    
    // Obtenir les événements à venir
    const upcomingEventsResponse = await eventsAPI.getEvents({
      status: 'validated',
      ordering: 'start_date',
      limit: 8
    });
    
    // Obtenir les événements populaires
    const popularEventsResponse = await eventsAPI.getEvents({
      status: 'validated',
      ordering: '-registration_count',
      limit: 6
    });
    
    // Obtenir les catégories
    const categoriesResponse = await categoriesAPI.getCategories();

    return {
      featuredEvents: featuredEventsResponse.data.results || [],
      upcomingEvents: upcomingEventsResponse.data.results || [],
      popularEvents: popularEventsResponse.data.results || [],
      categories: categoriesResponse.data.results || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la page d\'accueil:', error);
    return {
      featuredEvents: [],
      upcomingEvents: [],
      popularEvents: [],
      categories: []
    };
  }
}

export default async function HomePage() {
  const { featuredEvents, upcomingEvents, popularEvents, categories } = await getHomePageData();

  // Images de fond pour le carrousel (à remplacer par vos propres images)
  const heroBackgrounds = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg',
    '/images/hero-bg-3.jpeg'
  ];

  return (
    <MainLayout>
      {/* Hero Section avec carrousel (composant client) */}
      <HeroSection featuredEvents={featuredEvents} />

      {/* Search Section - Version améliorée */}
      <ModernSearchSection categories={categories} />

      {/* <div className="absolute left-0 right-0 top-22 translate-y-1/2 z-20">
          <SearchSection 
            categories={categories} 
            upcomingLocations={popularLocations} 
          />
        </div> */}
      {/* Sections suivantes avec des marges et espacements */}
      <div>
        {/* Categories Section with new component */}
        {categories.length > 0 && (
          <div className="px-4 md:px-8 lg:px-16 bg-gray-50">
            <CategoriesSection categories={categories} />
          </div>
        )}
        
        {/* Popular Events Section with new component */}
        {popularEvents.length > 0 && (
          <div className="px-4 md:px-8 lg:px-16">
            <PopularEventsSection events={popularEvents} />
          </div>
        )}
        
        {/* Featured Events Section - Avec composant client */}
        {featuredEvents.length > 0 && (
          <div className="px-4 md:px-8 lg:px-16 bg-white">
            <FeaturedEventsSection events={featuredEvents} />
          </div>
        )}
        
        {/* How It Works Section */}
        <div className="px-4 md:px-8 lg:px-16">
          <HowItWorksSection />
        </div>
        
        {/* Testimonials Section - Avec composant client */}
        <div className="px-4 md:px-8 lg:px-16 bg-gradient-to-br from-violet-900 via-indigo-800 to-purple-900 text-white">
          <TestimonialsSection />
        </div>
        
        {/* Stats Section */}
        <div className="px-4 md:px-8 lg:px-16">
          <StatsSection />
        </div>
        
        {/* CTA Section */}
        <div className="px-4 md:px-8 lg:px-16 bg-gradient-to-br from-violet-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
          <CTASection />
        </div>
        
        {/* Partners Section */}
        <div className="px-4 md:px-8 lg:px-16 bg-gray-50 py-16">
          <PartnersSection />
        </div>
        
        {/* Newsletter Section */}
        <div className="px-4 md:px-8 lg:px-16">
          <NewsletterSection />
        </div>
      </div>
    </MainLayout>
  );
}