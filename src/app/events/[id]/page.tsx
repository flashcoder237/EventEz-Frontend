import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import EventFilters from '@/components/events/EventFilters';
import EventGrid from '@/components/events/EventGrid';
import { eventsAPI } from '@/lib/api';

export const metadata: Metadata = {
  title: 'EventEz - Événements',
  description: 'Découvrez les événements à venir au Cameroun',
};

interface EventsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    event_type?: string;
    city?: string;
    page?: string;
  };
}

async function getEvents(searchParams: EventsPageProps['searchParams']) {
  try {
    const response = await eventsAPI.getEvents({
      ...searchParams,
      status: 'validated'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { results: [], count: 0 };
  }
}

async function getCategories() {
  try {
    const response = await eventsAPI.getCategories();
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { results: events, count } = await getEvents(searchParams);
  const categories = await getCategories();
  
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Événements</h1>
          <p className="text-gray-600 mb-6">
            Découvrez tous les événements à venir au Cameroun
          </p>
          
          <EventFilters categories={categories} />
          
          <div className="mb-6">
            {searchParams.search || searchParams.category || searchParams.event_type || searchParams.city ? (
              <p className="text-sm text-gray-600">
                {count} résultat{count !== 1 ? 's' : ''} trouvé{count !== 1 ? 's' : ''}
              </p>
            ) : null}
          </div>
          
          <EventGrid events={events} />
        </div>
      </div>
    </MainLayout>
  );
}
