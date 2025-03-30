'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { registrationsAPI, eventsAPI, usersAPI } from '@/lib/api';
import { Registration, Event } from '@/types';

import DashboardHeader from '@/components/dashboard/registration/DashboardHeader';
import SearchFilters from '@/components/dashboard/registration/SearchFilters';
import RegistrationsTable from '@/components/dashboard/registration/RegistrationsTable';
import RegistrationStats from '@/components/dashboard/registration/RegistrationStats';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function RegistrationsDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
  router.push(`/login?redirect=${returnUrl}`);
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
                const userInfo = userResponse.data.results[0] || null;
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
  }, [status, session, page, selectedEvent, selectedStatus, searchQuery]);
  
  // Filtrer les inscriptions par statut
  const getFilteredRegistrations = () => {
    if (currentTab === 'all') return registrations;
    return registrations.filter(reg => reg.status === currentTab);
  };

  // Exporter les inscriptions
  const exportRegistrations = async (format: 'csv' | 'excel') => {
    setExportLoading(true);

    try {
      const params: any = {
        format,
        registrations: selectedRegistrations.length > 0 ? selectedRegistrations : undefined,
        event: selectedEvent || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined
      };

      const response = await registrationsAPI.exportRegistrations(params);
      
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

  // Actions groupées
  const bulkActions = {
    sendEmailToSelected: () => {
      if (selectedRegistrations.length === 0) {
        setError('Veuillez sélectionner au moins une inscription.');
        return;
      }
      const ids = selectedRegistrations.join(',');
      window.location.href = `/dashboard/registrations/send-email?ids=${ids}`;
    },

    markAsCheckedIn: async () => {
      if (selectedRegistrations.length === 0) {
        setError('Veuillez sélectionner au moins une inscription.');
        return;
      }
  
      setLoading(true);
      
      try {
        await registrationsAPI.bulkCheckIn(selectedRegistrations);
        
        setRegistrations(prevRegistrations => 
          prevRegistrations.map(reg => 
            selectedRegistrations.includes(reg.id) 
              ? { ...reg, is_checked_in: true, checked_in_at: new Date().toISOString() } 
              : reg
          )
        );
        
        setSelectedRegistrations([]);
      } catch (err) {
        console.error('Erreur lors du check-in:', err);
        setError('Une erreur est survenue lors du marquage des inscriptions comme présentes.');
      } finally {
        setLoading(false);
      }
    },

    generateTicketsForSelected: async () => {
      if (selectedRegistrations.length === 0) {
        setError('Veuillez sélectionner au moins une inscription.');
        return;
      }
  
      setLoading(true);
      
      try {
        await registrationsAPI.bulkGenerateTickets(selectedRegistrations);
        setSelectedRegistrations([]);
      } catch (err) {
        console.error('Erreur lors de la génération des billets:', err);
        setError('Une erreur est survenue lors de la génération des billets.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Gérer la sélection
  const selectionHandlers = {
    toggleSelectRegistration: (id: string) => {
      setSelectedRegistrations(prev => 
        prev.includes(id) 
          ? prev.filter(regId => regId !== id) 
          : [...prev, id]
      );
    },

    toggleSelectAll: () => {
      if (selectedRegistrations.length === getFilteredRegistrations().length) {
        setSelectedRegistrations([]);
      } else {
        setSelectedRegistrations(getFilteredRegistrations().map(reg => reg.id));
      }
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
      <DashboardHeader 
        exportRegistrations={exportRegistrations} 
        exportLoading={exportLoading} 
      />
      
      {error && <ErrorAlert message={error} />}
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <SearchFilters 
            events={events}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                <span>Toutes</span>
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                <span>Confirmées</span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                <span>En attente</span>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <span>Annulées</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={currentTab}>
              <RegistrationsTable 
                filteredRegistrations={getFilteredRegistrations()}
                selectedRegistrations={selectedRegistrations}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                totalRegistrations={totalRegistrations}
                bulkActions={bulkActions}
                selectionHandlers={selectionHandlers}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <RegistrationStats registrations={registrations} totalRegistrations={totalRegistrations} />
    </div>
  );
}