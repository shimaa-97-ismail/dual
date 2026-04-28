export const validateNumber = (value, options = {}) => {
  const { required = false } = options;
  const errors = [];

  // Trim whitespace to avoid false positives
  const trimmedValue = value?.trim();

  if (required && !trimmedValue) {
    errors.push('الرقم مطلوب');                 // Number required
  } else if (trimmedValue && !/^\d+$/.test(trimmedValue)) {
    errors.push('الرقم غير صالح');              // Invalid number (must be digits only)
  }

  return { isValid: errors.length === 0, error: errors[0] || null };
};