// src/components/events/registration/RegistrationForm.jsx
import FormField from './FormField';

const RegistrationForm = ({ formFields, formData, onFormDataChange }) => {
  return (
    <div className="mb-8 space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Informations requises
      </h3>
      
      {formFields.map(field => (
        <FormField
          key={field.id}
          field={field}
          value={formData[field.id] || ''}
          onChange={(value) => onFormDataChange(field.id, value)}
        />
      ))}
    </div>
  );
};

export default RegistrationForm;