import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FaTicketAlt, FaClipboardList, FaPlus } from 'react-icons/fa';
import TicketTypeCard from './TicketTypeCard';
import FormFieldCard from './FormFieldCard';
import EmptyState from './EmptyState';

interface EventTicketingFormProps {
  eventData: any;
  setEventData: React.Dispatch<React.SetStateAction<any>>;
  defaultTicketType: any;
  defaultFormField: any;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function EventTicketingForm({
  eventData,
  setEventData,
  defaultTicketType,
  defaultFormField,
  goToNextStep,
  goToPreviousStep
}: EventTicketingFormProps) {
  // Gestion des types de billets
  const addTicketType = () => {
    setEventData((prev: any) => ({
      ...prev,
      ticket_types: [...prev.ticket_types, {
        ...defaultTicketType,
        sales_start_date: prev.start_date,
        sales_end_date: prev.registration_deadline_date || prev.start_date
      }]
    }));
  };

  const updateTicketType = (index: number, field: string, value: any) => {
    setEventData((prev: any) => {
      const updatedTickets = [...prev.ticket_types];
      updatedTickets[index] = {
        ...updatedTickets[index],
        [field]: value
      };
      return {
        ...prev,
        ticket_types: updatedTickets
      };
    });
  };

  const removeTicketType = (index: number) => {
    setEventData((prev: any) => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_: any, i: number) => i !== index)
    }));
  };

  // Gestion des champs de formulaire
  const addFormField = () => {
    setEventData((prev: any) => ({
      ...prev,
      form_fields: [...prev.form_fields, {
        ...defaultFormField,
        order: prev.form_fields.length
      }]
    }));
  };

  const updateFormField = (index: number, field: string, value: any) => {
    setEventData((prev: any) => {
      const updatedFields = [...prev.form_fields];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value
      };
      return {
        ...prev,
        form_fields: updatedFields
      };
    });
  };

  const removeFormField = (index: number) => {
    setEventData((prev: any) => ({
      ...prev,
      form_fields: prev.form_fields.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-xl font-semibold flex items-center"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {eventData.event_type === 'billetterie' 
          ? <FaTicketAlt className="mr-2 text-primary" /> 
          : <FaClipboardList className="mr-2 text-primary" />
        }
        {eventData.event_type === 'billetterie' ? 'Billetterie' : 'Formulaire d\'inscription'}
      </motion.h2>
      
      {eventData.event_type === 'billetterie' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Types de billets</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addTicketType}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" />
              Ajouter un type de billet
            </Button>
          </div>
          
          {eventData.ticket_types.length === 0 ? (
            <EmptyState 
              icon={<FaTicketAlt />}
              title="Aucun type de billet"
              description="Ajoutez au moins un type de billet pour votre événement"
              buttonText="Ajouter un type de billet"
              onClick={addTicketType}
            />
          ) : (
            <AnimatePresence>
              <div className="space-y-6">
                {eventData.ticket_types.map((ticket: any, index: number) => (
                  <TicketTypeCard
                    key={index}
                    ticket={ticket}
                    index={index}
                    updateTicketType={updateTicketType}
                    removeTicketType={removeTicketType}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Champs du formulaire</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addFormField}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" />
              Ajouter un champ
            </Button>
          </div>
          
          {eventData.form_fields.length === 0 ? (
            <EmptyState 
              icon={<FaClipboardList />}
              title="Aucun champ"
              description="Ajoutez des champs pour personnaliser votre formulaire d'inscription"
              buttonText="Ajouter un champ"
              onClick={addFormField}
            />
          ) : (
            <AnimatePresence>
              <div className="space-y-6">
                {eventData.form_fields.map((field: any, index: number) => (
                  <FormFieldCard
                    key={index}
                    field={field}
                    index={index}
                    updateFormField={updateFormField}
                    removeFormField={removeFormField}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      )}
      
      <motion.div 
        className="flex justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          type="button" 
          variant="outline" 
          onClick={goToPreviousStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Étape précédente
        </Button>
        <Button 
          type="button" 
          onClick={goToNextStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Étape suivante
        </Button>
      </motion.div>
    </motion.div>
  );
}