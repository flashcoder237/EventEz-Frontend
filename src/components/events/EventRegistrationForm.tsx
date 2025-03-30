'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { registrationsAPI } from '@/lib/api';
import { useTicketSelection } from '@/context/TicketSelectionContext';

// Import des composants modulaires
import { EventHeader } from '@/components/events/registration/EventHeader';
import { TicketsSection } from '@/components/events/registration/TicketsSection';
import { FormFieldsSection } from '@/components/events/registration/FormFieldsSection';
import { TermsAndConditions } from '@/components/events/registration/TermsAndConditions';
import { ErrorMessage } from '@/components/events/registration/ErrorMessage';

// Animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3 
    }
  }
};

interface EventRegistrationFormProps {
  event: any;
  ticketTypes: any[];
  formFields?: any[];
  preSelectedTickets?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }>;
}

export default function EventRegistrationForm({ 
  event, 
  ticketTypes, 
  formFields = [],
  preSelectedTickets = []
}: EventRegistrationFormProps) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { selectedTickets, totalPrice: contextTotalPrice, clearSelection } = useTicketSelection();
  
  // État pour les billets
  const [selectedTicketsState, setSelectedTicketsState] = useState<Record<number, number>>({});

  // Initialiser les billets à partir des pré-sélections ou du contexte
  useEffect(() => {
    // Si nous avons des billets présélectionnés via les URL params
    if (preSelectedTickets && preSelectedTickets.length > 0) {
      const initialTickets = preSelectedTickets.reduce((acc, ticket) => {
        acc[ticket.id] = ticket.quantity;
        return acc;
      }, {});
      
      setSelectedTicketsState(initialTickets);
    } 
    // Sinon, utiliser les billets du contexte, mais seulement si nécessaire
    else if (Object.keys(selectedTickets).length > 0) {
      // Vérifier si l'état actuel est différent avant de le mettre à jour
      const contextTickets = Object.values(selectedTickets).reduce((acc, ticket) => {
        if (ticket.quantity > 0) {
          acc[parseInt(ticket.ticketId)] = ticket.quantity;
        }
        return acc;
      }, {});
      
      // Comparer l'état actuel avec le nouvel état calculé avant de mettre à jour
      const currentKeys = Object.keys(selectedTicketsState);
      const newKeys = Object.keys(contextTickets);
      
      const shouldUpdate = 
        currentKeys.length !== newKeys.length || 
        currentKeys.some(key => selectedTicketsState[key] !== contextTickets[key]);
      
      if (shouldUpdate) {
        setSelectedTicketsState(contextTickets);
      }
    }
  }, [preSelectedTickets, selectedTickets]); 

  // Calculer le total
  const total = Object.entries(selectedTicketsState).reduce((acc, [ticketId, quantity]) => {
    const ticket = ticketTypes.find(t => t.id === parseInt(ticketId));
    return acc + (ticket ? ticket.price * quantity : 0);
  }, 0);

  // Utiliser le total du contexte si disponible, sinon calculer à partir de l'état local
  const finalTotal = Object.keys(selectedTickets).length > 0 ? contextTotalPrice : total;

  // Calculer les frais de service (5% du total)
  const serviceFee = Math.round(finalTotal * 0.05);
  const grandTotal = finalTotal + serviceFee;

  // Vérifier s'il y a des billets sélectionnés
  const hasSelectedTickets = Object.values(selectedTicketsState).some(quantity => quantity > 0) || 
                            Object.values(selectedTickets).some(ticket => ticket.quantity > 0);

  const handleFormDataChange = (fieldId: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Préparation des données pour l'inscription
      const registrationData: any = {
        event: event.id,
        registration_type: event.event_type
      };
      
      // Ajouter les données de formulaire pour les événements d'inscription
      if (event.event_type === 'inscription' && formFields.length > 0) {
        registrationData.form_data = formData;
      }
      
      // Ajouter les billets pour les événements de billetterie
      if (event.event_type === 'billetterie') {
        // Utiliser les tickets du contexte s'ils existent, sinon utiliser l'état local
        const ticketsToUse = Object.keys(selectedTickets).length > 0 
          ? Object.values(selectedTickets)
            .filter(ticket => ticket.quantity > 0)
            .map(ticket => ({
              ticket_type: parseInt(ticket.ticketId),
              quantity: ticket.quantity
            }))
          : Object.entries(selectedTicketsState)
            .filter(([_, quantity]) => quantity > 0)
            .map(([ticketId, quantity]) => ({
              ticket_type: parseInt(ticketId),
              quantity
            }));
        
        // Vérifier qu'il y a au moins un billet
        if (ticketsToUse.length === 0) {
          throw new Error('Veuillez sélectionner au moins un billet');
        }
        
        registrationData.tickets = ticketsToUse;
      }
      
      // Créer l'inscription
      const response = await registrationsAPI.createRegistration(registrationData);
      
      // Vérifier que nous avons un ID d'inscription valide
      if (!response.data || !response.data.id) {
        throw new Error("La réponse de l'API ne contient pas d'ID d'inscription");
      }
      
      // Nettoyer le contexte après inscription réussie
      clearSelection();
      
      // Pour les événements gratuits, l'inscription est déjà confirmée
      if (finalTotal <= 0) {
        // Mettre à jour le statut de l'inscription pour la marquer comme confirmée
        try {
          await registrationsAPI.patchRegistration(response.data.id, {
            status: 'confirmed'
          });
        } catch (error) {
          console.error("Erreur lors de la confirmation de l'inscription gratuite:", error);
        }
        router.push(`/events/${event.id}/register/confirmation?registration=${response.data.id}`);
      } else {
        // Pour les événements payants, rediriger vers la page de paiement
        router.push(`/events/${event.id}/register/payment?registration=${response.data.id}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        {/* En-tête avec les informations d'événement */}
        <EventHeader event={event} />
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Section des billets pour les événements de billetterie */}
            {event.event_type === 'billetterie' && (
              <TicketsSection 
                hasSelectedTickets={hasSelectedTickets}
                selectedTickets={selectedTickets}
                selectedTicketsState={selectedTicketsState}
                ticketTypes={ticketTypes}
                finalTotal={finalTotal}
                serviceFee={serviceFee}
                grandTotal={grandTotal}
                eventId={event.id}
                router={router}
              />
            )}
            
            {/* Champs de formulaire pour les événements d'inscription */}
            {event.event_type === 'inscription' && formFields.length > 0 && (
              <FormFieldsSection 
                formFields={formFields}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            )}
            
            {/* Termes et conditions */}
            <TermsAndConditions finalTotal={finalTotal} />
            
            {/* Message d'erreur */}
            <ErrorMessage error={error} />
            
            {/* Boutons d'action */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={() => router.push(`/events/${event.id}?tab=tickets`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              
              <Button
                type="submit"
                disabled={loading || (event.event_type === 'billetterie' && !hasSelectedTickets)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={loading ? { x: ["0%", "200%"] } : { x: "-100%" }}
                  transition={loading ? { repeat: Infinity, duration: 1.5, ease: "linear" } : {}}
                />
                
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 flex items-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <motion.div
                        className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Traitement...
                    </span>
                  ) : (
                    <>
                      {finalTotal > 0 ? 'Procéder au paiement' : 'Confirmer l\'inscription'}
                      <span className="ml-2">{finalTotal > 0 ? `(${formatCurrency(grandTotal)})` : ''}</span>
                    </>
                  )}
                </motion.span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function
function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);
}