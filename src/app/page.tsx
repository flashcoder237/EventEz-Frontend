// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import EventGrid from '@/components/events/EventGrid';
import { Button } from '@/components/ui/Button';
import { FaCalendarAlt, FaSearch, FaTicketAlt, FaClipboardList, FaChartLine } from 'react-icons/fa';

// Cette fonction s'exécute côté serveur pour obtenir les données
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
      limit: 6
    });
    
    // Obtenir les catégories
    const categoriesResponse = await eventsAPI.getCategories();

    return {
      featuredEvents: featuredEventsResponse.data.results || [],
      upcomingEvents: upcomingEventsResponse.data.results || [],
      categories: categoriesResponse.data.results || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la page d\'accueil:', error);
    return {
      featuredEvents: [],
      upcomingEvents: [],
      categories: []
    };
  }
}

export default async function HomePage() {
  const { featuredEvents, upcomingEvents, categories } = await getHomePageData();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez et organisez des événements au Cameroun
            </h1>
            <p className="text-lg md:text-xl mb-8">
              La plateforme de gestion d'événements adaptée aux différents types d'événements
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/events" variant="default" size="lg">
                Découvrir les événements
              </Button>
              <Button href="/register-organizer" variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                Devenir organisateur
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 -mt-20 relative z-20 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Rechercher un événement</h2>
            
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  className="w-full h-12 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FaSearch className="absolute left-3 top-4 text-gray-400" />
              </div>
              
              <select className="h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <Button type="submit" className="h-12">Rechercher</Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Événements en vedette</h2>
              <Link href="/events" className="text-primary font-medium hover:underline">
                Voir tous les événements
              </Link>
            </div>
            
            <EventGrid events={featuredEvents} />
          </div>
        </section>
      )}
      
      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Événements à venir</h2>
              <Link href="/events" className="text-primary font-medium hover:underline">
                Voir tous les événements
              </Link>
            </div>
            
            <EventGrid events={upcomingEvents} />
          </div>
        </section>
      )}
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Parcourir par catégorie</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link 
                key={category.id}
                href={`/events/categories/${category.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <FaCalendarAlt className="text-primary text-xl" />
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comment ça marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Billetterie</h3>
              <p className="text-gray-600">
                Vendez des billets en ligne pour vos événements, gérez les différents types de billets et les promotions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Formulaires Personnalisés</h3>
              <p className="text-gray-600">
                Créez des formulaires d'inscription adaptés à vos besoins spécifiques pour les événements sans billetterie.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyses Détaillées</h3>
              <p className="text-gray-600">
                Suivez les performances de vos événements avec des statistiques en temps réel et des rapports personnalisés.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button href="/about" variant="outline">En savoir plus</Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à organiser votre événement ?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'organisateurs et profitez de notre plateforme complète pour gérer vos événements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/register-organizer" variant="default" size="lg" className="bg-white text-primary hover:bg-gray-100">
              S'inscrire en tant qu'organisateur
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}