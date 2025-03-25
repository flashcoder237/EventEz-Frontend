'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/Button';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateFilterProps {
  onDateFilterChange: (startDate: string, endDate: string) => void;
}

export function ModernDateFilter({ onDateFilterChange }: DateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  useEffect(() => {
    // Set animation on mount
    setAnimateIn(true);

    const start = searchParams.get('start_date');
    const end = searchParams.get('end_date');

    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const today = formatDateForAPI(new Date());
      const tomorrow = formatDateForAPI(addDays(new Date(), 1));
      const weekStart = formatDateForAPI(startOfWeek(new Date(), { weekStartsOn: 1 }));
      const weekEnd = formatDateForAPI(endOfWeek(new Date(), { weekStartsOn: 1 }));
      const monthStart = formatDateForAPI(startOfMonth(new Date()));
      const monthEnd = formatDateForAPI(endOfMonth(new Date()));
      
      if (start === today && end === today) {
        setActiveFilter('today');
      } else if (start === tomorrow && end === tomorrow) {
        setActiveFilter('tomorrow');
      } else if (start === weekStart && end === weekEnd) {
        setActiveFilter('thisWeek');
      } else if (start === monthStart && end === monthEnd) {
        setActiveFilter('thisMonth');
      } else {
        setActiveFilter('custom');
      }
    } else {
      setActiveFilter('all');
    }
  }, [searchParams]);

  const applyDateFilter = (filter: string) => {
    const today = new Date();
    let start: string | null = null;
    let end: string | null = null;

    switch (filter) {
      case 'today':
        start = formatDateForAPI(today);
        end = formatDateForAPI(today);
        break;
      case 'tomorrow':
        start = formatDateForAPI(addDays(today, 1));
        end = formatDateForAPI(addDays(today, 1));
        break;
      case 'thisWeek':
        start = formatDateForAPI(startOfWeek(today, { weekStartsOn: 1 }));
        end = formatDateForAPI(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'thisMonth':
        start = formatDateForAPI(startOfMonth(today));
        end = formatDateForAPI(endOfMonth(today));
        break;
      default:
        start = null;
        end = null;
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setActiveFilter(filter);
    onDateFilterChange(start || '', end || '');
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveFilter('all');
    onDateFilterChange('', '');
  };

  const filters = [
    { id: 'all', label: 'Toutes les dates' },
    { id: 'today', label: 'Aujourd\'hui' },
    { id: 'tomorrow', label: 'Demain' },
    { id: 'thisWeek', label: 'Cette semaine' },
    { id: 'thisMonth', label: 'Ce mois' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={animateIn ? "visible" : "hidden"}
    >
      <div className="p-5">
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <div className="bg-violet-100 text-violet-600 p-2 rounded-lg mr-3">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-800">Filtrer par date</h3>
          </div>
          
          <div className="flex items-center">
            {activeFilter !== 'all' && (
              <span className="bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                {activeFilter === 'custom' ? 'Personnalisé' : 
                  filters.find(f => f.id === activeFilter)?.label || ''}
              </span>
            )}
            <ChevronRight 
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </div>
        </motion.div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Boutons de filtres de date - rendus explicitement */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => applyDateFilter(filter.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all font-medium border ${
                        activeFilter === filter.id 
                          ? 'bg-violet-600 text-white border-violet-600' 
                          : 'bg-white text-gray-700 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                {activeFilter === 'custom' && (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <div className="px-3 py-2 bg-violet-50 rounded-lg text-sm text-violet-800 flex-grow text-center">
                      <span className="font-medium">Période:</span>{' '}
                      {startDate && endDate ? (
                        <>
                          {formatDateForDisplay(startDate)} 
                          {startDate !== endDate && ` - ${formatDateForDisplay(endDate)}`}
                        </>
                      ) : 'Personnalisée'}
                    </div>
                    <button 
                      onClick={clearDateFilter} 
                      className="px-3 py-1.5 text-sm text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-lg flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Effacer
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isExpanded && activeFilter !== 'all' && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-2 mt-1"
          >
            <div className="px-3 py-1.5 bg-violet-50 rounded-full text-sm text-violet-800 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-violet-500" />
              {activeFilter === 'custom' && startDate && endDate ? (
                <span>
                  {formatDateForDisplay(startDate)} 
                  {startDate !== endDate && ` - ${formatDateForDisplay(endDate)}`}
                </span>
              ) : (
                <span>{filters.find(f => f.id === activeFilter)?.label}</span>
              )}
              <button
                onClick={clearDateFilter}
                className="ml-2 text-violet-400 hover:text-violet-600"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ModernDateFilter;