import { Button } from '@/components/ui/Button';

interface TablePaginationProps {
  currentPage: number;
  totalEvents: number;
  navigateToPage: (page: string) => void;
}

export default function TablePagination({
  currentPage,
  totalEvents,
  navigateToPage
}: TablePaginationProps) {
  const hasNextPage = totalEvents > currentPage * 20;

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="flex-1 flex justify-center">
        <div className="relative z-0 inline-flex shadow-sm rounded-md">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => navigateToPage(String(currentPage - 1))}
          >
            Précédent
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => navigateToPage(String(currentPage + 1))}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}