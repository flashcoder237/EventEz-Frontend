'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  MapPin,
  Calendar,
  Tag,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';

export default function ModernSearchSection({ categories = [], upcomingLocations = [] }) {
  // Gestion des onglets
  const [activeTab, setActiveTab] = useState('search');
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Animation d'entrée après chargement de la page
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation de conteneur
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  // Animation pour les éléments individuels
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Emplacements par défaut si aucun n'est fourni
  const locations = upcomingLocations.length > 0 
    ? upcomingLocations 
    : [
        { name: 'Yaoundé', slug: 'yaounde', count: 42 },
        { name: 'Douala', slug: 'douala', count: 38 },
        { name: 'Limbe', slug: 'limbe', count: 15 },
        { name: 'Bafoussam', slug: 'bafoussam', count: 12 }
      ];
  
  // Catégories populaires pour l'onglet "Filtres rapides"
  const quickCategories = categories.slice(0, 6);
  
  // Dates populaires pour l'onglet "Filtres rapides"
  const dates = [
    { label: "Ce weekend", value: "weekend" },
    { label: "Cette semaine", value: "week" },
    { label: "Ce mois", value: "month" },
  ];

  return (
    <section className="relative py-10 md:py-16 bg-white">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-[1400px]">
        <motion.div 
          className="max-w-6xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-3">
              Événements
            </span>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Trouvez votre prochain événement</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Utilisez notre outil de recherche avancé pour découvrir des événements qui correspondent à vos intérêts.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            variants={itemVariants}
          >
            {/* Onglets */}
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'search' 
                    ? 'text-violet-700 border-b-2 border-violet-600' 
                    : 'text-gray-600 hover:text-violet-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  Recherche
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'quick' 
                    ? 'text-violet-700 border-b-2 border-violet-600' 
                    : 'text-gray-600 hover:text-violet-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Filtres rapides
                </span>
              </button>
            </div>
            
            {/* Contenu des onglets */}
            <div className="p-6 md:p-8">
              {activeTab === 'search' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center"
                >
                  {/* Champ de recherche moderne */}
                  <motion.div variants={itemVariants} className="relative md:col-span-5">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-violet-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un événement..."
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-gray-700 placeholder-gray-500 transition-all shadow-sm"
                    />
                  </motion.div>
                  
                  {/* Sélecteur de catégorie */}
                  <motion.div variants={itemVariants} className="relative md:col-span-3">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-violet-500" />
                    </div>
                    <select 
                      className="w-full h-14 pl-12 pr-10 rounded-xl bg-gray-50 border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-gray-700 appearance-none transition-all shadow-sm"
                    >
                      <option value="">Toutes catégories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                    </div>
                  </motion.div>
                  
                  {/* Sélecteur de date */}
                  <motion.div variants={itemVariants} className="relative md:col-span-3">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-violet-500" />
                    </div>
                    <select 
                      className="w-full h-14 pl-12 pr-10 rounded-xl bg-gray-50 border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-gray-700 appearance-none transition-all shadow-sm"
                    >
                      <option value="">Toutes dates</option>
                      {dates.map(date => (
                        <option key={date.value} value={date.value}>
                          {date.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                    </div>
                  </motion.div>
                  
                  {/* Bouton de recherche */}
                  <motion.div variants={itemVariants} className="md:col-span-1 flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-14 rounded-xl text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg font-medium"
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === 'quick' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Lieux populaires */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-gray-900 text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-violet-500" />
                      Lieux populaires
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {locations.map((location) => (
                        <Link 
                          key={location.slug} 
                          href={`/events/location/${location.slug}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-200 transition-colors group"
                        >
                          <span className="text-gray-700">{location.name}</span>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-sm mr-1">{location.count}</span>
                            <ChevronRight className="h-4 w-4 text-violet-500 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Catégories populaires */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-gray-900 text-lg font-semibold mb-4 flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-violet-500" />
                      Catégories populaires
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                    {quickCategories.map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/events/category/${category.slug}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-200 transition-colors group"
                        >
                          <span className="text-gray-700">{category.name}</span>
                          <ChevronRight className="h-4 w-4 text-violet-500 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
            
            {/* Footer avec bouton de recherche avancée */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
              <Link 
                href="/events/"
                className="flex items-center text-violet-600 font-medium hover:text-violet-700 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Recherche avancée
              </Link>
            </div>
          </motion.div>
          
          {/* Tags populaires */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <div className="text-gray-500 mb-3">Tags populaires:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Concert', 'Formation', 'Conférence', 'Exposition', 'Festival', 'Sport'].map((tag) => (
                <Link 
                  key={tag}
                  href={`/events/tag/${tag.toLowerCase()}`}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}