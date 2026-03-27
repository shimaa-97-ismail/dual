export const validateSelect = (value, options = {}) => {
  const { required = false } = options;
  const errors = [];
  console.log(value);
  
  if (required && (!value || value === '')) {
    errors.push('يرجى اختيار قيمة');
  }
  return { isValid: errors.length === 0, error: errors[0] || null };
};