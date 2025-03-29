import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface DashboardHeaderProps {
  exportRegistrations: (format: 'csv' | 'excel') => Promise<void>;
  exportLoading: boolean;
}

export default function DashboardHeader({ exportRegistrations, exportLoading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des inscriptions</h1>
        <p className="text-gray-600">
          Gérez les inscriptions et les participants à vos événements
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => exportRegistrations('csv')}
          disabled={exportLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => exportRegistrations('excel')}
          disabled={exportLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter Excel
        </Button>
      </div>
    </div>
  );
}