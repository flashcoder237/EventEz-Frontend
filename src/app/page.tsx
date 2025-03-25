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
      <HeroSection backgrounds={heroBackgrounds} />
      
      {/* Search Section - Redesigné avec filtre rapide */}
      {/* Search Section - Version améliorée */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 -mt-32 relative z-20 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  Trouvez votre prochain événement
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative md:col-span-2">
                    <input
                      type="text"
                      placeholder="Recherchez un événement, une catégorie..."
                      className="w-full h-14 pl-12 pr-4 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 text-base transition-all duration-300"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                  <div className="relative">
                    <select className="w-full h-14 px-4 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 text-base appearance-none transition-all duration-300">
                      <option value="">Toutes catégories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                  </div>
                  <Button 
                    type="submit" 
                    className="md:col-span-3 h-14 rounded-lg text-base font-semibold bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Rechercher
                  </Button>
                </form>
              </div>
              <div className="w-full md:w-1/3 mt-8 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Événements proches</h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Yaoundé', link: '/events/location/yaounde' },
                    { name: 'Douala', link: '/events/location/douala' },
                    { name: 'Limbé', link: '/events/location/limbe' }
                  ].map(({ name, link }) => (
                    <li key={name}>
                      <Link 
                        href={link} 
                        className="flex items-center gap-3 text-base text-gray-600 hover:text-primary transition-colors"
                      >
                        <MapPin className="h-5 w-5 text-primary/70" />
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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