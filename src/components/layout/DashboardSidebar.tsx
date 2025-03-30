// components/layout/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCalendarAlt, FaChartLine, FaUsers, FaCreditCard, FaCog, FaPlus } from 'react-icons/fa';

export default function DashboardSidebar() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (status === 'loading' || !session) {
    return (
      <aside className="bg-white border-r border-gray-200 w-64 min-h-screen sticky top-0 pt-4">
        <div className="animate-pulse p-6">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </aside>
    );
  }

  if (!session || (session.user.role !== 'organizer' && session.user.role !== 'admin')) {
    return null;
  }

  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen sticky top-0 pt-4">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Tableau de bord</h2>
        <p className="text-sm text-gray-600">Gérez vos événements</p>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          <Link
            href="/dashboard/my-events"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/my-events') || pathname.startsWith('/dashboard/event/')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaCalendarAlt className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/my-events') || pathname.startsWith('/dashboard/event/')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Mes événements
          </Link>
          
          <Link
            href="/dashboard/create-event"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/create-event')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaPlus className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/create-event')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Créer un événement
          </Link>
          
          <Link
            href="/dashboard/analytics"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/analytics') || pathname.startsWith('/dashboard/analytics/')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaChartLine className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/analytics') || pathname.startsWith('/dashboard/analytics/')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Analytiques
          </Link>
          
          <Link
            href="/dashboard/registrations"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/registrations')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaUsers className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/registrations')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Inscriptions
          </Link>
          
          <Link
            href="/dashboard/payments"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/payments')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaCreditCard className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/payments')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Paiements
          </Link>
          
          <Link
            href="/dashboard/settings"
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard/settings')
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <FaCog className={`mr-3 h-5 w-5 ${
              isActive('/dashboard/settings')
                ? 'text-white'
                : 'text-gray-500 group-hover:text-primary'
            }`} />
            Paramètres
          </Link>
        </div>
      </nav>
    </aside>
  );
}