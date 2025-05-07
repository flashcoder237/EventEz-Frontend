'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Calendar } from 'lucide-react';

interface ViewSelectorProps {
  onChange: (view: 'grid' | 'list' | 'calendar') => void;
  currentView: 'grid' | 'list' | 'calendar';
}

export default function ViewSelector({ onChange, currentView }: ViewSelectorProps) {
  // Charger la préférence depuis localStorage au montage (uniquement côté client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('eventViewPreference') as 'grid' | 'list' | 'calendar' | null;
      if (savedView && savedView !== currentView) {
        onChange(savedView);
      }
    }
  }, [onChange, currentView]);

  // Sauvegarder la préférence quand elle change (uniquement côté client)
  const handleViewChange = (view: 'grid' | 'list' | 'calendar') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventViewPreference', view);
    }
    onChange(view);
  };

  return (
    <div className="flex items-center bg-white rounded-md border shadow-sm">
      <button
        className={`p-2 ${currentView === 'grid' ? 'bg-gray-100 text-violet' : 'text-gray-500'}`}
        onClick={() => handleViewChange('grid')}
        title="Vue en grille"
      >
        <LayoutGrid size={20} />
      </button>
      
      <button
        className={`p-2 ${currentView === 'list' ? 'bg-gray-100 text-violet' : 'text-gray-500'}`}
        onClick={() => handleViewChange('list')}
        title="Vue en liste"
      >
        <List size={20} />
      </button>
      
      <button
        className={`p-2 ${currentView === 'calendar' ? 'bg-gray-100 text-violet' : 'text-gray-500'}`}
        onClick={() => handleViewChange('calendar')}
        title="Vue calendrier"
      >
        <Calendar size={20} />
      </button>
    </div>
  );
}