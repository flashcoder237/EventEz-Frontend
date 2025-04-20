// components/layout/ModernHeader.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types/events';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernHeader() {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { data: session, status } = useSession({
    required: false,
  });
  
  const canAccessDashboard = session?.user?.role === 'organizer' || session?.user?.role === 'admin';
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const categoriesResponse = await categoriesAPI.getCategories();
        if (categoriesResponse.data && categoriesResponse.data.results) {
          setCategoriesData(categoriesResponse.data.results);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        setCategoriesData([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const userActions = () => {
    if (status === 'loading') {
      return (
        <div className="animate-pulse h-10 w-20 bg-gray-200 rounded"></div>
      );
    }
    
    if (session && session.user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-violet-50 px-3 py-2 rounded-full hover:bg-violet-100 transition-colors">
              <User className="h-5 w-5 text-violet-600" />
              <span className="text-violet-800 font-medium">{session.user.name || 'Profil'}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
              
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                    onClick={closeAllDropdowns}
                  >
                
                    {canAccessDashboard ? "Tableau de bord" : "Mon profile"}
                  </Link>
                
                <button 
                  onClick={() => signOut()} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/login" 
          className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
        >
          Connexion
        </Link>
        <Button 
          href="/register-organizer" 
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/20 text-white border-0 rounded-full"
        >
          S'inscrire
        </Button>
      </div>
    );
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-36 mr-2">
            <Image 
              src="/images/logo.png" 
              alt="EventEz" 
              width={120}
              height={40}
              className="mx-2"
              priority
            />
            </div>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button 
                onClick={() => toggleDropdown('events')}
                className="flex items-center text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Événements
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'events' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'events' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <Link 
                        href="/events/popular" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                        onClick={closeAllDropdowns}
                      >
                        Événements populaires
                      </Link>
                      <Link 
                        href="/events/upcoming" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                        onClick={closeAllDropdowns}
                      >
                        Événements à venir
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <button 
                onClick={() => toggleDropdown('categories')}
                className="flex items-center text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Catégories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'categories' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                      ) : (
                        Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                          categoriesData.slice(0, 6).map((category) => (
                            <Link 
                              key={category.id}
                              href={`/events?category=${category.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                              onClick={closeAllDropdowns}
                            >
                              {category.name}
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">Aucune catégorie disponible</div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/organizers" 
              className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
            >
              Organisateurs
            </Link>

            <Link 
              href="/about" 
              className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
            >
              À propos
            </Link>
            <Link 
              href="/princing" 
              className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
            >
             Nos tarifs
            </Link>

            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>
          
          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {userActions()}
          </div>
          
          {/* Menu button - Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              className="text-gray-700 hover:text-violet-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 py-4"
          >
            <div className="container mx-auto px-4 space-y-3">
              <Link 
                href="/events" 
                className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Événements
              </Link>
              
              <div>
                <button 
                  onClick={() => toggleDropdown('mobile-categories')}
                  className="flex items-center py-2 text-gray-700 font-medium w-full justify-between"
                >
                  Catégories
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'mobile-categories' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mobile-categories' && (
                  <div className="pl-4 space-y-2 mt-1">
                    {isLoading ? (
                      <div className="py-1 text-gray-500">Chargement...</div>
                    ) : (
                      Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                        categoriesData.slice(0, 4).map((category) => (
                          <Link 
                            key={category.id}
                            href={`/events?category=${category.id}`}
                            className="block py-1 text-gray-700 hover:text-violet-600 transition-colors"
                            onClick={closeAllDropdowns}
                          >
                            {category.name}
                          </Link>
                        ))
                      ) : (
                        <div className="py-1 text-gray-500">Aucune catégorie disponible</div>
                      )
                    )}
                  </div>
                )}
              </div>
              
              <Link 
                href="/organizers" 
                className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Organisateurs
              </Link>
              
              <Link 
                href="/about" 
                className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                À propos
              </Link>
              <Link 
                href="/princing"
                className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Nos tarifs
              </Link>
              
              <Link 
                href="/contact" 
                className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Contact
              </Link>
              
              <div className="pt-2 border-t border-gray-100">
                {userActions()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}