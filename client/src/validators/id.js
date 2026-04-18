// validators.js
export const validateNationalID = (value, options = { required: false }) => {
  // If not required and empty, consider valid
  console.log(value);
  
  if (!options.required && (!value || value.trim() === '')) {
    return { isValid: true, error: null };
  }

  // Required but missing
  if (options.required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'الرقم القومي مطلوب' };
  }

  const id = value.trim();
  const idRegex = /^\d{14}$/;
  if (!idRegex.test(id)) {
    return { isValid: false, error: 'الرقم القومي يجب أن يتكون من 14 رقمًا بالضبط' };
  }

  // Optional extra checks...
  return { isValid: true, error: null };
};