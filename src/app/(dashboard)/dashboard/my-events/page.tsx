'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { eventsAPI, analyticsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';

import PageHeader from '@/components/dashboard/my-events/PageHeader';
import StatisticsCards from '@/components/dashboard/my-events/StatisticsCards';
import CategoryOverview from '@/components/dashboard/my-events/CategoryOverview';
import EventsList from '@/components/dashboard/my-events/EventsList';
import ErrorAlert from '@/components/ui/ErrorAlert';

export default function MyEventsPage() {
  // État et hooks
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États pour stocker les données
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les valeurs des paramètres de recherche
  const currentStatus = searchParams.get('status') || 'all';
  const currentPage = searchParams.get('page') || '1';

  // Effet pour charger les données
  useEffect(() => {
    // Ne charger les données que si l'utilisateur est connecté
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Obtenir tous les événements de l'organisateur
          const eventsResponse = await eventsAPI.getEvents({
            organizer: session.user.id,
            status: currentStatus !== 'all' ? currentStatus : undefined,
            page: currentPage,
            limit: 20
          });
          
          // Obtenir le résumé des événements pour les statistiques
          const dashboardResponse = await analyticsAPI.getDashboardSummary({
            organizer_id: session.user.id
          });
          
          console.log('Données analytiques reçues:', dashboardResponse.data);
          console.log('Nombre d\'événements récupérés:', eventsResponse.data.results?.length);
          
          setEvents(eventsResponse.data.results || []);
          setTotalEvents(eventsResponse.data.count || 0);
          setAnalyticsData(dashboardResponse.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setError('Une erreur est survenue lors du chargement des données.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [session, sessionStatus, currentStatus, currentPage]);

  // Fonction pour naviguer entre les pages
  const navigateToPage = (page) => {
    const params = new URLSearchParams();
    if (currentStatus !== 'all') {
      params.set('status', currentStatus);
    }
    params.set('page', page);
    router.push(`/dashboard/my-events?${params.toString()}`);
  };

  // Si en cours de chargement de la session, afficher un spinner
  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-primary h-12 w-12" />
        <span className="ml-3 text-lg text-gray-600">Chargement de la session...</span>
      </div>
    );
  }

  // Extraire les statistiques pour les passer aux sous-composants
  const stats = analyticsData ? {
    totalEvents: analyticsData.event_summary?.total_events || 0,
    upcomingEvents: analyticsData.event_summary?.upcoming_events || 0,
    ongoingEvents: analyticsData.event_summary?.ongoing_events || 0,
    completedEvents: analyticsData.event_summary?.completed_events || 0,
    totalRevenue: analyticsData.revenue_summary?.total_revenue || 0,
    totalRegistrations: analyticsData.registration_summary?.summary?.total_registrations || 0,
    conversionRate: analyticsData.registration_summary?.summary?.conversion_rate || 0,
    avgFillRate: analyticsData.event_summary?.avg_fill_rate || 0,
    paymentCount: analyticsData.revenue_summary?.payment_count || 0,
    avgTransaction: analyticsData.revenue_summary?.avg_transaction || 0,
    paymentMethods: analyticsData.revenue_summary?.revenue_by_method || [],
    registrationTypes: analyticsData.registration_summary?.registration_types || [],
    categoryData: analyticsData.event_summary?.categories || []
  } : null;

  return (
    <div className="p-6">
      <PageHeader />
      
      {/* Afficher une erreur si nécessaire */}
      {error && <ErrorAlert message={error} />}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-primary h-12 w-12 mb-4" />
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Statistiques et liste d'événements */}
          {stats && <StatisticsCards stats={stats} />}
          
          {/* Répartition par catégorie */}
          {stats && stats.categoryData && stats.categoryData.length > 0 && (
            <CategoryOverview 
              categoryData={stats.categoryData} 
              totalEvents={stats.totalEvents} 
            />
          )}
          
          {/* Liste des événements */}
          <EventsList 
            events={events} 
            totalEvents={totalEvents} 
            currentStatus={currentStatus} 
            currentPage={currentPage}
            analyticsData={analyticsData}
            navigateToPage={navigateToPage}
          />
        </>
      )}
    </div>
  );
}