'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '@/types';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = () => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || category || eventType || city) {
        applyFilters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, eventType, city]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs">
      {/* Mobile Version */}
      {isMobile ? (
        <div className="p-4">
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsMobile(false)}
            >
              <Filter size={16} />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5 text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 flex items-center gap-1"
              >
                <X size={14} />
                <span>Effacer</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Version - Modern UI */
        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
                
                <Select
                  options={[
                    { value: '', label: 'Toutes catégories' },
                    ...categories.map(cat => ({ 
                      value: cat.id.toString(), 
                      label: cat.name 
                    }))
                  ]}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Catégorie"
                />
                
                <Select
                  options={[
                    { value: '', label: 'Tous types' },
                    { value: 'billetterie', label: 'Billetterie' },
                    { value: 'inscription', label: 'Inscription' }
                  ]}
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="Type"
                />
                
                <Input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-indigo-600 hover:bg-indigo-50 flex items-center gap-1"
                    onClick={clearFilters}
                  >
                    <X size={16} />
                    <span>Réinitialiser</span>
                  </Button>
                )}
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Appliquer
                </Button>
              </div>
            </div>
          </form>
          
          {/* Active Filters - Desktop */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-indigo-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <span className="text-indigo-800">"{searchTerm}"</span>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {category && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-indigo-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <span className="text-indigo-800">
                      {categories.find(c => c.id.toString() === category)?.name || category}
                    </span>
                    <button 
                      onClick={() => setCategory('')}
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {eventType && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-indigo-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <span className="text-indigo-800">
                      {eventType === 'billetterie' ? 'Billetterie' : 'Inscription'}
                    </span>
                    <button 
                      onClick={() => setEventType('')}
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {city && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-indigo-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <span className="text-indigo-800">{city}</span>
                    <button 
                      onClick={() => setCity('')}
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}