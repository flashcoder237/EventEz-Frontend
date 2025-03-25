'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '@/types';
import { Search, Filter, X, ChevronDown, Calendar, MapPin, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventFiltersProps {
  categories: Category[];
}

export default function ModernEventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [eventType, setEventType] = useState(searchParams.get('event_type') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Set animation on mount
    setAnimateIn(true);

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
    if (date) params.set('date', date);
    
    router.push(`/events?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setEventType('');
    setCity('');
    setDate('');
    router.push('/events');
  };
  
  const activeFiltersCount = [
    searchTerm,
    category,
    eventType,
    city,
    date
  ].filter(Boolean).length;

  const popularCities = [
    'Yaoundé', 'Douala', 'Bafoussam', 'Limbe'
  ];

  const dateRanges = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'tomorrow', label: 'Demain' },
    { value: 'weekend', label: 'Ce weekend' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -15 },
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => {
      if (searchTerm || category || eventType || city || date) {
        applyFilters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, eventType, city, date]);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={animateIn ? "visible" : "hidden"}
    >
      {/* Mobile Version */}
      {isMobile ? (
        <div className="p-4">
          <motion.div variants={itemVariants} className="relative mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
              onClick={() => setExpandedFilters(!expandedFilters)}
            >
              <Filter size={16} />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="bg-violet-100 text-violet-800 rounded-full px-2 py-0.5 text-xs">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expandedFilters ? 'rotate-180' : ''}`} 
              />
            </Button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-violet-600 flex items-center gap-1 hover:text-violet-800 transition-colors"
              >
                <X size={14} />
                <span>Réinitialiser</span>
              </button>
            )}
          </motion.div>

          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
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
                      className="border-gray-200 focus:border-violet-400 focus:ring-violet-400/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type d'événement</label>
                    <Select
                      options={[
                        { value: '', label: 'Tous types' },
                        { value: 'billetterie', label: 'Billetterie' },
                        { value: 'inscription', label: 'Inscription' }
                      ]}
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="Type d'événement"
                      className="border-gray-200 focus:border-violet-400 focus:ring-violet-400/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <Select
                      options={[
                        { value: '', label: 'Toutes les villes' },
                        ...popularCities.map(city => ({ 
                          value: city, 
                          label: city 
                        }))
                      ]}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ville"
                      className="border-gray-200 focus:border-violet-400 focus:ring-violet-400/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <Select
                      options={[
                        { value: '', label: 'Toutes dates' },
                        ...dateRanges
                      ]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Quand"
                      className="border-gray-200 focus:border-violet-400 focus:ring-violet-400/30"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters - Mobile */}
          {activeFiltersCount > 0 && (
            <motion.div variants={itemVariants} className="mt-3 flex flex-wrap gap-2">
              {searchTerm && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-violet-50 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  <span className="text-violet-800 truncate max-w-[150px]">"{searchTerm}"</span>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-violet-400 hover:text-violet-600"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
              
              {/* Other filters will be shown as a count pill if there are more than 1 filter active */}
              {activeFiltersCount > 1 && searchTerm && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-violet-50 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  <span className="text-violet-800">+{activeFiltersCount - 1} filtres</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        /* Desktop Version - Modern UI */
        <motion.div 
          variants={containerVariants}
          className="p-6"
        >
          <form onSubmit={handleSearch}>
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="text-violet-500" size={18} />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all shadow-sm"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Tag className="text-violet-500" size={18} />
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
                  className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all shadow-sm"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="text-violet-500" size={18} />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Toutes les villes' },
                    ...popularCities.map(city => ({ 
                      value: city, 
                      label: city 
                    }))
                  ]}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                  className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all shadow-sm"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar className="text-violet-500" size={18} />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Toutes dates' },
                    ...dateRanges
                  ]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Quand"
                  className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all shadow-sm"
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-4 flex items-center justify-between"
            >
              <div className="flex gap-1 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  className={`border-gray-200 text-gray-600 hover:bg-gray-50 text-sm ${!expandedFilters ? 'px-3 py-1.5' : 'px-3 py-1.5'}`}
                  onClick={() => setExpandedFilters(!expandedFilters)}
                >
                  <span className="flex items-center gap-1">
                    <Filter size={15} />
                    {expandedFilters ? 'Moins de filtres' : 'Plus de filtres'}
                    <ChevronDown 
                      size={15} 
                      className={`transition-transform ${expandedFilters ? 'rotate-180' : ''}`} 
                    />
                  </span>
                </Button>
                
                {activeFiltersCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3 py-1.5 text-violet-600 hover:bg-violet-50 text-sm"
                    onClick={clearFilters}
                  >
                    <span className="flex items-center gap-1">
                      <X size={15} />
                      Réinitialiser
                    </span>
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg px-4 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} />
                  Rechercher
                </span>
              </Button>
            </motion.div>
          </form>
          
          {/* Expanded Filters Section */}
          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Sparkles size={16} className="mr-2 text-violet-500" />
                        Type d'événement
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="event_type" 
                            value="" 
                            checked={eventType === ''} 
                            onChange={() => setEventType('')}
                            className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="text-gray-700">Tous</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="event_type" 
                            value="billetterie" 
                            checked={eventType === 'billetterie'} 
                            onChange={() => setEventType('billetterie')}
                            className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="text-gray-700">Billetterie</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="event_type" 
                            value="inscription" 
                            checked={eventType === 'inscription'} 
                            onChange={() => setEventType('inscription')}
                            className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 focus:ring-violet-500"
                          />
                          <span className="text-gray-700">Inscription</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Calendar size={16} className="mr-2 text-violet-500" />
                        Période
                      </h3>
                      <div className="space-y-2">
                        {dateRanges.map(range => (
                          <label key={range.value} className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="date" 
                              value={range.value} 
                              checked={date === range.value} 
                              onChange={() => setDate(range.value)}
                              className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 focus:ring-violet-500"
                            />
                            <span className="text-gray-700">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <MapPin size={16} className="mr-2 text-violet-500" />
                        Villes populaires
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularCities.map(cityName => (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => setCity(cityName)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              city === cityName 
                                ? 'bg-violet-100 text-violet-800 font-medium' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {cityName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Active Filters - Desktop */}
          {activeFiltersCount > 0 && (
            <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <span className="text-violet-800">"{searchTerm}"</span>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-violet-400 hover:text-violet-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {category && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <Tag size={14} className="mr-1 text-violet-500" />
                    <span className="text-violet-800">
                      {categories.find(c => c.id.toString() === category)?.name || category}
                    </span>
                    <button 
                      onClick={() => setCategory('')}
                      className="ml-2 text-violet-400 hover:text-violet-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {eventType && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <Sparkles size={14} className="mr-1 text-violet-500" />
                    <span className="text-violet-800">
                      {eventType === 'billetterie' ? 'Billetterie' : 'Inscription'}
                    </span>
                    <button 
                      onClick={() => setEventType('')}
                      className="ml-2 text-violet-400 hover:text-violet-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {city && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <MapPin size={14} className="mr-1 text-violet-500" />
                    <span className="text-violet-800">{city}</span>
                    <button 
                      onClick={() => setCity('')}
                      className="ml-2 text-violet-400 hover:text-violet-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
                
                {date && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-50 rounded-full px-3 py-1.5 text-sm flex items-center"
                  >
                    <Calendar size={14} className="mr-1 text-violet-500" />
                    <span className="text-violet-800">
                      {dateRanges.find(d => d.value === date)?.label || date}
                    </span>
                    <button 
                      onClick={() => setDate('')}
                      className="ml-2 text-violet-400 hover:text-violet-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}