export const validateCheckbox = (value, options = {}) => {
  const { required = false } = options;
  const errors = [];

  if (required && value !== true) {
    errors.push('يجب الموافقة على هذا الحقل');
  }

  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
  };
};