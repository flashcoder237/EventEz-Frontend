'use client';
// components/events/SortSelect.tsx
import { FaSort } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  currentValue: string;
  searchParams: Record<string, string>;
}

export default function SortSelect({ options, currentValue, searchParams }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    
    // Ajouter les paramètres existants
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // Mettre à jour le tri
    params.set('ordering', e.target.value);
    
    // Rediriger vers la nouvelle URL
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center">
      <FaSort className="text-gray-500 mr-2" />
      <select
        className="border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
        defaultValue={currentValue}
        onChange={handleChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}