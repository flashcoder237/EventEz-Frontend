'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { eventsAPI, categoriesAPI, tagsAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';

// Import des composants de formulaire
import EventGeneralInfoForm from '@/components/dashboard/create-event/EventGeneralInfoForm';
import EventLocationTimeForm from '@/components/dashboard/create-event/EventLocationTimeForm';
import EventTicketingForm from '@/components/dashboard/create-event/EventTicketingForm';
import EventMediaPublishForm from '@/components/dashboard/create-event/EventMediaPublishForm';
import FormProgressBar from '@/components/dashboard/create-event/FormProgressBar';
import ErrorMessage from '@/components/dashboard/create-event/ErrorMessage';
import SuccessMessage from '@/components/dashboard/create-event/SuccessMessage';

// État initial des données d'événement
const initialEventData = {
  title: '',
  description: '',
  short_description: '',
  event_type: 'billetterie',
  start_date: '',
  start_time: '',
  end_date: '',
  end_time: '',
  registration_deadline_date: '',
  registration_deadline_time: '',
  location_name: '',
  location_address: '',
  location_city: '',
  location_country: 'Cameroun',
  category: '',
  selected_tags: [] as number[],
  max_capacity: 0,
  is_featured: false,
  banner_image: null as File | null,
  banner_image_preview: null as string | null,
  ticket_types: [] as any[],
  form_fields: [] as any[]
};

// Valeurs par défaut pour les tickets et champs de formulaire
export const defaultTicketType = {
  name: '',
  description: '',
  price: 0,
  quantity_total: 100,
  sales_start_date: '',
  sales_start_time: '00:00',
  sales_end_date: '',
  sales_end_time: '23:59',
  is_visible: true,
  max_per_order: 10,
  min_per_order: 1
};

export const defaultFormField = {
  label: '',
  field_type: 'text',
  required: false,
  placeholder: '',
  help_text: '',
  options: '',
  order: 0
};

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  // États
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [eventData, setEventData] = useState(initialEventData);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  // Formatage d'une date pour les champs input date
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Charger les catégories et les tags au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          categoriesAPI.getCategories(),
          tagsAPI.getTags()
        ]);
        
        setCategories(categoriesResponse.data.results || []);
        setTags(tagsResponse.data.results || []);
        
        // Initialiser les dates avec la date du jour
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        setEventData(prev => ({
          ...prev,
          start_date: formatDateForInput(today),
          end_date: formatDateForInput(tomorrow),
          registration_deadline_date: formatDateForInput(today)
        }));
        
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des catégories et des tags. Veuillez réessayer.');
      }
    };
    
    fetchData();
  }, []);

  // Validation du formulaire à chaque étape
  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 1: // Informations générales
        if (!eventData.title) {
          setError('Le titre de l\'événement est requis');
          return false;
        }
        if (!eventData.description) {
          setError('La description de l\'événement est requise');
          return false;
        }
        if (!eventData.category) {
          setError('Veuillez sélectionner une catégorie');
          return false;
        }
        break;
        
      case 2: // Lieu et horaires
        if (!eventData.start_date || !eventData.start_time) {
          setError('La date et l\'heure de début sont requises');
          return false;
        }
        if (!eventData.end_date || !eventData.end_time) {
          setError('La date et l\'heure de fin sont requises');
          return false;
        }
        if (new Date(`${eventData.start_date}T${eventData.start_time}`) >= new Date(`${eventData.end_date}T${eventData.end_time}`)) {
          setError('La date de fin doit être postérieure à la date de début');
          return false;
        }
        if (!eventData.location_name || !eventData.location_address || !eventData.location_city) {
          setError('Les informations de lieu sont requises');
          return false;
        }
        break;
        
      case 3: // Billetterie ou Inscription
        if (eventData.event_type === 'billetterie' && eventData.ticket_types.length === 0) {
          setError('Veuillez ajouter au moins un type de billet');
          return false;
        }
        if (eventData.event_type === 'inscription' && eventData.form_fields.length === 0) {
          setError('Veuillez ajouter au moins un champ de formulaire');
          return false;
        }
        
        if (eventData.event_type === 'billetterie') {
          // Valider chaque type de billet
          for (let i = 0; i < eventData.ticket_types.length; i++) {
            const ticket = eventData.ticket_types[i];
            if (!ticket.name) {
              setError(`Le nom est requis pour le type de billet #${i + 1}`);
              return false;
            }
            if (ticket.quantity_total <= 0) {
              setError(`La quantité doit être supérieure à 0 pour le type de billet #${i + 1}`);
              return false;
            }
            if (!ticket.sales_start_date || !ticket.sales_end_date) {
              setError(`Les dates de vente sont requises pour le type de billet #${i + 1}`);
              return false;
            }
          }
        } else {
          // Valider chaque champ de formulaire
          for (let i = 0; i < eventData.form_fields.length; i++) {
            const field = eventData.form_fields[i];
            if (!field.label) {
              setError(`L'intitulé est requis pour le champ #${i + 1}`);
              return false;
            }
            if (['select', 'checkbox', 'radio'].includes(field.field_type) && !field.options) {
              setError(`Les options sont requises pour le champ ${field.label}`);
              return false;
            }
          }
        }
        break;
    }
    
    return true;
  };

  // Navigation entre les étapes
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Création de l'objet d'événement à envoyer à l'API
      const eventPayload = {
        title: eventData.title,
        short_description: eventData.short_description,
        description: eventData.description,
        event_type: eventData.event_type,
        category: parseInt(eventData.category),
        tags: eventData.selected_tags,
        start_date: `${eventData.start_date}T${eventData.start_time}:00`,
        end_date: `${eventData.end_date}T${eventData.end_time}:00`,
        registration_deadline: eventData.registration_deadline_date 
          ? `${eventData.registration_deadline_date}T${eventData.registration_deadline_time || '23:59'}:00` 
          : null,
        location_name: eventData.location_name,
        location_address: eventData.location_address,
        location_city: eventData.location_city,
        location_country: eventData.location_country,
        max_capacity: eventData.max_capacity > 0 ? eventData.max_capacity : null,
        is_featured: eventData.is_featured,
        status: isDraft ? 'draft' : 'published'
      };
      
      // Créer l'événement
      const response = await eventsAPI.createEvent(eventPayload);
      const eventId = response.data.id;
      
      // Télécharger l'image de bannière si elle existe
      if (eventData.banner_image) {
        const formData = new FormData();
        formData.append('banner_image', eventData.banner_image);
        await eventsAPI.updateEvent(eventId, formData);
      }
      
      // Ajouter les types de billets ou les champs de formulaire
      if (eventData.event_type === 'billetterie') {
        await Promise.all(eventData.ticket_types.map(ticket => 
          eventsAPI.createTicketType({
            event: eventId,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            quantity_total: ticket.quantity_total,
            sales_start: `${ticket.sales_start_date}T${ticket.sales_start_time}:00`,
            sales_end: `${ticket.sales_end_date}T${ticket.sales_end_time}:00`,
            is_visible: ticket.is_visible,
            max_per_order: ticket.max_per_order,
            min_per_order: ticket.min_per_order
          })
        ));
      } else {
        await Promise.all(eventData.form_fields.map(field => 
          eventsAPI.createFormField({
            event: eventId,
            label: field.label,
            field_type: field.field_type,
            required: field.required,
            placeholder: field.placeholder,
            help_text: field.help_text,
            options: field.options,
            order: field.order
          })
        ));
      }
      
      setSuccess(true);
      
      // Rediriger vers la page de l'événement créé ou le tableau de bord
      setTimeout(() => {
        router.push(isDraft 
          ? '/dashboard' 
          : `/events/${eventId}`
        );
      }, 2000);
      
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'événement:', err);
      setError(err.response?.data?.detail || 'Une erreur est survenue lors de la création de l\'événement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un message de succès
  if (success) {
    return <SuccessMessage router={router} />;
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
        <p className="text-gray-600">
          Configurez les détails de votre nouvel événement
        </p>
      </motion.div>
      
      <FormProgressBar currentStep={currentStep} totalSteps={4} />
      
      {error && <ErrorMessage message={error} />}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <EventGeneralInfoForm 
                  eventData={eventData}
                  setEventData={setEventData}
                  categories={categories}
                  tags={tags}
                  goToNextStep={goToNextStep}
                />
              )}
              
              {currentStep === 2 && (
                <EventLocationTimeForm 
                  eventData={eventData}
                  setEventData={setEventData}
                  goToNextStep={goToNextStep}
                  goToPreviousStep={goToPreviousStep}
                />
              )}
              
              {currentStep === 3 && (
                <EventTicketingForm 
                  eventData={eventData}
                  setEventData={setEventData}
                  defaultTicketType={defaultTicketType}
                  defaultFormField={defaultFormField}
                  goToNextStep={goToNextStep}
                  goToPreviousStep={goToPreviousStep}
                />
              )}
              
              {currentStep === 4 && (
                <EventMediaPublishForm 
                  eventData={eventData}
                  setEventData={setEventData}
                  categories={categories}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  goToPreviousStep={goToPreviousStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}