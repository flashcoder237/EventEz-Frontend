// src/components/events/registration/TicketSummary.jsx
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const TicketSummary = ({ 
  ticketTypes, 
  selectedTickets, 
  hasSelectedTickets, 
  finalTotal, 
  serviceFee, 
  grandTotal,
  event
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Vos billets sélectionnés
      </h3>
      
      {!hasSelectedTickets ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-yellow-700 dark:text-yellow-400">
              Aucun billet sélectionné. Veuillez retourner à la page des billets pour en sélectionner.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.location.href = `/events/${event.id}?tab=tickets`}
            >
              Sélectionner des billets
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Afficher les billets sélectionnés (du contexte ou des pré-sélections) */}
          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4">
            <div className="space-y-3">
              {Object.keys(selectedTickets).length > 0 ? (
                // Afficher les billets du contexte
                Object.values(selectedTickets)
                  .filter(ticket => ticket.quantity > 0)
                  .map((ticket, index) => {
                    const ticketInfo = ticketTypes.find(t => t.id.toString() === ticket.ticketId);
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.name}</span>
                          <span className="text-gray-600 dark:text-gray-400"> × {ticket.quantity}</span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {formatCurrency(ticket.price * ticket.quantity)}
                        </span>
                      </div>
                    );
                  })
              ) : (
                // Période de transition - s'affichera brièvement si les billets sont en cours de chargement
                <div className="flex justify-center items-center py-2">
                  <span className="text-gray-500 dark:text-gray-400">Chargement des billets...</span>
                </div>
              )}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(finalTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Frais de service (5%)</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Total</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSummary;