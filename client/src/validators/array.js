export const validateArray = (value, options = {}) => {
    const { required = false, minItems, maxItems, errorMessages = {} } = options;
    if (required && (!Array.isArray(value) || value.length === 0)) {
      return {
        isValid: false,
        error: errorMessages.required || 'يجب إدخال عنصر واحد على الأقل'
      };
    }
    if (Array.isArray(value)) {
      if (minItems && value.length < minItems) {
        return {
            isValid: false,
            error: errorMessages.minItems || `يجب أن يحتوي على الأقل ${minItems} عناصر`
        };
      } 
        if (maxItems && value.length > maxItems) {  
        return {
            isValid: false,
            error: errorMessages.maxItems || `يجب أن لا يحتوي على أكثر من ${maxItems} عناصر`
        };
      }

    } else if (value !== undefined && value !== null) {
      return {
        isValid: false,
        error: errorMessages.invalidType || 'يجب أن يكون هذا الحقل عبارة عن مصفوفة'
      };
    }
}