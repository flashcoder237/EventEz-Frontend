// src/components/payment/PaymentSuccessView.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface PaymentSuccessViewProps {
  event: any;
  registration: any;
  paymentId: string;
  paymentMethod: string;
}

export default function PaymentSuccessView({ 
  event,
  registration,
  paymentId,
  paymentMethod
}: PaymentSuccessViewProps) {
  const router = useRouter();
  
  // Lancer l'animation de confettis lorsque le composant est monté
  useEffect(() => {
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    // Lancer après un court délai pour laisser l'animation d'entrée se terminer
    const timer = setTimeout(launchConfetti, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Formater la date de façon lisible
  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Obtenir le libellé de la méthode de paiement
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'mtn_money': return 'MTN Mobile Money';
      case 'orange_money': return 'Orange Money';
      case 'credit_card': return 'Carte de crédit';
      case 'bank_transfer': return 'Virement bancaire';
      default: return 'Paiement en ligne';
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const successIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-8">
        <motion.div 
          className="inline-flex items-center justify-center h-24 w-24 bg-green-100 rounded-full mb-4"
          variants={successIconVariants}
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold mb-2"
          variants={itemVariants}
        >
          Paiement confirmé !
        </motion.h2>
        
        <motion.p 
          className="text-gray-600"
          variants={itemVariants}
        >
          Votre inscription a été enregistrée avec succès.
        </motion.p>
      </div>
      
      <motion.div 
        className="bg-gray-50 rounded-lg p-6 mb-6"
        variants={itemVariants}
      >
        <h3 className="font-semibold text-lg mb-4 pb-3 border-b border-gray-200">
          Détails de la commande
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Événement</p>
            <p className="font-medium">{event.title}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <p>{formatEventDate(event.start_date)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
            <p className="font-mono">{registration.id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Méthode de paiement</p>
            <p>{getPaymentMethodLabel(paymentMethod)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Montant total</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(registration.total_amount)}</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        variants={itemVariants}
      >
        <Button 
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger le reçu
        </Button>
        
        <Button 
          className="flex items-center justify-center bg-violet-600 hover:bg-violet-700"
          onClick={() => {/* Send email confirmation */}}
        >
          <Mail className="h-4 w-4 mr-2" />
          Envoyer par email
        </Button>
      </motion.div>
      
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <Button
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all transform hover:scale-105"
          onClick={() => router.push(`/events/${event.id}`)}
        >
          Retour à l'événement
        </Button>
        
        <p className="mt-4 text-sm text-gray-500">
          Une confirmation a été envoyée à votre adresse email
        </p>
      </motion.div>
    </motion.div>
  );
}