'use client';
// components/common/PaginationButtons.tsx
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface PaginationButtonsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  searchParams: Record<string, string>;
}

export default function PaginationButtons({
  currentPage,
  totalItems,
  itemsPerPage,
  searchParams
}: PaginationButtonsProps) {
  const router = useRouter();

  const handleNavigation = (page: number) => {
    // On utilise window.location.href pour causer un rechargement complet qui devrait 
    // forcer un nouvel appel à l'API avec les nouveaux paramètres
    const params = new URLSearchParams();
    
    // Ajouter les paramètres existants
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value);
    });
    
    // Ajouter le numéro de page
    params.set('page', String(page));
    
    // Rediriger avec un rechargement complet
    window.location.href = `?${params.toString()}`;
  };

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = totalItems <= currentPage * itemsPerPage;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={isPrevDisabled}
        onClick={() => !isPrevDisabled && handleNavigation(currentPage - 1)}
      >
        Précédent
      </Button>
      
      <Button
        variant="outline"
        disabled={isNextDisabled}
        onClick={() => !isNextDisabled && handleNavigation(currentPage + 1)}
      >
        Suivant
      </Button>
    </div>
  );
}