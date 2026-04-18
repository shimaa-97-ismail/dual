export const validatePassword = (value, { required = true, minLength = 6 } = {}) => {
  // Required check
  if (required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'كلمة المرور مطلوبة' };
  }
  // Not required and no value -> valid
  if (!value) {
    return { isValid: true, error: null };
  }

  // Length check
  if (value.length < minLength) {
    return { isValid: false, error: `كلمة المرور يجب أن تكون ${minLength} أحرف على الأقل` };
  }

  // Uppercase letter
  if (!/[A-Z]/.test(value)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل' };
  }
  // Lowercase letter
  if (!/[a-z]/.test(value)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل' };
  }
  // Digit
  if (!/[0-9]/.test(value)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' };
  }
  // Special character
  if (!/[!@#$%^&*_-]/.test(value)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف خاص واحد على الأقل (!@#$%^&*_-)' };
  }

  return { isValid: true, error: null };
};