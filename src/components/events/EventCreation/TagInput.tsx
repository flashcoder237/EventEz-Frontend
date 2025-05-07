'use client';

import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagInputProps {
  existingTags: any[];
  selectedTagIds: number[];
  customTags: string[];
  onTagsChange: (selectedTags: number[]) => void;
  onCustomTagAdd: (tag: string) => void;
  onCustomTagRemove: (tag: string) => void;
}

export default function TagInput({
  existingTags,
  selectedTagIds,
  customTags,
  onTagsChange,
  onCustomTagAdd,
  onCustomTagRemove
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onCustomTagAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleExistingTagSelect = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {selectedTagIds.map(tagId => {
          const tag = existingTags.find(t => t.id === tagId);
          if (!tag) return null;
          
          return (
            <div 
              key={tag.id}
              className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleExistingTagSelect(tag.id)}
                className="text-purple-600 hover:text-purple-800"
                aria-label={`Supprimer le tag ${tag.name}`}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
        
        {customTags.map(tag => (
          <div 
            key={tag}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onCustomTagRemove(tag)}
              className="text-blue-600 hover:text-blue-800"
              aria-label={`Supprimer le tag personnalisé ${tag}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="relative flex items-center">
          <Tag className="absolute left-3 text-gray-400" size={18} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter un tag personnalisé et appuyer sur Entrée"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
          <button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                onCustomTagAdd(inputValue.trim());
                setInputValue('');
              }
            }}
            className="absolute right-2 rounded-full p-1 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
            aria-label="Ajouter un tag"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Tags disponibles :</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {existingTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleExistingTagSelect(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}