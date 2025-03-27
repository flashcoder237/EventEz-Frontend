'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { 
  Ticket, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  ShoppingCart,
  Info
} from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
import { Event } from '@/types';

interface EventTicketsTabProps {
  ticketTypes: any[];
  event: Event;
}

export default function EventTicketsTab({ ticketTypes, event }: EventTicketsTabProps) {
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const isExpired = new Date(event.end_date) < new Date();

  // Calculate total selected tickets and total price
  const ticketSummary = useMemo(() => {
    const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = ticketTypes.reduce((total, ticket) => 
      total + (ticket.price * (selectedTickets[ticket.id] || 0)), 0
    );
    return { totalTickets, totalPrice };
  }, [selectedTickets, ticketTypes]);

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

    window.location.href = `/events/${event.id}/register?tickets=${encodeURIComponent(JSON.stringify(selectedTicketData))}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <motion.h2 
        className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 flex items-center"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Ticket className="mr-4 text-primary" size={36} />
        Billets disponibles
      </motion.h2>
      
      {ticketTypes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center"
        >
          <AlertTriangle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <p className="text-gray-600 dark:text-gray-400">
            Aucun billet n'est disponible pour cet événement.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {ticketTypes.map(ticket => (
            <motion.div 
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
              }}
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {ticket.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {ticket.description || 'Aucune description'}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Jusqu'au {formatDate(ticket.sales_end, 'short')}
                    </div>
                    
                    {ticket.available_quantity > 0 ? (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {ticket.available_quantity} disponible{ticket.available_quantity > 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Épuisé
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-primary mb-4">
                    {ticket.price > 0 
                      ? `${ticket.price.toLocaleString()} XAF` 
                      : 'Gratuit'}
                  </div>
                  
                  {ticket.available_quantity > 0 && !isExpired && (
                    <div className="flex items-center">
                      <motion.button
                        onClick={() => handleSelectTicket(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                        disabled={(selectedTickets[ticket.id] || 0) <= 0}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 disabled:opacity-50"
                      >
                        -
                      </motion.button>
                      <span className="mx-4 min-w-[30px] text-center text-lg font-semibold">
                        {selectedTickets[ticket.id] || 0}
                      </span>
                      <motion.button
                        onClick={() => handleSelectTicket(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                        disabled={(selectedTickets[ticket.id] || 0) >= ticket.available_quantity}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 disabled:opacity-50"
                      >
                        +
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {ticketSummary.totalTickets > 0 && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                    <ShoppingCart className="mr-2 text-primary" />
                    <span className="font-semibold">
                      {ticketSummary.totalTickets} billet{ticketSummary.totalTickets > 1 ? 's' : ''} sélectionné{ticketSummary.totalTickets > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="mr-2 h-4 w-4 text-blue-500" />
                    Les billets seront réservés à votre nom
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {ticketSummary.totalPrice.toLocaleString()} XAF
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-600 transition-colors"
                    onClick={handleProceedToCheckout}
                  >
                    <Ticket className="mr-2 h-5 w-5" /> 
                    Procéder à l'achat
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

