// src/components/payment/PaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { paymentsAPI, registrationsAPI } from '@/lib/api';
import { CreditCard, Phone, ChevronsRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { FaMobileAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface PaymentFormProps {
  event: any;
  registration: any;
  totalAmount?: number;
}

export default function PaymentForm({ event, registration, totalAmount: propsTotalAmount }: PaymentFormProps) {
  const router = useRouter();
  const { selectedTickets, totalPrice: contextTotalPrice, clearSelection } = useTicketSelection();
  
  // Utiliser le montant total des props si fourni, sinon utiliser celui du contexte
  const totalAmount = propsTotalAmount !== undefined ? propsTotalAmount : contextTotalPrice;
  
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Informations de carte de crédit
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Formater le numéro de carte de crédit lors de la saisie
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formater la date d'expiration lors de la saisie
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Traiter le changement de numéro de carte
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Traiter le changement de date d'expiration
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setCardExpiry(formattedValue);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
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
      
      // Créer un paiement pour l'inscription
      const paymentData = {
        registration: registration.id,
        amount: totalAmount,
        currency: 'XAF',
        payment_method: paymentMethod,
        billing_name: session?.user?.name || cardName || 'Client',
        billing_email: session?.user?.email || '',
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
        // Simuler un traitement de carte de crédit
        await processPayment(paymentId);
        
        // Rediriger vers la confirmation après succès
        router.push(`/events/${event.id}/register/confirmation?registration=${registration.id}`);
      } else if (paymentMethod === 'bank_transfer') {
        // Pour un virement bancaire, afficher les instructions
        router.push(`/events/${event.id}/register/payment/bank-transfer?registration=${registration.id}&payment=${paymentId}`);
      }
      
      // Nettoyer le contexte de sélection des billets
      clearSelection();
      
    } catch (err) {
      console.error('Erreur lors du traitement du paiement:', err);
      setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
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

  // Lorsque la page est chargée, vérifier si nous avons des billets sélectionnés
  useEffect(() => {
    // Si l'inscription vient d'une autre page et nous n'avons pas de sélection,
    // récupérer les détails des tickets depuis l'inscription pour l'affichage
    if (contextTotalPrice === 0 && registration?.tickets?.length > 0) {
      // L'inscription a déjà des billets, pas besoin d'utiliser la sélection
    }
  }, [registration, contextTotalPrice]);

  // Calculer les frais de service (5% du total)
  const serviceFee = Math.round(totalAmount * 0.05);
  const finalTotal = totalAmount + serviceFee;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulaire de paiement */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-bold mb-6">Choisissez votre méthode de paiement</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handlePayment}>
            {/* Options de paiement */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`border rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors ${paymentMethod === 'mtn_money' ? 'border-purple-500 bg-purple-50' : ''}`}
                  onClick={() => setPaymentMethod('mtn_money')}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <FaMobileAlt className="text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">MTN MoMo</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Paiement mobile via MTN Money</p>
                </div>
                
                <div 
                  className={`border rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors ${paymentMethod === 'orange_money' ? 'border-purple-500 bg-purple-50' : ''}`}
                  onClick={() => setPaymentMethod('orange_money')}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-orange-400 rounded-full flex items-center justify-center">
                      <FaMobileAlt className="text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Orange Money</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Paiement mobile via Orange Money</p>
                </div>
                
                <div 
                  className={`border rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors ${paymentMethod === 'credit_card' ? 'border-purple-500 bg-purple-50' : ''}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FaCreditCard className="text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Carte de crédit</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Visa, Mastercard, etc.</p>
                </div>
                
                <div 
                  className={`border rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors ${paymentMethod === 'bank_transfer' ? 'border-purple-500 bg-purple-50' : ''}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                      <FaMoneyBillWave className="text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Virement bancaire</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Virement vers notre compte bancaire</p>
                </div>
              </div>
            </div>
            
            {/* Champs spécifiques pour chaque méthode de paiement */}
            {(paymentMethod === 'mtn_money' || paymentMethod === 'orange_money') && (
              <div className="mb-6">
                <h3 className="font-medium mb-4">
                  Numéro de téléphone {paymentMethod === 'mtn_money' ? 'MTN' : 'Orange'}
                </h3>
                <div>
                  <div className="flex border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-r">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Saisissez votre numéro de téléphone"
                      className="flex-1 p-3 focus:outline-none"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Vous recevrez une notification de paiement sur ce numéro.
                  </p>
                </div>
              </div>
            )}
            
            {paymentMethod === 'credit_card' && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    placeholder="Ex: John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Numéro de carte
                  </label>
                  <div className="flex border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-r">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="flex-1 p-3 focus:outline-none"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full p-3 border rounded-md"
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Code de sécurité (CVC)
                    </label>
                    <input
                      type="text"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full p-3 border rounded-md"
                      placeholder="XXX"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'bank_transfer' && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-blue-800">Informations pour le virement bancaire</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Après avoir confirmé votre commande, vous recevrez les coordonnées bancaires pour effectuer votre virement.
                </p>
                <p className="text-sm text-blue-700">
                  Veuillez noter que votre inscription sera confirmée uniquement après réception du paiement.
                </p>
              </div>
            )}
            
            {/* Boutons */}
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                className="flex items-center text-gray-600 hover:text-gray-800"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </button>
              
              <Button
                type="submit"
                disabled={!paymentMethod || loading}
                className="flex items-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
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
            </div>
          </form>
        </div>
        
        {/* Résumé de la commande */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Résumé de votre commande</h3>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">{event.title}</h4>
            <p className="text-sm text-gray-600">
              {new Date(event.start_date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="font-medium mb-2">Billets</h4>
            
            {/* Afficher les billets sélectionnés du contexte */}
            {Object.values(selectedTickets).length > 0 && (
              <div className="space-y-2">
                {Object.values(selectedTickets)
                  .filter(ticket => ticket.quantity > 0)
                  .map((ticket, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="text-sm">{ticket.name}</span>
                        <span className="text-xs text-gray-500 ml-1">×{ticket.quantity}</span>
                      </div>
                      <span className="text-sm">{formatCurrency(ticket.price * ticket.quantity)}</span>
                    </div>
                  ))
                }
              </div>
            )}
            
            {/* Ou afficher les billets de l'inscription existante */}
            {Object.values(selectedTickets).length === 0 && registration?.tickets?.length > 0 && (
              <div className="space-y-2">
                {registration.tickets.map((ticket: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="text-sm">{ticket.ticket_type_name}</span>
                      <span className="text-xs text-gray-500 ml-1">×{ticket.quantity}</span>
                    </div>
                    <span className="text-sm">{formatCurrency(ticket.total_price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Sous-total</span>
              <span className="text-sm">{formatCurrency(totalAmount)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-sm">Frais de service (5%)</span>
              <span className="text-sm">{formatCurrency(serviceFee)}</span>
            </div>
            
            <div className="flex justify-between font-bold mt-4 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
          
          {/* Informations sur la sécurité des paiements */}
          <div className="mt-6 text-center">
            <div className="flex justify-center mb-2">
              <Image 
                src="/secure-payment.png" 
                alt="Paiement sécurisé" 
                width={120} 
                height={40}
                className="opacity-70"
              />
            </div>
            <p className="text-xs text-gray-500">
              Toutes les transactions sont sécurisées et chiffrées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}