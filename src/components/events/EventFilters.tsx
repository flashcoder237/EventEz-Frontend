// components/events/EventFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '@/types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface EventFiltersProps {
  categories: Category[];
}

export default function EventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [eventType, setEventType] = useState(searchParams.get('event_type') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category) params.set('category', category);
    if (eventType) params.set('event_type', eventType);
    if (city) params.set('city', city);
    
    router.push(`/events?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setEventType('');
    setCity('');
    router.push('/events');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="md:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <FaTimes className="mr-2" />
                  Masquer les filtres
                </>
              ) : (
                <>
                  <FaFilter className="mr-2" />
                  Filtres
                </>
              )}
            </Button>
          </div>
          
          <div className="md:w-auto">
            <Button type="submit" className="w-full md:w-auto">
              Rechercher
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              options={[
                { value: '', label: 'Toutes les catégories' },
                ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Catégorie"
            />
            
            <Select
              options={[
                { value: '', label: 'Tous les types' },
                { value: 'billetterie', label: 'Billetterie' },
                { value: 'inscription', label: 'Inscription personnalisée' }
              ]}
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              label="Type d'événement"
            />
            
            <Input
              type="text"
              placeholder="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              label="Ville"
            />
            
            <div className="md:col-span-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-sm"
                onClick={clearFilters}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}