import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { SpecialForm } from "../forms/SpecialForm";
import { validateForm } from '../../utils/validateForm';
import { addSpecialSchema, updateSpecialSchema } from '../../schemas/specialSchema';
export function Special({
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
        is_active: initialData.is_active !== undefined ? initialData.is_active : "true",
      };
    }
    return {
      name: "",
      is_active: "true",
    };
  });
  const [errors, setErrors] = useState({});

  const isUpdate = !!mode && mode === "edit";
  const schema = isUpdate ? updateSpecialSchema : addSpecialSchema;
  const handleChange = (field, value) => {
    console.log(field, value);

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData, schema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } 
    console.log("formData",formData);
    
    onSubmit(formData);
  };
  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات " : "إضافة تخصص جديدة"}
      description={mode === "edit" ? "تعديل بيانات " : "إضافة تخصص جديدة"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.name || (!initialData?._id && formData.name.trim() === "")
      }
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة تخصص  جديد"}
    >
      <SpecialForm
        key={mode === "edit" ? initialData?.id : "add"}
        data={formData}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModel>
  );
}
