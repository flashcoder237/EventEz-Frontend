// src/components/payment/BankTransferInfo.tsx
'use client';

import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

export default function BankTransferInfo() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div 
      className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="flex items-start"
        variants={itemVariants}
      >
        <div className="mr-3 mt-1">
          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <InfoIcon size={18} className="text-indigo-700" />
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2 text-indigo-800">Informations pour le virement bancaire</h3>
          <p className="text-sm text-indigo-700 mb-4">
            Après avoir confirmé votre commande, vous recevrez les coordonnées bancaires pour effectuer votre virement.
          </p>
          <p className="text-sm text-indigo-700">
            Veuillez noter que votre inscription sera confirmée uniquement après réception du paiement.
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-5 bg-white rounded-md border border-indigo-100 p-4"
        variants={itemVariants}
      >
        <h4 className="font-medium text-sm mb-2 text-gray-700">Instructions de paiement</h4>
        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
          <li>Effectuez un virement vers notre compte bancaire</li>
          <li>Incluez votre numéro d'inscription comme référence</li>
          <li>Conservez votre reçu de virement bancaire</li>
          <li>Une confirmation vous sera envoyée par email</li>
        </ol>
      </motion.div>

      <motion.div 
        className="mt-4 text-sm text-indigo-600 flex items-center"
        variants={itemVariants}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-1"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        Le délai de traitement est généralement de 24 à 48 heures ouvrables
      </motion.div>
    </motion.div>
  );
}