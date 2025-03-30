// src/components/events/registration/ErrorMessage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start"
      >
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage;