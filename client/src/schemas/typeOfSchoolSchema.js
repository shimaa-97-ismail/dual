import { validateText } from '../validators';
const nameOptions = { minLength: 3, maxLength: 50 };


export const addTypeOfSchoolSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
  
};

export const updateTypeOfSchoolSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
 
};