// src/components/events/registration/FormField.jsx

const FormField = ({ field, value, onChange }) => {
    // Gestionnaire de changement générique pour les champs de texte
    const handleTextChange = (e) => {
      onChange(e.target.value);
    };
  
    // Gestionnaire pour les cases à cocher
    const handleCheckboxChange = (e) => {
      onChange(e.target.checked);
    };
  
    // Rendu du champ selon son type
    const renderField = () => {
      switch (field.field_type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
          
        case 'textarea':
          return (
            <textarea
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
              rows={4}
            />
          );
          
        case 'email':
          return (
            <input
              type="email"
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
          
        case 'select':
          return (
            <select
              value={value}
              onChange={handleTextChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            >
              <option value="">Sélectionner une option</option>
              {field.options && field.options.split(',').map((option, index) => (
                <option key={index} value={option.trim()}>
                  {option.trim()}
                </option>
              ))}
            </select>
          );
          
        case 'radio':
          return (
            <div className="space-y-2">
              {field.options && field.options.split(',').map((option, index) => {
                const optionValue = option.trim();
                const id = `field-${field.id}-option-${index}`;
                
                return (
                  <label key={id} className="flex items-center">
                    <input
                      type="radio"
                      id={id}
                      name={`field-${field.id}`}
                      value={optionValue}
                      checked={value === optionValue}
                      onChange={() => onChange(optionValue)}
                      required={field.required}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{optionValue}</span>
                  </label>
                );
              })}
            </div>
          );
          
        case 'checkbox':
          return (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={handleCheckboxChange}
                required={field.required}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{field.placeholder || field.label}</span>
            </label>
          );
          
        case 'date':
          return (
            <input
              type="date"
              value={value}
              onChange={handleTextChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
          
        case 'number':
          return (
            <input
              type="number"
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
          
        case 'phone':
          return (
            <input
              type="tel"
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
          
        default:
          return (
            <input
              type="text"
              value={value}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              required={field.required}
            />
          );
      }
    };
  
    return (
      <div>
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {renderField()}
        
        {field.help_text && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.help_text}</p>
        )}
      </div>
    );
  };
  
  export default FormField;