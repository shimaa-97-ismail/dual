import { validateText } from '../validators';
const nameOptions = { minLength: 3, maxLength: 50 };


export const addSpecialSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
  
};

export const updateSpecialSchema = {
  name: (value) => validateText(value, { required: true, ...nameOptions }),
 
};