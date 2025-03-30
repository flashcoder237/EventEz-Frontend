'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

// Animations
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const alertVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

interface TicketsSectionProps {
  hasSelectedTickets: boolean;
  selectedTickets: any;
  selectedTicketsState: Record<number, number>;
  ticketTypes: any[];
  finalTotal: number;
  serviceFee: number;
  grandTotal: number;
  eventId: number;
  router: any;
}

export function TicketsSection({
  hasSelectedTickets,
  selectedTickets,
  selectedTicketsState,
  ticketTypes,
  finalTotal,
  serviceFee,
  grandTotal,
  eventId,
  router
}: TicketsSectionProps) {
  return (
    <motion.div 
      className="mb-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
        variants={itemVariants}
      >
        Vos billets sélectionnés
      </motion.h3>
      
      <AnimatePresence>
        {!hasSelectedTickets ? (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start mb-4"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 dark:text-yellow-400">
                Aucun billet sélectionné. Veuillez retourner à la page des billets pour en sélectionner.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 relative overflow-hidden group"
                onClick={() => router.push(`/events/${eventId}?tab=tickets`)}
              >
                <motion.span 
                  className="absolute inset-0 bg-yellow-100 dark:bg-yellow-800/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Sélectionner des billets</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-3">
                {Object.keys(selectedTickets).length > 0 ? (
                  // Afficher les billets du contexte
                  Object.values(selectedTickets)
                    .filter(ticket => ticket.quantity > 0)
                    .map((ticket, index) => {
                      const ticketInfo = ticketTypes.find(t => t.id.toString() === ticket.ticketId);
                      return (
                        <motion.div 
                          key={index} 
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.name}</span>
                            <span className="text-gray-600 dark:text-gray-400"> × {ticket.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency(ticket.price * ticket.quantity)}
                          </span>
                        </motion.div>
                      );
                    })
                ) : (
                  // Afficher les billets des pré-sélections
                  Object.entries(selectedTicketsState)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([ticketId, quantity], index) => {
                      const ticket = ticketTypes.find(t => t.id === parseInt(ticketId));
                      return (
                        <motion.div 
                          key={index} 
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{ticket?.name}</span>
                            <span className="text-gray-600 dark:text-gray-400"> × {quantity}</span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency(ticket ? ticket.price * quantity : 0)}
                          </span>
                        </motion.div>
                      );
                    })
                )}
                
                <motion.div 
                  className="border-t pt-2 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(finalTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Frais de service (5%)</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(serviceFee)}</span>
                  </div>
                  <motion.div 
                    className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Total</span>
                    <motion.span 
                      className="font-bold text-lg text-primary"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.8, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 500
                      }}
                    >
                      {formatCurrency(grandTotal)}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}