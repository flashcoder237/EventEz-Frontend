// components/events/SortSelect.tsx
'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

// Types for sort options and component props
interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  currentValue: string;
  searchParams: { [key: string]: string };
}

export default function SortSelect({ 
  options, 
  currentValue, 
  searchParams 
}: SortSelectProps) {
  const router = useRouter();

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams();
    
    // Copy existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'ordering') {
        params.set(key, value);
      }
    });
    
    if (sortValue) {
      params.set('ordering', sortValue);
    }
    
    // Remove page parameter when changing sort
    params.delete('page');
    
    router.push(`/events?${params.toString()}`);
  };

  // Determine sort icon based on current sort value
  const getSortIcon = (value: string) => {
    if (currentValue === value) {
      return <ArrowUp className="h-4 w-4 text-primary" />;
    } else if (currentValue === `-${value}`) {
      return <ArrowDown className="h-4 w-4 text-primary" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-600 mr-2">Trier par</label>
      <select 
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}