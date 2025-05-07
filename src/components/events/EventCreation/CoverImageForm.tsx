'use client';

import { useState } from 'react';
import { ChevronLeft, ImageIcon, X, Save, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CoverImageFormProps {
  imagePreview: string | null;
  handleImageRemove: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  eventData: any;
  setEventData: (data: any) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent, isDraft: boolean) => void;
  goToPreviousStep: () => void;
  isEditing: boolean;
}

export default function CoverImageForm({
  imagePreview,
  handleImageRemove,
  fileInputRef,
  handleImageChange,
  eventData,
  setEventData,
  isSubmitting,
  handleSubmit,
  goToPreviousStep,
  isEditing
}: CoverImageFormProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-pink-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-purple-900 mb-2">Image et publication</h2>
        <p className="text-gray-700">
          Finalisez votre événement en ajoutant une image de couverture attrayante.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
          <ImageIcon className="mr-2 h-5 w-5 text-purple-600" />
          Image de couverture
        </h3>
        
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden shadow-md mb-6">
            <div 
              className="aspect-w-16 aspect-h-9 bg-gray-100 relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                src={imagePreview}
                alt="Aperçu de l'image"
                fill
                className="object-cover transition-opacity"
                style={{ opacity: isHovering ? 0.7 : 1 }}
              />
              {isHovering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mr-2 bg-white rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="bg-red-500 rounded-full p-2 text-white hover:bg-red-600 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors bg-gray-50 relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4 group-hover:text-purple-500 transition-colors" />
              <div className="mt-2">
                <p className="text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                  Cliquez ou glissez-déposez une image ici
                </p>
                <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                  PNG, JPG, GIF jusqu'à 5MB. Une image attrayante augmente significativement l'intérêt pour votre événement.
                </p>
              </div>
            </motion.div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Une image de couverture attrayante et de qualité augmente significativement le taux de participation à votre événement.
                Choisissez une image en rapport avec votre thématique, lumineuse et lisible.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Finalisation</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <input
              id="is_featured"
              name="is_featured"
              type="checkbox"
              checked={eventData.is_featured}
              onChange={(e) => setEventData({...eventData, is_featured: e.target.checked})}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-3 block text-sm font-medium text-gray-700">
              Mettre en vedette sur la page d'accueil
            </label>
          </div>
          
          <div className="flex items-center px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <Info className="h-5 w-5 text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800">
              Les événements en vedette apparaissent en premier sur la page d'accueil et bénéficient d'une visibilité accrue.
            </p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="text-base font-medium text-gray-900 mb-3">Résumé de votre événement</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500">Titre :</span>
                <span className="font-medium">{eventData.title || '—'}</span>
              </div>
              <div>
                <span className="block text-gray-500">Type :</span>
                <span className="font-medium capitalize">{eventData.event_type || '—'}</span>
              </div>
              <div>
                <span className="block text-gray-500">Date :</span>
                <span className="font-medium">
                  {eventData.start_date ? (
                    `${eventData.start_date} à ${eventData.start_time || '00:00'}`
                  ) : '—'}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Lieu :</span>
                <span className="font-medium">{eventData.location_name || '—'}</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <span className="block text-gray-500 mb-1">Description courte :</span>
              <span className="text-sm">{eventData.short_description || 'Aucune description courte fournie'}</span>
            </div>
          </div>
        </div>
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
        
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            variant="outline"
            className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-700 rounded-xl hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Enregistrer comme brouillon
              </>
            )}
          </Button>
          
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                {isEditing ? 'Mettre à jour l\'événement' : 'Publier l\'événement'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}