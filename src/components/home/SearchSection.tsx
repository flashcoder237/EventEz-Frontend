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
  ChevronRight
} from 'lucide-react';

export default function SearchSection({ categories = [], upcomingLocations = [] }) {
  // Gestion des onglets
  const [activeTab, setActiveTab] = useState('search');
  
  // Animation de conteneur
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
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
    hidden: { opacity: 0, y: 20 },
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
    <section className="relative py-0 lg:py-4">
      <div className="container mx-auto px-6">
        <motion.div 
          className="relative z-30 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.2)] border border-white/[0.12]">
            {/* Effet de glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-3xl blur-xl opacity-30 -z-10"></div>
            
            {/* Onglets */}
            <div className="flex border-b border-white/[0.12]">
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'search' 
                    ? 'text-white bg-white/[0.08]' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Recherche
              </button>
              <button 
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'quick' 
                    ? 'text-white bg-white/[0.08]' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Filtres rapides
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
                  {/* Champ de recherche */}
                  <motion.div variants={itemVariants} className="relative md:col-span-5">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-violet-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un événement..."
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/[0.08] border border-white/[0.16] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-white placeholder-white/60 transition-all"
                    />
                  </motion.div>
                  
                  {/* Sélecteur de catégorie */}
                  <motion.div variants={itemVariants} className="relative md:col-span-3">
                    <select 
                      className="w-full h-14 pl-4 pr-10 rounded-xl bg-white/[0.08] border border-white/[0.16] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-white appearance-none transition-all"
                    >
                      <option value="" className="bg-gray-900 text-white">Toutes catégories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id} className="bg-gray-900 text-white">
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-violet-300" />
                    </div>
                  </motion.div>
                  
                  {/* Sélecteur de date */}
                  <motion.div variants={itemVariants} className="relative md:col-span-3">
                    <select 
                      className="w-full h-14 pl-4 pr-10 rounded-xl bg-white/[0.08] border border-white/[0.16] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-white appearance-none transition-all"
                    >
                      <option value="" className="bg-gray-900 text-white">Toutes dates</option>
                      {dates.map(date => (
                        <option key={date.value} value={date.value} className="bg-gray-900 text-white">
                          {date.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-violet-300" />
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
                        className="w-full h-14 rounded-xl text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/20 font-medium"
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
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-violet-300" />
                      Lieux populaires
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {locations.map((location) => (
                        <Link 
                          key={location.slug} 
                          href={`/events/location/${location.slug}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.14] transition-colors group"
                        >
                          <span className="text-white">{location.name}</span>
                          <div className="flex items-center">
                            <span className="text-white/70 text-sm mr-1">{location.count}</span>
                            <ChevronRight className="h-4 w-4 text-violet-300 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Catégories populaires */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-violet-300" />
                      Catégories populaires
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickCategories.map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/events/category/${category.slug}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.14] transition-colors group"
                        >
                          <span className="text-white">{category.name}</span>
                          <ChevronRight className="h-4 w-4 text-violet-300 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}