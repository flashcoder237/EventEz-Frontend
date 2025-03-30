'use client';

import { motion } from 'framer-motion';

// Animations
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

interface FormFieldsSectionProps {
  formFields: any[];
  formData: Record<string, any>;
  handleFormDataChange: (fieldId: number, value: any) => void;
}

export function FormFieldsSection({
  formFields,
  formData,
  handleFormDataChange
}: FormFieldsSectionProps) {
  return (
    <motion.div 
      className="mb-8 space-y-4"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
        variants={itemVariants}
      >
        Informations requises
      </motion.h3>
      
      {formFields.map((field, index) => (
        <motion.div 
          key={field.id}
          variants={itemVariants}
          custom={index}
          transition={{ delay: index * 0.05 }}
        >
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.field_type === 'text' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              <input
                type="text"
                value={formData[field.id] || ''}
                onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                required={field.required}
              />
            </motion.div>
          )}
          
          {field.field_type === 'textarea' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              <textarea
                value={formData[field.id] || ''}
                onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                required={field.required}
                rows={4}
              />
            </motion.div>
          )}
          
          {field.field_type === 'select' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              <select
                value={formData[field.id] || ''}
                onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                required={field.required}
              >
                <option value="">Sélectionner une option</option>
                {field.options && field.options.split(',').map((option, index) => (
                  <option key={index} value={option.trim()}>
                    {option.trim()}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
          
          {field.field_type === 'radio' && field.options && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            >
              {field.options.split(',').map((option, optionIndex) => (
                <motion.label 
                  key={optionIndex} 
                  className="flex items-center"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + optionIndex * 0.05, duration: 0.2 }}
                >
                  <input
                    type="radio"
                    name={`field-${field.id}`}
                    value={option.trim()}
                    checked={formData[field.id] === option.trim()}
                    onChange={() => handleFormDataChange(field.id, option.trim())}
                    required={field.required}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{option.trim()}</span>
                </motion.label>
              ))}
            </motion.div>
          )}
          
          {field.field_type === 'checkbox' && (
            <motion.label 
              className="flex items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="checkbox"
                checked={formData[field.id] || false}
                onChange={(e) => handleFormDataChange(field.id, e.target.checked)}
                required={field.required}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{field.placeholder || field.label}</span>
            </motion.label>
          )}
          
          {field.help_text && (
            <motion.p 
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {field.help_text}
            </motion.p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}