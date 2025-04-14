'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Search, Filter, Calendar, Star, MapPin } from 'lucide-react';
import { usersAPI } from '../../../lib/api';

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

export default function AllOrganizersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState<Organizer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const organizersPerPage = 12;
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fonction pour récupérer les organisateurs
  const fetchOrganizers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await usersAPI.getOrganizers();
      
      if (response.data && response.data.results) {
        // Transformer les données pour correspondre à notre format
        const organizersData = response.data.results.map(user => {
          const organizer: Organizer = {
            id: user.id,
            name: user.company_name || `${user.first_name} ${user.last_name}`,
            logo: user.organizer_profile?.logo || (user.organizer_type === 'organization' ? '/images/defaults/organization.png' : '/images/defaults/user.png'),
            category: user.organizer_type === 'organization' ? 'Organisation' : 'Individuel',
            rating: user.organizer_profile?.rating || 4.5,
            eventCount: user.organizer_profile?.event_count || 0,
            location: "Cameroun",
            description: user.organizer_profile?.description || "Organisateur d'événements"
          };
          return organizer;
        });
        
        setOrganizers(organizersData);
        
        // Créer des catégories basées sur les types d'organisateurs
        const categoryMap = new Map<string, number>();
        categoryMap.set('all', organizersData.length);
        
        organizersData.forEach(organizer => {
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
        setInitialLoadComplete(true);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des organisateurs:", err);
      setError("Impossible de charger les organisateurs. Veuillez réessayer plus tard.");
      
      // Utiliser des données de secours en cas d'erreur
      const fallbackData = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Organisateur ${i + 1}`,
        logo: `/images/team-${(i % 4) + 1}.jpg`,
        category: i % 2 === 0 ? 'Organisation' : 'Individuel',
        rating: 4 + Math.random(),
        eventCount: Math.floor(Math.random() * 30) + 5,
        location: i % 2 === 0 ? "Douala, Cameroun" : "Yaoundé, Cameroun",
        description: "Organisateur d'événements professionnels au Cameroun."
      }));
      
      setOrganizers(fallbackData as Organizer[]);
      
      setCategories([
        { id: 'all', name: 'Tous', count: fallbackData.length },
        { id: 'organisation', name: 'Organisation', count: Math.floor(fallbackData.length / 2) },
        { id: 'individuel', name: 'Individuel', count: Math.ceil(fallbackData.length / 2) }
      ]);
      setInitialLoadComplete(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les organisateurs en fonction de la recherche et de la catégorie
  const filterOrganizers = () => {
    if (!initialLoadComplete) return;
    
    let filtered = [...organizers];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchLower) || 
        org.description.toLowerCase().includes(searchLower) ||
        org.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(org => 
        org.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    
    setFilteredOrganizers(filtered);
    setTotalPages(Math.ceil(filtered.length / organizersPerPage));
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  };

  // Obtenir les organisateurs pour la page actuelle
  const getCurrentPageOrganizers = () => {
    const startIndex = (currentPage - 1) * organizersPerPage;
    const endIndex = startIndex + organizersPerPage;
    return filteredOrganizers.slice(startIndex, endIndex);
  };

  // Gérer le changement de page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Check for URL parameters on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    fetchOrganizers();
  }, []);

  // Effectuer le filtrage chaque fois que les données changent ou que les filtres changent
  useEffect(() => {
    filterOrganizers();
  }, [searchTerm, selectedCategory, organizers, initialLoadComplete]);

  return (
    <MainLayout>
      {/* Header Section */}
      <section className="pt-32 pb-10 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button href="/organizers" className="bg-white text-violet-700 hover:bg-violet-50 mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tous les organisateurs</h1>
          </div>
          
          {/* Filtres et recherche */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
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
              <div className="flex-shrink-0">
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Organizers List Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
              {error}
              <button 
                onClick={fetchOrganizers} 
                className="ml-4 text-violet-600 underline hover:text-violet-800"
              >
                Réessayer
              </button>
            </div>
          ) : filteredOrganizers.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Aucun organisateur trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getCurrentPageOrganizers().map((organizer) => (
                  <motion.div 
                    key={organizer.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
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
                          <span className="text-gray-900 font-medium">{typeof organizer.rating === 'number' ? organizer.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-gray-700">{organizer.eventCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-700 text-sm mb-3">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="line-clamp-1">{organizer.location}</span>
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-violet-700 hover:bg-violet-50'
                      }`}
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium border-t border-b ${
                          currentPage === page
                            ? 'bg-violet-600 text-white'
                            : 'bg-white text-violet-700 hover:bg-violet-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-violet-700 hover:bg-violet-50'
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}