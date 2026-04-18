// schemas/userSchemas.js
import { validateText, validateEmail, validatePassword } from '../validators';

const validateRole = (value, { required = false } = {}) => {
  const allowed = ['admin', 'supervisor', 'manager'];
  if (required && !value) {
    return 'الدور مطلوب';
  }
  if (value && !allowed.includes(value)) {
    return { isValid: false, error: `الدور يجب أن يكون واحداً من: ${allowed.join('، ')}` };
  }
  return { isValid: true, error: null };
};
// Text options
const usernameOptions = { minLength: 3, maxLength: 30 };

export const addUserSchema = {
  username: (value) => validateText(value, { required: true, ...usernameOptions }),
  email: (value) => validateEmail(value, { required: true }),
  password: (value) => validatePassword(value, { required: true, minLength: 6 }),
  role: (value) => validateRole(value, { required: true }), // optional, defaults to 'supervisor'
};

// Update user schema (only username and email are updatable; password optional)
export const updateUserSchema = {
  username: (value) => validateText(value, { required: false, ...usernameOptions }),
  email: (value) => validateEmail(value, { required: false }),
  password: (value) => validatePassword(value, { required: false, minLength: 6 }),
  role: (value) => validateRole(value, { required: true }), // admin-only in backend, but validation here
};