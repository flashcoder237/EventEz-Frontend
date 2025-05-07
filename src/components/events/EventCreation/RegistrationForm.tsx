'use client';

import { ChevronRight, ChevronLeft, Plus, Trash2, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationFormProps {
  eventData: any;
  handleFormFieldChange: (index: number, field: string, value: any) => void;
  handleAddFormField: () => void;
  handleRemoveFormField: (index: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function RegistrationForm({
  eventData,
  handleFormFieldChange,
  handleAddFormField,
  handleRemoveFormField,
  goToNextStep,
  goToPreviousStep
}: RegistrationFormProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-100 to-purple-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Formulaire d'inscription</h2>
        <p className="text-gray-700">
          Personnalisez le formulaire d'inscription pour recueillir les informations dont vous avez besoin.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center text-blue-800 mb-4">
          <Info className="h-5 w-5 mr-2" />
          <p className="text-sm">
            Créez un formulaire personnalisé pour recueillir les informations nécessaires des participants
          </p>
        </div>
        
        <AnimatePresence>
          {eventData.form_fields.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"
            >
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun champ défini</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Ajoutez des champs pour recueillir les informations des participants
              </p>
              <Button 
                onClick={handleAddFormField}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un champ
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {eventData.form_fields.map((field: any, index: number) => (
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
                    onClick={() => handleRemoveFormField(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Supprimer ce champ"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Champ #{index + 1}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor={`field-label-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-700 transition-colors">
                        Intitulé du champ *
                      </label>
                      <input
                        type="text"
                        id={`field-label-${index}`}
                        value={field.label}
                        onChange={(e) => handleFormFieldChange(index, 'label', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                        placeholder="Ex: Nom, Prénom, Email, etc."
                        required
                      />
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`field-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-700 transition-colors">
                        Type de champ *
                      </label>
                      <select
                        id={`field-type-${index}`}
                        value={field.field_type}
                        onChange={(e) => handleFormFieldChange(index, 'field_type', e.target.value)}
                        className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                        required
                      >
                        <option value="text">Texte</option>
                        <option value="textarea">Zone de texte</option>
                        <option value="email">Email</option>
                        <option value="tel">Téléphone</option>
                        <option value="number">Nombre</option>
                        <option value="select">Menu déroulant</option>
                        <option value="radio">Boutons radio</option>
                        <option value="checkbox">Cases à cocher</option>
                        <option value="date">Date</option>
                        <option value="time">Heure</option>
                      </select>
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`field-placeholder-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-700 transition-colors">
                        Texte indicatif
                      </label>
                      <input
                        type="text"
                        id={`field-placeholder-${index}`}
                        value={field.placeholder}
                        onChange={(e) => handleFormFieldChange(index, 'placeholder', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                        placeholder="Texte affiché dans le champ vide"
                      />
                    </div>
                    
                    <div className="group">
                      <label htmlFor={`field-help-${index}`} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-700 transition-colors">
                        Texte d'aide
                      </label>
                      <input
                        type="text"
                        id={`field-help-${index}`}
                        value={field.help_text}
                        onChange={(e) => handleFormFieldChange(index, 'help_text', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                        placeholder="Texte d'explication affiché sous le champ"
                      />
                    </div>
                  </div>
                  
                  {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h5 className="text-sm font-medium text-blue-800 mb-2">Options disponibles</h5>
                      <textarea
                        id={`field-options-${index}`}
                        value={field.options}
                        onChange={(e) => handleFormFieldChange(index, 'options', e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                        placeholder="Une option par ligne"
                        rows={3}
                        required={['select', 'radio', 'checkbox'].includes(field.field_type)}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Saisissez une option par ligne pour les menus déroulants, boutons radio et cases à cocher
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id={`field-required-${index}`}
                      checked={field.required}
                      onChange={(e) => handleFormFieldChange(index, 'required', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`field-required-${index}`} className="ml-2 block text-sm text-gray-700">
                      Ce champ est obligatoire
                    </label>
                  </div>
                </motion.div>
              ))}
              
              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  onClick={handleAddFormField}
                  variant="outline"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un autre champ
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
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Suivant
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}