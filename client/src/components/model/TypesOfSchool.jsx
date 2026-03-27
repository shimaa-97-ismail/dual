import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { TypesOfSchoolForm } from "../forms/TypesOfSchoolForm";
import { validateForm } from '../../utils/validateForm';
import { addTypeOfSchoolSchema, updateTypeOfSchoolSchema } from '../../schemas/typeOfSchoolSchema';
export function TypesOfSchool({
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
      };
    }
    return {
      name: "",
    };
  });
  const [errors, setErrors] = useState({});

  const isUpdate = !!mode && mode === "edit";
  const schema = isUpdate ? updateTypeOfSchoolSchema : addTypeOfSchoolSchema;
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData, schema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };
  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات " : "إضافة نوع جديدة"}
      description={mode === "edit" ? "تعديل بيانات " : "إضافة نوع جديدة"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.name || (!initialData?._id && formData.name.trim() === "")
      }
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة نوع مدرسه جديد"}
    >
      <TypesOfSchoolForm
        key={mode === "edit" ? initialData?.id : "add"}
        data={formData}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModel>
  );
}
