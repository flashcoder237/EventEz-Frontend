import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { FaPlus, FaCalendarAlt, FaEye, FaUsers, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

import EventTableRow from './EventTableRow';
import EmptyEventState from './EmptyEventState';
import TablePagination from './TablePagination';

interface EventsTableProps {
  events: any[];
  totalEvents: number;
  currentStatus: string;
  currentPage: string;
  analyticsData: any;
  navigateToPage: (page: string) => void;
}

export default function EventsTable({
  events,
  totalEvents,
  currentStatus,
  currentPage,
  analyticsData,
  navigateToPage
}: EventsTableProps) {
  return (
    <>
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
              <EmptyEventState currentStatus={currentStatus} />
            ) : (
              events.map((event) => (
                <EventTableRow
                  key={event.id}
                  event={event}
                  eventDetails={analyticsData?.event_summary?.events_details?.find(e => e.id === event.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalEvents > 20 && (
        <TablePagination 
          currentPage={parseInt(currentPage)}
          totalEvents={totalEvents}
          navigateToPage={navigateToPage}
        />
      )}
    </>
  );
}