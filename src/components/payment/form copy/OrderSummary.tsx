// src/components/payment/OrderSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Calendar, Shield, CreditCard, Clock } from 'lucide-react';

interface OrderSummaryProps {
  event: any;
  registration: any;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export default function OrderSummary({ 
  event, 
  registration, 
  subtotal, 
  serviceFee, 
  total
}: OrderSummaryProps) {
  const { selectedTickets } = useTicketSelection();
  const [showTickets, setShowTickets] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Afficher les détails des billets après un court délai pour l'animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTickets(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Formater la date de l'événement
  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sticky top-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Élément de design décoratif - vague en haut */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500"></div>
      
      <motion.h3 
        className="font-bold text-xl mb-5 pb-3 border-b border-gray-100 text-gray-800"
        variants={itemVariants}
      >
        Résumé de votre commande
      </motion.h3>
      
      <motion.div 
        className="mb-6 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 backdrop-blur-sm border border-violet-100"
        variants={itemVariants}
      >
        <h4 className="font-semibold text-violet-900 mb-2">{event.title}</h4>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-violet-500" />
          <p>{formatEventDate(event.start_date)}</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="border-b border-gray-100 pt-2 pb-5 mb-5"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">Vos billets</h4>
          {showTickets && (
            <motion.span 
              className="text-xs bg-green-100 text-green-800 py-1 px-2.5 rounded-full flex items-center shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Sélectionné
            </motion.span>
          )}
        </div>
        
        {/* Tickets animation container */}
        <div className="space-y-3">
          {/* Afficher les billets sélectionnés du contexte */}
          {showTickets && Object.values(selectedTickets).length > 0 && (
            <>
              {Object.values(selectedTickets)
                .filter(ticket => ticket.quantity > 0)
                .map((ticket, index) => (
                  <motion.div 
                    key={index} 
                    className="flex justify-between items-center bg-gray-50 p-3.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <div className="w-1.5 h-12 bg-violet-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-sm font-medium block">{ticket.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-200 mt-1 px-1.5 py-0.5 rounded-full inline-block">×{ticket.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(ticket.price * ticket.quantity)}</span>
                  </motion.div>
                ))
              }
            </>
          )}
          
          {/* Ou afficher les billets de l'inscription existante */}
          {showTickets && Object.values(selectedTickets).length === 0 && registration?.tickets?.length > 0 && (
            <>
              {registration.tickets.map((ticket: any, index: number) => (
                <motion.div 
                  key={index} 
                  className="flex justify-between items-center bg-gray-50 p-3.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center">
                    <div className="w-1.5 h-12 bg-violet-400 rounded-full mr-3"></div>
                    <div>
                      <span className="text-sm font-medium block">{ticket.ticket_type_name}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 mt-1 px-1.5 py-0.5 rounded-full inline-block">×{ticket.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{formatCurrency(ticket.total_price)}</span>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Sous-total</span>
          <span className="text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Frais de service (5%)</span>
          <span className="text-gray-800">{formatCurrency(serviceFee)}</span>
        </div>
        
        <motion.div 
          className="flex justify-between font-bold pt-3 border-t border-gray-200 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-gray-800">Total</span>
          <motion.span 
            className="text-lg bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          >
            {formatCurrency(total)}
          </motion.span>
        </motion.div>
      </motion.div>
      
      {/* Informations sur la sécurité des paiements - Version améliorée */}
      <motion.div 
        className="mt-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-500 font-medium">PAIEMENT SÉCURISÉ</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div 
            className="bg-gray-50 rounded-lg p-3 flex flex-col items-center border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
          >
            <Shield className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-xs text-gray-600 text-center">Paiement sécurisé</span>
          </motion.div>
          
          <motion.div 
            className="bg-gray-50 rounded-lg p-3 flex flex-col items-center border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
          >
            <CreditCard className="h-5 w-5 text-indigo-500 mb-1" />
            <span className="text-xs text-gray-600 text-center">Multiple méthodes</span>
          </motion.div>
          
          <motion.div 
            className="bg-gray-50 rounded-lg p-3 flex flex-col items-center border border-gray-100"
            whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
          >
            <Clock className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-xs text-gray-600 text-center">Traitement rapide</span>
          </motion.div>
        </div>
        
        <div className="flex justify-center space-x-3 mt-4">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image src="/images/payments/visa.png" alt="Visa" width={36} height={2} className="grayscale hover:grayscale-0 transition-all" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image src="/images/payments/mastercard.png" alt="Mastercard" width={36} height={10} className="grayscale hover:grayscale-0 transition-all" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image src="/images/payments/mtn.png" alt="MTN" width={28} height={10} className="grayscale hover:grayscale-0 transition-all" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image src="/images/payments/orange.png" alt="Orange" width={28} height={10} className="grayscale hover:grayscale-0 transition-all" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}