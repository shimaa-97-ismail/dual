// validations/studentValidators.js
import {
  validateText,
  validatePhone,
  validateNationalID,
  validateEmail,
  validateNumber,
} from "../validators";

// Options for common fields
const nameOptions = { required: true, minLength: 3, maxLength: 100 };
const jobOptions = { required: true, minLength: 2, maxLength: 100 };
const idOptions = { required: true, minLength: 14, maxLength: 14 }; // Egyptian national ID
const phoneOptions = {
  required: true,
  maxLength: 11,
  message: {
    required: "رقم الهاتف مطلوب",
    maxLength: "رقم الهاتف يجب ألا يزيد عن 11 رقمًا"
  }
};
const addressOptions = { required: true, minLength: 5, maxLength: 200 ,allowNumbers: true,};
// const numberOptions = { required: true };
const validateIntake = (value) => {
  if (!value) return { isValid: true, error: null }; // optional
  const pattern = /^\d{4}\/\d{4}$/;
  if (!pattern.test(value)) {
    return { isValid: false, error: "صيغة الدفعة يجب أن تكون سنة/سنة (مثال: 2025/2026)" };
  }
  const [start, end] = value.split("/").map(Number);
  if (end !== start + 1) {
    return { isValid: false, error: "السنة الثانية يجب أن تلي السنة الأولى (مثال: 2025/2026)" };
  }
  return { isValid: true, error: null };
};
// Helper for required fields
const requiredField = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { isValid: false, error: `${fieldName} مطلوب` };
  }
  return { isValid: true, error: null };
};
const validateCurrentClass = (value) => {
  if (!value) return { isValid: true, error: null }; // optional
  const pattern = /^\d{1,2}\/\d{1,2}$/;
  if (!pattern.test(value)) {
    return { isValid: false, error: "صيغة الفصل يجب أن تكون رقم/رقم (مثال: 1/1 أو 1/15)" };
  }
  return { isValid: true, error: null };
};
const validateGraduationYear = (value) => {
  if (!value) return { isValid: true, error: null }; // optional
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num < 2000 || num > 2100) {
    return { isValid: false, error: "سنة التخرج يجب أن تكون رقماً صحيحاً بين 2000 و 2100" };
  }
  return { isValid: true, error: null };
};

const validatePassword = (value) => {
  if (!value) return { isValid: true, error: null }; // optional
  if (typeof value !== "string") return { isValid: false, error: "كلمة المرور غير صالحة" };
  if (value.length < 6) return { isValid: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
  if (value.length > 12) return { isValid: false, error: "كلمة المرور طويلة جداً (حد أقصى 12)" };
  // Optional: enforce alphanumeric or special characters? We'll keep simple.
  return { isValid: true, error: null };
};
const validateCode = (value) => {
  if (!value) return { isValid: true, error: null };
  if (typeof value !== "string") return { isValid: false, error: "الكود غير صالح" };
  // Allow Arabic letters, English letters, numbers, no spaces
  const allowedRegex = /^[\u0600-\u06FFa-zA-Z0-9]+$/;
  if (!allowedRegex.test(value)) {
    return { isValid: false, error: "الكود يجب أن يحتوي على حروف عربية أو إنجليزية وأرقام فقط (بدون مسافات)" };
  }
  if (value.length < 3) return { isValid: false, error: "الكود يجب أن يكون 3 أحرف على الأقل" };
  if (value.length > 20) return { isValid: false, error: "الكود طويل جداً (حد أقصى 20)" };
  return { isValid: true, error: null };
};
export const studentValidators = {
  // Personal
  stdName: (value) => validateText(value, nameOptions),
  studID: (value) => validateNationalID(value, idOptions),
    stdBOD: (value) => requiredField(value, "تاريخ الميلاد"),
  stdGender: (value) => requiredField(value, "الجنس"),
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
    if (value && value.trim() !== "") {
      return validateText(value, {
        required: false,
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
   if (value && value.trim() !== "") {
      return validateText(value, {
        required: false,
        minLength: 2,
        maxLength: 100,
      });
    }
    return { isValid: true, error: null };
  },

  // Additional
   email: (value) => (value ? validateEmail(value) : { isValid: true, error: null }),
   password:validatePassword,
   code:validateCode,
  preparatorySchoolTotalScore: (value) => {
    if (!value) return { isValid: false, error: "مجموع الإعدادية مطلوب" };
    if (isNaN(value)) return { isValid: false, error: "يجب أن يكون رقمًا" };
    return { isValid: true, error: null };
  },
  // Academic
  school: (value) => requiredField(value, "المدرسة"),
  studStatus: (value) => requiredField(value, "حالة الطالب"),

    current_stage: (value) => {
    // value is an object like { stage_name: "..." }
    if (!value || !value.stage_name) {
      return { isValid: false, error: "المرحلة الدراسية مطلوبة" };
    }
    return { isValid: true, error: null };
  },

  stdSpecial: (value) => requiredField(value, "التخصص"),
  intake: (value) => requiredField(value, "الدفعة"),                     
  graduationYear: validateGraduationYear,    
  current_class: validateCurrentClass, 
};
