'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { registrationsAPI } from '@/lib/api';
import { useTicketSelection } from '@/context/TicketSelectionContext';
import { Loader, CheckCircle, AlertCircle, Info, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';

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
  const { data: session } = useSession();
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
  }, [preSelectedTickets]); // Retirez selectedTickets des dépendances

  // Calculer le total
  const total = Object.entries(selectedTicketsState).reduce((acc, [ticketId, quantity]) => {
    const ticket = ticketTypes.find(t => t.id === parseInt(ticketId));
    return acc + (ticket ? ticket.price * quantity : 0);
  }, 0);

  // Utiliser le total du contexte si disponible, sinon calculer à partir de l'état local
  const finalTotal = Object.keys(selectedTickets).length > 0 ? contextTotalPrice : total;

  const handleTicketChange = (ticketId: number, quantity: number) => {
    setSelectedTicketsState(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

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
  
  // Afficher la réponse complète pour comprendre sa structure
  console.log("Réponse complète de l'API:", JSON.stringify(response, null, 2));
  console.log("Type de response:", typeof response);
  console.log("Propriétés:", Object.keys(response));
  
  if (response.data) {
    console.log("Propriétés de data:", Object.keys(response.data));
  }
    
    // Vérifier que la réponse contient bien un ID
    console.log("Réponse de l'API:", response);
    
    // L'erreur est probablement ici, assurez-vous que vous accédez correctement à l'ID
    if (!response.data || !response.data.id) {
      throw new Error("La réponse de l'API ne contient pas d'ID d'inscription");
    }
    
    // Nettoyer le contexte après inscription réussie
    clearSelection();
    
    // Rediriger vers la page de paiement avec l'ID correct
    if (finalTotal > 0) {
      router.push(`/events/${event.id}/register/payment?registration=${response.data.id}`);
    } else {
      router.push(`/events/${event.id}/register/confirmation?registration=${response.data.id}`);
    }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier s'il y a des billets sélectionnés
  const hasSelectedTickets = Object.values(selectedTicketsState).some(quantity => quantity > 0) || 
                            Object.values(selectedTickets).some(ticket => ticket.quantity > 0);

  // Calculer les frais de service (5% du total)
  const serviceFee = Math.round(finalTotal * 0.05);
  const grandTotal = finalTotal + serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        {/* En-tête avec les informations d'événement */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Finaliser votre inscription</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-200" />
              <span>{formatDate(event.start_date, 'long')}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-200" />
              <span>{event.location_name}, {event.location_city}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Section des billets pour les événements de billetterie */}
            {event.event_type === 'billetterie' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Vos billets sélectionnés
                </h3>
                
                {!hasSelectedTickets ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-700 dark:text-yellow-400">
                        Aucun billet sélectionné. Veuillez retourner à la page des billets pour en sélectionner.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => router.push(`/events/${event.id}?tab=tickets`)}
                      >
                        Sélectionner des billets
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Afficher les billets sélectionnés (du contexte ou des pré-sélections) */}
                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4">
                      <div className="space-y-3">
                        {Object.keys(selectedTickets).length > 0 ? (
                          // Afficher les billets du contexte
                          Object.values(selectedTickets)
                            .filter(ticket => ticket.quantity > 0)
                            .map((ticket, index) => {
                              const ticketInfo = ticketTypes.find(t => t.id.toString() === ticket.ticketId);
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.name}</span>
                                    <span className="text-gray-600 dark:text-gray-400"> × {ticket.quantity}</span>
                                  </div>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {formatCurrency(ticket.price * ticket.quantity)}
                                  </span>
                                </div>
                              );
                            })
                        ) : (
                          // Afficher les billets des pré-sélections
                          Object.entries(selectedTicketsState)
                            .filter(([_, quantity]) => quantity > 0)
                            .map(([ticketId, quantity], index) => {
                              const ticket = ticketTypes.find(t => t.id === parseInt(ticketId));
                              return (
                                <div key={index} className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{ticket?.name}</span>
                                    <span className="text-gray-600 dark:text-gray-400"> × {quantity}</span>
                                  </div>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {formatCurrency(ticket ? ticket.price * quantity : 0)}
                                  </span>
                                </div>
                              );
                            })
                        )}
                        
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(finalTotal)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Frais de service (5%)</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(serviceFee)}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">Total</span>
                            <span className="font-bold text-lg text-primary">{formatCurrency(grandTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Champs de formulaire pour les événements d'inscription */}
            {event.event_type === 'inscription' && formFields.length > 0 && (
              <div className="mb-8 space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Informations requises
                </h3>
                {formFields.map(field => (
                  <div key={field.id}>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.field_type === 'text' && (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        required={field.required}
                      />
                    )}
                    
                    {field.field_type === 'textarea' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        required={field.required}
                        rows={4}
                      />
                    )}
                    
                    {field.field_type === 'select' && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        required={field.required}
                      >
                        <option value="">Sélectionner une option</option>
                        {field.options && field.options.split(',').map((option, index) => (
                          <option key={index} value={option.trim()}>
                            {option.trim()}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.field_type === 'radio' && field.options && (
                      <div className="space-y-2">
                        {field.options.split(',').map((option, index) => (
                          <label key={index} className="flex items-center">
                            <input
                              type="radio"
                              name={`field-${field.id}`}
                              value={option.trim()}
                              checked={formData[field.id] === option.trim()}
                              onChange={() => handleFormDataChange(field.id, option.trim())}
                              required={field.required}
                              className="mr-2 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{option.trim()}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {field.field_type === 'checkbox' && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[field.id] || false}
                          onChange={(e) => handleFormDataChange(field.id, e.target.checked)}
                          required={field.required}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{field.placeholder || field.label}</span>
                      </label>
                    )}
                    
                    {field.help_text && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.help_text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Termes et conditions */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    En cliquant sur "Continuer", vous acceptez nos conditions générales et notre politique de confidentialité.
                    {finalTotal > 0 && " Vous serez redirigé vers l'écran de paiement pour finaliser votre achat."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Boutons d'action */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              
              <Button
                type="submit"
                disabled={loading || (event.event_type === 'billetterie' && !hasSelectedTickets)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    Traitement...
                  </span>
                ) : (
                  <>
                    {finalTotal > 0 ? 'Procéder au paiement' : 'Confirmer l\'inscription'}
                    <span className="ml-2">{finalTotal > 0 ? `(${formatCurrency(grandTotal)})` : ''}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );