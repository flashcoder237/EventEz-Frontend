'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface TermsAndConditionsProps {
  finalTotal: number;
}

export function TermsAndConditions({ finalTotal }: TermsAndConditionsProps) {
  return (
    <motion.div 
      className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ 
        delay: 0.4, 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <motion.div 
        className="flex items-start"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <Info className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <motion.p 
            className="text-sm text-indigo-800 dark:text-indigo-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            En cliquant sur "Continuer", vous acceptez nos conditions générales et notre politique de confidentialité.
            {finalTotal > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                {" Vous serez redirigé vers l'écran de paiement pour finaliser votre achat."}
              </motion.span>
            )}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}