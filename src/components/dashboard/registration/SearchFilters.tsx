import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Event } from '@/types';

interface SearchFiltersProps {
  events: Event[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedEvent: string;
  setSelectedEvent: (eventId: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function SearchFilters({
  events,
  searchQuery,
  setSearchQuery,
  selectedEvent,
  setSelectedEvent,
  selectedStatus,
  setSelectedStatus
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un participant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          options={[
            { value: '', label: 'Tous les événements' },
            ...events.map(event => ({ value: event.id, label: event.title }))
          ]}
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-64"
        />
        
        <Select
          options={[
            { value: '', label: 'Tous les statuts' },
            { value: 'confirmed', label: 'Confirmé' },
            { value: 'pending', label: 'En attente' },
            { value: 'cancelled', label: 'Annulé' },
            { value: 'completed', label: 'Terminé' }
          ]}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-48"
        />
      </div>
    </div>
  );
}