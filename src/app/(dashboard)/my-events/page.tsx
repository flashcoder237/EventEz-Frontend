// app/(dashboard)/dashboard/my-events/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { FaPlus, FaCalendarAlt, FaEye, FaUsers, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';
import { eventsAPI, analyticsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// Type pour les paramètres de recherche
interface SearchParams {
  status?: string;
  page?: string;
}

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getOrganizerEventsData(organizerId: string, searchParams: SearchParams) {
  try {
    // Obtenir tous les événements de l'organisateur
    const eventsResponse = await eventsAPI.getEvents({
      organizer: organizerId,
      status: searchParams.status || undefined,
      page: searchParams.page || '1',
      limit: 8
    });
    
    // Obtenir le résumé des événements pour les statistiques
    const dashboardResponse = await analyticsAPI.getDashboardSummary({
      organizer_id: organizerId
    });

    return {
      events: eventsResponse.data.results || [],
      totalEvents: eventsResponse.data.count || 0,
      analyticsData: dashboardResponse.data || null
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return {
      events: [],
      totalEvents: 0,
      analyticsData: null
    };
  }
}

export default async function MyEventsPage({ searchParams }: { searchParams: SearchParams }) {
  // Vérifier si l'utilisateur est connecté et est un organisateur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?redirect=/dashboard/my-events');
  }
  
  if (session.user.role !== 'organizer') {
    redirect('/');
  }
  
  const { events, totalEvents, analyticsData } = await getOrganizerEventsData(
    session.user.id as string,
    searchParams
  );
  
  // Statistiques de base
  const stats = {
    totalEvents: analyticsData?.event_summary?.total_events || 0,
    upcomingEvents: analyticsData?.event_summary?.upcoming_events || 0,
    ongoingEvents: analyticsData?.event_summary?.ongoing_events || 0,
    completedEvents: analyticsData?.event_summary?.completed_events || 0,
    totalRevenue: analyticsData?.revenue_summary?.total_revenue || 0,
    totalRegistrations: analyticsData?.registration_summary?.summary?.total_registrations || 0
  };
  
  // Statut par défaut sélectionné
  const currentStatus = searchParams.status || 'all';
  
  return (
    <DashboardLayout>
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
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">Événements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalEvents}</div>
              <div className="mt-2 flex text-sm text-gray-600 space-x-4">
                <div><span className="font-medium text-blue-600">{stats.upcomingEvents}</span> à venir</div>
                <div><span className="font-medium text-green-600">{stats.ongoingEvents}</span> en cours</div>
                <div><span className="font-medium text-gray-600">{stats.completedEvents}</span> terminés</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">Inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalRegistrations}</div>
              <div className="mt-2 text-sm text-gray-600">
                Total des inscriptions à tous vos événements
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalRevenue.toLocaleString()} XAF</div>
              <div className="mt-2 text-sm text-gray-600">
                Total des revenus générés par vos événements
              </div>
            </CardContent>
          </Card>
        </div>
        
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
              <Suspense fallback={<div className="p-4">Chargement...</div>}>
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
                        events.map((event) => (
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
                              <div className="text-sm text-gray-900">{event.registration_count}</div>
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalEvents > 8 && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-center">
                      <div className="relative z-0 inline-flex shadow-sm rounded-md">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!searchParams.page || searchParams.page === '1'}
                          href={`?${new URLSearchParams({
                            ...(searchParams.status ? { status: searchParams.status } : {}),
                            page: String(Number(searchParams.page || 1) - 1)
                          }).toString()}`}
                        >
                          Précédent
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={totalEvents <= Number(searchParams.page || 1) * 8}
                          href={`?${new URLSearchParams({
                            ...(searchParams.status ? { status: searchParams.status } : {}),
                            page: String(Number(searchParams.page || 1) + 1)
                          }).toString()}`}
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}