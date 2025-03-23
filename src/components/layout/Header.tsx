// components/layout/Header.tsx
'use client';

// components/layout/Header.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Ne rien faire ici, c'est normal pour les visiteurs non authentifiés
    },
  });
  const canAccessDashboard = session?.user?.role === 'organizer' || session?.user?.role === 'admin';
  const userActions = () => {
    if (status === 'loading') {
      return (
        <div className="animate-pulse h-10 w-20 bg-gray-200 rounded"></div>
      );
    }
    
    if (session && session.user) {
      return (
        <div className="flex items-center space-x-4">
          {canAccessDashboard && (
              <Link href="/dashboard/my-events" className="text-violet-600 hover:text-violet-800 font-medium transition-colors">
                Tableau de bord
              </Link>
            )}
            
          <Button onClick={() => signOut()} className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0">
            Déconnexion
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
          Connexion
        </Link>
        <Button href="/register" className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0">
          S'inscrire
        </Button>
      </div>
    );
  };
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-36 mr-2">
              <Image 
                src="/images/logo.png" 
                alt="EventEz" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            {/* Utiliser cette alternative si vous n'avez pas d'image de logo */}
            {/* <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">EventEz</span> */}
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
              Événements
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-violet-600 font-medium transition-colors">
                Catégories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-1">
                  <Link href="/events/categories/1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                    Concerts
                  </Link>
                  <Link href="/events/categories/2" className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                    Conférences
                  </Link>
                  <Link href="/events/categories/3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                    Expositions
                  </Link>
                  <Link href="/events/categories/4" className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                    Ateliers
                  </Link>
                  <Link href="/events/categories" className="block px-4 py-2 text-sm font-medium text-violet-600 border-t border-gray-100">
                    Toutes les catégories
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/organizers" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
              Organisateurs
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Actions - Desktop */}
          {userActions()}
          
          {/* Menu button - Mobile */}
          <button 
            className="md:hidden text-gray-700 hover:text-violet-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link 
              href="/events" 
              className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Événements
            </Link>
            <div>
              <button className="flex items-center py-2 text-gray-700 font-medium w-full justify-between">
                Catégories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="pl-4 space-y-2 mt-1">
                <Link 
                  href="/events/categories/1" 
                  className="block py-1 text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Concerts
                </Link>
                <Link 
                  href="/events/categories/2" 
                  className="block py-1 text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Conférences
                </Link>
                <Link 
                  href="/events/categories/3" 
                  className="block py-1 text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Expositions
                </Link>
                <Link 
                  href="/events/categories/4" 
                  className="block py-1 text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ateliers
                </Link>
              </div>
            </div>
            <Link 
              href="/organizers" 
              className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Organisateurs
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {userActions()}
          </div>
        </div>
      )}
    </header>
  );
}