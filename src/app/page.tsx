// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, Search, Ticket, ClipboardList, BarChart2, 
  MapPin, Clock, TrendingUp, Award, ChevronRight, Users, Heart
} from 'lucide-react';

// Importations des composants côté client
import HeroSection from '@/components/home/HeroSection';
import FeaturedEventsSection from '@/components/home/FeaturedEventsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

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
      limit: 8
    });
    
    // Obtenir les événements populaires
    const popularEventsResponse = await eventsAPI.getEvents({
      status: 'validated',
      ordering: '-attendees_count',
      limit: 3
    });
    
    // Obtenir les catégories
    const categoriesResponse = await eventsAPI.getCategories();

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

// Format date helper function
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
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
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 -mt-24 relative z-20 mx-auto">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-6">Rechercher un événement</h2>
                
                <form className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Quel événement recherchez-vous ?"
                      className="w-full h-14 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    />
                    <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
                  </div>
                  
                  <div className="w-full md:w-44">
                    <select className="w-full h-14 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg">
                      <option value="">Catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-full md:w-44">
                    <input
                      type="date"
                      className="w-full h-14 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="h-14 px-8 rounded-lg text-lg font-medium"
                  >
                    Rechercher
                  </Button>
                </form>
              </div>
              
              <div className="w-full md:w-1/3 mt-6 md:mt-0 border-l-0 md:border-l border-gray-200 pl-0 md:pl-6">
                <h3 className="text-lg font-semibold mb-4">Événements proches</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary h-5 w-5 flex-shrink-0" />
                    <Link href="/events/location/yaounde" className="text-gray-700 hover:text-primary transition-colors">
                      Yaoundé
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary h-5 w-5 flex-shrink-0" />
                    <Link href="/events/location/douala" className="text-gray-700 hover:text-primary transition-colors">
                      Douala
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary h-5 w-5 flex-shrink-0" />
                    <Link href="/events/location/limbe" className="text-gray-700 hover:text-primary transition-colors">
                      Limbé
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section - Redesigné avec icônes personnalisées */}
      <section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Explorez par intérêt</span>
      <h2 className="text-3xl font-bold mt-2">Trouvez votre prochaine expérience</h2>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category, index) => {
        // Icônes spécifiques pour chaque catégorie
        const icons = [
          <Award key="1" className="h-8 w-8" />,
          <Calendar key="2" className="h-8 w-8" />,
          <MapPin key="3" className="h-8 w-8" />,
          <TrendingUp key="4" className="h-8 w-8" />,
          <Ticket key="5" className="h-8 w-8" />,
          <Clock key="6" className="h-8 w-8" />
        ];
        
        return (
          <Link 
            key={category.id}
            href={`/events/categories/${category.id}`}
            className="group"
          >
            <div className="aspect-square rounded-xl bg-white border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
              <div className="p-4 bg-violet-50 rounded-full mb-4 text-violet-600 group-hover:bg-violet-100 transition-colors">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-semibold text-center text-gray-800">{category.name}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
</section>
      
      {/* Popular Events Showcase - Nouvelle section avec design amélioré */}
      {popularEvents.length > 0 && (
  <section className="py-20 bg-white overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Les plus populaires</span>
        <h2 className="text-3xl font-bold mt-2">Événements tendances</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {popularEvents.map((event, index) => (
          <Link 
            key={event.id} 
            href={`/events/${event.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="relative aspect-[4/3]">
                {/* Overlay sur l'image qui apparaît au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/40 opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                
                <Image 
                  src={event.banner_url || "/images/placeholder-image.png"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badge de catégorie */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {event.category?.name || 'Événement'}
                  </span>
                </div>
                
                {/* Badge tendance */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-gradient-to-r from-violet-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    Tendance
                  </span>
                </div>
                
                {/* Date élégante */}
                <div className="absolute bottom-3 left-3 z-10">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    {formatDate(event.start_date)}
                  </div>
                </div>
                
                {/* Bouton découvrir qui apparaît au survol */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <span className="bg-gradient-to-r from-violet-600/90 to-pink-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Découvrir
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-violet-600" />
                  <span className="text-sm truncate">{event.location}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-bold text-pink-500 text-lg">
                    {event.price ? `${event.price} XAF` : 'Gratuit'}
                  </span>
                  
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 50) + 10} places</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Button 
          href="/events" 
          variant="outline"
          className="rounded-full px-8 py-3 border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors"
        >
          Voir tous les événements populaires
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>
)}
      
      {/* Featured Events Section - Avec composant client */}
      {featuredEvents.length > 0 && (
        <FeaturedEventsSection events={featuredEvents} />
      )}
      
      {/* Upcoming Events Section - Redesigné en grille moderne */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Agenda</span>
                <h2 className="text-3xl font-bold mt-2">Événements à venir</h2>
              </div>
              
              <Link href="/events" className="text-primary font-medium mt-4 md:mt-0 group flex items-center">
                Tous les événements
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.slice(0, 8).map((event, index) => (
                <Link 
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative aspect-[4/3]">
                      {/* Overlay sur l'image qui apparaît au survol */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/40 opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                      
                      <Image 
                        src={event.banner_url || `/images/event-upcoming-${(index % 4) + 1}.jpg`}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Badge de catégorie */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          {event.category?.name || 'Événement'}
                        </span>
                      </div>
                      
                      {/* Badge featured si applicable */}
                      {event.is_featured && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            En vedette
                          </span>
                        </div>
                      )}
                      
                      {/* Date élégante */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatDate(event.start_date)}
                        </div>
                      </div>
                      
                      {/* Bouton découvrir qui apparaît au survol */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Découvrir
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                        <span className="text-sm truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="font-bold text-primary text-lg">
                          {event.price ? `${event.price} XAF` : 'Gratuit'}
                        </span>
                        
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{Math.floor(Math.random() * 50) + 10} places</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* How it Works Section - Redesigné avec illustrations et étapes numérotées */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre plateforme</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Comment ça marche</h2>
            <p className="text-lg text-gray-600">
              Notre plateforme offre une solution complète pour organiser et gérer vos événements au Cameroun, du début à la fin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Ligne de connexion */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-1 bg-primary/20 z-0"></div>
            
            <div className="relative z-10 bg-white">
              <div className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Ticket className="text-primary text-3xl" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Billetterie avancée</h3>
                <p className="text-gray-600">
                  Gérez facilement différents types de billets, codes promotionnels, et offrez plusieurs méthodes de paiement à vos participants.
                </p>
                
                <div className="mt-6">
                  <Button 
                    href="/features/ticketing" 
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    En savoir plus
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 bg-white">
              <div className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <ClipboardList className="text-primary text-3xl" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Formulaires personnalisés</h3>
                <p className="text-gray-600">
                  Créez des formulaires d'inscription sur mesure avec des champs personnalisés pour collecter les informations dont vous avez besoin.
                </p>
                
                <div className="mt-6">
                  <Button 
                    href="/features/forms" 
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    En savoir plus
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 bg-white">
              <div className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <BarChart2 className="text-primary text-3xl" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Analyses en temps réel</h3>
                <p className="text-gray-600">
                  Accédez à des statistiques détaillées et des rapports personnalisés pour mesurer le succès de vos événements.
                </p>
                
                <div className="mt-6">
                  <Button 
                    href="/features/analytics" 
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    En savoir plus
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              href="/features" 
              variant="outline"
              className="rounded-full px-8 border-2 border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Découvrir toutes nos fonctionnalités
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - Avec composant client */}
      <TestimonialsSection />
      
      {/* Stats Section - Nouvelle section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-600 font-medium">Événements organisés</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600 font-medium">Organisateurs actifs</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600 font-medium">Taux de satisfaction</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100K+</div>
              <p className="text-gray-600 font-medium">Participants</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Redesigné avec fond dynamique */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-pink-500 text-white relative overflow-hidden">
  {/* Formes décoratives */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
  </div>
  
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-6 text-white">Prêt à lancer votre prochain événement ?</h2>
      <p className="text-xl mb-8 text-white">
        Rejoignez notre communauté d'organisateurs et profitez d'une plateforme complète pour faire de votre événement un succès retentissant.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          href="/register-organizer" 
          variant="default" 
          size="xl"
          className="rounded-full px-8 py-6 text-lg font-medium bg-white text-violet-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all"
        >
          Créer mon compte organisateur
        </Button>
        <Button 
          href="/contact" 
          variant="outline" 
          size="xl"
          className="rounded-full px-8 py-6 text-lg font-medium bg-transparent text-white border-white hover:bg-white/10 transition-all"
        >
          Nous contacter
        </Button>
      </div>
      
      <p className="mt-8 text-white/90">
        Déjà membre ? <Link href="/login" className="text-white font-medium underline hover:no-underline">Connectez-vous</Link>
      </p>
    </div>
  </div>
</section>

      
      {/* Partners Section - Nouvelle section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-gray-500 font-medium">Ils nous font confiance</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image 
                  src={`/images/partner-${item}.png`}
                  alt="Partenaire"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section - Nouvelle section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
            <p className="text-gray-600 mb-6">
              Abonnez-vous à notre newsletter pour recevoir les dernières actualités sur les événements à venir
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button type="submit" className="h-12 whitespace-nowrap">
                S'abonner
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}