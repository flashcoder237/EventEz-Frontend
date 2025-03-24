// components/events/EventFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Filter, 
  X, 
  Search 
} from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Types pour les catégories de filtre
interface FilterCategory {
  id: string;
  name: string;
}

interface EventFiltersProps {
  categories: FilterCategory[];
}

export default function EventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from current search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    event_type: searchParams.get('event_type') || '',
    city: searchParams.get('city') || ''
  });

  // List of event types and cities (can be dynamically fetched in a real app)
  const eventTypes = [
    { value: 'billetterie', label: 'Événements payants' },
    { value: 'inscription', label: 'Événements gratuits' }
  ];

  const cities = [
    'Yaoundé', 
    'Douala', 
    'Bafoussam', 
    'Garoua', 
    'Bamenda', 
    'Maroua', 
    'Ngaoundéré'
  ];

  // Handle filter input changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Add non-empty filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Navigate to events page with filters
    router.push(`/events?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      event_type: '',
      city: ''
    });
    router.push('/events');
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <Filter className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">
          Filtres de recherche
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recherche
          </label>
          <div className="relative">
            <Input 
              type="text"
              placeholder="Nom de l'événement"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'événement
          </label>
          <select 
            value={filters.event_type}
            onChange={(e) => handleFilterChange('event_type', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Tous les types</option>
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <select 
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          variant="outline"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
        <Button 
          onClick={applyFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}