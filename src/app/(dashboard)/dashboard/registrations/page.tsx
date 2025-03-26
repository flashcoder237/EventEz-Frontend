// app/(dashboard)/dashboard/registrations/page.tsx
'use client';

import { useState, useEffect,useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { registrationsAPI, eventsAPI,usersAPI } from '@/lib/api';
import { Registration, Event } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Search,
  Download,
  Filter,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  CheckSquare,
  XCircle,
  ClipboardList,
  Users
} from 'lucide-react';

export default function RegistrationsDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // La page est protégée par le middleware
    },
  });

  // États
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated" || !session) {
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        // Construire les paramètres de filtrage
        const params: any = {
          page,
          limit: pageSize,
        };
  
        if (selectedEvent) {
          params.event = selectedEvent;
        }
  
        if (selectedStatus) {
          params.status = selectedStatus;
        }
  
        if (searchQuery) {
          params.search = searchQuery;
        }
  
        // Récupérer les inscriptions filtrées
        const registrationsResponse = await registrationsAPI.getRegistrations(params);
        const registrations = registrationsResponse.data.results || [];
        const totalCount = registrationsResponse.data.count || 0;
  
        // Ajouter les informations des utilisateurs
        const enrichedRegistrations = await Promise.all(
          registrations.map(async (registration) => {
            if (registration.user) {
              try {
                const userResponse = await usersAPI.getUsers({ id: registration.user });
                const userInfo = userResponse.data.results[0] || null; // Prendre le premier utilisateur ou null
                                
                return { ...registration, userInfo };
              } catch (error) {
                console.error(`Erreur lors de la récupération de l'utilisateur ${registration.user}:`, error);
                return { ...registration, userInfo: null };
              }
            }
            return { ...registration, userInfo: null };
          })
        );
  
        // Mettre à jour l'état
        setRegistrations(enrichedRegistrations);
        setTotalRegistrations(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize));
  
        // Récupérer les événements de l'organisateur
        const eventsResponse = await eventsAPI.getMyEvents();
        setEvents(eventsResponse.data.results || []);
      } catch (err) {
        console.error("Erreur lors du chargement des inscriptions:", err);
        setError("Une erreur est survenue lors du chargement des inscriptions.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [status, session, page, selectedEvent, selectedStatus, searchQuery]); // Vérifie bien que tes dépendances sont optimisées
  
  // Filtrer les inscriptions par statut
  const getFilteredRegistrations = () => {
    if (currentTab === 'all') return registrations;
    return registrations.filter(reg => reg.status === currentTab);
  };

  // Exporter les inscriptions
  const exportRegistrations = async (format: 'csv' | 'excel') => {
    setExportLoading(true);

    try {
      // Construire les paramètres d'exportation
      const params: any = {
        format,
        registrations: selectedRegistrations.length > 0 ? selectedRegistrations : undefined,
        event: selectedEvent || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined
      };

      // Appeler l'API d'exportation
      const response = await registrationsAPI.exportRegistrations(params);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registrations-export-${new Date().toISOString().slice(0, 10)}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erreur lors de l\'exportation des inscriptions:', err);
      setError('Une erreur est survenue lors de l\'exportation des inscriptions.');
    } finally {
      setExportLoading(false);
    }
  };

  // Envoyer un email aux participants sélectionnés
  const sendEmailToSelected = () => {
    if (selectedRegistrations.length === 0) {
      setError('Veuillez sélectionner au moins une inscription.');
      return;
    }

    // Rediriger vers la page d'envoi d'email avec les IDs des participants
    const ids = selectedRegistrations.join(',');
    window.location.href = `/dashboard/registrations/send-email?ids=${ids}`;
  };

  // Marquer les inscriptions comme présentes
  const markAsCheckedIn = async () => {
    if (selectedRegistrations.length === 0) {
      setError('Veuillez sélectionner au moins une inscription.');
      return;
    }

    setLoading(true);
    
    try {
      await registrationsAPI.bulkCheckIn(selectedRegistrations);
      
      // Mise à jour de l'état local
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          selectedRegistrations.includes(reg.id) 
            ? { ...reg, is_checked_in: true, checked_in_at: new Date().toISOString() } 
            : reg
        )
      );
      
      // Réinitialiser la sélection
      setSelectedRegistrations([]);
    } catch (err) {
      console.error('Erreur lors du check-in:', err);
      setError('Une erreur est survenue lors du marquage des inscriptions comme présentes.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection d'une inscription
  const toggleSelectRegistration = (id: string) => {
    setSelectedRegistrations(prev => 
      prev.includes(id) 
        ? prev.filter(regId => regId !== id) 
        : [...prev, id]
    );
  };

  // Sélectionner toutes les inscriptions affichées
  const toggleSelectAll = () => {
    if (selectedRegistrations.length === getFilteredRegistrations().length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(getFilteredRegistrations().map(reg => reg.id));
    }
  };

  // Générer les billets pour les inscriptions sélectionnées
  const generateTicketsForSelected = async () => {
    if (selectedRegistrations.length === 0) {
      setError('Veuillez sélectionner au moins une inscription.');
      return;
    }

    setLoading(true);
    
    try {
      await registrationsAPI.bulkGenerateTickets(selectedRegistrations);
      
      // Notification de succès (à implémenter)
      // showNotification('Billets générés avec succès');
      
      // Réinitialiser la sélection
      setSelectedRegistrations([]);
    } catch (err) {
      console.error('Erreur lors de la génération des billets:', err);
      setError('Une erreur est survenue lors de la génération des billets.');
    } finally {
      setLoading(false);
    }
  };

  // Statut de badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmée</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'completed':
        return <Badge variant="default">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // UI pour le chargement
  if (loading && page === 1) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des inscriptions</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des inscriptions</h1>
          <p className="text-gray-600">
            Gérez les inscriptions et les participants à vos événements
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => exportRegistrations('csv')}
            disabled={exportLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => exportRegistrations('excel')}
            disabled={exportLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un participant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'Tous les événements' },
                  ...events.map(event => ({ value: event.id, label: event.title }))
                ]}
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full md:w-64"
              />
              
              <Select
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'confirmed', label: 'Confirmé' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'cancelled', label: 'Annulé' },
                  { value: 'completed', label: 'Terminé' }
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              {selectedRegistrations.length > 0 && (
                <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-700">
                    {selectedRegistrations.length} sélectionné(s)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="h-8" onClick={sendEmailToSelected}>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email
                    </Button>
                    <Button size="sm" variant="outline" className="h-8" onClick={markAsCheckedIn}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Marquer comme présent
                    </Button>
                    <Button size="sm" variant="outline" className="h-8" onClick={generateTicketsForSelected}>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Générer les billets
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            checked={
                              getFilteredRegistrations().length > 0 &&
                              selectedRegistrations.length === getFilteredRegistrations().length
                            }
                            onChange={toggleSelectAll}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Référence
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Événement
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Présence
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredRegistrations().length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                          <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-lg font-medium">Aucune inscription trouvée</p>
                          <p className="text-sm mt-1">
                            Essayez de modifier vos critères de recherche.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      getFilteredRegistrations().map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedRegistrations.includes(registration.id)}
                                onChange={() => toggleSelectRegistration(registration.id)}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.reference_code}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {registration.userInfo?.first_name} {registration.userInfo?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{registration.userInfo?.email}</div>
                        </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {registration.event_detail?.title || 'Événement inconnu'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {registration.registration_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(registration.created_at)}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            {getStatusBadge(registration.status)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            {registration.is_checked_in ? (
                              <Badge variant="success" className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" /> Présent
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center">
                                <XCircle className="h-3 w-3 mr-1" /> Non présent
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link 
                                href={`/dashboard/registrations/${registration.id}`} 
                                className="text-primary hover:text-primary-dark"
                              >
                                Détails
                              </Link>
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
                        <span className="font-medium">{totalRegistrations}</span> résultats - Page{' '}
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
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total des inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRegistrations}</div>
            <p className="text-sm text-gray-500 mt-1">Tous événements confondus</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Confirmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((registrations.filter(r => r.status === 'confirmed').length / registrations.length) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {registrations.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Nécessitent une action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {registrations.filter(r => r.is_checked_in).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((registrations.filter(r => r.is_checked_in).length / registrations.length) * 100).toFixed(1)}% de présence
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}