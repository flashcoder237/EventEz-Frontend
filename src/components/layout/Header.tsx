// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { FaUser, FaSignOutAlt, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">EventEz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Accueil
            </Link>
            <Link 
              href="/events"
              className={`text-sm font-medium ${isActive('/events') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Événements
            </Link>
            <Link 
              href="/events/categories"
              className={`text-sm font-medium ${isActive('/events/categories') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Catégories
            </Link>
            
            {session?.user.role === 'organizer' && (
              <Link 
                href="/dashboard/my-events"
                className={`text-sm font-medium ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Tableau de bord
              </Link>
            )}
            
            {session?.user.role === 'admin' && (
              <Link 
                href="/admin/dashboard"
                className={`text-sm font-medium ${pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Administration
              </Link>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {session.user.role === 'organizer' && (
                  <Button href="/dashboard/create-event" variant="default" size="sm">
                    Créer un événement
                  </Button>
                )}
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <FaBell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                  
                  {showNotifications && <NotificationDropdown />}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">{session.user.name || session.user.email}</div>
                  <Link href="/user-profile">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FaUser className="h-4 w-4" />
                    </div>
                  </Link>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost">
                  Connexion
                </Button>
                <Button href="/register" variant="default">
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/"
                className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/events"
                className={`text-sm font-medium ${isActive('/events') ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Événements
              </Link>
              <Link 
                href="/events/categories"
                className={`text-sm font-medium ${isActive('/events/categories') ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              
              {session?.user.role === 'organizer' && (
                <>
                  <Link 
                    href="/dashboard/my-events"
                    className={`text-sm font-medium ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-gray-700'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Link 
                    href="/dashboard/create-event"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Créer un événement
                  </Link>
                </>
              )}
              
              {session?.user.role === 'admin' && (
                <Link 
                  href="/admin/dashboard"
                  className={`text-sm font-medium ${pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
              )}
              
              {session ? (
                <>
                  <Link 
                    href="/user-profile"
                    className="text-sm font-medium text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Link 
                    href="/notifications"
                    className="text-sm font-medium text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  <button
                    className="text-sm font-medium text-gray-700 flex items-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/login"
                    className="text-sm font-medium text-center px-4 py-2 border border-gray-300 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/register"
                    className="text-sm font-medium text-center px-4 py-2 bg-primary text-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}