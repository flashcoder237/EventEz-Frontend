import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsContent } from '@/components/ui/Tabs';
import { formatDate } from '@/lib/utils';
import { FaPlus, FaCalendarAlt, FaEye, FaUsers, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

import EventTab from './EventTab';
import EventsTable from './EventsTable';

interface EventsListProps {
  events: any[];
  totalEvents: number;
  currentStatus: string;
  currentPage: string;
  analyticsData: any;
  navigateToPage: (page: string) => void;
}

export default function EventsList({
  events,
  totalEvents,
  currentStatus,
  currentPage,
  analyticsData,
  navigateToPage
}: EventsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs defaultValue={currentStatus} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="inline-flex">
            <EventTab value="all" href="/dashboard">
              Tous
            </EventTab>
            <EventTab value="draft" href="/dashboard?status=draft">
              Brouillons
            </EventTab>
            <EventTab value="published" href="/dashboard?status=published">
              Publiés
            </EventTab>
            <EventTab value="validated" href="/dashboard?status=validated">
              Validés
            </EventTab>
            <EventTab value="completed" href="/dashboard?status=completed">
              Terminés
            </EventTab>
          </TabsList>
        </div>
        
        <TabsContent value={currentStatus} className="p-0">
          <EventsTable 
            events={events}
            totalEvents={totalEvents}
            currentStatus={currentStatus}
            currentPage={currentPage}
            analyticsData={analyticsData}
            navigateToPage={navigateToPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}