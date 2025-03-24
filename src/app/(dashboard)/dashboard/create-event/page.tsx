// app/(dashboard)/dashboard/create-event/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { eventsAPI,categoriesAPI } from '@/lib/api';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaImage, FaClock, FaTag, FaMoneyBillWave, 
  FaTicketAlt, FaClipboardList, FaPlus, FaTrashAlt, FaInfoCircle, FaUsers
} from 'react-icons/fa';
import { AlertCircle } from 'lucide-react';

const defaultTicketType = {
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

const defaultFormField = {
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
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // La page est protégée par le middleware
    },
  });

  // États pour la création d'événement
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  // États pour les données de l'événement
  const [eventData, setEventData] = useState({
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
  });

  // Charger les catégories et les tags au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          categoriesAPI.getCategories(),
          eventsAPI.getTags()
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

  // Formatage d'une date pour les champs input date
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion du changement de l'image de bannière
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setEventData(prev => ({
        ...prev,
        banner_image: file
      }));
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onload = () => {
        setEventData(prev => ({
          ...prev,
          banner_image_preview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion des tags
  const toggleTag = (tagId: number) => {
    setEventData(prev => {
      const selectedTags = [...prev.selected_tags];
      if (selectedTags.includes(tagId)) {
        return {
          ...prev,
          selected_tags: selectedTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          selected_tags: [...selectedTags, tagId]
        };
      }
    });
  };

  // Gestion des types de billets
  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticket_types: [...prev.ticket_types, {
        ...defaultTicketType,
        sales_start_date: prev.start_date,
        sales_end_date: prev.registration_deadline_date || prev.start_date
      }]
    }));
  };

  const updateTicketType = (index: number, field: string, value: any) => {
    setEventData(prev => {
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
    setEventData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index)
    }));
  };

  // Gestion des champs de formulaire
  const addFormField = () => {
    setEventData(prev => ({
      ...prev,
      form_fields: [...prev.form_fields, {
        ...defaultFormField,
        order: prev.form_fields.length
      }]
    }));
  };

  const updateFormField = (index: number, field: string, value: any) => {
    setEventData(prev => {
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
    setEventData(prev => ({
      ...prev,
      form_fields: prev.form_fields.filter((_, i) => i !== index)
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
        
      case 4: // Médias
        // Pas de validation obligatoire pour cette étape
        break;
    }
    
    return true;
  };

  // Navigation entre les étapes
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
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
        for (const ticket of eventData.ticket_types) {
          await eventsAPI.createTicketType({
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
          });
        }
      } else {
        for (const field of eventData.form_fields) {
          await eventsAPI.createFormField({
            event: eventId,
            label: field.label,
            field_type: field.field_type,
            required: field.required,
            placeholder: field.placeholder,
            help_text: field.help_text,
            options: field.options,
            order: field.order
          });
        }
      }
      
      setSuccess(true);
      
      // Rediriger vers la page de l'événement créé ou le tableau de bord
      setTimeout(() => {
        router.push(isDraft 
          ? '/dashboard/my-events' 
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
    return (
      <div className="p-6">
        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-md text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-green-500 text-2xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Événement créé avec succès !</h2>
          <p className="mb-4">Votre événement a été créé et sera bientôt disponible sur la plateforme.</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push('/dashboard/my-events')}>
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Barre de progression
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Étape {currentStep} de 4</span>
          <span className="text-sm font-medium">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
        <p className="text-gray-600">
          Configurez les détails de votre nouvel événement
        </p>
      </div>
      
      {renderProgressBar()}
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={(e) => handleSubmit(e, false)}>
          {/* Étape 1: Informations générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaInfoCircle className="mr-2 text-primary" />
                Informations générales
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Titre de l'événement *"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Ex: Concert live, Conférence tech, Atelier cuisine..."
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Type d'événement *"
                    name="event_type"
                    value={eventData.event_type}
                    onChange={handleChange}
                    options={[
                      { value: 'billetterie', label: 'Billetterie - Vente de billets' },
                      { value: 'inscription', label: 'Inscription - Formulaire personnalisé' }
                    ]}
                    required
                  />
                  
                  <Select
                    label="Catégorie *"
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Sélectionnez une catégorie' },
                      ...categories.map(category => ({
                        value: category.id.toString(),
                        label: category.name
                      }))
                    ]}
                    required
                  />
                </div>
                
                <Textarea
                  label="Description courte"
                  name="short_description"
                  value={eventData.short_description}
                  onChange={handleChange}
                  placeholder="Résumé court de votre événement (max 255 caractères)"
                  maxLength={255}
                />
                
                <Textarea
                  label="Description complète *"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre événement en détail"
                  className="min-h-40"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                          eventData.selected_tags.includes(tag.id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Sélectionnez des tags pour aider les utilisateurs à trouver votre événement
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Capacité maximale"
                    type="number"
                    name="max_capacity"
                    value={eventData.max_capacity}
                    onChange={handleChange}
                    min={0}
                    placeholder="Laisser vide si pas de limite"
                  />
                  
                  <div className="flex items-center h-full pt-7">
                    <label className="flex items-center cursor-pointer">
                      <Switch
                        checked={eventData.is_featured}
                        onCheckedChange={(checked) => 
                          setEventData(prev => ({ ...prev, is_featured: checked }))
                        }
                      />
                      <span className="ml-2">Demander une mise en avant</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={goToNextStep}>
                  Étape suivante
                </Button>
              </div>
            </div>
          )}
          
          {/* Étape 2: Lieu et horaires */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary" />
                Lieu et horaires
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Date et heure</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Date de début *"
                        type="date"
                        name="start_date"
                        value={eventData.start_date}
                        onChange={handleChange}
                        required
                      />
                      
                      <Input
                        label="Heure de début *"
                        type="time"
                        name="start_time"
                        value={eventData.start_time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Date de fin *"
                        type="date"
                        name="end_date"
                        value={eventData.end_date}
                        onChange={handleChange}
                        required
                      />
                      
                      <Input
                        label="Heure de fin *"
                        type="time"
                        name="end_time"
                        value={eventData.end_time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Date limite d'inscription</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Date limite"
                          type="date"
                          name="registration_deadline_date"
                          value={eventData.registration_deadline_date}
                          onChange={handleChange}
                        />
                        
                        <Input
                          label="Heure limite"
                          type="time"
                          name="registration_deadline_time"
                          value={eventData.registration_deadline_time}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500">
                          Si non spécifié, les inscriptions seront possibles jusqu'au début de l'événement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Lieu</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      label="Nom du lieu *"
                      name="location_name"
                      value={eventData.location_name}
                      onChange={handleChange}
                      placeholder="Ex: Palais des Congrès, Stade Ahmadou Ahidjo, etc."
                      required
                    />
                    
                    <Textarea
                      label="Adresse *"
                      name="location_address"
                      value={eventData.location_address}
                      onChange={handleChange}
                      placeholder="Adresse complète du lieu"
                      required
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Ville *"
                        name="location_city"
                        value={eventData.location_city}
                        onChange={handleChange}
                        required
                      />
                      
                      <Input
                        label="Pays *"
                        name="location_country"
                        value={eventData.location_country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  Étape précédente
                </Button>
                <Button type="button" onClick={goToNextStep}>
                  Étape suivante
                </Button>
              </div>
            </div>
          )}
          
          {/* Étape 3: Billetterie ou Inscription */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center">
                {eventData.event_type === 'billetterie' 
                  ? <FaTicketAlt className="mr-2 text-primary" /> 
                  : <FaClipboardList className="mr-2 text-primary" />
                }
                {eventData.event_type === 'billetterie' ? 'Billetterie' : 'Formulaire d\'inscription'}
              </h2>
              
              {eventData.event_type === 'billetterie' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Types de billets</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addTicketType}
                      className="flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Ajouter un type de billet
                    </Button>
                  </div>
                  
                  {eventData.ticket_types.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <FaTicketAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900">Aucun type de billet</h4>
                      <p className="mt-2 text-gray-600">
                        Ajoutez au moins un type de billet pour votre événement
                      </p>
                      <Button 
                        type="button" 
                        onClick={addTicketType} 
                        className="mt-4"
                      >
                        <FaPlus className="mr-2" />
                        Ajouter un type de billet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {eventData.ticket_types.map((ticket, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-lg">Type de billet #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTicketType(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                              label="Nom du billet *"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                              placeholder="Ex: Standard, VIP, Early Bird, etc."
                              required
                            />
                            
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                type="number"
                                label="Prix (XAF) *"
                                value={ticket.price}
                                onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                                min={0}
                                required
                              />
                              
                              <Input
                                type="number"
                                label="Quantité totale *"
                                value={ticket.quantity_total}
                                onChange={(e) => updateTicketType(index, 'quantity_total', parseInt(e.target.value))}
                                min={1}
                                required
                              />
                            </div>
                            
                            <Textarea
                              label="Description"
                              value={ticket.description}
                              onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                              placeholder="Décrivez ce type de billet et ses avantages"
                            />
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="number"
                                  label="Min. par commande"
                                  value={ticket.min_per_order}
                                  onChange={(e) => updateTicketType(index, 'min_per_order', parseInt(e.target.value))}
                                  min={1}
                                />
                                
                                <Input
                                  type="number"
                                  label="Max. par commande"
                                  value={ticket.max_per_order}
                                  onChange={(e) => updateTicketType(index, 'max_per_order', parseInt(e.target.value))}
                                  min={1}
                                />
                              </div>
                              
                              <div className="flex items-center mt-4">
                                <label className="flex items-center cursor-pointer">
                                  <Switch
                                    checked={ticket.is_visible}
                                    onCheckedChange={(checked) => 
                                      updateTicketType(index, 'is_visible', checked)
                                    }
                                  />
                                  <span className="ml-2">Visible sur la page de l'événement</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h5 className="font-medium mb-3">Période de vente</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="date"
                                  label="Date de début"
                                  value={ticket.sales_start_date}
                                  onChange={(e) => updateTicketType(index, 'sales_start_date', e.target.value)}
                                />
                                
                                <Input
                                  type="time"
                                  label="Heure de début"
                                  value={ticket.sales_start_time}
                                  onChange={(e) => updateTicketType(index, 'sales_start_time', e.target.value)}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="date"
                                  label="Date de fin"
                                  value={ticket.sales_end_date}
                                  onChange={(e) => updateTicketType(index, 'sales_end_date', e.target.value)}
                                />
                                
                                <Input
                                  type="time"
                                  label="Heure de fin"
                                  value={ticket.sales_end_time}
                                  onChange={(e) => updateTicketType(index, 'sales_end_time', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Formulaire d'inscription
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Champs du formulaire</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addFormField}
                      className="flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Ajouter un champ
                    </Button>
                  </div>
                  
                  {eventData.form_fields.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <FaClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900">Aucun champ</h4>
                      <p className="mt-2 text-gray-600">
                        Ajoutez des champs pour personnaliser votre formulaire d'inscription
                      </p>
                      <Button 
                        type="button" 
                        onClick={addFormField} 
                        className="mt-4"
                      >
                        <FaPlus className="mr-2" />
                        Ajouter un champ
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {eventData.form_fields.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-lg">Champ #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFormField(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                              label="Intitulé du champ *"
                              value={field.label}
                              onChange={(e) => updateFormField(index, 'label', e.target.value)}
                              required
                            />
                            
                            <Select
                              label="Type de champ *"
                              value={field.field_type}
                              onChange={(e) => updateFormField(index, 'field_type', e.target.value)}
                              options={[
                                { value: 'text', label: 'Texte court' },
                                { value: 'textarea', label: 'Texte long' },
                                { value: 'email', label: 'Email' },
                                { value: 'phone', label: 'Téléphone' },
                                { value: 'number', label: 'Nombre' },
                                { value: 'date', label: 'Date' },
                                { value: 'select', label: 'Liste déroulante' },
                                { value: 'checkbox', label: 'Cases à cocher' },
                                { value: 'radio', label: 'Boutons radio' }
                              ]}
                              required
                            />
                            
                            <Input
                              label="Texte d'exemple (placeholder)"
                              value={field.placeholder}
                              onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                            />
                            
                            <Input
                              label="Texte d'aide"
                              value={field.help_text}
                              onChange={(e) => updateFormField(index, 'help_text', e.target.value)}
                              placeholder="Instructions supplémentaires pour ce champ"
                            />
                            
                            {['select', 'checkbox', 'radio'].includes(field.field_type) && (
                              <div className="md:col-span-2">
                                <Textarea
                                  label="Options (séparées par des virgules) *"
                                  value={field.options}
                                  onChange={(e) => updateFormField(index, 'options', e.target.value)}
                                  placeholder="Option 1, Option 2, Option 3"
                                  required
                                />
                              </div>
                            )}
                            
                            <div className="md:col-span-2">
                              <div className="flex items-center mt-2">
                                <label className="flex items-center cursor-pointer">
                                  <Switch
                                    checked={field.required}
                                    onCheckedChange={(checked) => 
                                      updateFormField(index, 'required', checked)
                                    }
                                  />
                                  <span className="ml-2">Champ obligatoire</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  Étape précédente
                </Button>
                <Button type="button" onClick={goToNextStep}>
                  Étape suivante
                </Button>
              </div>
            </div>
          )}
          
          {/* Étape 4: Médias et publication */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaImage className="mr-2 text-primary" />
                Médias et publication
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Image de bannière</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {eventData.banner_image_preview ? (
                      <div className="space-y-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <Image 
                            src={eventData.banner_image_preview} 
                            alt="Aperçu de la bannière" 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            Cliquez ci-dessous pour changer l'image
                          </p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEventData(prev => ({
                                ...prev,
                                banner_image: null,
                                banner_image_preview: null
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrashAlt className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FaImage className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">
                          Glissez-déposez une image ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG ou JPEG. Taille recommandée : 1200 x 630 pixels.
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      id="banner-image"
                      className="w-full mt-4"
                      accept="image/*"
                      onChange={handleBannerImageChange}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Prévisualisation et publication</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Résumé de l'événement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Titre</h4>
                          <p className="font-medium">{eventData.title || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Type</h4>
                          <p>{eventData.event_type === 'billetterie' ? 'Billetterie' : 'Inscription personnalisée'}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date et heure</h4>
                          <p>
                            {eventData.start_date 
                              ? new Date(`${eventData.start_date}T${eventData.start_time || '00:00'}`).toLocaleString('fr-FR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric'
                                })
                              : 'Non spécifié'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Lieu</h4>
                          <p>{eventData.location_name || 'Non spécifié'}</p>
                          <p className="text-sm text-gray-500">{eventData.location_city}, {eventData.location_country}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Configuration</h4>
                          <ul className="list-disc list-inside text-sm">
                            <li>
                              {eventData.event_type === 'billetterie' 
                                ? `${eventData.ticket_types.length} type(s) de billet configuré(s)` 
                                : `${eventData.form_fields.length} champ(s) de formulaire configuré(s)`
                              }
                            </li>
                            <li>
                              Catégorie: {categories.find(c => c.id.toString() === eventData.category)?.name || 'Non spécifiée'}
                            </li>
                            <li>{eventData.selected_tags.length} tag(s) sélectionné(s)</li>
                            {eventData.max_capacity > 0 && (
                              <li>Capacité maximale: {eventData.max_capacity} participants</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  Étape précédente
                </Button>
                <div className="space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                  >
                    Enregistrer comme brouillon
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Création en cours...' : 'Publier l\'événement'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}