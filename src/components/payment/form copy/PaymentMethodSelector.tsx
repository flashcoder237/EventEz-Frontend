// src/components/payment/PaymentMethodSelector.tsx
'use client';

import { motion } from 'framer-motion';
import { FaMobileAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onSelectMethod 
}: PaymentMethodSelectorProps) {
  
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'mtn_money',
      name: 'MTN MoMo',
      description: 'Paiement mobile via MTN Money',
      icon: <FaMobileAlt className="text-white" />,
      color: 'bg-yellow-400'
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      description: 'Paiement mobile via Orange Money',
      icon: <FaMobileAlt className="text-white" />,
      color: 'bg-orange-400'
    },
    {
      id: 'credit_card',
      name: 'Carte de crédit',
      description: 'Visa, Mastercard, etc.',
      icon: <FaCreditCard className="text-white" />,
      color: 'bg-indigo-600'
    },
    {
      id: 'bank_transfer',
      name: 'Virement bancaire',
      description: 'Virement vers notre compte bancaire',
      icon: <FaMoneyBillWave className="text-white" />,
      color: 'bg-green-600'
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-300 
              ${selectedMethod === method.id 
                ? 'border-violet-500 bg-violet-50 shadow-sm' 
                : 'border-gray-200 hover:border-violet-300'}`}
            onClick={() => onSelectMethod(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-2">
              <div className={`h-10 w-10 ${method.color} rounded-full flex items-center justify-center shadow-sm`}>
                {method.icon}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{method.name}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-500">{method.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}