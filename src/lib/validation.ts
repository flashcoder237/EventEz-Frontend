export function validateForm(schema, data) {
    try {
      schema.parse(data);
      return { valid: true, errors: {} };
    } catch (error) {
      return { 
        valid: false, 
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}) 
      };
    }
  }