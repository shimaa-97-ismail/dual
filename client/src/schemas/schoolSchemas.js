// schemas/schoolSchemas.js
import {
  validateText,
  validatePhone,
  validateEmail,
  validateSelect,
  
} from "../validators";

// خيارات مشتركة للحقول النصية
const nameOptions = {
  maxLength: 60,
  required: true,
  allowNumbers: true,
  minLength: 3,
};
const managerNameOptions = { maxLength: 50, minLength: 3, required: false };

const studentAffairsOptions = { maxLength: 50, minLength: 3, required: false };
// const studentAffairsPhoneOptions = { maxLength: 11 };
const addressOptions = {
  required: true,
  minLength: 5,
  maxLength: 200,
  allowNumbers: true,
}; 
const phoneOptions = { maxLength: 11 };


// Schema موحد للإضافة والتحديث (كل الحقول المطلوبة هي نفسها)
export const schoolSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
  address: (value) => validateText(value, addressOptions),
  //   intakes: (value) => validateArray(value, { required: false, itemValidator: intakeItemValidator }),
  managerName: (value) =>
    validateText(value, { required: false, ...managerNameOptions }),
  phone: (value) => validatePhone(value, { required: false, ...phoneOptions }),
  email: (value) => validateEmail(value, { required: false }),
  studentAffairs: (value) =>
    validateText(value, { required: false, ...studentAffairsOptions }),
  studentAffairsPhone: (value) =>
    validatePhone(value, { required: false, ...phoneOptions }),
  type: (value) => validateSelect(value, { required: true }),
  departement: (value) => validateSelect(value, { required: true }),
};

export const updateSchoolSchema = {
  name: (value) => validateText(value, { required: false, ...nameOptions }),
  address: (value) =>
    validateText(value, { required: false, ...addressOptions }),
  //   intakes: (value) => validateArray(value, { required: false, itemValidator: intakeItemValidator }),
  managerName: (value) =>
    validateText(value, { required: false, ...managerNameOptions }),
  phone: (value) => validatePhone(value,  { required: false, ...phoneOptions }),
  email: (value) => validateEmail(value, { required: false }),
  studentAffairs: (value) =>
    validateText(value, { required: false }),
  studentAffairsPhone: (value) =>
    validatePhone(value, { required: false, ...phoneOptions }),
  type: (value) => validateSelect(value, { required: true }),
  departement: (value) => validateSelect(value, { required: true }),
};
