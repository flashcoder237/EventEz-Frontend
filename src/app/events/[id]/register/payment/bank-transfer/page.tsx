// src/app/events/[id]/register/payment/bank-transfer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { eventsAPI, registrationsAPI, paymentsAPI } from '@/lib/api';
import { 
  ArrowLeft, 
  Copy, 
  CheckCircle, 
  Building, // ou Landmark
  Send,
  Printer,
  Download
} from 'lucide-react';

// Types pour les paramètres et état
interface BankTransferPageProps {
  params: { id: string };
  searchParams: { 
    registration: string;
    payment: string;
  };
}

export default function BankTransferPage({ params, searchParams }: BankTransferPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  // Détails bancaires fictifs - À remplacer par les vrais détails
  const bankDetails = {
    bankName: 'Banque Atlantique Cameroun',
    accountName: 'EventEz SAS',
    accountNumber: '0056-7890-1234-5678',
    swiftCode: 'ATLCCMCX',
    referencePrefix: 'EZ-PAY-',
    branchName: 'Agence Principale Douala',
    address: 'Boulevard de la Liberté, Douala, Cameroun'
  };
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?redirect=/events/${params.id}/register/payment/bank-transfer?registration=${searchParams.registration}&payment=${searchParams.payment}`);
      return;
    }
    
    // Charger les données
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Vérifier les paramètres
        if (!searchParams.registration || !searchParams.payment) {
          throw new Error('Paramètres manquants');
        }
        
        // Récupérer les données de l'événement
        const eventResponse = await eventsAPI.getEvent(params.id);
        setEvent(eventResponse.data);
        
        // Récupérer les données de l'inscription
        const registrationResponse = await registrationsAPI.getRegistration(searchParams.registration);
        setRegistration(registrationResponse.data);
        
        // Récupérer les données du paiement
        const paymentResponse = await paymentsAPI.getPayment(searchParams.payment);
        setPayment(paymentResponse.data);
        
        // Vérifier que le paiement correspond à l'inscription
        if (paymentResponse.data.registration !== searchParams.registration) {
          throw new Error('Le paiement ne correspond pas à cette inscription');
        }
        
        // Vérifier la méthode de paiement
        if (paymentResponse.data.payment_method !== 'bank_transfer') {
          throw new Error('Méthode de paiement incorrecte');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchData();
    }
  }, [params.id, searchParams, router, status]);
  
  // Fonction pour copier les informations
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyTooltip(label);
        setTimeout(() => setCopyTooltip(null), 2000);
      })
      .catch(err => {
        console.error('Impossible de copier:', err);
      });
  };
  
  // Fonction pour simuler l'envoi d'un email
  const sendEmailInstructions = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };
  
  // Fonction pour imprimer les instructions
  const printInstructions = () => {
    window.print();
  };
  
  // Affichage de chargement
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Affichage d'erreur
  if (error || !event || !registration || !payment) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">{error || 'Impossible de charger les informations nécessaires'}</p>
          <Button
            onClick={() => router.push(`/events/${params.id}`)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
          >
            Retour à l'événement
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 print:py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 print:shadow-none"
      >
        {/* En-tête */}
        <div className="text-center mb-8 print:mb-4">
          <div className="inline-flex items-center justify-center p-3 bg-violet-100 rounded-full mb-4 print:hidden">
          <Building className="h-8 w-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold">Instructions de virement bancaire</h1>
          <p className="text-gray-600 mt-2">Suivez ces instructions pour finaliser votre paiement</p>
        </div>
        
        {/* Détails de la commande */}
        <div className="bg-gray-50 rounded-lg p-5 mb-6">
          <h2 className="font-bold text-lg mb-3">Détails de votre commande</h2>
          
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-600">Référence:</div>
            <div className="font-medium flex items-center">
              <span>{bankDetails.referencePrefix}{payment.id}</span>
              <button 
                onClick={() => copyToClipboard(`${bankDetails.referencePrefix}${payment.id}`, 'Référence')}
                className="ml-2 text-violet-600 hover:text-violet-800"
              >
                <Copy className="h-4 w-4" />
              </button>
              {copyTooltip === 'Référence' && (
                <span className="absolute ml-6 bg-black text-white text-xs px-2 py-1 rounded">Copié !</span>
              )}
            </div>
            
            <div className="text-gray-600">Événement:</div>
            <div className="font-medium">{event.title}</div>
            
            <div className="text-gray-600">Montant:</div>
            <div className="font-bold text-violet-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(payment.amount)}
            </div>
            
            <div className="text-gray-600">Date:</div>
            <div className="font-medium">
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        
        {/* Instructions bancaires */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3">Coordonnées bancaires</h2>
          
          <div className="border rounded-lg divide-y">
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Banque:</div>
              <div className="font-medium">{bankDetails.bankName}</div>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Bénéficiaire:</div>
              <div className="font-medium">{bankDetails.accountName}</div>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">N° de compte:</div>
              <div className="font-medium flex items-center">
                <span>{bankDetails.accountNumber}</span>
                <button 
                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'Compte')}
                  className="ml-2 text-violet-600 hover:text-violet-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {copyTooltip === 'Compte' && (
                  <span className="absolute ml-6 bg-black text-white text-xs px-2 py-1 rounded">Copié !</span>
                )}
              </div>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Code SWIFT:</div>
              <div className="font-medium">{bankDetails.swiftCode}</div>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Agence:</div>
              <div className="font-medium">{bankDetails.branchName}</div>
            </div>
            
            <div className="p-3 grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Motif de paiement:</div>
              <div className="font-medium flex items-center">
                <span>{bankDetails.referencePrefix}{payment.id}</span>
                <button 
                  onClick={() => copyToClipboard(`${bankDetails.referencePrefix}${payment.id}`, 'Motif')}
                  className="ml-2 text-violet-600 hover:text-violet-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {copyTooltip === 'Motif' && (
                  <span className="absolute ml-6 bg-black text-white text-xs px-2 py-1 rounded">Copié !</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Note importante */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-yellow-800 text-sm mb-2">Important:</h3>
          <p className="text-yellow-700 text-sm">
            <span className="font-medium">Veuillez indiquer exactement la référence {bankDetails.referencePrefix}{payment.id} comme motif de paiement.</span> 
            Sans cette référence, nous ne pourrons pas associer votre paiement à votre commande.
            <br/><br/>
            Après avoir effectué le virement, veuillez prévoir un délai de 24 à 48 heures ouvrées pour le traitement.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center print:hidden">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={printInstructions}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => {
              // Code pour télécharger un PDF
              printInstructions();
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center relative"
            onClick={sendEmailInstructions}
          >
            <Send className="mr-2 h-4 w-4" />
            Envoyer par email
            {emailSent && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Email envoyé !
              </span>
            )}
          </Button>
        </div>
        
        {/* Bouton de retour et confirmation */}
        <div className="mt-8 pt-6 border-t flex justify-between items-center print:hidden">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => router.push(`/events/${params.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'événement
          </Button>
          
          <Button
            className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            onClick={() => router.push(`/events/${params.id}/register/confirmation?registration=${registration.id}`)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            J'ai effectué le virement
          </Button>
        </div>
      </motion.div>
    </div>
  );
}