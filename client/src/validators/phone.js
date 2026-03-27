export const validatePhone = (value, options = {}) => {
  const { required = false } = options;
  const errors = [];
  if (required && !value) errors.push('رقم الهاتف مطلوب');
  else if (value && !/^01[0125][0-9]{8}$/.test(value)) {
    errors.push('رقم الهاتف غير صالح. يجب أن يبدأ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقمًا');
  }
  return { isValid: errors.length === 0, error: errors[0] || null };
};