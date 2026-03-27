import { validateText, validatePhone,validateEmail } from '../validators';

const nameOptions = { required: true, minLength: 3, maxLength: 100 };
const addressOptions = { required: false, minLength: 5, maxLength: 200 };
const supervisorNameOptions = { required: false, minLength: 3, maxLength: 50 };
const ownerOptions = { required: false, minLength: 3, maxLength: 50 };

const phoneOptions = { required: false, maxLength: 11 };

const emailOptions = { required: false };

const fileOptions = {
  required: false,
  maxCount: 1,
  maxSize: 5 * 1024 * 1024, // 5 MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
};

const maxParticipantsOptions = { required: false, min: 1, max: 10000 };
const currentParticipantsOptions = { required: false, min: 0, max: 10000 };

export const addTrainningPlaceSchema = {
  name: (value) => validateText(value, nameOptions),
  address: (value) => validateText(value, addressOptions),
  phone: (value) => validatePhone(value, phoneOptions),
  email: (value) => validateEmail(value, emailOptions),
  supervisorName: (value) => validateText(value, supervisorNameOptions),
  supervisorPhone: (value) => validatePhone(value, phoneOptions),
  owner: (value) => validateText(value, ownerOptions),
  ownerPhone: (value) => validatePhone(value, phoneOptions),
//   commercialRegister: (value) => validateFiles(value, fileOptions),
//   max_participants: (value) => validateNumber(value, maxParticipantsOptions),
//   current_participants: (value) => validateNumber(value, currentParticipantsOptions),
};
    
export const updateTrainningPlaceSchema = {
  name: (value) => validateText(value, { ...nameOptions, required: false }),
  address: (value) => validateText(value, addressOptions), // addressOptions بالفعل required: false
  phone: (value) => validatePhone(value, phoneOptions),
  email: (value) => validateEmail(value, emailOptions),
  supervisorName: (value) => validateText(value, supervisorNameOptions),
  supervisorPhone: (value) => validatePhone(value, phoneOptions),
  owner: (value) => validateText(value, ownerOptions),
  ownerPhone: (value) => validatePhone(value, phoneOptions),
//   commercialRegister: (value) => validateFiles(value, fileOptions),
//   max_participants: (value) => validateNumber(value, { ...maxParticipantsOptions, required: false }),
//   current_participants: (value) => validateNumber(value, { ...currentParticipantsOptions, required: false }),
};