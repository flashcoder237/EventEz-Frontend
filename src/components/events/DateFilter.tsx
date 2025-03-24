'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/Button';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateFilterProps {
  onDateFilterChange: (startDate: string, endDate: string) => void;
}

// Utilisation d'export nommé pour s'assurer que l'import fonctionne correctement
export function DateFilter({ onDateFilterChange }: DateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Pour formater les dates pour l'API
  const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    // Vérifier s'il y a déjà des filtres de date dans l'URL
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (startDate && endDate) {
      // Déterminer quel filtre est actif en fonction des dates
      const today = formatDateForAPI(new Date());
      
      if (startDate === today && endDate === today) {
        setActiveFilter('today');
      } else {
        // Essayer de déterminer si c'est cette semaine, ce mois, etc.
        // Pour simplifier, on met juste 'custom' pour tout filtre non standard
        setActiveFilter('custom');
      }
    } else {
      setActiveFilter('all');
    }
  }, [searchParams]);

  const applyDateFilter = (filter: string) => {
    const today = new Date();
    let startDate: string | null = null;
    let endDate: string | null = null;

    switch (filter) {
      case 'today':
        startDate = formatDateForAPI(today);
        endDate = formatDateForAPI(today);
        break;
      case 'tomorrow':
        const tomorrow = addDays(today, 1);
        startDate = formatDateForAPI(tomorrow);
        endDate = formatDateForAPI(tomorrow);
        break;
      case 'thisWeek':
        startDate = formatDateForAPI(startOfWeek(today, { weekStartsOn: 1 }));
        endDate = formatDateForAPI(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'thisMonth':
        startDate = formatDateForAPI(startOfMonth(today));
        endDate = formatDateForAPI(endOfMonth(today));
        break;
      case 'all':
      default:
        // Pas de filtre de date
        startDate = null;
        endDate = null;
        break;
    }

    setActiveFilter(filter);
    
    if (startDate && endDate) {
      onDateFilterChange(startDate, endDate);
    } else {
      onDateFilterChange('', '');
    }
  };

  return (
    <div className="bg-white rounded-lg p-2 mb-2">
      <div className="flex items-center mb-2">
        <CalendarIcon className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium text-gray-800">Filtrer par date</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        <Button 
          size="sm"
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => applyDateFilter('all')}
          className={activeFilter === 'all' ? 'bg-primary' : ''}
        >
          Tous
        </Button>
        
        <Button 
          size="sm"
          variant={activeFilter === 'today' ? 'default' : 'outline'}
          onClick={() => applyDateFilter('today')}
          className={activeFilter === 'today' ? 'bg-primary' : ''}
        >
          Aujourd'hui
        </Button>
        
        <Button 
          size="sm"
          variant={activeFilter === 'tomorrow' ? 'default' : 'outline'}
          onClick={() => applyDateFilter('tomorrow')}
          className={activeFilter === 'tomorrow' ? 'bg-primary' : ''}
        >
          Demain
        </Button>
        
        <Button 
          size="sm"
          variant={activeFilter === 'thisWeek' ? 'default' : 'outline'}
          onClick={() => applyDateFilter('thisWeek')}
          className={activeFilter === 'thisWeek' ? 'bg-primary' : ''}
        >
          Cette semaine
        </Button>
        
        <Button 
          size="sm"
          variant={activeFilter === 'thisMonth' ? 'default' : 'outline'}
          onClick={() => applyDateFilter('thisMonth')}
          className={activeFilter === 'thisMonth' ? 'bg-primary' : ''}
        >
          Ce mois
        </Button>
      </div>
      
      {activeFilter === 'custom' && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Filtre personnalisé appliqué
        </div>
      )}
    </div>
  );
}

// Export par défaut pour compatibilité avec les deux styles d'import
export default DateFilter;