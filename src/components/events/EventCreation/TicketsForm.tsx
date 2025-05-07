'use client';

import { ChevronRight, ChevronLeft, Plus, Trash2, Info, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketsFormProps {
  eventData: any;
  handleTicketChange: (index: number, field: string, value: any) => void;
  handleAddTicketType: () => void;
  handleRemoveTicket: (index: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function TicketsForm({
  eventData,
  handleTicketChange,
  handleAddTicketType,
  handleRemoveTicket,
  goToNextStep,
  goToPreviousStep
}: TicketsFormProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-100 to-teal-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-green-900 mb-2">Billetterie</h2>
        <p className="text-gray-700">
          Définissez les différents types de billets que vous souhaitez proposer à vos participants.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center text-green-800 mb-4">
          <Info className="h-5 w-5 mr-2" />
          <p className="text-sm">
            Créez différents types de billets pour votre événement (standard, VIP, étudiant, etc.)
          </p>
        </div>
        
        <AnimatePresence>
          {eventData.ticket_types.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"
            >
              <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun billet défini</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Ajoutez au moins un type de billet pour votre événement
              </p>
              <Button 
                onClick={handleAddTicketType}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un type de billet
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {eventData.ticket_types.map((ticket: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveTicket(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Supprimer ce type de billet"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-green-600" />
                    Type de billet #{index + 1}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor={`ticket-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                        Nom du billet *
                      </label>
                      <input
                        type="text"
                        id={`ticket-name-${index}`}
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all p-3"
                        placeholder="Ex: Standard, VIP, Étudiant"
                        required
                      />
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                        Prix (FCFA) *
                      </label>
                      <div className="relative mt-1 rounded-xl shadow-sm">
                        <input
                          type="number"
                          id={`ticket-price-${index}`}
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(index, 'price', Number(e.target.value))}
                          className="block w-full border-gray-300 pl-3 pr-12 py-3 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          min="0"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">FCFA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`ticket-quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                        Quantité disponible *
                      </label>
                      <input
                        type="number"
                        id={`ticket-quantity-${index}`}
                        value={ticket.quantity_total}
                        onChange={(e) => handleTicketChange(index, 'quantity_total', Number(e.target.value))}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all p-3"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`ticket-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                        Description
                      </label>
                      <input
                        type="text"
                        id={`ticket-description-${index}`}
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all p-3"
                        placeholder="Description des avantages de ce billet"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                    <h5 className="text-sm font-medium text-green-800 mb-2">Période de vente</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="group md:col-span-2">
                        <label htmlFor={`ticket-sales-start-date-${index}`} className="block text-xs text-gray-600">
                          Date de début *
                        </label>
                        <input
                          type="date"
                          id={`ticket-sales-start-date-${index}`}
                          value={ticket.sales_start_date}
                          onChange={(e) => handleTicketChange(index, 'sales_start_date', e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all p-2"
                          required
                        />
                      </div>
                      <div className="group">
                        <label htmlFor={`ticket-sales-start-time-${index}`} className="block text-xs text-gray-600">
                          Heure
                        </label>
                        <input
                          type="time"
                          id={`ticket-sales-start-time-${index}`}
                          value={ticket.sales_start_time}
                          onChange={(e) => handleTicketChange(index, 'sales_start_time', e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all p-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                      <div className="group md:col-span-2">
                        <label htmlFor={`ticket-sales-end-date-${index}`} className="block text-xs text-gray-600">
                          Date de fin *
                        </label>
                        <input
                          type="date"
                          id={`ticket-sales-end-date-${index}`}
                          value={ticket.sales_end_date}
                          onChange={(e) => handleTicketChange(index, 'sales_end_date', e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all p-2"
                          required
                        />
                      </div>
                      <div className="group">
                        <label htmlFor={`ticket-sales-end-time-${index}`} className="block text-xs text-gray-600">
                          Heure
                        </label>
                        <input
                          type="time"
                          id={`ticket-sales-end-time-${index}`}
                          value={ticket.sales_end_time}
                          onChange={(e) => handleTicketChange(index, 'sales_end_time', e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all p-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`ticket-visible-${index}`}
                        checked={ticket.is_visible}
                        onChange={(e) => handleTicketChange(index, 'is_visible', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`ticket-visible-${index}`} className="ml-2 block text-sm text-gray-700">
                        Visible sur la page de l'événement
                      </label>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  onClick={handleAddTicketType}
                  variant="outline"
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un autre type de billet
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={goToPreviousStep}
          variant="outline"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Précédent
        </Button>
        
        <Button
          type="button"
          onClick={goToNextStep}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Suivant
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}