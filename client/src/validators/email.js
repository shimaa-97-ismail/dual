export const validateEmail = (value, options = {}) => {
  const { required = false } = options;
  const errors = [];
  if (required && !value) errors.push('البريد الإلكتروني مطلوب');
  else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errors.push('البريد الإلكتروني غير صالح');
  }
  return { isValid: errors.length === 0, error: errors[0] || null };
};