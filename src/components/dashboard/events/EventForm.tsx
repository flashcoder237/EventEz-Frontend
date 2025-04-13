'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Info, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  X, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Settings,
  PenTool,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { eventsAPI, categoriesAPI } from '@/lib/api';
import { Category, EventCreate, EventUpdate } from '@/types';
import { format, addDays, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

// Type pour les sections du formulaire
type FormSection = 'general' | 'datetime' | 'location' | 'image' | 'review';

interface EventFormProps {
  eventId?: string;
  initialData?: EventUpdate;
}

export default function EventForm({ eventId, initialData }: EventFormProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États
  const [isEditing] = useState(!!eventId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.banner_image || null);
  const [currentSection, setCurrentSection] = useState<FormSection>('general');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Date par défaut: maintenant + 7 jours
  const defaultStartDate = addDays(new Date(), 7);
  const defaultEndDate = addHours(defaultStartDate, 3);
  const defaultDeadline = addDays(new Date(), 6);

  // État du formulaire avec valeurs par défaut améliorées
  const [formData, setFormData] = useState<EventCreate | EventUpdate>({
    id: eventId || '',
    title: '',
    description: '',
    short_description: '',
    event_type: 'billetterie',
    category: 0,
    start_date: format(defaultStartDate, "yyyy-MM-dd'T'HH:mm"),
    end_date: format(defaultEndDate, "yyyy-MM-dd'T'HH:mm"),
    registration_deadline: format(defaultDeadline, "yyyy-MM-dd'T'HH:mm"),
    location_name: '',
    location_address: '',
    location_city: '',
    location_country: 'Cameroun',
    status: 'draft',
    ...initialData
  });

  // Configuration des sections du formulaire
  const formSections = useMemo(() => [
    { id: 'general', title: 'Informations générales', icon: <FileText className="w-5 h-5" /> },
    { id: 'datetime', title: 'Date et heure', icon: <Calendar className="w-5 h-5" /> },
    { id: 'location', title: 'Lieu', icon: <MapPin className="w-5 h-5" /> },
    { id: 'image', title: 'Image', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'review', title: 'Finalisation', icon: <CheckCircle className="w-5 h-5" /> }
  ], []);

  // Chargement des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        setCategories(response.data.results || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast.error('Impossible de charger les catégories. Veuillez réessayer.');
      }
    };

    fetchCategories();
  }, []);

  // Chargement des données de l'événement en mode édition
  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await eventsAPI.getEvent(eventId);
        const eventData = response.data;
        
        setFormData({
          id: eventId,
          title: eventData.title,
          description: eventData.description,
          short_description: eventData.short_description || '',
          event_type: eventData.event_type,
          category: eventData.category?.id || 0,
          start_date: format(new Date(eventData.start_date), "yyyy-MM-dd'T'HH:mm"),
          end_date: format(new Date(eventData.end_date), "yyyy-MM-dd'T'HH:mm"),
          registration_deadline: eventData.registration_deadline 
            ? format(new Date(eventData.registration_deadline), "yyyy-MM-dd'T'HH:mm")
            : null,
          location_name: eventData.location_name,
          location_address: eventData.location_address,
          location_city: eventData.location_city,
          location_country: eventData.location_country,
          status: eventData.status,
        });
        
        if (eventData.banner_image) {
          setImagePreview(eventData.banner_image);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de l\'événement:', error);
        toast.error('Impossible de charger les données de l\'événement.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion du téléchargement d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse. Taille maximale: 5MB.');
      return;
    }

    // Création d'un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, banner_image: file }));
  };

  // Suppression de l'image
  const handleImageRemove = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, banner_image: undefined }));
  };

  // Validation de la section actuelle
  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentSection) {
      case 'general':
        if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.category) newErrors.category = 'La catégorie est requise';
        break;
      
      case 'datetime':
        if (!formData.start_date) newErrors.start_date = 'La date de début est requise';
        if (!formData.end_date) newErrors.end_date = 'La date de fin est requise';
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
          newErrors.end_date = 'La date de fin doit être postérieure à la date de début';
        }
        break;
      
      case 'location':
        if (!formData.location_name.trim()) newErrors.location_name = 'Le nom du lieu est requis';
        if (!formData.location_address.trim()) newErrors.location_address = 'L\'adresse est requise';
        if (!formData.location_city.trim()) newErrors.location_city = 'La ville est requise';
        if (!formData.location_country.trim()) newErrors.location_country = 'Le pays est requis';
        break;
      
      // Pas de validation pour la section image (facultatif)
      // Pas de validation pour la section review (récapitulatif)
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation entre les sections
  const handleNextSection = () => {
    if (validateCurrentSection()) {
      const currentIndex = formSections.findIndex(section => section.id === currentSection);
      if (currentIndex < formSections.length - 1) {
        setCurrentSection(formSections[currentIndex + 1].id as FormSection);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevSection = () => {
    const currentIndex = formSections.findIndex(section => section.id === currentSection);
    if (currentIndex > 0) {
      setCurrentSection(formSections[currentIndex - 1].id as FormSection);
      window.scrollTo(0, 0);
    }
  };

  const goToSection = (section: FormSection) => {
    // Pour revenir en arrière, pas besoin de valider
    const currentIndex = formSections.findIndex(s => s.id === currentSection);
    const targetIndex = formSections.findIndex(s => s.id === section);
    
    if (targetIndex <= currentIndex) {
      setCurrentSection(section);
      window.scrollTo(0, 0);
      return;
    }
    
    // Pour aller en avant, valider les sections intermédiaires
    if (validateCurrentSection()) {
      setCurrentSection(section);
      window.scrollTo(0, 0);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider toutes les sections avant de soumettre
    let allValid = true;
    
    // Temporairement passer à chaque section pour la valider
    const originalSection = currentSection;
    
    for (const section of ['general', 'datetime', 'location']) {
      setCurrentSection(section as FormSection);
      if (!validateCurrentSection()) {
        allValid = false;
        break;
      }
    }
    
    // Revenir à la section originale si la validation échoue
    if (!allValid) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    // Revenir à la section originale
    setCurrentSection(originalSection);
    
    setSaving(true);

    try {
      let response;
      
      // Toujours utiliser FormData pour une meilleure compatibilité avec le backend
      const formDataObj = new FormData();
      
      // Ajouter tous les champs du formulaire au FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'banner_image' && value instanceof File) {
            formDataObj.append(key, value);
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });
      
      if (isEditing) {
        response = await eventsAPI.updateEvent(eventId!, formDataObj);
      } else {
        response = await eventsAPI.createEvent(formDataObj);
      }

      toast.success(isEditing 
        ? 'Événement mis à jour avec succès!' 
        : 'Événement créé avec succès!'
      );
      
      // Redirection
      setTimeout(() => {
        if (isEditing) {
          router.refresh();
        } else {
          router.push(`/dashboard/events/${response.data.id}`);
        }
      }, 1000);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Amélioration de la gestion des erreurs
      if (error.response?.data) {
        // Afficher les erreurs spécifiques du backend si disponibles
        const errorData = error.response.data;
        
        if (typeof errorData === 'object' && errorData !== null) {
          // Traiter les erreurs de validation du backend
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          
          toast.error(errorMessages || 'Erreur de validation. Veuillez vérifier vos données.');
        } else {
          toast.error(error.response.data.detail || 'Une erreur est survenue');
        }
      } else {
        toast.error('Une erreur est survenue lors de la communication avec le serveur');
      }
    } finally {
      setSaving(false);
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Rendu des différentes sections du formulaire
  const renderFormSection = () => {
    switch (currentSection) {
      case 'general':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 text-purple-500 mr-2" />
              Informations générales
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${formErrors.title ? 'border-red-500' : ''}`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                  Description courte
                </label>
                <input
                  type="text"
                  name="short_description"
                  id="short_description"
                  value={formData.short_description}
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
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${formErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Décrivez votre événement en détail"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                    Type d'événement *
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'datetime':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-purple-500 mr-2" />
              Date et heure
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Date de début *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="start_date"
                      id="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${formErrors.start_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.start_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.start_date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    Date de fin *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="end_date"
                      id="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${formErrors.end_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.end_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.end_date}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700">
                  Date limite d'inscription
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="registration_deadline"
                    id="registration_deadline"
                    value={formData.registration_deadline || ''}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Si non spécifié, les inscriptions seront possibles jusqu'au début de l'événement.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Les participants ne pourront plus s'inscrire après la date limite d'inscription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <MapPin className="h-6 w-6 text-purple-500 mr-2" />
              Lieu de l'événement
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
                  Nom du lieu *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location_name"
                    id="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    className={`focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${formErrors.location_name ? 'border-red-500' : ''}`}
                    placeholder="Ex: Palais des Congrès, Université de Yaoundé, etc."
                  />
                </div>
                {formErrors.location_name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="location_address" className="block text-sm font-medium text-gray-700">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="location_address"
                  id="location_address"
                  value={formData.location_address}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${formErrors.location_address ? 'border-red-500' : ''}`}
                  placeholder="Adresse complète du lieu"
                />
                {formErrors.location_address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location_address}</p>
                )}
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
                    value={formData.location_city}
                    onChange={handleChange}
                    className={`mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${formErrors.location_city ? 'border-red-500' : ''}`}
                  />
                  {formErrors.location_city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location_city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location_country" className="block text-sm font-medium text-gray-700">
                    Pays *
                  </label>
                  <input
                    type="text"
                    name="location_country"
                    id="location_country"
                    value={formData.location_country}
                    onChange={handleChange}
                    className={`mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${formErrors.location_country ? 'border-red-500' : ''}`}
                  />
                  {formErrors.location_country && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location_country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <ImageIcon className="h-6 w-6 text-purple-500 mr-2" />
              Image de couverture
            </h3>
            <div className="space-y-6">
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-w-16 aspect-h-9">
                    <Image
                      src={imagePreview}
                      alt="Aperçu de l'image"
                      width={800}
                      height={450}
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    aria-label="Supprimer l'image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer transition-colors hover:border-purple-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="banner_image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                      >
                        <span>Télécharger une image</span>
                        <input
                          id="banner_image"
                          name="banner_image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                  <p className="text-sm text-blue-700">
                      Une image de couverture attractive augmente significativement le taux de participation à votre événement. Utilisez une image de haute qualité et pertinente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-500 mr-2" />
              Résumé et finalisation
            </h3>
            
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 text-purple-500 mr-2" />
                  Informations générales
                  <button 
                    type="button" 
                    onClick={() => goToSection('general')} 
                    className="ml-auto text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <PenTool className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Titre:</span> 
                    <span className="ml-2 font-medium">{formData.title}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Description courte:</span> 
                    <span className="ml-2">{formData.short_description || '(Non spécifiée)'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type d'événement:</span> 
                    <span className="ml-2">{formData.event_type === 'billetterie' ? 'Billetterie' : 'Inscription Personnalisée'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Catégorie:</span> 
                    <span className="ml-2">{categories.find(c => c.id === Number(formData.category))?.name || '(Non spécifiée)'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                  Date et heure
                  <button 
                    type="button" 
                    onClick={() => goToSection('datetime')} 
                    className="ml-auto text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <PenTool className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Date de début:</span> 
                    <span className="ml-2">
                      {formData.start_date && format(new Date(formData.start_date), 'PPP à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date de fin:</span> 
                    <span className="ml-2">
                      {formData.end_date && format(new Date(formData.end_date), 'PPP à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Date limite d'inscription:</span> 
                    <span className="ml-2">
                      {formData.registration_deadline 
                        ? format(new Date(formData.registration_deadline), 'PPP à HH:mm', { locale: fr })
                        : '(Non spécifiée)'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                  Lieu
                  <button 
                    type="button" 
                    onClick={() => goToSection('location')} 
                    className="ml-auto text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <PenTool className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Nom du lieu:</span> 
                    <span className="ml-2">{formData.location_name}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Adresse:</span> 
                    <span className="ml-2">{formData.location_address}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ville:</span> 
                    <span className="ml-2">{formData.location_city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pays:</span> 
                    <span className="ml-2">{formData.location_country}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <ImageIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Image de couverture
                  <button 
                    type="button" 
                    onClick={() => goToSection('image')} 
                    className="ml-auto text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <PenTool className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                </h4>
                <div className="mt-3">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={imagePreview}
                        alt="Aperçu de l'image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Aucune image sélectionnée</div>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Votre événement est prêt à être {isEditing ? 'mis à jour' : 'créé'}. Vérifiez les informations ci-dessus et cliquez sur "{isEditing ? 'Mettre à jour' : 'Créer l\'événement'}" pour continuer.
                    </p>
                  </div>
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Indicateur de progression */}
      <div className="mx-auto">
        <div className="mb-6">
          <nav className="flex flex-nowrap overflow-x-auto pb-2 hide-scrollbar">
            <ol className="flex space-x-2 md:space-x-8">
              {formSections.map((section, index) => {
                const isCurrent = section.id === currentSection;
                const isPast = formSections.findIndex(s => s.id === currentSection) > index;
                
                return (
                  <li key={section.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => goToSection(section.id as FormSection)}
                      className={`flex items-center group ${
                        isCurrent 
                          ? 'text-purple-600' 
                          : isPast 
                            ? 'text-gray-500 hover:text-purple-800' 
                            : 'text-gray-400'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                        isCurrent 
                          ? 'border-purple-600 bg-purple-100' 
                          : isPast 
                            ? 'border-gray-500 group-hover:border-purple-800' 
                            : 'border-gray-300'
                      }`}>
                        {section.icon}
                      </span>
                      <span className="ml-2 text-sm font-medium whitespace-nowrap">{section.title}</span>
                    </button>
                    
                    {index < formSections.length - 1 && (
                      <ChevronRight className="flex-shrink-0 mx-2 h-5 w-5 text-gray-300" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
        
        {/* Contenu de la section courante */}
        {renderFormSection()}
        
        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevSection}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
              currentSection === formSections[0].id ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="-ml-1 mr-2 h-5 w-5" />
            Précédent
          </button>
          
          {currentSection === 'review' ? (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-5 w-5" />
                  {isEditing ? 'Mettre à jour' : 'Créer l\'événement'}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextSection}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Suivant
              <ChevronRight className="-mr-1 ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
