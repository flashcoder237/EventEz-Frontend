import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { FaTrashAlt } from 'react-icons/fa';

interface FormFieldCardProps {
  field: any;
  index: number;
  updateFormField: (index: number, field: string, value: any) => void;
  removeFormField: (index: number) => void;
}

export default function FormFieldCard({
  field,
  index,
  updateFormField,
  removeFormField
}: FormFieldCardProps) {
  const fieldTypeOptions = [
    { value: 'text', label: 'Texte court' },
    { value: 'textarea', label: 'Texte long' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'number', label: 'Nombre' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Liste déroulante' },
    { value: 'checkbox', label: 'Cases à cocher' },
    { value: 'radio', label: 'Boutons radio' }
  ];

  return (
    <motion.div 
      className="border border-gray-200 rounded-lg p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {/* Décoration visuelle */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500 rounded-full -ml-20 -mb-20"></div>
      </div>
      
      <div className="flex justify-between items-center mb-4 relative">
        <h4 className="font-medium text-lg">Champ #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeFormField(index)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <FaTrashAlt className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
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
          options={fieldTypeOptions}
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
    </motion.div>
  );
}