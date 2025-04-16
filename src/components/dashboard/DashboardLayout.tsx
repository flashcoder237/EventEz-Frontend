'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart2, 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Home,
  PlusCircle,
  Ticket,
  MessageSquare,
  User,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import BecomeOrganizerCard from './BecomeOrganizerCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string; // Added title prop for better accessibility
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Determine if user is an organizer
  const isOrganizer = session?.user?.role === 'organizer' || session?.user?.role === 'admin';
  console.log(session?.user?.role);
  
  
  // Navigation items for all users
  const commonNavigation = [
    { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home },
    { name: 'Mes inscriptions', href: '/dashboard/registrations', icon: Ticket },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  ];
  
  // Navigation items only for organizers
  const organizerNavigation = [
    { name: 'Mes événements', href: '/dashboard/events', icon: Calendar },
    { name: 'Créer un événement', href: '/dashboard/events/create', icon: PlusCircle, organizerOnly: true },
    { name: 'Paiements', href: '/dashboard/payments', icon: CreditCard, organizerOnly: true },
    { name: 'Statistiques', href: '/dashboard/analytics', icon: BarChart2, organizerOnly: true },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, organizerOnly: true, openInNewTab: true },
  ];
  
  // Combine navigation items based on user role
  const navigation = isOrganizer 
    ? [...commonNavigation, ...organizerNavigation]
    : [...commonNavigation, { name: 'Mes événements', href: '/dashboard/events', icon: Calendar }];
  
  const secondaryNavigation = [
    { name: 'Profil', href: '/dashboard/profile', icon: User },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="relative flex flex-col w-full max-w-xs pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 p-1 -mr-12">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Fermer le menu</span>
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-center px-4">
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/logo.png" alt="EventEz Logo" width={120} height={40} />
            </Link>
          </div>
          <div className="flex-1 h-0 mt-5 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                
                // Check if this is an organizer-only item and user is not an organizer
                const isRestricted = item.organizerOnly && !isOrganizer;
                
                if (isRestricted) {
                  return (
                    <div
                      key={item.name}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-400 cursor-not-allowed"
                    >
                      <Lock className="mr-4 h-6 w-6 text-gray-400" />
                      <span>{item.name}</span>
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        Organisateur
                      </span>
                    </div>
                  );
                }
                
                // Check if item should open in a new tab
                if (item.openInNewTab) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              
              {!isOrganizer && (
                <div className="mt-6 px-2">
                  <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Certaines fonctionnalités sont réservées aux organisateurs.
                        </p>
                        <Link
                          href="/dashboard/become-organizer"
                          className="mt-2 inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600"
                        >
                          Devenir organisateur
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
            <div className="pt-6 mt-6">
              <div className="px-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                >
                  <LogOut className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-white border-b">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo.png" alt="EventEz Logo" width={120} height={40} />
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                
                // Check if this is an organizer-only item and user is not an organizer
                const isRestricted = item.organizerOnly && !isOrganizer;
                
                if (isRestricted) {
                  return (
                    <div
                      key={item.name}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                    >
                      <Lock className="mr-3 h-6 w-6 text-gray-400" />
                      <span>{item.name}</span>
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        Organisateur
                      </span>
                    </div>
                  );
                }
                
                // Check if item should open in a new tab
                if (item.openInNewTab) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              
              {!isOrganizer && (
                <div className="mt-6">
                  <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Certaines fonctionnalités sont réservées aux organisateurs.
                        </p>
                        <Link
                          href="/dashboard/become-organizer"
                          className="mt-2 inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600"
                        >
                          Devenir organisateur
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
            <div className="pt-2 border-t border-gray-200">
              <div className="px-3 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                >
                  <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-3 text-lg font-medium text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center">
            {session?.user && (
              <div className="flex items-center">
                <button className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none">
                  <Bell className="w-6 h-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="hidden md:inline-flex text-sm font-medium text-gray-700 mr-2">
                      {session.user.name || session.user.email}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <main className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}