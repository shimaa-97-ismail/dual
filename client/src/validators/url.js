
export const validateUrl = (value, options = {}) => {
  const {
    required = false,
    pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/i, // نمط بسيط للروابط
    messages = {},
  } = options;

  const defaultMessages = {
    required: 'هذا الحقل مطلوب',
    invalid: 'الرجاء إدخال رابط صحيح',
    pattern: 'الرابط لا يتطابق مع النمط المطلوب',
  };

  const msgs = { ...defaultMessages, ...messages };
  const errors = [];

  if (required && (!value || value.trim() === '')) {
    errors.push(msgs.required);
  } else if (value && value.trim() !== '') {
    // محاولة إضافة https:// إذا لم يكن هناك بروتوكول لتسهيل التحقق
    let testValue = value.trim();
    if (!/^https?:\/\//i.test(testValue)) {
      testValue = 'http://' + testValue;
    }
    try {
      const url = new URL(testValue);
      // تحقق إضافي من وجود hostname صالح
      if (!url.hostname.includes('.')) {
        errors.push(msgs.invalid);
      }
    } catch {
      errors.push(msgs.invalid);
    }
    // إذا كان هناك نمط مخصص، نتحقق منه بعد التحقق الأساسي
    if (pattern && !pattern.test(value)) {
      errors.push(msgs.pattern);
    }
  }

  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
  };
};