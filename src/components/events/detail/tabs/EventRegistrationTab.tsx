// src/components/events/detail/tabs/EventRegistrationTab.tsx
'use client';

import { FormField } from '@/types';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface EventRegistrationTabProps {
  formFields: FormField[];
}

export default function EventRegistrationTab({ formFields }: EventRegistrationTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Informations d'inscription</h2>
      
      {formFields.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun champ de formulaire n'est défini pour cet événement.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-700">
            Pour vous inscrire à cet événement, vous devrez fournir les informations suivantes :
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Champs requis</h3>
            <ul className="space-y-3">
              {formFields.map(field => (
                <li key={field.id} className="flex items-start">
                  <CheckCircle className={`h-5 w-5 mr-2 ${field.required ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <span className="font-medium">{field.label}</span>
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.help_text && (
                      <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-lg p-5 flex items-start">
            <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-indigo-800">
                Veillez à préparer ces informations avant de commencer le processus d'inscription. Vous aurez un délai limité pour compléter votre inscription une fois commencée.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}