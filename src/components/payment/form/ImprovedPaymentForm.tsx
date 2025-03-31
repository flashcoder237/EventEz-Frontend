// src/components/payment/form/ImprovedPaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { paymentsAPI, registrationsAPI } from '@/lib/api';
import { ArrowLeft, ChevronsRight, AlertTriangle, Loader, CheckCircle } from 'lucide-react';
import { paymentVerificationService } from '@/lib/services/paymentVerificationService';

// Importer les composants
import PaymentMethodSelector from './PaymentMethodSelector';
import CreditCardForm from './CreditCardForm';
import EnhancedMobilePaymentForm from './EnhancedMobilePaymentForm';
import BankTransferInfo from './BankTransferInfo';

interface ImprovedPaymentFormProps {
  event: any;
  registration: any;
  totalAmount: number;
  serviceFee: number;
}

// États possibles du processus de paiement
type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'failed';
type MobileProcessingStatus = 'waiting' | 'verifying' | 'success' | 'failed';

export default function ImprovedPaymentForm({ 
  event, 
  registration, 
  totalAmount, 
  serviceFee 
}: ImprovedPaymentFormProps) {
  const router = useRouter();
  const { clearSelection } = useTicketSelection();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [mobileProcessingStatus, setMobileProcessingStatus] = useState<MobileProcessingStatus>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Données de paiement mobile
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
  // Informations de carte de crédit
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Arrêter la vérification du paiement lors du démontage du composant
  useEffect(() => {
    return () => {
      paymentVerificationService.stopVerification();
    };
  }, []);

  const handleInitiateMobilePayment = async () => {
    try {
      setPaymentStatus('processing');
      setMobileProcessingStatus('waiting');
      setError(null);
      
      // Validation du numéro de téléphone - assurez-vous que phoneNumber existe
      if (!phoneNumber || (phoneNumber && phoneNumber.replace(/\D/g, '').length < 9)) {
        setError('Veuillez saisir un numéro de téléphone valide');
        setPaymentStatus('idle');
        return;
      }
      
      // Vérifier si le montant total est valide
      if (totalAmount <= 0) {
        setError('Le montant total n\'est pas valide');
        setPaymentStatus('idle');
        return;
      }
      
      // S'assurer que la méthode de paiement est définie
      if (paymentMethod !== 'mtn_money' && paymentMethod !== 'orange_money') {
        setError('Méthode de paiement invalide');
        setPaymentStatus('idle');
        return;
      }
      
      // Créer un paiement pour l'inscription s'il n'existe pas déjà
      let paymentRecord;
      
      if (!paymentId) {
        // Créer un nouveau paiement
        const paymentData = {
          registration: registration.id,
          amount: totalAmount,
          currency: 'XAF',
          payment_method: paymentMethod,
          billing_name: 'Client',
          billing_email: '',
          billing_phone: phoneNumber,
          billing_address: '',
          is_usage_based: false,
        };
        
        const response = await paymentsAPI.createPayment(paymentData);
        paymentRecord = response.data;
        setPaymentId(paymentRecord.id);
      } else {
        // Utiliser le paiement existant
        const response = await paymentsAPI.getPayment(paymentId);
        paymentRecord = response.data;
      }
      const safePhoneNumber = phoneNumber || '';
      // Initialiser le paiement mobile via l'API
      const paymentResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          paymentId: paymentRecord.id,
          method: paymentMethod,
          phoneNumber: phoneNumber.replace(/\D/g, '')
        }),
      });
      
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Erreur lors de l\'initialisation du paiement');
      }
      
      const paymentResult = await paymentResponse.json();
      
      if (paymentResult.success) {
        // Le paiement a été initialisé avec succès
        // Pour les paiements mobiles, on passe en mode "vérification"
        setMobileProcessingStatus('verifying');
        
        // Démarrer la vérification périodique
        paymentVerificationService.startVerification(
          paymentRecord.id,
          5000, // Vérifier toutes les 5 secondes
          () => {
            // À chaque vérification
            setPaymentStatus('verifying');
          },
          () => {
            // En cas de succès
            setMobileProcessingStatus('success');
            setPaymentStatus('success');
            
            // Nettoyer le contexte de sélection des billets
            clearSelection();
            
            // Rediriger vers la page de confirmation après un court délai
            setTimeout(() => {
              router.push(`/events/${event.id}/register/confirmation?registration=${registration.id}`);
            }, 2000);
          },
          (error) => {
            // En cas d'échec
            setMobileProcessingStatus('failed');
            setPaymentStatus('failed');
            setError(error.message || 'Le paiement a échoué');
          },
          () => {
            // En cas de timeout
            setMobileProcessingStatus('failed');
            setPaymentStatus('failed');
            setError('Le délai de paiement a expiré. Veuillez réessayer.');
          }
        );
      } else {
        // Erreur lors de l'initialisation du paiement
        setMobileProcessingStatus('failed');
        setPaymentStatus('failed');
        setError(paymentResult.data?.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (err) {
      console.error('Erreur lors du traitement du paiement mobile:', err);
      setMobileProcessingStatus('failed');
      setPaymentStatus('failed');
      setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Vérifier si le montant total est valide
      if (totalAmount <= 0) {
        setError('Le montant total n\'est pas valide');
        return;
      }
      
      // Validation de base pour chaque méthode de paiement
      if (paymentMethod === 'mtn_money' || paymentMethod === 'orange_money') {
        // Utiliser la fonction dédiée pour les paiements mobiles
        await handleInitiateMobilePayment();
        return;
      } else if (paymentMethod === 'credit_card') {
        setPaymentStatus('processing');
        
        // Validation des champs de carte
        if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
          setError('Veuillez remplir tous les champs de la carte de crédit');
          setPaymentStatus('idle');
          return;
        }
        
        if (cardNumber.replace(/\s+/g, '').length < 16) {
          setError('Le numéro de carte est invalide');
          setPaymentStatus('idle');
          return;
        }
        
        if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
          setError('La date d\'expiration est invalide (format MM/AA)');
          setPaymentStatus('idle');
          return;
        }
        
        if (cardCVC.length < 3) {
          setError('Le code de sécurité est invalide');
          setPaymentStatus('idle');
          return;
        }
        
        // Créer un paiement pour l'inscription s'il n'existe pas déjà
        let paymentRecord;
        
        if (!paymentId) {
          // Créer un nouveau paiement
          const paymentData = {
            registration: registration.id,
            amount: totalAmount,
            currency: 'XAF',
            payment_method: 'credit_card',
            billing_name: cardName,
            billing_email: '',
            billing_phone: '',
            billing_address: '',
            is_usage_based: false,
          };
          
          const response = await paymentsAPI.createPayment(paymentData);
          paymentRecord = response.data;
          setPaymentId(paymentRecord.id);
        } else {
          // Utiliser le paiement existant
          const response = await paymentsAPI.getPayment(paymentId);
          paymentRecord = response.data;
        }
        
        // Traiter le paiement par virement bancaire
        const paymentResponse = await fetch('/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentRecord.id,
            method: 'bank_transfer'
          }),
        });
        
        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || 'Erreur lors du traitement du paiement');
        }
        
        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
          // Le paiement a été enregistré comme en attente
          setPaymentStatus('success');
          
          // Nettoyer le contexte de sélection des billets
          clearSelection();
          
          // Rediriger vers la page d'instructions pour le virement bancaire
          router.push(`/events/${event.id}/register/payment/bank-transfer?registration=${registration.id}&payment=${paymentRecord.id}`);
        } else {
          // Erreur lors du traitement du paiement
          setPaymentStatus('failed');
          setError(paymentResult.data?.message || 'Erreur lors du traitement du paiement');
        }
      } else {
        setError('Veuillez sélectionner une méthode de paiement');
      }
    } catch (err) {
      console.error('Erreur lors du traitement du paiement:', err);
      setPaymentStatus('failed');
      setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
    } finally {
      if (paymentStatus === 'processing') {
        setPaymentStatus('idle');
      }
    }
  };

  // Rendu conditionnel pour le succès du paiement
  if (paymentStatus === 'success' && paymentMethod !== 'mtn_money' && paymentMethod !== 'orange_money') {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-10">
          <motion.div 
            className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Paiement traité avec succès !</h2>
          <p className="text-gray-600 mb-8">
            Votre transaction a été complétée et vous allez être redirigé vers la page de confirmation.
          </p>
          <div className="flex justify-center">
            <div className="loader">
              <div className="dot-flashing"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handlePayment}>
        <PaymentMethodSelector 
          selectedMethod={paymentMethod} 
          onSelectMethod={setPaymentMethod} 
          disabled={paymentStatus !== 'idle'}
        />
        
        <AnimatePresence mode="wait">
          {paymentMethod === 'mtn_money' && (
            <EnhancedMobilePaymentForm
              key="mtn"
              provider="MTN"
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onInitiatePayment={handleInitiateMobilePayment}
              isProcessing={paymentStatus !== 'idle'}
              processingStatus={mobileProcessingStatus}
              errorMessage={error || undefined}
            />
          )}
          
          {paymentMethod === 'orange_money' && (
            <EnhancedMobilePaymentForm
              key="orange"
              provider="Orange"
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onInitiatePayment={handleInitiateMobilePayment}
              isProcessing={paymentStatus !== 'idle'}
              processingStatus={mobileProcessingStatus}
              errorMessage={error || undefined}
            />
          )}
          
          {paymentMethod === 'credit_card' && (
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
          )}
          
          {paymentMethod === 'bank_transfer' && (
            <BankTransferInfo key="bank" />
          )}
        </AnimatePresence>
        
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
            disabled={paymentStatus !== 'idle'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          
          {(paymentMethod !== 'mtn_money' && paymentMethod !== 'orange_money') && (
            <Button
              type="submit"
              disabled={!paymentMethod || paymentStatus !== 'idle'}
              className={`flex items-center text-white ${!paymentMethod ? 'bg-gray-400' : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'} transition-all duration-300 transform hover:scale-105`}
            >
              {paymentStatus === 'processing' ? (
                <span className="flex items-center">
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Traitement...
                </span>
              ) : (
                <>
                  Confirmer et payer
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </motion.div>
      </form>
      
      {/* Styles CSS pour l'animation de chargement */}
      <style jsx>{`
        .loader {
          display: inline-block;
        }
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6366f1;
          color: #6366f1;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6366f1;
          color: #6366f1;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6366f1;
          color: #6366f1;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dot-flashing {
          0% {
            background-color: #6366f1;
          }
          50%, 100% {
            background-color: rgba(99, 102, 241, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
        