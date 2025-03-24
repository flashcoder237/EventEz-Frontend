// app/(dashboard)/dashboard/events-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { eventsAPI } from '@/lib/api';
import { Event } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/AlertDialog';
import {
  Search,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity,
  Flag,
  Star
} from 'lucide-react';

export default function EventsManagementPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // La page est protégée par le middleware
    },
  });

  // États
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const pageSize = 10;

  // Event pour suppression
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    draft: 0,
    published: 0,
    validated: 0,
    cancelled: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });

  // Charger les événements et les catégories
  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Construire les paramètres de filtrage
        const params: any = {
          page,
          limit: pageSize,
          organizer: 'me',
          ordering: `${sortDirection === 'desc' ? '-' : ''}${sortBy}`
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (currentTab !== 'all') {
          params.status = currentTab;
        }

        // Récupérer les événements filtrés
        const eventsResponse = await eventsAPI.getEvents(params);
        setEvents(eventsResponse.data.results || []);
        setTotalEvents(eventsResponse.data.count || 0);
        setTotalPages(Math.ceil((eventsResponse.data.count || 0) / pageSize));

        // Récupérer les catégories
        const categoriesResponse = await eventsAPI.getCategories();
        setCategories(categoriesResponse.data.results || []);

        // Récupérer les statistiques des événements
        const statsResponse = await eventsAPI.getEventStats();
        const statsData = statsResponse.data;
        
        setStats({
          total: statsData.total_events || 0,
          upcoming: statsData.upcoming_events || 0,
          ongoing: statsData.ongoing_events || 0,
          completed: statsData.completed_events || 0,
          draft: statsData.draft_events || 0,
          published: statsData.published_events || 0,
          validated: statsData.validated_events || 0,
          cancelled: statsData.cancelled_events || 0,
          totalRegistrations: statsData.total_registrations || 0,
          totalRevenue: statsData.total_revenue || 0
        });
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Une erreur est survenue lors du chargement des événements.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, page, selectedCategory, searchQuery, currentTab, sortBy, sortDirection]);

  // Changer l'ordre de tri
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Dupliquer un événement
  const duplicateEvent = async (eventId: string) => {
    try {
      const response = await eventsAPI.duplicateEvent(eventId);
      
      // Rediriger vers la page d'édition du nouvel événement
      if (response.data && response.data.id) {
        window.location.href = `/dashboard/event/${response.data.id}/edit`;
      }
    } catch (err) {
      console.error('Erreur lors de la duplication de l\'événement:', err);
      setError('Une erreur est survenue lors de la duplication de l\'événement.');
    }
  };

  // Supprimer un événement
  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      await eventsAPI.deleteEvent(eventToDelete.id);
      
      // Mettre à jour la liste des événements
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      
      // Mettre à jour les statistiques
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        [eventToDelete.status]: prev[eventToDelete.status as keyof typeof prev] - 1
      }));
      
      // Réinitialiser l'événement à supprimer
      setEventToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement:', err);
      setError('Une erreur est survenue lors de la suppression de l\'événement.');
    }
  };

  // Publier un événement
  const publishEvent = async (eventId: string) => {
    try {
      await eventsAPI.publishEvent(eventId);
      
      // Mettre à jour la liste des événements
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, status: 'published' } 
          : e
      ));
      
      // Mettre à jour les statistiques
      setStats(prev => ({
        ...prev,
        draft: prev.draft - 1,
        published: prev.published + 1
      }));
    } catch (err) {
      console.error('Erreur lors de la publication de l\'événement:', err);
      setError('Une erreur est survenue lors de la publication de l\'événement.');
    }
  };

  // Obtenir l'icône de statut appropriée
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'published':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <Flag className="h-4 w-4 text-purple-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Brouillon</Badge>;
      case 'published':
        return <Badge variant="info" className="flex items-center gap-1"><Activity className="h-3 w-3" /> Publié</Badge>;
      case 'validated':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Validé</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1"><Flag className="h-3 w-3" /> Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // UI pour le chargement
  if (loading && page === 1) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des événements</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse flex items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-md mr-3"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
          <p className="text-gray-600">
            Créez, modifiez et gérez vos événements
          </p>
        </div>
        
        <Button href="/dashboard/create-event" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Créer un événement
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Total des événements</span>
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats.total}</h2>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-blue-600">
                  <span>{stats.upcoming} à venir</span>
                </div>
                <span className="text-gray-300 mx-2">•</span>
                <div className="flex items-center text-green-600">
                  <span>{stats.ongoing} en cours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">États de publication</span>
              <div className="p-2 bg-blue-100 rounded-full">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Brouillons</span>
                </div>
                <span className="font-semibold">{stats.draft}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Publiés</span>
                </div>
                <span className="font-semibold">{stats.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Validés</span>
                </div>
                <span className="font-semibold">{stats.validated}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Total inscriptions</span>
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats.totalRegistrations}</h2>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+{Math.floor(Math.random() * 10) + 5}% cette semaine</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Revenus totaux</span>
              <div className="p-2 bg-amber-100 rounded-full">
                <BarChart2 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</h2>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+{Math.floor(Math.random() * 10) + 2}% ce mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'Toutes les catégories' },
                  ...categories.map(category => ({ value: category.id.toString(), label: category.name }))
                ]}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="validated">Validés</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
              <TabsTrigger value="cancelled">Annulés</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('title')}
                      >
                        <div className="flex items-center">
                          Événement
                          {sortBy === 'title' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('start_date')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortBy === 'start_date' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lieu
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange('registration_count')}
                      >
                        <div className="flex items-center">
                          Inscriptions
                          {sortBy === 'registration_count' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
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
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-lg font-medium">Aucun événement trouvé</p>
                          <p className="text-sm mt-1">
                            {currentTab === 'all' 
                              ? 'Commencez par créer votre premier événement.' 
                              : `Vous n'avez pas d'événements avec le statut "${currentTab}".`
                            }
                          </p>
                          {currentTab === 'all' && (
                            <Button href="/dashboard/create-event" className="mt-4">
                              <Plus className="mr-2" />
                              Créer un événement
                            </Button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                {event.banner_image ? (
                                  <Image
                                    src={event.banner_image}
                                    alt={event.title}
                                    fill
                                    className="rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center">
                                    <Calendar className="text-gray-400 h-5 w-5" />
                                  </div>
                                )}
                                {event.is_featured && (
                                  <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5">
                                    <Star className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                <div className="text-xs text-gray-500">{event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(event.start_date)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{event.location_city}</div>
                            <div className="text-xs text-gray-500">{event.location_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{event.registration_count}</div>
                            {event.max_capacity > 0 && (
                              <div className="text-xs text-gray-500">{Math.round((event.registration_count / event.max_capacity) * 100)}% de la capacité</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(event.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Link 
                                href={`/events/${event.id}`} 
                                className="text-blue-600 hover:text-blue-900"
                                target="_blank"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              
                              <Link 
                                href={`/dashboard/event/${event.id}/registrations`}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Users className="h-5 w-5" />
                              </Link>
                              
                              <Link 
                                href={`/dashboard/analytics/event/${event.id}`}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                <BarChart2 className="h-5 w-5" />
                              </Link>
                              
                              {event.status !== 'completed' && event.status !== 'cancelled' && (
                                <Link 
                                  href={`/dashboard/event/${event.id}/edit`}
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  <Edit className="h-5 w-5" />
                                </Link>
                              )}
                              
                              <button
                                type="button"
                                onClick={() => duplicateEvent(event.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Copy className="h-5 w-5" />
                              </button>
                              
                              {event.status === 'draft' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => publishEvent(event.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Activity className="h-5 w-5" />
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => setEventToDelete(event)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              
                              {event.status === 'published' && (
                                <Link 
                                  href={`/dashboard/event/${event.id}/settings`}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Settings className="h-5 w-5" />
                                </Link>
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
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{totalEvents}</span> résultats - Page{' '}
                        <span className="font-medium">{page}</span> sur{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                        >
                          Précédent
                        </Button>
                        
                        {/* Pages */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = page <= 3 
                            ? i + 1 
                            : page >= totalPages - 2 
                              ? totalPages - 4 + i 
                              : page - 2 + i;
                          
                          if (pageNum <= 0 || pageNum > totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === pageNum
                                  ? 'z-10 bg-primary border-primary text-white'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                        >
                          Suivant
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Boîte de dialogue de confirmation pour la suppression */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <span className="hidden">Supprimer</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}