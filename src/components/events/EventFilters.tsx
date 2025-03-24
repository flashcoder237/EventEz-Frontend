'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '@/types';
import { Search, Filter, X, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Surveiller le défilement pour les styles visuels
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
  
  const activeFiltersCount = [
    searchTerm,
    category,
    eventType,
    city
  ].filter(Boolean).length;
  
  return (
    <div className={`transition-all duration-300 ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      <button 
        className={`md:hidden w-full py-2 px-4 flex justify-between items-center border-b ${
          collapsed ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-medium flex items-center">
          <Filter size={16} className="mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>
      
      <div className={`bg-white p-4 transition-all duration-300 overflow-hidden ${
        collapsed ? 'max-h-0 p-0 opacity-0' : 'max-h-[1000px] opacity-100'
      }`}>
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
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
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
                    <X className="mr-2" size={16} />
                    Masquer les filtres
                  </>
                ) : (
                  <>
                    <Filter className="mr-2" size={16} />
                    Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </>
                )}
              </Button>
            </div>
            
            <div className="md:w-auto">
              <Button type="submit" className="w-full md:w-auto bg-primary">
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
          
          {/* Filtres actifs */}
          {activeFiltersCount > 0 && !showFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span className="mr-1">Recherche:</span>
                  <span className="font-medium">{searchTerm}</span>
                  <button 
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {category && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span className="mr-1">Catégorie:</span>
                  <span className="font-medium">
                    {categories.find(c => c.id.toString() === category)?.name || category}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setCategory('')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {eventType && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span className="mr-1">Type:</span>
                  <span className="font-medium">
                    {eventType === 'billetterie' ? 'Billetterie' : 'Inscription'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setEventType('')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {city && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                  <span className="mr-1">Ville:</span>
                  <span className="font-medium">{city}</span>
                  <button 
                    type="button"
                    onClick={() => setCity('')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}