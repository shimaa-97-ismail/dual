import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { Department } from "../forms/Department";
import { validateForm } from '../../utils/validateForm';
import { addDepartmentSchema, updateDepartmentSchema } from '../../schemas/departmentSchemas';
export function DepartmentModel({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading,
 }) {
  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && initialData) {
      return {
        name: initialData.name || "",
        mangerName: initialData.mangerName || "",
        mangerPhone: initialData.mangerPhone || "",
      };
    }
    return {
      name: "",
      mangerName: "",
      mangerPhone: "",
    };
  });
   const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
     setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "edit") {
      const validationErrors = validateForm(formData, updateDepartmentSchema);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    } else {
      const validationErrors = validateForm(formData, addDepartmentSchema);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
      onSubmit(formData);
    // }
  };
  //  const handleBlur = (field, value) => {
  //   const validator = schema[field];
  //   if (validator) {
  //     const result = validator(value);
  //     setErrors(prev => ({ ...prev, [field]: result.isValid ? null : result.error }));
  //   }
  // };;
  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات الإدارة" : "إضافة إدارة جديدة"}
      description={
        mode === "edit" ? "تعديل بيانات الإدارة" : "إضافة إدارة جديدة"
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.name || (!initialData?._id && formData.name.trim() === "")
      }
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة الإدارة"}
    >
      <Department
        key={mode === "edit" ? initialData?.id : "add"}
        data={formData}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModel>
  );
}
