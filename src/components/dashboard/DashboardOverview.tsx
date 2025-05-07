'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { eventsAPI, registrationsAPI } from '@/lib/api';
import { Event, Registration } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardOverviewEnhanced() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsCount: 0,
    registrationsCount: 0,
    totalRevenue: 0,
    viewsCount: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const eventsResponse = await eventsAPI.getMyEvents();
        const events = eventsResponse.data || [];
        setRecentEvents(events.slice(0, 5)); // Show 5 recent events
        
        const registrationsResponse = await registrationsAPI.getMyRegistrations();
        const registrations = registrationsResponse.data || [];
        setRecentRegistrations(registrations.slice(0, 5)); // Show 5 recent registrations
        
        setStats({
          eventsCount: events.length,
          registrationsCount: registrations.length,
          totalRevenue: events.reduce((total, event) => total + (event.registration_count || 0) * 10, 0), // Example simplified
          viewsCount: events.reduce((total, event) => total + (event.view_count || 0), 0),
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const handleExport = () => {
    // Example export functionality: export stats as JSON file
    const dataStr = JSON.stringify(stats, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard-stats.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble sur vos évènements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue sur votre tableau de bord EventEz avec fonctionnalités étendues
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Download className="mr-2 h-5 w-5" />
          Exporter les statistiques
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mes événements
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.eventsCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/events" className="font-medium text-purple-700 hover:text-purple-900">
                Voir tous mes événements
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inscriptions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.registrationsCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/registrations" className="font-medium text-indigo-700 hover:text-indigo-900">
                Voir toutes mes inscriptions
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenus totaux
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalRevenue.toLocaleString()} XAF</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/payments" className="font-medium text-green-700 hover:text-green-900">
                Voir tous mes paiements
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vues totales
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.viewsCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/analytics" className="font-medium text-yellow-700 hover:text-yellow-900">
                Voir les statistiques détaillées
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Événements récents */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Événements récents</h3>
        <ul className="divide-y divide-gray-200">
          {recentEvents.map(event => (
            <li key={event.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 relative">
                  <Image
                    src={event.banner_image || '/images/defaults/default-event.png'}
                    alt={event.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-purple-600">
                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                  </h4>
                  <p className="text-xs text-gray-500">
                    {format(new Date(event.start_date), 'PPP', { locale: fr })}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Modifier
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
