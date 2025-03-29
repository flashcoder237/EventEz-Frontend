// src/components/payment/CreditCardForm.tsx
'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

interface CreditCardFormProps {
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCVC: string;
  setCardCVC: (value: string) => void;
}

export default function CreditCardForm({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCVC,
  setCardCVC
}: CreditCardFormProps) {
  
  // Formater le numéro de carte de crédit lors de la saisie
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formater la date d'expiration lors de la saisie
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Traiter le changement de numéro de carte
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Traiter le changement de date d'expiration
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setCardExpiry(formattedValue);
  };

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
      className="mb-6 space-y-4 rounded-lg border border-gray-100 p-5 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
          placeholder="Ex: John Doe"
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium mb-2">
          Numéro de carte
        </label>
        <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
          <div className="bg-gray-50 p-3 border-r border-gray-200">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="flex-1 p-3 focus:outline-none bg-white"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
            required
          />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            value={cardExpiry}
            onChange={handleExpiryChange}
            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            placeholder="MM/AA"
            maxLength={5}
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-2">
            Code de sécurité (CVC)
          </label>
          <input
            type="text"
            value={cardCVC}
            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            placeholder="XXX"
            maxLength={4}
            required
          />
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-2 flex items-center text-gray-500 text-xs"
        variants={itemVariants}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="h-4 w-4 mr-1"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Les transactions sont sécurisées et cryptées
      </motion.div>
    </motion.div>
  );
}