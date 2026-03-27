// validators.js - النسخة العربية

export const validators = {
  // التحقق من البريد الإلكتروني
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "البريد الإلكتروني مطلوب";
    if (!emailRegex.test(email)) return "الرجاء إدخال بريد إلكتروني صحيح";
    return null; // لا يوجد خطأ
  },

  // التحقق من كلمة المرور (يجب أن تحتوي على: حرف كبير، حرف صغير، رقم، و _@!)
  password: (password) => {
    if (!password) return "كلمة المرور مطلوبة";
    if (password.length < 8) return "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
    if (!/[A-Z]/.test(password)) return "يجب أن تحتوي على حرف كبير واحد على الأقل";
    if (!/[a-z]/.test(password)) return "يجب أن تحتوي على حرف صغير واحد على الأقل";
    if (!/\d/.test(password)) return "يجب أن تحتوي على رقم واحد على الأقل";
    if (!/[_@!]/.test(password)) return "يجب أن تحتوي على واحد من الرموز التالية: _ @ !";
    return null; // لا يوجد خطأ
  },

  // التحقق من الهاتف (اختياري، ولكن إذا تم إدخاله يجب أن يكون صحيحاً)
  phone: (phone) => {
    if (!phone || phone.trim() === "") {
      return null; // الهاتف اختياري، لا يوجد خطأ
    }
    
    // إزالة المسافات والشرطات والأقواس
    const cleanedPhone = phone.replace(/[\s\-()]/g, '');
    
    // التحقق مما إذا كان يبدأ بالبادئات الصحيحة
    const validPrefixes = ['011', '010', '012', '015'];
    const prefix = cleanedPhone.substring(0, 3);
    
    if (!validPrefixes.includes(prefix)) {
      return "يجب أن يبدأ رقم الهاتف بـ 011 أو 010 أو 012 أو 015";
    }
    
    // التحقق من الطول الكلي (3 للبادئة + 8 أرقام = 11)
    if (cleanedPhone.length !== 11) {
      return "يجب أن يكون رقم الهاتف 11 رقماً (بما في ذلك البادئة)";
    }
    
    // التحقق مما إذا كانت جميع الأحرف بعد البادئة أرقاماً
    const numbersPart = cleanedPhone.substring(3);
    if (!/^\d{8}$/.test(numbersPart)) {
      return "يجب أن يحتوي رقم الهاتف على 8 أرقام بعد البادئة";
    }
    
    return null; // لا يوجد خطأ
  }
};


export const validateField = (value, options = {}) => {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    customValidator,
    errorMessages = {}
  } = options;

    if (required && (!value || value.trim() === '')) {
    return {
      isValid: false,
      error: errorMessages.required || 'هذا الحقل مطلوب'
    };
  }

   if (!required && (!value || value.trim() === '')) {
    return { isValid: true, error: null };
  }

    if (minLength && value.length < minLength) {
    return {
      isValid: false,
      error: errorMessages.minLength || `يجب أن يكون على الأقل ${minLength} حروف`
    };
  }

   if (maxLength && value.length > maxLength) {
    return {
      isValid: false,
      error: errorMessages.maxLength || `يجب أن لا يزيد عن ${maxLength} حروف`
    };
  }

   if (pattern && !pattern.test(value)) {
    return {
      isValid: false,
      error: errorMessages.pattern || 'القيمة المدخلة غير صالحة'
    };
  }

   if (customValidator) {
    const customResult = customValidator(value);
    if (!customResult.isValid) {
      return {
        isValid: false,
        error: customResult.error || errorMessages.custom || 'قيمة غير صالحة'
      };
    }
  }
  
  return { isValid: true, error: null };
};
export const validateName = (value, options = {}) => {
  const defaults = {
    required: false,   
    minLength: 10,
    maxLength: 50,
    pattern: /^[a-zA-Z\u0600-\u06FF\s]+$/, // أحرف إنجليزية وعربية ومسافات
    errorMessages: {
       required: 'هذا الحقل مطلوب',  
      pattern: 'يسمح فقط بأحرف ومسافات',
      minLength: `الاسم يجب أن يكون ${options.minLength} أحرف على الأقل`,
      maxLength: 'الاسم يجب أن لا يزيد عن 50 حرف'
    }
  };
  return validateField(value, { ...defaults, ...options });
};

export const validatePhone = (value, options = {}) => {
  const defaults = {
    required: false,  
    pattern: /^01[0125][0-9]{8}$/,
    errorMessages: {
      pattern: 'رقم الهاتف غير صالح. يجب أن يبدأ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقمًا'
    }
  };
  return validateField(value, { ...defaults, ...options });
};