import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { FaCalendarAlt, FaEye, FaUsers, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

interface EventTableRowProps {
  event: any;
  eventDetails: any;
}

export default function EventTableRow({ event, eventDetails }: EventTableRowProps) {
  // Fonction utilitaire pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'published':
        return <Badge variant="default">Publié</Badge>;
      case 'validated':
        return <Badge variant="success">Validé</Badge>;
      case 'completed':
        return <Badge variant="secondary">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-violet/10 rounded-md flex items-center justify-center text-violet">
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
        <div className="flex flex-col">
          <div className="text-sm text-gray-900">{event.registration_count}</div>
          {eventDetails && eventDetails.max_capacity > 0 && (
            <div className="flex items-center mt-1">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div 
                  className={`h-full ${
                    eventDetails.fill_rate > 75 ? 'bg-green-500' :
                    eventDetails.fill_rate > 25 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, eventDetails.fill_rate)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{eventDetails.fill_rate.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(event.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            href={`/events/${event.id}`}
            title="Voir"
          >
            <FaEye className="text-indigo-600" />
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
  );
}