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

export function DateFilter({ onDateFilterChange }: DateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (startDate && endDate) {
      const today = formatDateForAPI(new Date());
      
      if (startDate === today && endDate === today) {
        setActiveFilter('today');
      } else {
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
        startDate = formatDateForAPI(addDays(today, 1));
        endDate = formatDateForAPI(addDays(today, 1));
        break;
      case 'thisWeek':
        startDate = formatDateForAPI(startOfWeek(today, { weekStartsOn: 1 }));
        endDate = formatDateForAPI(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'thisMonth':
        startDate = formatDateForAPI(startOfMonth(today));
        endDate = formatDateForAPI(endOfMonth(today));
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    setActiveFilter(filter);
    onDateFilterChange(startDate || '', endDate || '');
  };

  const filters = [
    { id: 'all', label: 'Toutes les dates' },
    { id: 'today', label: 'Aujourd\'hui' },
    { id: 'tomorrow', label: 'Demain' },
    { id: 'thisWeek', label: 'Cette semaine' },
    { id: 'thisMonth', label: 'Ce mois' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="font-medium text-gray-800">Filtrer par date</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            size="sm"
            variant={activeFilter === filter.id ? 'default' : 'outline'}
            onClick={() => applyDateFilter(filter.id)}
            className={`text-sm rounded-lg transition-all ${
              activeFilter === filter.id 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      {activeFilter === 'custom' && (
        <div className="mt-3 text-sm text-indigo-600 font-medium flex items-center">
          <span className="bg-indigo-100 rounded-full px-3 py-1">
            Filtre personnalisé appliqué
          </span>
        </div>
      )}
    </div>
  );
}

export default DateFilter;