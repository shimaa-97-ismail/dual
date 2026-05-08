// validators.js or in the same file
import { validatePassword } from '../validators';
import { validateEmail } from '../validators';

// Login specific validation
const emailOptions = { required: true };
const passwordOptions = { required: true, minLength: 8, maxLength: 12 };

export const loginSchema = {
  email: (value) => validateEmail(value, emailOptions),
  password: (value) => validatePassword(value, passwordOptions),
};