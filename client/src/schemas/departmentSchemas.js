
import { validateText, validatePhone } from '../validators';

// خيارات مشتركة لحقل الاسم
const nameOptions = { minLength: 3, maxLength: 50 };
// خيارات لاسم المدير
const managerNameOptions = { minLength: 3, maxLength: 50 };
// خيارات للهاتف (يمكن تركها فارغة)


// Schema لنموذج إضافة إدارة
export const addDepartmentSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
  mangerName: (value) => validateText(value, { required: false, ...managerNameOptions }),
  mangerPhone: (value) => validatePhone(value, { required: false }),
};

// Schema لنموذج تحديث إدارة (قد تكون بعض الحقول مطلوبة بشكل مختلف)
export const updateDepartmentSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
  mangerName: (value) => validateText(value, { required: false, ...managerNameOptions }), // الآن مطلوب
  mangerPhone: (value) => validatePhone(value, { required: false }),
};