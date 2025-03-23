// app/events/page.tsx
import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import { FaFilter } from 'react-icons/fa';
import { eventsAPI } from '@/lib/api';
import SortSelect from '@/components/events/SortSelect';
import PaginationButtons from '@/components/common/PaginationButtons';

// Types pour les paramètres de recherche
interface SearchParams {
  search?: string;
  category?: string;
  event_type?: string;
  city?: string;
  ordering?: string;
  page?: string;
}

// Cette fonction s'exécute côté serveur pour obtenir les données
async function getEventsData(searchParams: SearchParams) {
  try {
    // Obtenir les événements avec les filtres et la pagination
    const eventsResponse = await eventsAPI.getEvents({
      ...searchParams,
      status: 'validated',
      limit: 5,
      // Nous envoyons à la fois page et offset pour s'assurer que l'API reçoit ce qu'elle attend
      page: Number(searchParams.page || 1),
      offset: (Number(searchParams.page || 1) - 1) * 5
    });
    
    // Obtenir les catégories pour les filtres
    const categoriesResponse = await eventsAPI.getCategories();

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
  
  // Create a function to generate the URL for pagination and sorting
  const createQueryString = (params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    
    // Add search parameters
    if (searchParams.search) urlParams.set('search', searchParams.search);
    if (searchParams.category) urlParams.set('category', searchParams.category);
    if (searchParams.event_type) urlParams.set('event_type', searchParams.event_type);
    if (searchParams.city) urlParams.set('city', searchParams.city);
    if (searchParams.ordering) urlParams.set('ordering', searchParams.ordering);
    
    // Override with new params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      } else {
        urlParams.delete(key);
      }
    });
    
    return urlParams.toString();
  };
  
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <EventFilters categories={categories} />
        
        {/* Options de tri et résultats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <p className="text-gray-600 mb-4 md:mb-0">
            {totalEvents} événement{totalEvents !== 1 ? 's' : ''} trouvé{totalEvents !== 1 ? 's' : ''}
          </p>
          
          <SortSelect 
            options={sortOptions}
            currentValue={currentSort}
            searchParams={searchParams}
          />
        </div>
        
        {/* Grille d'événements */}
        <Suspense fallback={<EventGrid events={[]} loading={true} />}>
          <EventGrid events={events} />
        </Suspense>
        
        {/* Pagination */}
        {totalEvents > 5 && (
          <div className="mt-12 flex justify-center">
            <PaginationButtons
              currentPage={Number(searchParams.page || 1)}
              totalItems={totalEvents}
              itemsPerPage={5}
              searchParams={searchParams}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}