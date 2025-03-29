import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FaPlus } from 'react-icons/fa';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick
}: EmptyStateProps) {
  return (
    <motion.div 
      className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mx-auto h-12 w-12 text-gray-300 mb-4 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icon}
      </motion.div>
      <motion.h4 
        className="text-lg font-medium text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {title}
      </motion.h4>
      <motion.p 
        className="mt-2 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          type="button" 
          onClick={onClick} 
          className="mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" />
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}