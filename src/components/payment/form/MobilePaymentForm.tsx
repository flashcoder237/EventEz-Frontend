// src/components/payment/MobilePaymentForm.tsx
'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface MobilePaymentFormProps {
  provider: 'MTN' | 'Orange';
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

export default function MobilePaymentForm({
  provider,
  phoneNumber,
  setPhoneNumber
}: MobilePaymentFormProps) {
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
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

  const bgColor = provider === 'MTN' 
    ? 'bg-yellow-50 border-yellow-100' 
    : 'bg-orange-50 border-orange-100';
  
  const iconColor = provider === 'MTN' 
    ? 'text-yellow-500' 
    : 'text-orange-500';

  return (
    <motion.div 
      className={`mb-6 rounded-lg p-5 ${bgColor} border`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="font-medium mb-4 flex items-center">
        <motion.span 
          className={`inline-flex mr-2 ${iconColor}`}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, -15, 15, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Phone size={18} />
        </motion.span>
        Numéro de téléphone {provider}
      </h3>

      <div>
        <div className="flex border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all bg-white">
          <div className={`p-3 border-r ${provider === 'MTN' ? 'bg-yellow-50' : 'bg-orange-50'}`}>
            <Phone className={`h-5 w-5 ${provider === 'MTN' ? 'text-yellow-500' : 'text-orange-500'}`} />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              // Accepter uniquement les chiffres et limiter à 12 caractères
              const value = e.target.value.replace(/\D/g, '').slice(0, 12);
              setPhoneNumber(value);
            }}
            placeholder="Saisissez votre numéro de téléphone"
            className="flex-1 p-3 focus:outline-none"
            required
          />
        </div>
        
        <motion.div 
          className="mt-4 p-3 bg-white rounded-md border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 mb-2">
            <strong>Comment ça marche:</strong>
          </p>
          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
            <li>Vous recevrez une notification sur votre téléphone</li>
            <li>Validez le paiement avec votre code {provider}</li>
            <li>Une confirmation s'affichera automatiquement</li>
          </ol>
        </motion.div>
      </div>
    </motion.div>
  );
}