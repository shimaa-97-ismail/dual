// applicantValidators.js
import { validateText, validatePhone,validateNationalID } from '../validators';

// Options for each field
const nameOptions = { required: true, minLength: 3, maxLength: 100 };
const jobOptions = { required: true, minLength: 2, maxLength: 100 };
const idOptions = { required: true, minLength: 14, maxLength: 14 }; // Egyptian national ID
const phoneOptions = { required: true, maxLength: 11 };
const addressOptions = { required: true, minLength: 5, maxLength: 200,  allowNumbers: true, };
const relationshipOptions = { required: true, minLength: 2, maxLength: 100 };

export const applicantSchema = {
  applicantName: (value) => validateText(value, nameOptions),
  job: (value) => validateText(value, jobOptions),
  ID: (value) => validateNationalID(value, idOptions),
  phone: (value) => validatePhone(value, phoneOptions),
  address: (value) => validateText(value, addressOptions),
  relationshipWithStudent: (value) => validateText(value, relationshipOptions),
};