import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { FaInfoCircle } from 'react-icons/fa';

interface EventGeneralInfoFormProps {
  eventData: any;
  setEventData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  tags: any[];
  goToNextStep: () => void;
}

export default function EventGeneralInfoForm({
  eventData,
  setEventData,
  categories,
  tags,
  goToNextStep
}: EventGeneralInfoFormProps) {
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`handleChange called with name: ${name}, value: ${value}`);
    setEventData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeaturedChange = useCallback((checked: boolean) => {
    console.log(`handleFeaturedChange called with checked: ${checked}`);
    setEventData((prev: any) => ({ 
      ...prev, 
      is_featured: checked 
    }));
  }, [setEventData]);

  const toggleTag = (tagId: number) => {
    console.log(`toggleTag called with tagId: ${tagId}`);
    setEventData((prev: any) => {
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

  return (
    <div className="space-y-6">
      <motion.h2 
        className="text-xl font-semibold flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaInfoCircle className="mr-2 text-violet" />
        Informations générales
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Input
            label="Titre de l'événement *"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Ex: Concert live, Conférence tech, Atelier cuisine..."
            required
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
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
          </motion.div>
          
          <motion.div 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
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
          </motion.div>
        </div>
        
        <motion.div 
          custom={3}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Textarea
            label="Description courte"
            name="short_description"
            value={eventData.short_description}
            onChange={handleChange}
            placeholder="Résumé court de votre événement (max 255 caractères)"
            maxLength={255}
          />
        </motion.div>
        
        <motion.div 
          custom={4}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Textarea
            label="Description complète *"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Décrivez votre événement en détail"
            className="min-h-40"
            required
          />
        </motion.div>
        
        <motion.div 
          custom={5}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <motion.button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  eventData.selected_tags.includes(tag.id)
                    ? 'bg-violet text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag.name}
              </motion.button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Sélectionnez des tags pour aider les utilisateurs à trouver votre événement
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            custom={6}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Input
              label="Capacité maximale"
              type="number"
              name="max_capacity"
              value={eventData.max_capacity}
              onChange={handleChange}
              min={0}
              placeholder="Laisser vide si pas de limite"
            />
          </motion.div>
          
          <motion.div 
            custom={7}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex items-center h-full pt-7"
          >
            <div className="flex items-center cursor-pointer">
              <Switch
                checked={!!eventData.is_featured}
                onCheckedChange={handleFeaturedChange}
              />
              <span className="ml-2">Demander une mise en avant</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button 
          type="button" 
          onClick={goToNextStep}
          className="transition-all hover:scale-105"
        >
          Etape suivante
        </Button>
      </motion.div>
    </div>
  );
}