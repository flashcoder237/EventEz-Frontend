import { Button } from '@/components/ui/Button';
import { FaPlus } from 'react-icons/fa';

export default function PageHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes événements</h1>
        <p className="text-gray-600">
          Gérez tous vos événements à partir de ce tableau de bord
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <Button href="/dashboard/create-event">
          <FaPlus className="mr-2" />
          Créer un événement
        </Button>
      </div>
    </div>
  );
}