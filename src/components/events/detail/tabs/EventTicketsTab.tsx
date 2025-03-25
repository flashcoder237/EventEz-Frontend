// src/components/events/detail/tabs/EventTicketsTab.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Ticket, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
import { Event } from '@/types';

interface EventTicketsTabProps {
  ticketTypes: any[];
  event: Event;
}

export default function EventTicketsTab({ ticketTypes, event }: EventTicketsTabProps) {
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const isExpired = new Date(event.end_date) < new Date();

  const handleSelectTicket = (ticketId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity)
    }));
  };

  const handleProceedToCheckout = () => {
    const selectedTicketData = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => ({ ticketId, quantity }));

    if (selectedTicketData.length === 0) {
      alert('Veuillez sélectionner au moins un billet');
      return;
    }

    // Rediriger vers la page d'inscription avec les billets sélectionnés
    window.location.href = `/events/${event.id}/register?tickets=${encodeURIComponent(JSON.stringify(selectedTicketData))}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Billets disponibles</h2>
      
      {ticketTypes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun billet n'est disponible pour cet événement.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ticketTypes.map(ticket => (
            <div key={ticket.id} className="border rounded-lg p-6 transition-all hover:border-primary hover:shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold">{ticket.name}</h3>
                  <p className="text-gray-600 mt-1">{ticket.description || 'Aucune description'}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Jusqu'au {formatDate(ticket.sales_end, 'short')}
                    </span>
                    
                    {ticket.available_quantity > 0 ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {ticket.available_quantity} disponible{ticket.available_quantity > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Épuisé
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {ticket.price > 0 ? `${ticket.price.toLocaleString()} XAF` : 'Gratuit'}
                  </div>
                  
                  {ticket.available_quantity > 0 && !isExpired && (
                    <div className="mt-4 flex items-center justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectTicket(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                        disabled={(selectedTickets[ticket.id] || 0) <= 0}
                      >
                        -
                      </Button>
                      <span className="mx-3 min-w-[30px] text-center">
                        {selectedTickets[ticket.id] || 0}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectTicket(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                        disabled={(selectedTickets[ticket.id] || 0) >= ticket.available_quantity}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!isExpired && (
            <div className="mt-6 pt-6 border-t">
              <Button 
                className="w-full md:w-auto bg-primary"
                onClick={handleProceedToCheckout}
                disabled={Object.values(selectedTickets).every(qty => qty === 0)}
              >
                <Ticket className="mr-2 h-5 w-5" /> 
                Procéder à l'achat
              </Button>
              
              <p className="text-sm text-gray-500 mt-2">
                Les billets seront réservés à votre nom et vous pourrez les récupérer lors de l'événement.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
