// validationSchemas.js
import { validateName, validatePhone } from './validators';

export const FormValidation = {
  name: (value) => validateName(value, { required: true, minLength: 3, maxLength: 50 }),
  mangerName: (value) => validateName(value, { required: false, minLength: 3, maxLength: 50 }),
  mangerPhone: (value) => validatePhone(value, { required: false }),
};

export const updateFormValidation = {
  name: (value) => validateName(value, { required: true, minLength: 3, maxLength: 50 }), // same as add
  mangerName: (value) => validateName(value, { required: false, minLength: 3, maxLength: 50 }), // different required
  mangerPhone: (value) => validatePhone(value, { required: false }), // different required
};