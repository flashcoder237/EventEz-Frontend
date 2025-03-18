// app/events/page.tsx
import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import { Button } from '@/components/ui/Button';
import { FaSort, FaFilter } from 'react-icons/fa';
import { eventsAPI } from '@/lib/api';

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
    // Obtenir les événements avec les filtres
    const eventsResponse = await eventsAPI.getEvents({
      ...searchParams,
      status: 'validated',
      limit: 9
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
          
          <div className="flex items-center">
            <FaSort className="text-gray-500 mr-2" />
            <select
              className="border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              defaultValue={currentSort}
              onChange={(e) => {
                // Redirection avec le nouveau tri
                window.location.href = `?${new URLSearchParams({
                  ...searchParams,
                  ordering: e.target.value
                }).toString()}`;
              }}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Grille d'événements */}
        <Suspense fallback={<EventGrid events={[]} loading={true} />}>
          <EventGrid events={events} />
        </Suspense>
        
        {/* Pagination */}
        {totalEvents > 9 && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!searchParams.page || searchParams.page === '1'}
                href={`?${new URLSearchParams({
                  ...searchParams,
                  page: String(Number(searchParams.page || 1) - 1)
                }).toString()}`}
              >
                Précédent
              </Button>
              
              <Button
                variant="outline"
                disabled={totalEvents <= Number(searchParams.page || 1) * 9}
                href={`?${new URLSearchParams({
                  ...searchParams,
                  page: String(Number(searchParams.page || 1) + 1)
                }).toString()}`}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}