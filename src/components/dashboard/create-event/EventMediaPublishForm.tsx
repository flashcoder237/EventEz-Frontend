import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FaImage, FaTrashAlt } from 'react-icons/fa';

interface EventMediaPublishFormProps {
  eventData: any;
  setEventData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent, isDraft: boolean) => Promise<void>;
  goToPreviousStep: () => void;
}

export default function EventMediaPublishForm({
  eventData,
  setEventData,
  categories,
  isSubmitting,
  handleSubmit,
  goToPreviousStep
}: EventMediaPublishFormProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Gestion du changement de l'image de bannière
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setEventData((prev: any) => ({
        ...prev,
        banner_image: file
      }));
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onload = () => {
        setEventData((prev: any) => ({
          ...prev,
          banner_image_preview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-xl font-semibold flex items-center"
        variants={itemVariants}
      >
        <FaImage className="mr-2 text-violet" />
        Médias et publication
      </motion.h2>
      
      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-medium mb-4">Image de bannière</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all hover:border-violet hover:bg-gray-50">
          {eventData.banner_image_preview ? (
            <div className="space-y-4">
              <motion.div 
                className="aspect-video relative rounded-lg overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image 
                  src={eventData.banner_image_preview} 
                  alt="Aperçu de la bannière" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Cliquez ci-dessous pour changer l'image
                </p>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setEventData((prev: any) => ({
                      ...prev,
                      banner_image: null,
                      banner_image_preview: null
                    }));
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <FaTrashAlt className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FaImage className="mx-auto h-12 w-12 text-gray-300" />
              </motion.div>
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
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium mb-4">Prévisualisation et publication</h3>
        
        <Card className="overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-lg">Résumé de l'événement</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    {eventData.event_type === 'billetterie' 
                      ? `${eventData.ticket_types.length} type(s) de billet configuré(s)` 
                      : `${eventData.form_fields.length} champ(s) de formulaire configuré(s)`
                    }
                  </li>
                  <li>
                    Catégorie: {categories.find((c: any) => c.id.toString() === eventData.category)?.name || 'Non spécifiée'}
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
      </motion.div>
      
      <motion.div 
        className="flex justify-between"
        variants={itemVariants}
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
        <div className="space-x-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enregistrer comme brouillon
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className={`relative overflow-hidden ${isSubmitting ? 'bg-violet/80' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Publier l'événement</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </span>
              </>
            ) : (
              'Publier l\'événement'
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}