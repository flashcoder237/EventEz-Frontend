'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Calendar, 
  BarChart, 
  Users, 
  CreditCard, 
  Settings, 
  PlusCircle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// Définition du type de menu item
type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPaths?: string[];
};

// Fonction utilitaire pour combiner des classes conditionnelles
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fermer la sidebar mobile quand le chemin change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Définition des items du menu
  const menuItems: MenuItem[] = [
    {
      href: '/dashboard',
      label: 'Mes événements',
      icon: <Calendar className="h-5 w-5" />,
      matchPaths: ['/dashboard/event/']
    },
    {
      href: '/dashboard/create-event',
      label: 'Créer un événement',
      icon: <PlusCircle className="h-5 w-5" />
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytiques',
      icon: <BarChart className="h-5 w-5" />,
      matchPaths: ['/dashboard/analytics/']
    },
    {
      href: '/dashboard/registrations',
      label: 'Inscriptions',
      icon: <Users className="h-5 w-5" />
    },
    {
      href: '/dashboard/payments',
      label: 'Paiements',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      href: '/dashboard/settings',
      label: 'Paramètres',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  // Vérification si un menu est actif
  const isActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.matchPaths) {
      return item.matchPaths.some(path => pathname.startsWith(path));
    }
    return false;
  };

  // État de chargement
  if (status === 'loading') {
    return <SidebarSkeleton />;
  }

  // Vérification des permissions
  if (!session || (session.user?.role !== 'organizer' && session.user?.role !== 'admin')) {
    return null;
  }

  // Sidebar version desktop - sticky, toujours visible
  const DesktopSidebar = (
    <aside className="hidden md:block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 h-screen sticky top-0 overflow-y-auto">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tableau de bord</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Gérez vos événements</p>
      </div>
      
      <SidebarContent isActive={isActive} menuItems={menuItems} />

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Version 2.0</p>
          <p>{session.user?.name || 'Utilisateur'}</p>
        </div>
      </div>
    </aside>
  );

  // Bouton flottant pour mobile - toujours visible
  const MobileMenuButton = (
    <button 
      onClick={() => setIsMobileSidebarOpen(true)}
      className="md:hidden fixed z-50 bottom-4 right-4 p-3 bg-violet text-white rounded-full shadow-lg"
      aria-label="Ouvrir le menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );

  // Sidebar pour mobile - flottante
  const MobileSidebar = (
    <>
      {isMobileSidebarOpen && (
        <>
          {/* Overlay pour fermer la sidebar */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar flottante */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-r-2xl overflow-y-auto md:hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tableau de bord</h2>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <SidebarContent isActive={isActive} menuItems={menuItems} />

            <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Connecté en tant que</p>
                <p className="font-medium">{session.user?.name || 'Utilisateur'}</p>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );

  // Menu de navigation flottant pour mobile
  const MobileFloatingNav = (
    <div className="fixed bottom-0 left-0 right-0 flex md:hidden justify-evenly bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-30 py-1">
      {menuItems.slice(0, 5).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1",
            isActive(item) 
              ? "text-violet"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          <span className="p-1 rounded-full">
            {React.cloneElement(item.icon as React.ReactElement, {
              className: cn(
                "h-5 w-5",
                isActive(item) ? "text-violet" : "text-gray-500 dark:text-gray-400"
              )
            })}
          </span>
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileFloatingNav}
      {MobileMenuButton}
      {MobileSidebar}
    </>
  );
}

// Composant réutilisable pour le contenu de la sidebar
function SidebarContent({ isActive, menuItems }) {
  return (
    <nav className="mt-4 px-4">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                isActive(item) 
                  ? "bg-violet text-white" 
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center">
                <span className={cn(
                  "mr-3",
                  isActive(item) ? "text-white" : "text-gray-500 group-hover:text-violet dark:text-gray-400"
                )}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive(item) && (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Composant pour l'état de chargement
function SidebarSkeleton() {
  return (
    <aside className="hidden md:block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
      </div>
      <div className="mt-6 px-3">
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center p-2">
              <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 mr-3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}