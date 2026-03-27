// validations/studentValidators.js
import {
  validateText,
  validatePhone,
  validateNationalID,
  validateEmail,
//   validateNumber,
} from "../validators";

// Options for common fields
const nameOptions = { required: true, minLength: 3, maxLength: 100 };
const jobOptions = { required: true, minLength: 2, maxLength: 100 };
const idOptions = { required: true, minLength: 14, maxLength: 14 }; // Egyptian national ID
const phoneOptions = { required: true, maxLength: 11 };
const addressOptions = { required: true, minLength: 5, maxLength: 200 };
const numberOptions = { required: true };

export const studentValidators = {
  // Personal
  stdName: (value) => validateText(value, nameOptions),
  studID: (value) => validateNationalID(value, idOptions),
  stdBOD: (value) => validateText(value, { required: true }),
  stdGender: (value) => validateText(value, { required: true }),
  stdAddress: (value) => validateText(value, addressOptions),

  // Phones
  phones: (value) => {
    if (!value || !value[0] || !value[0].number) {
      return { isValid: false, error: "رقم الهاتف الأساسي مطلوب" };
    }
    const phoneValidation = validatePhone(value[0].number, { required: true });
    if (!phoneValidation.isValid) return phoneValidation;
    return { isValid: true, error: null };
  },

  // Father
  fatherName: (value) => validateText(value, nameOptions),
  fatherID: (value) => validateNationalID(value, idOptions),
  fatherPhone: (value) => validatePhone(value, phoneOptions),
  fatherJobTitle: (value) => validateText(value, jobOptions),
  fatherJobDetails: (value) => {
    // Only validate if job is "موظف"
    if (value !== undefined && value !== "") {
      return validateText(value, {
        required: true,
        minLength: 2,
        maxLength: 100,
      });
    }
    return { isValid: true, error: null };
  },

  // Mother
  motherName: (value) => validateText(value, nameOptions),
  motherID: (value) => validateNationalID(value, idOptions),
  motherPhone: (value) => validatePhone(value, { required: false }), // optional
  motherJobTitle: (value) => validateText(value, jobOptions),
  motherJobDetails: (value) => {
    if (value !== undefined && value !== "") {
      return validateText(value, {
        required: true,
        minLength: 2,
        maxLength: 100,
      });
    }
    return { isValid: true, error: null };
  },

  // Additional
  email: (value) => validateEmail(value),
  preparatorySchoolTotalScore: (value) => validateNumber(value, numberOptions),

  // Academic
  school: (value) => validateText(value, { required: true }),
  studStatus: (value) => validateText(value, { required: true }),
  current_stage: (value) => {
    if (!value || !value.stage_name) {
      return { isValid: false, error: "المرحلة الدراسية مطلوبة" };
    }
    return validateText(value.stage_name, { required: true });
  },
  stdSpecial: (value) => validateText(value, { required: true }),
  intake: (value) => validateText(value, { required: false }),
  graduationYear: (value) => validateText(value, { required: false }),
  current_class: (value) => validateText(value, { required: false }),
};
