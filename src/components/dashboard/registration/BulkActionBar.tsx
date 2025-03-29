import { Button } from '@/components/ui/Button';
import { Mail, CheckSquare, ClipboardList } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onSendEmail: () => void;
  onMarkAsCheckedIn: () => Promise<void>;
  onGenerateTickets: () => Promise<void>;
}

export default function BulkActionBar({ 
  selectedCount, 
  onSendEmail, 
  onMarkAsCheckedIn, 
  onGenerateTickets 
}: BulkActionBarProps) {
  return (
    <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-700">
        {selectedCount} sélectionné(s)
      </span>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="h-8" onClick={onSendEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un email
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={onMarkAsCheckedIn}>
          <CheckSquare className="h-4 w-4 mr-2" />
          Marquer comme présent
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={onGenerateTickets}>
          <ClipboardList className="h-4 w-4 mr-2" />
          Générer les billets
        </Button>
      </div>
    </div>
  );
}