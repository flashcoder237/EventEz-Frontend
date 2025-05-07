'use client';

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  router: ReturnType<typeof useRouter>;
}

export default function SuccessMessage({ router }: SuccessMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Événement créé avec succès!</h2>
        <p className="text-gray-600 mb-6">
          Votre événement a été enregistré et sera bientôt disponible pour les participants.
        </p>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Retour au tableau de bord
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Créer un autre événement
          </button>
        </div>
      </div>
    </motion.div>
  );
}