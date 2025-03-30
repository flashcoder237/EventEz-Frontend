// src/components/events/registration/ActionButtons.jsx
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const ActionButtons = ({ loading, hasSelectedTickets, event, finalTotal, grandTotal }) => {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        className="flex items-center"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Button
        type="submit"
        disabled={loading || (event.event_type === 'billetterie' && !hasSelectedTickets)}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
      >
        {loading ? (
          <span className="flex items-center">
            <Loader className="animate-spin mr-2 h-4 w-4" />
            Traitement...
          </span>
        ) : (
          <>
            {finalTotal > 0 ? 'Procéder au paiement' : 'Confirmer l\'inscription'}
            <span className="ml-2">{finalTotal > 0 ? `(${formatCurrency(grandTotal)})` : ''}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;