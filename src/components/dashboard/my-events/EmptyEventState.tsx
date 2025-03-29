import { Button } from '@/components/ui/Button';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';

interface EmptyEventStateProps {
  currentStatus: string;
}

export default function EmptyEventState({ currentStatus }: EmptyEventStateProps) {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <FaCalendarAlt className="text-gray-300 text-5xl mb-4" />
          <p className="text-lg font-medium">Aucun événement trouvé</p>
          <p className="text-sm text-gray-500 mt-1">
            {currentStatus === 'all' 
              ? 'Commencez par créer votre premier événement.' 
              : `Vous n'avez pas d'événements avec le statut "${currentStatus}".`
            }
          </p>
          {currentStatus === 'all' && (
            <Button href="/dashboard/create-event" className="mt-4">
              <FaPlus className="mr-2" />
              Créer un événement
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}