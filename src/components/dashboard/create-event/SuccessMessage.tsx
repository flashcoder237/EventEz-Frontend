import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FaCalendarAlt } from 'react-icons/fa';
import { NextRouter } from 'next/router';

interface SuccessMessageProps {
  router: NextRouter;
}

export default function SuccessMessage({ router }: SuccessMessageProps) {
  return (
    <div className="p-6">
      <motion.div 
        className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCalendarAlt className="text-green-500 text-2xl" />
          </div>
        </motion.div>
        <motion.h2 
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Événement créé avec succès !
        </motion.h2>
        <motion.p 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Votre événement a été créé et sera bientôt disponible sur la plateforme.
        </motion.p>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button onClick={() => router.push('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}