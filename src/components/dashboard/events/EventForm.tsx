'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  X, 
  Plus, 
  Trash2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { eventsAPI, categoriesAPI, tagsAPI } from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
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

export default function EventForm({ eventId, initialData }: { eventId?: string, initialData?: any } = {}) {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [eventData, setEventData] = useState(initialEventData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!eventId;

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

  // Chargement des catégories et des tags au chargement de la page
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

  // Chargement des données de l'événement en mode édition
  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventData = async () => {
      try {
        const response = await eventsAPI.getEvent(eventId);
        const event = response.data;
        
        // Convertir les dates au format attendu par les champs
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const deadlineDate = event.registration_deadline ? new Date(event.registration_deadline) : null;
        
        setEventData({
          title: event.title,
          description: event.description,
          short_description: event.short_description || '',
          event_type: event.event_type,
          start_date: formatDateForInput(startDate),
          start_time: startDate.toTimeString().slice(0, 5),
          end_date: formatDateForInput(endDate),
          end_time: endDate.toTimeString().slice(0, 5),
          registration_deadline_date: deadlineDate ? formatDateForInput(deadlineDate) : '',
          registration_deadline_time: deadlineDate ? deadlineDate.toTimeString().slice(0, 5) : '',
          location_name: event.location_name,
          location_address: event.location_address,
          location_city: event.location_city,
          location_country: event.location_country,
          category: event.category?.id.toString() || '',
          selected_tags: event.tags?.map((tag: any) => tag.id) || [],
          max_capacity: event.max_capacity || 0,
          is_featured: event.is_featured || false,
          banner_image: null,
          banner_image_preview: null,
          ticket_types: event.ticket_types || [],
          form_fields: event.form_fields || []
        });
        
        if (event.banner_image) {
          setImagePreview(event.banner_image);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données de l\'événement:', err);
        setError('Erreur lors du chargement des données de l\'événement. Veuillez réessayer.');
      }
    };
    
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (error) {
      setError(null);
    }
  };

  // Gestion du téléchargement d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type d'image
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }

    // Validation de la taille
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximale: 5MB.');
      return;
    }

    // Création d'un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setEventData(prev => ({ 
      ...prev, 
      banner_image: file,
      banner_image_preview: URL.createObjectURL(file)
    }));
  };

  // Suppression de l'image
  const handleImageRemove = () => {
    setImagePreview(null);
    setEventData(prev => ({ 
      ...prev, 
      banner_image: null,
      banner_image_preview: null
    }));
  };

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

  // Gestion des champs de formulaire ou types de billets
  const handleAddTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticket_types: [...prev.ticket_types, { ...defaultTicketType }]
    }));
  };

  const handleAddFormField = () => {
    setEventData(prev => ({
      ...prev,
      form_fields: [...prev.form_fields, { ...defaultFormField, order: prev.form_fields.length }]
    }));
  };

  const handleTicketChange = (index: number, field: string, value: any) => {
    setEventData(prev => {
      const updatedTickets = [...prev.ticket_types];
      updatedTickets[index] = { ...updatedTickets[index], [field]: value };
      return { ...prev, ticket_types: updatedTickets };
    });
  };

  const handleFormFieldChange = (index: number, field: string, value: any) => {
    setEventData(prev => {
      const updatedFields = [...prev.form_fields];
      updatedFields[index] = { ...updatedFields[index], [field]: value };
      return { ...prev, form_fields: updatedFields };
    });
  };

  const handleRemoveTicket = (index: number) => {
    setEventData(prev => {
      const updatedTickets = [...prev.ticket_types];
      updatedTickets.splice(index, 1);
      return { ...prev, ticket_types: updatedTickets };
    });
  };

  const handleRemoveFormField = (index: number) => {
    setEventData(prev => {
      const updatedFields = [...prev.form_fields];
      updatedFields.splice(index, 1);
      return { ...prev, form_fields: updatedFields };
    });
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
      
      let eventId;
      
      if (isEditing) {
        await eventsAPI.updateEvent(eventId!, eventPayload);
        eventId = eventId;
      } else {
        // Créer l'événement
        const response = await eventsAPI.createEvent(eventPayload);
        eventId = response.data.id;
      }
      
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

  // Rendu des différentes sections du formulaire
  const renderFormSection = () => {
    switch (currentStep) {
      case 1: // Informations générales
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre de l'événement *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={eventData.title}
                onChange={handleChange}
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                Description courte
              </label>
              <input
                type="text"
                name="short_description"
                id="short_description"
                value={eventData.short_description}
                onChange={handleChange}
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Brève description pour les listes d'événements"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description complète *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={eventData.description}
                onChange={handleChange}
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Décrivez votre événement en détail"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                  Type d'événement *
                </label>
                <select
                  id="event_type"
                  name="event_type"
                  value={eventData.event_type}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                >
                  <option value="billetterie">Billetterie</option>
                  <option value="inscription">Inscription Personnalisée</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (optionnel)
                </label>
                <select
                  id="tags"
                  name="tags"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  multiple
                  onChange={(e) => {
                    const selectedTags = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
                    setEventData(prev => ({ ...prev, selected_tags: selectedTags }));
                  }}
                  value={eventData.selected_tags.map(String)}
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs tags
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2"
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2: // Lieu et horaires
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Date et heure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  Date de début *
                </label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={eventData.start_date}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                  Heure de début *
                </label>
                <input
                  type="time"
                  name="start_time"
                  id="start_time"
                  value={eventData.start_time}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                  Date de fin *
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={eventData.end_date}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                  Heure de fin *
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="end_time"
                  value={eventData.end_time}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="registration_deadline_date" className="block text-sm font-medium text-gray-700">
                  Date limite d'inscription
                </label>
                <input
                  type="date"
                  name="registration_deadline_date"
                  id="registration_deadline_date"
                  value={eventData.registration_deadline_date}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="registration_deadline_time" className="block text-sm font-medium text-gray-700">
                  Heure limite d'inscription
                </label>
                <input
                  type="time"
                  name="registration_deadline_time"
                  id="registration_deadline_time"
                  value={eventData.registration_deadline_time}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mt-8">Lieu</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
                  Nom du lieu *
                </label>
                <input
                  type="text"
                  name="location_name"
                  id="location_name"
                  value={eventData.location_name}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Palais des Congrès, Université de Yaoundé, etc."
                  required
                />
              </div>
              <div>
                <label htmlFor="location_address" className="block text-sm font-medium text-gray-700">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="location_address"
                  id="location_address"
                  value={eventData.location_address}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Adresse complète du lieu"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="location_city"
                    id="location_city"
                    value={eventData.location_city}
                    onChange={handleChange}
                    className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location_country" className="block text-sm font-medium text-gray-700">
                    Pays *
                  </label>
                  <input
                    type="text"
                    name="location_country"
                    id="location_country"
                    value={eventData.location_country}
                    onChange={handleChange}
                    className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700">
                  Capacité maximale
                </label>
                <input
                  type="number"
                  name="max_capacity"
                  id="max_capacity"
                  value={eventData.max_capacity}
                  onChange={handleChange}
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Laisser vide si pas de limite"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={goToPreviousStep}
                variant="outline"
                className="inline-flex items-center px-4 py-2"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>
              <Button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2"
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 3: // Billetterie ou Inscription
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              {eventData.event_type === 'billetterie' ? 'Billets' : 'Formulaire d\'inscription'}
            </h3>
            
            {eventData.event_type === 'billetterie' ? (
              // Section pour la billetterie
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Créez différents types de billets pour votre événement (standard, VIP, étudiant, etc.)
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Liste des types de billets */}
                {eventData.ticket_types.map((ticket, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveTicket(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Supprimer ce type de billet"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    
                    <h4 className="font-medium text-gray-900 mb-4">Type de billet #{index + 1}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`ticket-name-${index}`} className="block text-sm font-medium text-gray-700">
                          Nom du billet *
                        </label>
                        <input
                          type="text"
                          id={`ticket-name-${index}`}
                          value={ticket.name}
                          onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Ex: Standard, VIP, Étudiant"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          id={`ticket-price-${index}`}
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(index, 'price', Number(e.target.value))}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`ticket-quantity-${index}`} className="block text-sm font-medium text-gray-700">
                          Quantité disponible *
                        </label>
                        <input
                          type="number"
                          id={`ticket-quantity-${index}`}
                          value={ticket.quantity_total}
                          onChange={(e) => handleTicketChange(index, 'quantity_total', Number(e.target.value))}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          min="1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`ticket-description-${index}`} className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          id={`ticket-description-${index}`}
                          value={ticket.description}
                          onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Description des avantages de ce billet"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Période de vente</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`ticket-sales-start-date-${index}`} className="block text-xs text-gray-500">
                              Date de début *
                            </label>
                            <input
                              type="date"
                              id={`ticket-sales-start-date-${index}`}
                              value={ticket.sales_start_date}
                              onChange={(e) => handleTicketChange(index, 'sales_start_date', e.target.value)}
                              className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor={`ticket-sales-end-date-${index}`} className="block text-xs text-gray-500">
                              Date de fin *
                            </label>
                            <input
                              type="date"
                              id={`ticket-sales-end-date-${index}`}
                              value={ticket.sales_end_date}
                              onChange={(e) => handleTicketChange(index, 'sales_end_date', e.target.value)}
                              className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAddTicketType}
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un type de billet
                  </Button>
                </div>
              </div>
            ) : (
              // Section pour le formulaire d'inscription
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Créez un formulaire personnalisé pour recueillir les informations des participants
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Liste des champs de formulaire */}
                {eventData.form_fields.map((field, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveFormField(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Supprimer ce champ"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    
                    <h4 className="font-medium text-gray-900 mb-4">Champ #{index + 1}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`field-label-${index}`} className="block text-sm font-medium text-gray-700">
                          Intitulé du champ *
                        </label>
                        <input
                          type="text"
                          id={`field-label-${index}`}
                          value={field.label}
                          onChange={(e) => handleFormFieldChange(index, 'label', e.target.value)}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`field-type-${index}`} className="block text-sm font-medium text-gray-700">
                          Type de champ *
                        </label>
                        <select
                          id={`field-type-${index}`}
                          value={field.field_type}
                          onChange={(e) => handleFormFieldChange(index, 'field_type', e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`field-required-${index}`}
                          checked={field.required}
                          onChange={(e) => handleFormFieldChange(index, 'required', e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`field-required-${index}`} className="ml-2 block text-sm text-gray-700">
                          Champ obligatoire
                        </label>
                      </div>
                      
                      <div>
                        <label htmlFor={`field-placeholder-${index}`} className="block text-sm font-medium text-gray-700">
                          Texte indicatif
                        </label>
                        <input
                          type="text"
                          id={`field-placeholder-${index}`}
                          value={field.placeholder}
                          onChange={(e) => handleFormFieldChange(index, 'placeholder', e.target.value)}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Texte affiché dans le champ vide"
                        />
                      </div>
                      
                      {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                        <div className="sm:col-span-2">
                          <label htmlFor={`field-options-${index}`} className="block text-sm font-medium text-gray-700">
                            Options *
                          </label>
                          <textarea
                            id={`field-options-${index}`}
                            value={field.options}
                            onChange={(e) => handleFormFieldChange(index, 'options', e.target.value)}
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Une option par ligne"
                            rows={3}
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">Saisissez une option par ligne</p>
                        </div>
                      )}
                      
                      <div className="sm:col-span-2">
                        <label htmlFor={`field-help-${index}`} className="block text-sm font-medium text-gray-700">
                          Texte d'aide
                        </label>
                        <input
                          type="text"
                          id={`field-help-${index}`}
                          value={field.help_text}
                          onChange={(e) => handleFormFieldChange(index, 'help_text', e.target.value)}
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Texte d'explication affiché sous le champ"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAddFormField}
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un champ
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={goToPreviousStep}
                variant="outline"
                className="inline-flex items-center px-4 py-2"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>
              <Button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2"
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 4: // Image et publication
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Image de couverture</h3>
            
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Aperçu de l'image"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 text-white hover:bg-red-700 focus:outline-none"
                  aria-label="Supprimer l'image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-gray-300 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Cliquez ou glissez-déposez une image ici
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF jusqu'à 5MB
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Une image de couverture attractive augmente significativement le taux de participation à votre événement.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Finalisation</h3>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    id="is_featured"
                    name="is_featured"
                    type="checkbox"
                    checked={eventData.is_featured}
                    onChange={(e) => setEventData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Mettre en vedette sur la page d'accueil
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Les événements en vedette apparaissent en premier sur la page d'accueil.
                </p>
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  onClick={goToPreviousStep}
                  variant="outline"
                  className="inline-flex items-center px-4 py-2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    variant="outline"
                    className="inline-flex items-center px-4 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer comme brouillon'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    className="inline-flex items-center px-4 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      isEditing ? 'Mettre à jour l\'événement' : 'Publier l\'événement'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier l\'événement' : 'Créer un événement'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Modifiez les détails de votre événement' 
            : 'Configurez les détails de votre nouvel événement'}
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
              {renderFormSection()}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}