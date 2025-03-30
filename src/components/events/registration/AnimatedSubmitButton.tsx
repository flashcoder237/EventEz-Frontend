'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface AnimatedSubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  finalTotal: number;
  grandTotal: number;
}

export function AnimatedSubmitButton({ 
  loading, 
  disabled, 
  finalTotal, 
  grandTotal 
}: AnimatedSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white relative overflow-hidden group"
    >
      {/* Animation de chargement */}
      <motion.span
        className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12"
        initial={{ x: "-100%" }}
        animate={loading ? { x: ["0%", "200%"] } : { x: "-100%" }}
        transition={loading ? { 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear" 
        } : {}}
      />
      
      {/* Contenu du bouton */}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex items-center"
      >
        {loading ? (
          <span className="flex items-center">
            <motion.div
              className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            Traitement...
          </span>
        ) : (
          <>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {finalTotal > 0 ? 'Procéder au paiement' : 'Confirmer l\'inscription'}
              {finalTotal > 0 && (
                <motion.span 
                  className="ml-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 500
                  }}
                >
                  {`(${formatCurrency(grandTotal)})`}
                </motion.span>
              )}
            </motion.span>
          </>
        )}
      </motion.span>
      
      {/* Effet de hover */}
      <motion.span
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/50 to-violet-600/50 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  );
}