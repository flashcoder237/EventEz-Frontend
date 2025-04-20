'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { 
  Ticket, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  ShoppingCart,
  Info,
  Loader
} from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';
import { Event } from '@/types';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { formatCurrency } from '@/lib/utils';

interface EventTicketsTabProps {
  ticketTypes: any[];
  event: Event;
}

export default function EventTicketsTab({ ticketTypes, event }: EventTicketsTabProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { selectedTickets, updateTicketSelection, totalSelectedTickets, totalPrice } = useTicketSelection();
  const isExpired = new Date(event.end_date) < new Date();

  // Gestion des animations pour les tickets sélectionnés
  const [animatingTicketId, setAnimatingTicketId] = useState<string | null>(null);

  const handleSelectTicket = (ticketId: string, quantity: number, price: number, name: string) => {
    // Animer le ticket en cours de modification
    setAnimatingTicketId(ticketId);
    setTimeout(() => setAnimatingTicketId(null), 300);
    
    // Mettre à jour la sélection dans le contexte
    updateTicketSelection(ticketId, quantity, price, name);
  };

  const handleProceedToCheckout = async () => {
    setLoading(true);
    
    // Vérifier si l'utilisateur est connecté
    if (status !== 'authenticated') {
      router.push(`/login?redirect=/events/${event.id}/register`);
      return;
    }
    
    try {
      // Vérifier si des tickets sont sélectionnés
      if (totalSelectedTickets <= 0) {
        alert('Veuillez sélectionner au moins un billet');
        setLoading(false);
        return;
      }
      
      // Convertir les données sélectionnées pour l'URL
      const selectedTicketsData = {
        tickets: Object.values(selectedTickets)
          .filter(ticket => ticket.quantity > 0)
          .map(ticket => ({
            ticketId: ticket.ticketId,
            quantity: ticket.quantity
          }))
      };
      
      // Rediriger vers la page d'inscription avec les billets sélectionnés
      router.push(`/events/${event.id}/register?tickets=${encodeURIComponent(JSON.stringify(selectedTicketsData))}`);
    } catch (error) {
      console.error('Erreur lors de la redirection vers le checkout:', error);
      setLoading(false);
    }
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
              className={`bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition-all duration-300 ${
                animatingTicketId === ticket.id.toString() 
                  ? 'border-purple-500 shadow-md' 
                  : selectedTickets[ticket.id]?.quantity > 0
                    ? 'border-purple-200 shadow-sm'
                    : 'dark:border-gray-700 border-gray-200'
              }`}
              whileHover={{ 
                scale: 1.01,
                boxShadow: '0 10px 15px rgba(0,0,0,0.05)'
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
                      ? formatCurrency(ticket.price) 
                      : 'Gratuit'}
                  </div>
                  
                  {ticket.available_quantity > 0 && !isExpired && (
                    <div className="flex items-center">
                      <motion.button
                        onClick={() => handleSelectTicket(
                          ticket.id.toString(),
                          Math.max((selectedTickets[ticket.id]?.quantity || 0) - 1, 0),
                          ticket.price,
                          ticket.name
                        )}
                        disabled={(selectedTickets[ticket.id]?.quantity || 0) <= 0}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          (selectedTickets[ticket.id]?.quantity || 0) <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-purple-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-purple-900'
                        }`}
                      >
                        <span className="text-xl font-bold">-</span>
                      </motion.button>
                      
                      <span className="mx-4 min-w-[36px] text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {selectedTickets[ticket.id]?.quantity || 0}
                      </span>
                      
                      <motion.button
                        onClick={() => handleSelectTicket(
                          ticket.id.toString(),
                          Math.min((selectedTickets[ticket.id]?.quantity || 0) + 1, ticket.available_quantity),
                          ticket.price,
                          ticket.name
                        )}
                        disabled={(selectedTickets[ticket.id]?.quantity || 0) >= ticket.available_quantity}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          (selectedTickets[ticket.id]?.quantity || 0) >= ticket.available_quantity
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-purple-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-purple-900'
                        }`}
                      >
                        <span className="text-xl font-bold">+</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Barre de remplissage pour indiquer les billets restants */}
              {ticket.available_quantity > 0 && ticket.quantity_total > 0 && (
                <div className="px-6 pb-6">
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{Math.round((ticket.quantity_sold / ticket.quantity_total) * 100)}% vendus</span>
                    <span>{ticket.available_quantity} restants</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-violet-600 to-pink-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.round((ticket.quantity_sold / ticket.quantity_total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Section du résumé et bouton d'achat */}
          <AnimatePresence>
            {totalSelectedTickets > 0 && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-purple-200 shadow-sm"
              >
                <div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                    <ShoppingCart className="mr-2 text-primary" />
                    <span className="font-semibold">
                      {totalSelectedTickets} billet{totalSelectedTickets > 1 ? 's' : ''} sélectionné{totalSelectedTickets > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="mr-2 h-4 w-4 text-indigo-500" />
                    Les billets seront réservés à votre nom
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(totalPrice)}
                  </div>
                  <Button 
                    onClick={handleProceedToCheckout}
                    disabled={loading}
                    className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader className="animate-spin mr-2 h-5 w-5" />
                        <span>Traitement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Ticket className="mr-2 h-5 w-5" /> 
                        <span>Procéder à l'achat</span>
                      </div>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Instructions d'achat - Section informative */}
      {ticketTypes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Comment acheter des billets
          </h3>
          <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 font-medium">1</span>
              <span>Sélectionnez le type et la quantité de billets que vous souhaitez acheter.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 font-medium">2</span>
              <span>Cliquez sur "Procéder à l'achat" pour continuer vers le paiement.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 font-medium">3</span>
              <span>Remplissez les informations nécessaires et choisissez votre mode de paiement.</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 font-medium">4</span>
              <span>Une fois le paiement confirmé, vous recevrez vos billets par email.</span>
            </li>
          </ol>
        </motion.div>
      )}
    </motion.div>
  );
}