// src/components/payment/PaymentPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import { formatCurrency } from '@/lib/utils';

interface PaymentPageProps {
  event: any;
  registration: any;
  totalAmount?: number;
}

export default function PaymentPage({ event, registration, totalAmount: propsTotalAmount }: PaymentPageProps) {
  const router = useRouter();
  const { totalPrice: contextTotalPrice } = useTicketSelection();
  
  // Vérifier et s'assurer que le montant total est valide
  let resolvedTotalAmount = 0;
  
  // Si propsTotalAmount est défini et valide, l'utiliser
  if (propsTotalAmount !== undefined && propsTotalAmount !== null && !isNaN(propsTotalAmount)) {
    resolvedTotalAmount = propsTotalAmount;
  } 
  // Sinon, essayer d'utiliser contextTotalPrice
  else if (contextTotalPrice !== undefined && contextTotalPrice !== null && !isNaN(contextTotalPrice)) {
    resolvedTotalAmount = contextTotalPrice;
  }
  // Si tout échoue, calculer le montant à partir des billets de l'inscription
  else if (registration?.tickets?.length > 0) {
    resolvedTotalAmount = registration.tickets.reduce((acc: number, ticket: any) => {
      return acc + (ticket.total_price || 0);
    }, 0);
  }
  
  // Vérification finale - s'assurer d'avoir un montant valide
  if (resolvedTotalAmount === undefined || resolvedTotalAmount === null || isNaN(resolvedTotalAmount)) {
    resolvedTotalAmount = 0;
    console.warn("Attention: Le montant total est invalide, valeur par défaut à 0.");
  }
  
  // Garantir que c'est un nombre
  resolvedTotalAmount = Number(resolvedTotalAmount);
  
  // Calculer les frais de service (5% du total) et s'assurer qu'ils sont arrondis à 2 décimales
  const serviceFee = Number((Math.round(resolvedTotalAmount * 0.05 * 100) / 100).toFixed(2));
  
  // Calculer le total final et s'assurer qu'il est arrondi à 2 décimales
  const finalTotal = Number((Math.round((resolvedTotalAmount + serviceFee) * 100) / 100).toFixed(2));
  
  // Journalisation pour le débogage
  useEffect(() => {
    console.log("Détails des montants:");
    console.log("propsTotalAmount:", propsTotalAmount, typeof propsTotalAmount);
    console.log("contextTotalPrice:", contextTotalPrice, typeof contextTotalPrice);
    console.log("resolvedTotalAmount:", resolvedTotalAmount, typeof resolvedTotalAmount);
    console.log("serviceFee:", serviceFee, typeof serviceFee);
    console.log("finalTotal:", finalTotal, typeof finalTotal);
    
    if (registration?.tickets) {
      console.log("Billets de l'inscription:", registration.tickets);
    }
  }, [propsTotalAmount, contextTotalPrice, resolvedTotalAmount, serviceFee, finalTotal, registration]);
  
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-15"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Finaliser votre commande
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <PaymentForm 
            event={event} 
            registration={registration} 
            totalAmount={finalTotal} 
            serviceFee={serviceFee}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <OrderSummary 
            event={event} 
            registration={registration} 
            subtotal={resolvedTotalAmount}
            serviceFee={serviceFee}
            total={finalTotal}
          />
        </motion.div>
      </div>
      
      {/* Affichage des montants pour le débogage en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <h3 className="font-bold mb-2">Détails des montants (debug):</h3>
          <ul className="space-y-1">
            <li>Montant brut: {resolvedTotalAmount} ({typeof resolvedTotalAmount})</li>
            <li>Frais de service: {serviceFee} ({typeof serviceFee})</li>
            <li>Total final: {finalTotal} ({typeof finalTotal})</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}