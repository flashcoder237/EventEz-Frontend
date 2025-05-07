'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TagInput from './TagInput';

interface GeneralInfoFormProps {
  eventData: any;
  categories: any[];
  tags: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTagsChange: (selectedTagIds: number[]) => void;
  handleCustomTagAdd: (tag: string) => void;
  handleCustomTagRemove: (tag: string) => void;
  goToNextStep: () => void;
}

export default function GeneralInfoForm({
  eventData,
  categories,
  tags,
  handleChange,
  handleTagsChange,
  handleCustomTagAdd,
  handleCustomTagRemove,
  goToNextStep
}: GeneralInfoFormProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-purple-900 mb-2">Informations générales</h2>
        <p className="text-gray-700">
          Donnez un titre accrocheur et une description complète pour attirer l'attention de vos participants.
        </p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-purple-700 transition-colors">
            Titre de l'événement *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={eventData.title}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-all p-3"
            placeholder="Donnez un titre accrocheur à votre événement"
            required
          />
        </div>

        <div className="group">
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-purple-700 transition-colors">
            Description courte
          </label>
          <input
            type="text"
            name="short_description"
            id="short_description"
            value={eventData.short_description}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-all p-3"
            placeholder="Résumé bref pour les listes d'événements (max 150 caractères)"
          />
          <span className="mt-1 text-xs text-gray-500 flex justify-end">
            {eventData.short_description.length}/150
          </span>
        </div>

        <div className="group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-purple-700 transition-colors">
            Description complète *
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={eventData.description}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-all p-3"
            placeholder="Décrivez votre événement en détail (programme, intervenants, objectifs...)"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-purple-700 transition-colors">
              Type d'événement *
            </label>
            <select
              id="event_type"
              name="event_type"
              value={eventData.event_type}
              onChange={handleChange}
              className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
              required
            >
              <option value="billetterie">Billetterie</option>
              <option value="inscription">Inscription Personnalisée</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-purple-700 transition-colors">
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={eventData.category}
              onChange={handleChange}
              className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
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
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags
          </label>
          <TagInput
            existingTags={tags}
            selectedTagIds={eventData.selected_tags}
            customTags={eventData.custom_tags}
            onTagsChange={handleTagsChange}
            onCustomTagAdd={handleCustomTagAdd}
            onCustomTagRemove={handleCustomTagRemove}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="button"
          onClick={goToNextStep}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Suivant
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}