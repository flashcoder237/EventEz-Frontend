'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { FaPlus, FaCalendarAlt, FaEye, FaUsers, FaEdit, FaTrash, FaChartBar, FaMoneyBillWave, FaTicketAlt, FaPercentage, FaSpinner } from 'react-icons/fa';
import { eventsAPI, analyticsAPI } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function MyEventsPage() {
  // État et hooks
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login?redirect=/dashboard/my-events');
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

  // Extraire les statistiques des données analytiques
  const stats = {
    totalEvents: analyticsData?.event_summary?.total_events || 0,
    upcomingEvents: analyticsData?.event_summary?.upcoming_events || 0,
    ongoingEvents: analyticsData?.event_summary?.ongoing_events || 0,
    completedEvents: analyticsData?.event_summary?.completed_events || 0,
    totalRevenue: analyticsData?.revenue_summary?.total_revenue || 0,
    totalRegistrations: analyticsData?.registration_summary?.summary?.total_registrations || 0,
    conversionRate: analyticsData?.registration_summary?.summary?.conversion_rate || 0,
    avgFillRate: analyticsData?.event_summary?.avg_fill_rate || 0,
    paymentCount: analyticsData?.revenue_summary?.payment_count || 0,
    avgTransaction: analyticsData?.revenue_summary?.avg_transaction || 0
  };
  
  // Extraire d'autres données des analytics
  const paymentMethods = analyticsData?.revenue_summary?.revenue_by_method || [];
  const registrationTypes = analyticsData?.registration_summary?.registration_types || [];
  const categoryData = analyticsData?.event_summary?.categories || [];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes événements</h1>
          <p className="text-gray-600">
            Gérez tous vos événements à partir de ce tableau de bord
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button href="/dashboard/create-event">
            <FaPlus className="mr-2" />
            Créer un événement
          </Button>
        </div>
      </div>
      
      {/* Afficher une erreur si nécessaire */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-primary h-12 w-12 mb-4" />
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  Événements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalEvents}</div>
                <div className="mt-2 flex flex-wrap text-sm text-gray-600 gap-y-1 gap-x-4">
                  <div><span className="font-medium text-blue-600">{stats.upcomingEvents}</span> à venir</div>
                  <div><span className="font-medium text-green-600">{stats.ongoingEvents}</span> en cours</div>
                  <div><span className="font-medium text-gray-600">{stats.completedEvents}</span> terminés</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Taux de remplissage moyen</div>
                  <div className="text-sm font-semibold text-gray-700">{stats.avgFillRate.toFixed(2)}%</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                  <FaUsers className="mr-2 text-blue-500" />
                  Inscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{stats.totalRegistrations}</div>
                <div className="mt-2 flex flex-wrap text-sm text-gray-600 gap-2">
                  {registrationTypes.map((type, index) => (
                    <Badge key={index} variant={type.registration_type === 'billetterie' ? 'info' : 'success'}>
                      {type.registration_type === 'billetterie' ? 'Billetterie' : 'Inscription'}: {type.count}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Taux de conversion</div>
                  <div className="text-sm font-semibold text-gray-700">{stats.conversionRate}%</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-500" />
                  Revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</div>
                <div className="mt-2 text-sm text-gray-600">
                  {stats.paymentCount} paiements au total
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Transaction moyenne</div>
                  <div className="text-sm font-semibold text-gray-700">{formatCurrency(stats.avgTransaction)}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                  <FaTicketAlt className="mr-2 text-amber-500" />
                  Répartition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {paymentMethods.slice(0, 3).map((method, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          method.payment_method === 'credit_card' ? 'bg-purple-500' :
                          method.payment_method === 'mtn_money' ? 'bg-green-500' :
                          method.payment_method === 'orange_money' ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-xs text-gray-600 capitalize">
                          {method.payment_method === 'credit_card' ? 'Carte de crédit' :
                           method.payment_method === 'mtn_money' ? 'MTN Money' :
                           method.payment_method === 'orange_money' ? 'Orange Money' :
                           method.payment_method === 'bank_transfer' ? 'Virement bancaire' :
                           method.payment_method}
                        </span>
                      </div>
                      <span className="text-xs font-medium">{method.percentage?.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs justify-center"
                    href="/dashboard/analytics"
                  >
                    <FaChartBar className="mr-2" /> Voir les analytiques détaillées
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Categories Overview Card */}
          {categoryData && categoryData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Répartition par catégorie</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{category.category__name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary" 
                        style={{ width: `${(category.count / stats.totalEvents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
         
          
          {/* Event List */}
          <div className="bg-white rounded-lg shadow-sm">
            <Tabs defaultValue={currentStatus} className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="inline-flex">
                  <TabsTrigger 
                    value="all" 
                    asChild
                  >
                    <Link href="/dashboard/my-events">Tous</Link>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="draft" 
                    asChild
                  >
                    <Link href="/dashboard/my-events?status=draft">Brouillons</Link>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="published"
                    asChild
                  >
                    <Link href="/dashboard/my-events?status=published">Publiés</Link>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="validated"
                    asChild
                  >
                    <Link href="/dashboard/my-events?status=validated">Validés</Link>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed"
                    asChild
                  >
                    <Link href="/dashboard/my-events?status=completed">Terminés</Link>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={currentStatus} className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscriptions
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <FaCalendarAlt className="text-gray-300 text-5xl mb-4" />
                              <p className="text-lg font-medium">Aucun événement trouvé</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {currentStatus === 'all' 
                                  ? 'Commencez par créer votre premier événement.' 
                                  : `Vous n'avez pas d'événements avec le statut "${currentStatus}".`
                                }
                              </p>
                              {currentStatus === 'all' && (
                                <Button href="/dashboard/create-event" className="mt-4">
                                  <FaPlus className="mr-2" />
                                  Créer un événement
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        events.map((event) => {
                          // Trouver les détails supplémentaires de l'événement dans les analytiques si disponibles
                          const eventDetails = analyticsData?.event_summary?.events_details?.find(e => e.id === event.id);
                          
                          return (
                            <tr key={event.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                                    <FaCalendarAlt />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-sm text-gray-500">
                                      {event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(event.start_date)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="text-sm text-gray-900">{event.registration_count}</div>
                                  {eventDetails && eventDetails.max_capacity > 0 && (
                                    <div className="flex items-center mt-1">
                                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div 
                                          className={`h-full ${
                                            eventDetails.fill_rate > 75 ? 'bg-green-500' :
                                            eventDetails.fill_rate > 25 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`}
                                          style={{ width: `${Math.min(100, eventDetails.fill_rate)}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500">{eventDetails.fill_rate.toFixed(1)}%</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    event.status === 'draft' ? 'outline' :
                                    event.status === 'published' ? 'default' :
                                    event.status === 'validated' ? 'success' :
                                    event.status === 'completed' ? 'secondary' :
                                    'destructive'
                                  }
                                >
                                  {event.status === 'draft' && 'Brouillon'}
                                  {event.status === 'published' && 'Publié'}
                                  {event.status === 'validated' && 'Validé'}
                                  {event.status === 'completed' && 'Terminé'}
                                  {event.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    href={`/events/${event.id}`}
                                    title="Voir"
                                  >
                                    <FaEye className="text-blue-600" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    href={`/dashboard/event/${event.id}/registrations`}
                                    title="Inscriptions"
                                  >
                                    <FaUsers className="text-green-600" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    href={`/dashboard/analytics/event/${event.id}`}
                                    title="Analytiques"
                                  >
                                    <FaChartBar className="text-purple-600" />
                                  </Button>
                                  
                                  {event.status !== 'completed' && event.status !== 'cancelled' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      href={`/dashboard/event/${event.id}/edit`}
                                      title="Modifier"
                                    >
                                      <FaEdit className="text-amber-600" />
                                    </Button>
                                  )}
                                  
                                  {event.status === 'draft' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Supprimer"
                                    >
                                      <FaTrash className="text-red-600" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalEvents > 20 && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-center">
                      <div className="relative z-0 inline-flex shadow-sm rounded-md">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === '1'}
                          onClick={() => navigateToPage(String(Number(currentPage) - 1))}
                        >
                          Précédent
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={totalEvents <= Number(currentPage) * 20}
                          onClick={() => navigateToPage(String(Number(currentPage) + 1))}
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}