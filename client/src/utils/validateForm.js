
export const validateForm = (data, schema) => {
  const errors = {};
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    if (!result.isValid) {
      errors[field] = result.error;
    }
  }
  return errors;
};