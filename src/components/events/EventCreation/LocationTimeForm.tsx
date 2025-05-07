'use client';

import { ChevronRight, ChevronLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LocationTimeFormProps {
  eventData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function LocationTimeForm({
  eventData,
  handleChange,
  goToNextStep,
  goToPreviousStep
}: LocationTimeFormProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-100 to-blue-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-indigo-900 mb-2">Date, heure et lieu</h2>
        <p className="text-gray-700">
          Précisez quand et où se déroulera votre événement pour aider vos participants à s'organiser.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
          Date et heure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Date de début *
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={eventData.start_date}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              required
            />
          </div>
          
          <div className="group">
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Heure de début *
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              value={eventData.start_time}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              required
            />
          </div>
          
          <div className="group">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Date de fin *
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={eventData.end_date}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              required
            />
          </div>
          
          <div className="group">
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Heure de fin *
            </label>
            <input
              type="time"
              name="end_time"
              id="end_time"
              value={eventData.end_time}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              required
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-blue-600" />
            Limite d'inscription (optionnel)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <input
                type="date"
                name="registration_deadline_date"
                id="registration_deadline_date"
                value={eventData.registration_deadline_date}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                placeholder="Date limite"
              />
            </div>
            <div className="group">
              <input
                type="time"
                name="registration_deadline_time"
                id="registration_deadline_time"
                value={eventData.registration_deadline_time}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all p-3"
                placeholder="Heure limite"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-indigo-600" />
          Lieu
        </h3>
        
        <div className="space-y-4">
          <div className="group">
            <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Nom du lieu *
            </label>
            <input
              type="text"
              name="location_name"
              id="location_name"
              value={eventData.location_name}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              placeholder="Ex: Palais des Congrès, Université de Yaoundé, etc."
              required
            />
          </div>
          
          <div className="group">
            <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Adresse *
            </label>
            <input
              type="text"
              name="location_address"
              id="location_address"
              value={eventData.location_address}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              placeholder="Adresse complète du lieu"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label htmlFor="location_city" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
                Ville *
              </label>
              <input
                type="text"
                name="location_city"
                id="location_city"
                value={eventData.location_city}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
                required
              />
            </div>
            
            <div className="group">
              <label htmlFor="location_country" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
                Pays *
              </label>
              <input
                type="text"
                name="location_country"
                id="location_country"
                value={eventData.location_country}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-700 transition-colors">
              Capacité maximale
            </label>
            <input
              type="number"
              name="max_capacity"
              id="max_capacity"
              value={eventData.max_capacity}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all p-3"
              placeholder="Laisser vide si pas de limite"
              min="0"
            />
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
        
        <Button
          type="button"
          onClick={goToNextStep}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Suivant
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}