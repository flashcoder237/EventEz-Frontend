'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ 
            duration: 0.3,
            type: "spring", 
            stiffness: 500, 
            damping: 30
          }}
          className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start overflow-hidden"
        >
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          </motion.div>
          <div>
            <motion.p 
              className="text-sm text-red-800 dark:text-red-300"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {error}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}