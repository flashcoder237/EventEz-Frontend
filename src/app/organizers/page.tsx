'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Search, Filter, Calendar, Users, Star, MapPin } from 'lucide-react';
import { usersAPI } from '../../lib/api';

// Type pour les organisateurs
interface Organizer {
  id: number;
  name: string;
  logo: string;
  category: string;
  rating: number;
  eventCount: number;
  location: string;
  description: string;
}

// Type pour les catégories
interface Category {
  id: string;
  name: string;
  count: number;
}

export default function OrganizersPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredOrganizers, setFeaturedOrganizers] = useState<Organizer[]>([]);
  const [popularOrganizers, setPopularOrganizers] = useState<Organizer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs pour observer les sections
  const sectionsRef = {
    hero: useRef(null),
    featured: useRef(null),
    categories: useRef(null),
    popular: useRef(null),
    cta: useRef(null)
  };
  
  // Fonction pour récupérer les organisateurs
  const fetchOrganizers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer les utilisateurs avec le rôle 'organizer'
      const response = await usersAPI.getUsers({ role: 'organizer' });
      
      if (response.data && response.data.results) {
        // Transformer les données pour correspondre à notre format
        const organizers = response.data.results.map(user => {
          const organizer: Organizer = {
            id: user.id,
            name: user.company_name || `${user.first_name} ${user.last_name}`,
            logo: user.organizer_profile?.logo || "/images/team-1.jpg",
            category: user.organizer_type === 'organization' ? 'Organisation' : 'Individuel',
            rating: user.organizer_profile?.rating || 4.5,
            eventCount: user.organizer_profile?.event_count || 0,
            location: "Cameroun",
            description: user.organizer_profile?.description || "Organisateur d'événements"
          };
          return organizer;
        });
        
        // Trier par nombre d'événements pour les organisateurs en vedette
        const sortedByEvents = [...organizers].sort((a, b) => b.eventCount - a.eventCount);
        setFeaturedOrganizers(sortedByEvents.slice(0, 3));
        
        // Trier par note pour les organisateurs populaires
        const sortedByRating = [...organizers].sort((a, b) => b.rating - a.rating);
        setPopularOrganizers(sortedByRating.slice(0, 4));
        
        // Créer des catégories basées sur les types d'organisateurs
        const categoryMap = new Map<string, number>();
        categoryMap.set('all', organizers.length);
        
        organizers.forEach(organizer => {
          const category = organizer.category;
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });
        
        const categoryList: Category[] = [
          { id: 'all', name: 'Tous', count: categoryMap.get('all') || 0 }
        ];
        
        categoryMap.forEach((count, name) => {
          if (name !== 'all') {
            categoryList.push({
              id: name.toLowerCase().replace(/\s+/g, '-'),
              name,
              count
            });
          }
        });
        
        setCategories(categoryList);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des organisateurs:", err);
      setError("Impossible de charger les organisateurs. Veuillez réessayer plus tard.");
      
      // Utiliser des données de secours en cas d'erreur
      setFeaturedOrganizers([
        {
          id: 1,
          name: "Festival Douala Art",
          logo: "/images/team-1.jpg",
          category: "Arts & Culture",
          rating: 4.8,
          eventCount: 24,
          location: "Douala, Cameroun",
          description: "Organisation d'événements culturels et artistiques dans la ville de Douala."
        },
        {
          id: 2,
          name: "TechHub Cameroun",
          logo: "/images/team-2.jpg",
          category: "Technologie",
          rating: 4.9,
          eventCount: 36,
          location: "Yaoundé, Cameroun",
          description: "Conférences et ateliers sur les dernières tendances technologiques."
        },
        {
          id: 3,
          name: "Business Summit",
          logo: "/images/team-3.jpg",
          category: "Business",
          rating: 4.7,
          eventCount: 18,
          location: "Douala, Cameroun",
          description: "Événements professionnels pour les entrepreneurs et les entreprises."
        }
      ]);
      
      setPopularOrganizers([
        {
          id: 4,
          name: "Cameroon Music Awards",
          logo: "/images/team-4.jpg",
          category: "Musique",
          rating: 4.6,
          eventCount: 12,
          location: "Yaoundé, Cameroun",
          description: "Célébration de la musique camerounaise à travers des événements prestigieux."
        },
        {
          id: 5,
          name: "Afro Food Festival",
          logo: "/images/team-1.jpg",
          category: "Gastronomie",
          rating: 4.5,
          eventCount: 8,
          location: "Douala, Cameroun",
          description: "Festival culinaire mettant en valeur la gastronomie africaine."
        },
        {
          id: 6,
          name: "Cameroon Fashion Week",
          logo: "/images/team-2.jpg",
          category: "Mode",
          rating: 4.7,
          eventCount: 15,
          location: "Douala, Cameroun",
          description: "Événements de mode présentant les créateurs camerounais et africains."
        },
        {
          id: 7,
          name: "Sports Connect Africa",
          logo: "/images/team-3.jpg",
          category: "Sport",
          rating: 4.4,
          eventCount: 20,
          location: "Yaoundé, Cameroun",
          description: "Organisation d'événements sportifs et de compétitions à travers le pays."
        }
      ]);
      
      setCategories([
        { id: 'all', name: 'Tous', count: 120 },
        { id: 'music', name: 'Musique', count: 45 },
        { id: 'business', name: 'Business', count: 32 },
        { id: 'tech', name: 'Technologie', count: 28 },
        { id: 'arts', name: 'Arts & Culture', count: 25 },
        { id: 'sports', name: 'Sports', count: 18 },
        { id: 'food', name: 'Gastronomie', count: 15 },
        { id: 'fashion', name: 'Mode', count: 12 }
      ]);
    } finally {
      setIsLoading(false);
    }
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
    
    // Charger les données
    fetchOrganizers();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      Object.values(sectionsRef).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-violet-50 to-purple-50" id="hero-section" ref={sectionsRef.hero}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial={{ opacity: 0, y: 30 }}
              animate={animationTriggered["hero-section"] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={animationTriggered["hero-section"] ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Découvrez les organisateurs
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={animationTriggered["hero-section"] ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Trouvez les meilleurs <span className="text-violet-600">organisateurs d'événements</span> au Cameroun
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-700 mb-8"
                initial={{ opacity: 0 }}
                animate={animationTriggered["hero-section"] ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Découvrez des organisateurs professionnels pour tous types d'événements. Consultez leurs profils, évaluations et événements passés pour faire le meilleur choix.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={animationTriggered["hero-section"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Rechercher un organisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  Rechercher
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 lg:pl-10"
              initial={{ opacity: 0, x: 30 }}
              animate={animationTriggered["hero-section"] ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/chuttersnap-Q_KdjKxntH8-unsplash.jpg"
                  alt="Organisateurs d'événements"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white" id="categories-section" ref={sectionsRef.categories}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={animationTriggered["categories-section"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={animationTriggered["categories-section"] ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Catégories
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={animationTriggered["categories-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Explorez par catégorie
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={animationTriggered["categories-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Trouvez des organisateurs spécialisés dans le domaine qui vous intéresse
            </motion.p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={animationTriggered["categories-section"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Organizers Section */}
      <section className="py-16 bg-gray-50" id="featured-section" ref={sectionsRef.featured}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={animationTriggered["featured-section"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={animationTriggered["featured-section"] ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              À la une
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={animationTriggered["featured-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Organisateurs en vedette
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={animationTriggered["featured-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Ces organisateurs se distinguent par la qualité de leurs événements et leur professionnalisme
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredOrganizers.map((organizer, index) => (
              <motion.div 
                key={organizer.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={animationTriggered["featured-section"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        src={organizer.logo}
                        alt={organizer.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{organizer.name}</h3>
                      <p className="text-violet-600 text-sm">{organizer.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{organizer.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-gray-900 font-medium">{organizer.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-1" />
                      <span className="text-gray-700">{organizer.eventCount} événements</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700 mb-4">
                    <MapPin className="h-5 w-5 text-gray-500 mr-1" />
                    <span>{organizer.location}</span>
                  </div>
                  
                  <Button 
                    href={`/organizers/${organizer.id}`}
                    className="w-full bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
                  >
                    Voir le profil
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Organizers Section */}
      <section className="py-16 bg-white" id="popular-section" ref={sectionsRef.popular}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={animationTriggered["popular-section"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={animationTriggered["popular-section"] ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Populaires
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={animationTriggered["popular-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Organisateurs populaires
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={animationTriggered["popular-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Découvrez les organisateurs les plus appréciés par notre communauté
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularOrganizers.map((organizer, index) => (
              <motion.div 
                key={organizer.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={animationTriggered["popular-section"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={organizer.logo}
                        alt={organizer.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{organizer.name}</h3>
                      <p className="text-violet-600 text-xs">{organizer.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{organizer.description}</p>
                  
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-gray-900 font-medium">{organizer.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-700">{organizer.eventCount}</span>
                    </div>
                  </div>
                  
                  <Button 
                    href={`/organizers/${organizer.id}`}
                    className="w-full text-sm py-1 bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
                  >
                    Voir le profil
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              href="/organizers/all"
              className="bg-white text-violet-700 hover:bg-violet-50 border border-violet-200"
            >
              Voir tous les organisateurs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white" id="cta-section" ref={sectionsRef.cta}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={animationTriggered["cta-section"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={animationTriggered["cta-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Vous êtes un organisateur d'événements ?
            </motion.h2>
            <motion.p 
              className="text-lg text-violet-100 mb-8"
              initial={{ opacity: 0 }}
              animate={animationTriggered["cta-section"] ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Rejoignez notre plateforme pour promouvoir vos événements, vendre des billets et développer votre audience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={animationTriggered["cta-section"] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                href="/register-organizer"
                className="bg-white text-violet-700 hover:bg-gray-100 border-0 px-8 py-4 rounded-full text-lg shadow-lg"
              >
                Devenir organisateur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
