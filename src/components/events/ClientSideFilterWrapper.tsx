// Composant client pour gérer les filtres flottants
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventFilters from '@/components/events/EventFilters';
import SortSelect   from '@/components/events/SortSelect';

export default function ClientSideFilterWrapper({ 
  initialFilterFloating, 
  clientFilterId,
  categories,
  sortOptions,
  currentSort,
  searchParams,
  totalEvents
}) {
  const router = useRouter();
  const [isFilterFloating, setIsFilterFloating] = useState(initialFilterFloating);
  
  // Charger la préférence au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('filterFloating');
      if (savedPreference !== null) {
        setIsFilterFloating(savedPreference === 'true');
      }
    }
  }, []);
  

  
  // Basculer le mode flottant des filtres
  const toggleFilterFloating = () => {
    setIsFilterFloating(!isFilterFloating);
    // Sauvegarder la préférence
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterFloating', (!isFilterFloating).toString());
    }
  };
  
  return (
    <div id={`filters-${clientFilterId}`} className="max-w-6xl mx-auto">
      {/* Contrôle pour le mode flottant */}
      <div className="flex justify-end mb-4 ">
        <button 
          onClick={toggleFilterFloating}
          className="text-sm text-gray-600 flex items-center hover:text-primary transition-colors text-white"
        >
          {isFilterFloating ? 'Désactiver' : 'Activer'} filtres flottants
        </button>
      </div>
      
      {/* Filtres flottants */}
      <div className={`${
        isFilterFloating ? 'sticky top-4 z-10' : ''
      } bg-white rounded-lg shadow-md mb-6`}>
        <EventFilters categories={categories} />
        
       
        
        {/* Options de tri et résultats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-t">
          <p className="text-gray-600 mb-4 md:mb-0">
            {totalEvents} événement{totalEvents !== 1 ? 's' : ''} trouvé{totalEvents !== 1 ? 's' : ''}
          </p>
          
          <SortSelect 
            options={sortOptions}
            currentValue={currentSort}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}