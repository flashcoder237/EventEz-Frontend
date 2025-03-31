// src/components/payment/form/PaymentMethodSelector.tsx
'use client';

import { motion } from 'framer-motion';
import { FaMobileAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  disabled?: boolean;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  logo?: string;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onSelectMethod,
  disabled = false
}: PaymentMethodSelectorProps) {
  
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'mtn_money',
      name: 'MTN MoMo',
      description: 'Paiement rapide via MTN Mobile Money',
      icon: <FaMobileAlt className="text-white" />,
      color: 'bg-yellow-400',
      logo: '/images/payments/mtn.png'
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      description: 'Paiement rapide via Orange Money',
      icon: <FaMobileAlt className="text-white" />,
      color: 'bg-orange-400',
      logo: '/images/payments/orange.png'
    },
    {
      id: 'credit_card',
      name: 'Carte de crédit',
      description: 'Visa, Mastercard, etc.',
      icon: <FaCreditCard className="text-white" />,
      color: 'bg-blue-600',
      logo: '/images/payments/credit-cards.png'
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
      <h3 className="text-sm font-medium text-gray-700 mb-3">Sélectionnez une méthode de paiement</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            className={`border rounded-xl p-4 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'} transition-all duration-300 
              ${selectedMethod === method.id 
                ? 'border-violet-500 bg-violet-50 shadow-sm' 
                : 'border-gray-200 hover:border-violet-300'}`}
            onClick={() => !disabled && onSelectMethod(method.id)}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center mb-2">
              <div className={`h-10 w-10 ${method.color} rounded-full flex items-center justify-center shadow-sm`}>
                {method.icon}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{method.name}</h3>
              </div>
              
              {/* Icône de vérification pour la méthode sélectionnée */}
              {selectedMethod === method.id && (
                <div className="ml-auto">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="h-6 w-6 bg-violet-100 rounded-full flex items-center justify-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-violet-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </motion.div>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500">{method.description}</p>
            
            {/* Logo si disponible */}
            {method.logo && (
              <div className={`mt-3 flex ${method.id === 'credit_card' ? 'justify-between' : 'justify-start'}`}>
                {method.id === 'credit_card' ? (
                  <>
                    <Image src="/images/payments/visa.png" alt="Visa" width={32} height={10} className="h-4 object-contain" />
                    <Image src="/images/payments/mastercard.png" alt="Mastercard" width={32} height={10} className="h-4 object-contain" />
                    <Image src="/images/payments/american-express.png" alt="AmEx" width={32} height={10} className="h-4 object-contain" />
                  </>
                ) : (
                  <Image src={method.logo} alt={method.name} width={40} height={16} className="h-5 object-contain" />
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Ligne de séparation décorée */}
      <div className="flex items-center mt-6 mb-2">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-3 text-xs text-gray-500 font-medium">PAIEMENT SÉCURISÉ</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
    </motion.div>
  );
}