// src/components/payment/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { paymentsAPI, registrationsAPI } from '@/lib/api';
import { ArrowLeft, ChevronsRight, AlertCircle } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCardForm';
import MobilePaymentForm from './MobilePaymentForm';
import BankTransferInfo from './BankTransferInfo';
import { formatCurrency } from '@/lib/utils';

interface PaymentFormProps {
  event: any;
  registration: any;
  totalAmount: number;
  serviceFee: number;
}

export default function PaymentForm({ 
  event, 
  registration, 
  totalAmount, 
  serviceFee 
}: PaymentFormProps) {
  const router = useRouter();
  const { clearSelection } = useTicketSelection();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Informations de carte de crédit
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier si le montant total est valide
      if (totalAmount === undefined || totalAmount === null || isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error('Le montant total n\'est pas valide. Veuillez recharger la page ou contacter le support.');
      }
      
      // Validation de base pour chaque méthode de paiement
      if (paymentMethod === 'mtn_money' || paymentMethod === 'orange_money') {
        if (!phoneNumber || phoneNumber.length < 9) {
          throw new Error('Veuillez saisir un numéro de téléphone valide');
        }
      } else if (paymentMethod === 'credit_card') {
        if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
          throw new Error('Veuillez remplir tous les champs de la carte de crédit');
        }
        
        if (cardNumber.replace(/\s+/g, '').length < 16) {
          throw new Error('Le numéro de carte est invalide');
        }
        
        if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
          throw new Error('La date d\'expiration est invalide (format MM/AA)');
        }
        
        if (cardCVC.length < 3) {
          throw new Error('Le code de sécurité est invalide');
        }
      } else if (paymentMethod === 'bank_transfer') {
        // Pour un virement bancaire, nous n'avons pas besoin de validation supplémentaire
      } else {
        throw new Error('Veuillez sélectionner une méthode de paiement');
      }
      
      // S'assurer que le montant est un nombre et l'arrondir à 2 décimales
      const roundedAmount = Number((Math.round(totalAmount * 100) / 100).toFixed(2));
      
      console.log("Montant envoyé à l'API:", roundedAmount, typeof roundedAmount);
      
      // Créer un paiement pour l'inscription
      const paymentData = {
        registration: registration.id,
        amount: roundedAmount,  // Utiliser le montant arrondi et formaté correctement
        currency: 'XAF',
        payment_method: paymentMethod,
        billing_name: cardName || 'Client',
        billing_email: '',
        billing_phone: phoneNumber || '',
        billing_address: '',
        is_usage_based: false,
      };
      
      const response = await paymentsAPI.createPayment(paymentData);
      const paymentId = response.data.id;
      
      // Traiter le paiement en fonction de la méthode
      if (paymentMethod === 'mtn_money' || paymentMethod === 'orange_money') {
        // Pour Mobile Money, rediriger vers la page de traitement en attente de confirmation
        router.push(`/events/${event.id}/register/payment/processing?registration=${registration.id}&payment=${paymentId}&method=${paymentMethod}`);
      } else if (paymentMethod === 'credit_card') {
        try {
          // Simuler un traitement de carte de crédit
          const processingResult = await processPayment(paymentId);
          
          if (processingResult && processingResult.success) {
            // Mettre à jour le statut de l'inscription pour la marquer comme confirmée
            await registrationsAPI.patchRegistration(registration.id, {
              status: 'confirmed',
              payment_status: 'paid'
            });
            
            // Rediriger vers la confirmation après succès
            router.push(`/events/${event.id}/register/confirmation?registration=${registration.id}`);
          } else {
            throw new Error("Le traitement de la carte a échoué");
          }
        } catch (error) {
          console.error("Erreur lors du traitement de la carte:", error);
          setError("Le traitement de la carte a échoué. Veuillez réessayer.");
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'bank_transfer') {
        // Pour un virement bancaire, l'inscription reste en statut pending
        router.push(`/events/${event.id}/register/payment/bank-transfer?registration=${registration.id}&payment=${paymentId}`);
      }
      
      // Nettoyer le contexte de sélection des billets
      clearSelection();
      
    } catch (err: any) {
      console.error('Erreur lors du traitement du paiement:', err);
      
      if (err.response && err.response.data) {
        // Afficher les erreurs de validation de l'API de manière plus conviviale
        const apiErrors = err.response.data;
        
        if (apiErrors.amount) {
          setError(`Erreur de montant: ${apiErrors.amount[0]}`);
        } else if (apiErrors.detail) {
          setError(apiErrors.detail);
        } else {
          // Créer un message d'erreur à partir de toutes les erreurs de validation
          const errorMessages = [];
          for (const [field, messages] of Object.entries(apiErrors)) {
            errorMessages.push(`${field}: ${(messages as string[]).join(', ')}`);
          }
          setError(errorMessages.join('; ') || 'Une erreur est survenue lors du traitement du paiement');
        }
      } else {
        setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour simuler le traitement du paiement
  const processPayment = async (paymentId: string) => {
    try {
      // Appeler l'API de traitement de paiement
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          method: paymentMethod,
          phoneNumber: phoneNumber || undefined,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du traitement du paiement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden">
      <motion.h2 
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Choisissez votre méthode de paiement
      </motion.h2>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handlePayment}>
        <PaymentMethodSelector 
          selectedMethod={paymentMethod} 
          onSelectMethod={setPaymentMethod} 
        />
        
        <AnimatePresence mode="wait">
          {paymentMethod === 'mtn_money' || paymentMethod === 'orange_money' ? (
            <MobilePaymentForm
              key="mobile"
              provider={paymentMethod === 'mtn_money' ? 'MTN' : 'Orange'}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          ) : paymentMethod === 'credit_card' ? (
            <CreditCardForm
              key="card"
              cardName={cardName}
              setCardName={setCardName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCVC={cardCVC}
              setCardCVC={setCardCVC}
            />
          ) : paymentMethod === 'bank_transfer' ? (
            <BankTransferInfo key="bank" />
          ) : null}
        </AnimatePresence>
        
        {/* Détails du montant pour debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-500">
            <p>Montant Total (sans frais de transaction): {totalAmount ? Number((Math.round(totalAmount * 100) / 100).toFixed(2)) : 'N/A'} FCFA</p>
           
          </div>
        )}
        
        {/* Boutons */}
        <motion.div 
          className="flex items-center justify-between mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <button
            type="button"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => router.push(`/events/${event.id}?tab=tickets`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          
          <Button
            type="submit"
            disabled={!paymentMethod || loading}
            className={`flex items-center text-white ${!paymentMethod ? 'bg-gray-400' : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'} transition-all duration-300 transform hover:scale-105`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
            ) : (
              <>
                Confirmer et payer
                <ChevronsRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}