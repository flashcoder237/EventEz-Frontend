// app/events/page.tsx
import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { eventsAPI, categoriesAPI } from '@/lib/api';
import SortSelect from '@/components/events/SortSelect';
import InfiniteScrollEvents from '@/components/events/InfiniteScrollEvents';
import { DateFilter } from '@/components/events/DateFilter';
import ClientSideFilterWrapper from '@/components/events/ClientSideFilterWrapper'

// Types pour les paramètres de recherche
interface SearchParams {
  search?: string;
  category?: string;
  event_type?: string;
  city?: string;
  ordering?: string;
  start_date?: string;
  end_date?: string;
}

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getEventsData(searchParams: SearchParams) {
  try {
    // Obtenir les événements avec les filtres
    const eventsResponse = await eventsAPI.getEvents({
      ...searchParams,
      status: 'validated',
      limit: 9,
      offset: 0
    });
    
    // Obtenir les catégories pour les filtres
    const categoriesResponse = await categoriesAPI.getCategories();

    return {
      events: eventsResponse.data.results || [],
      totalEvents: eventsResponse.data.count || 0,
      categories: categoriesResponse.data.results || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return {
      events: [],
      totalEvents: 0,
      categories: []
    };
  }
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  // Obtenir les données côté serveur
  const { events, totalEvents, categories } = await getEventsData(searchParams);
  
  // Options de tri
  const sortOptions = [
    { value: 'start_date', label: 'Par date (croissant)' },
    { value: '-start_date', label: 'Par date (décroissant)' },
    { value: 'title', label: 'Par titre (A-Z)' },
    { value: '-title', label: 'Par titre (Z-A)' },
    { value: '-registration_count', label: 'Par popularité' }
  ];
  
  const currentSort = searchParams.ordering || 'start_date';
  
  // Créer un client ID pour le côté client
  const clientFilterId = Math.random().toString(36).substring(7);
  
  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Explorez les événements</h1>
          <p className="text-lg mb-0">
            Découvrez tous les événements disponibles sur notre plateforme
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative">
      <ClientSideFilterWrapper 
        initialFilterFloating={true}
        clientFilterId={clientFilterId}
        categories={categories}
        sortOptions={sortOptions}
        currentSort={currentSort}
        searchParams={searchParams}
        totalEvents={totalEvents}
      />
        
        {/* Grille d'événements avec scroll infini */}
        <Suspense fallback={<div>Chargement des événements...</div>}>
          <InfiniteScrollEvents 
            initialEvents={events} 
            totalEvents={totalEvents}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}

