// components/common/PaginationButtons.tsx
'use client';

import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface PaginationButtonsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  searchParams: { [key: string]: string };
}

export default function PaginationButtons({ 
  currentPage, 
  totalItems, 
  itemsPerPage,
  searchParams 
}: PaginationButtonsProps) {
  const router = useRouter();

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create function to generate pagination URL
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Copy existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page') {
        params.set(key, value);
      }
    });
    
    // Set new page
    params.set('page', page.toString());
    
    return `/events?${params.toString()}`;
  };

  // Handle page navigation
  const navigateToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page));
    }
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
    }
    
    // Show ellipsis if current page is far from first page
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around current page
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Show ellipsis if current page is far from last page
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    if (currentPage < totalPages - 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // If only one page, don't render pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {generatePageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-2 py-1 text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => navigateToPage(Number(page))}
              className={`
                px-4 py-2 rounded-md 
                ${currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 text-gray-700'}
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}