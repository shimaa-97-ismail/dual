export const validateText = (value, options = {}) => {
  const {
    required = false,
    minLength = 10,
    maxLength = 50,
    allowNumbers = false,
    pattern: customPattern,
    messages: customMessages = {},
  } = options;

  let defaultPattern;
  if (customPattern) {
    defaultPattern = customPattern; // use provided pattern if any
  } else {
    const baseChars =  "a-zA-Z\u0600-\u06FF\\s\\-"; // letters + spaces
    const digits = allowNumbers ? "0-9\u0660-\u0669" : ""; // English + Arabic digits
    defaultPattern = new RegExp(`^[${baseChars}${digits}]+$`);
  }

  const defaultMessages = {
    required: "هذا الحقل مطلوب",
    minLength: `الحد الأدنى للأحرف هو ${minLength}`,
    maxLength: `الحد الأقصى للأحرف هو ${maxLength}`,
    pattern: allowNumbers
      ? "يسمح فقط بأحرف ومسافات وأرقام"
      : "يسمح فقط بأحرف ومسافات",
  };
  const messages = { ...defaultMessages, ...customMessages };
  const errors = [];

  if (required && (!value || value.trim() === "")) {
    errors.push(messages.required);
  } else if (value) {
    if (minLength > 0 && value.length < minLength) {
      errors.push(messages.minLength);
    }
    if (maxLength < Infinity && value.length > maxLength) {
      errors.push(messages.maxLength);
    }
    if (!defaultPattern.test(value)) {
      errors.push( messages.pattern)
    }
   
  }

  return {
    isValid: errors.length === 0,
    error: errors[0] || null, // نأخذ أول خطأ للعرض
    errors, // مصفوفة كاملة (اختياري)
  };
};
