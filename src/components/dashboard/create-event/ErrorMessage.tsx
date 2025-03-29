import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div 
      className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </motion.div>
  );
}