// src/components/events/registration/EventRegistrationForm.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Loader } from 'lucide-react';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { registrationsAPI } from '@/lib/api';

import RegistrationHeader from './RegistrationHeader';
import TicketSummary from './TicketSummary';
import RegistrationForm from './RegistrationForm';
import TermsAndConditions from './TermsAndConditions';
import ErrorMessage from './ErrorMessage';
import ActionButtons from './ActionButtons';

const EventRegistrationForm = ({ 
  event, 
  ticketTypes = [], 
  formFields = [],
  preSelectedTickets = []
}) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const { selectedTickets, totalPrice: contextTotalPrice, clearSelection } = useTicketSelection();
  
  // État pour les billets locaux (utilisé pour les préselections)
  const [selectedTicketsState, setSelectedTicketsState] = useState({});

  // Initialiser les billets à partir des pré-sélections ou du contexte
  useEffect(() => {
    if (preSelectedTickets && preSelectedTickets.length > 0) {
      const initialTickets = preSelectedTickets.reduce((acc, ticket) => {
        acc[ticket.id] = ticket.quantity;
        return acc;
      }, {});
      
      setSelectedTicketsState(initialTickets);
    } 
  }, [preSelectedTickets]);

  // Vérifier s'il y a des billets sélectionnés (soit dans le contexte, soit en local)
  const hasSelectedTickets = Object.values(selectedTicketsState).some(quantity => quantity > 0) || 
                            Object.values(selectedTickets).some(ticket => ticket.quantity > 0);

  // Utiliser le total du contexte si disponible, sinon calculer à partir de l'état local
  const total = Object.entries(selectedTicketsState).reduce((acc, [ticketId, quantity]) => {
    const ticket = ticketTypes.find(t => t.id === parseInt(ticketId));
    return acc + (ticket ? ticket.price * quantity : 0);
  }, 0);
  
  const finalTotal = Object.keys(selectedTickets).length > 0 ? contextTotalPrice : total;
  
  // Calculer les frais de service (5% du total)
  const serviceFee = Math.round(finalTotal * 0.05);
  const grandTotal = finalTotal + serviceFee;

  const handleFormDataChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Préparation des données pour l'inscription
      const registrationData = {
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
      
      // Vérifier que la réponse contient bien un ID
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <RegistrationHeader event={event} />
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Section des billets pour les événements de billetterie */}
            {event.event_type === 'billetterie' && (
              <TicketSummary 
                ticketTypes={ticketTypes}
                selectedTickets={selectedTickets}
                hasSelectedTickets={hasSelectedTickets}
                finalTotal={finalTotal}
                serviceFee={serviceFee}
                grandTotal={grandTotal}
                event={event}
              />
            )}
            
            {/* Champs de formulaire pour les événements d'inscription */}
            {event.event_type === 'inscription' && formFields.length > 0 && (
              <RegistrationForm 
                formFields={formFields} 
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
            )}
            
            <TermsAndConditions finalTotal={finalTotal} />
            
            {/* Message d'erreur */}
            {error && <ErrorMessage error={error} />}
            
            {/* Boutons d'action */}
            <ActionButtons 
              loading={loading}
              hasSelectedTickets={hasSelectedTickets}
              event={event}
              finalTotal={finalTotal}
              grandTotal={grandTotal}
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EventRegistrationForm;