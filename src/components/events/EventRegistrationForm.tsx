'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ChevronRight, 
  Ticket, 
  User, 
  Calendar, 
  ShoppingCart, 
  Info,
  AlertTriangle 
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/Textarea';
import { FormField, Event } from '@/types/events';

interface TicketType {
  id: string;
  name: string;
  price: number;
  available_quantity: number;
  description?: string;
}


interface EventRegistrationFormProps {
  event: Event;
  ticketTypes?: TicketType[];
}

interface RegistrationData {
  tickets?: { 
    ticket_type_id: string; 
    quantity: number 
  }[];
  form_responses?: { 
    field_id: string; 
    value: string | number | boolean 
  }[];
}

export default function EventRegistrationForm({ 
  event, 
  ticketTypes = [], 
 
}: EventRegistrationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    tickets: [],
    form_responses: []
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>(event.form_fields || []);

  useEffect(() => {
    if (formFields.length > 0) {
      const initialFormResponses = formFields.map(field => ({
        field_id: field.id,
        options: field.options,
        value: field.type === 'checkbox' ? false : ''
      }));
      setRegistrationData(prev => ({
        ...prev,
        form_responses: initialFormResponses
      }));
    }
  }, [formFields]);

  const handleTicketQuantityChange = (ticketTypeId: string, quantity: number) => {
    setRegistrationData(prev => {
      const existingTickets = prev.tickets || [];
      const ticketIndex = existingTickets.findIndex(t => t.ticket_type_id === ticketTypeId);

      if (ticketIndex > -1) {
        const updatedTickets = [...existingTickets];
        if (quantity > 0) {
          updatedTickets[ticketIndex] = { ticket_type_id: ticketTypeId, quantity };
        } else {
          updatedTickets.splice(ticketIndex, 1);
        }
        return { ...prev, tickets: updatedTickets };
      } else if (quantity > 0) {
        return { 
          ...prev, 
          tickets: [...(existingTickets || []), { ticket_type_id: ticketTypeId, quantity }] 
        };
      }
      return prev;
    });
  };

  const handleFormFieldChange = (fieldId: string, value: string | number | boolean) => {
    setRegistrationData(prev => {
      const formResponses = prev.form_responses || [];
      const responseIndex = formResponses.findIndex(r => r.field_id === fieldId);

      if (responseIndex > -1) {
        const updatedResponses = [...formResponses];
        updatedResponses[responseIndex] = { field_id: fieldId, value };
        return { ...prev, form_responses: updatedResponses };
      }
      return { 
        ...prev, 
        form_responses: [...formResponses, { field_id: fieldId, value }] 
      };
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (event.event_type === 'billetterie') {
      const totalTickets = (registrationData.tickets || [])
        .reduce((sum, ticket) => sum + ticket.quantity, 0);
      
      if (totalTickets === 0) {
        errors['tickets'] = 'Veuillez sélectionner au moins un type de billet';
      }
    }

    (registrationData.form_responses || []).forEach(response => {
      const field = formFields.find(f => f.id === response.field_id);
      if (field?.required) {
        if (response.value === '' || response.value === false) {
          errors[field.id] = `Le champ ${field.label} est obligatoire`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        const registrationResult = await response.json();
        router.push(`/events/${event.id}/register/confirmation?registration=${registrationResult.registrationId}`);
      } else {
        const errorData = await response.json();
        setGlobalError(errorData.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      setGlobalError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const renderTicketSelection = () => {
    if (event.event_type !== 'billetterie' || ticketTypes.length === 0) {
      return null;
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Ticket className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Sélection des billets</h2>
        </div>
        
        {ticketTypes.map(ticketType => {
          const currentTicket = registrationData.tickets?.find(
            t => t.ticket_type_id === ticketType.id
          );

          return (
            <div 
              key={ticketType.id} 
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-bold text-gray-900">{ticketType.name}</h3>
                <p className="text-gray-600">
                  {ticketType.price > 0 
                    ? `${ticketType.price.toLocaleString()} FCFA` 
                    : 'Gratuit'}
                  {ticketType.description && (
                    <span className="block text-sm text-gray-500 mt-1">
                      {ticketType.description}
                    </span>
                  )}
                  <span className="block text-sm text-gray-500">
                    {ticketType.available_quantity} places disponibles
                  </span>
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTicketQuantityChange(
                    ticketType.id, 
                    Math.max(0, (currentTicket?.quantity || 0) - 1)
                  )}
                  disabled={(currentTicket?.quantity || 0) <= 0}
                >
                  -
                </Button>
                <span className="mx-2">
                  {currentTicket?.quantity || 0}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTicketQuantityChange(
                    ticketType.id, 
                    (currentTicket?.quantity || 0) + 1
                  )}
                  disabled={(currentTicket?.quantity || 0) >= ticketType.available_quantity}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
        
        {formErrors['tickets'] && (
          <div className="text-red-500 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {formErrors['tickets']}
          </div>
        )}
      </section>
    );
  };

  const renderFormFields = () => {
    if (formFields.length === 0) {
      return null;
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <User className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {formFields.map((field: FormField) => {
            const currentValue = registrationData.form_responses?.find(
              r => r.field_id === field.id
            )?.value;
            

            switch (field.field_type) {
              case 'text':
              case 'email':
              case 'number':
                return (
                  <div key={field.id}>
                    <Input 
                      type={field.type} 
                      placeholder={field.label}
                      required={field.required}
                      value={currentValue as string || ''}
                      onChange={(e) => 
                        handleFormFieldChange(field.id, e.target.value)
                      }
                    />
                    {formErrors[field.id] && (
                      <span className="text-red-500 text-sm">
                        {formErrors[field.id]}
                      </span>
                    )}
                  </div>
                );
              
              case 'select':
                return (
                  <div key={field.id}>
                    <Select
                      value={currentValue as string || ''}
                      options={field.options ? field.options : ""}
                      onValueChange={(value) => 
                        handleFormFieldChange(field.id, value)
                      }
                      placeholder={field.label}
                    >
                     
                    </Select>
                    {formErrors[field.id] && (
                      <span className="text-red-500 text-sm">
                        {formErrors[field.id]}
                      </span>
                    )}
                  </div>
                );
              
              case 'textarea':
                return (
                  <div key={field.id} className="md:col-span-2">
                    <Textarea 
                      placeholder={field.label}
                      required={field.required}
                      value={currentValue as string || ''}
                      onChange={(e) => 
                        handleFormFieldChange(field.id, e.target.value)
                      }
                    />
                    {formErrors[field.id] && (
                      <span className="text-red-500 text-sm">
                        {formErrors[field.id]}
                      </span>
                    )}
                  </div>
                );
              
              case 'checkbox':
                return (
                  <div key={field.id} className="md:col-span-2">
                    <Checkbox
                      checked={!!currentValue}
                      onCheckedChange={(checked) => 
                        handleFormFieldChange(field.id, checked)
                      }
                    >
                      {field.label}
                    </Checkbox>
                    {formErrors[field.id] && (
                      <span className="text-red-500 text-sm">
                        {formErrors[field.id]}
                      </span>
                    )}
                  </div>
                );
              
              default:
                return null;
            }
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
            <p className="text-gray-600">
              {new Date(event.start_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderTicketSelection()}
          {renderFormFields()}
          
          {globalError && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {globalError}
            </div>
          )}
          
          <div className="text-center">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Inscription en cours...' : 'Finaliser mon inscription'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
