import React, { useState,useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { UserForm } from "../forms/UserForm";
import { validateForm } from '../../utils/validateForm';
import { addUserSchema, updateUserSchema } from '../../schemas/userSchemas';


export function UserModel({ open, onOpenChange, mode, initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const isEdit = mode === "edit";

  // Sync when initialData changes or mode changes
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setFormData({
          username: initialData.username || "",
          email: initialData.email || "",
          role: initialData.role || "",
          // password: initialData.password, // never prefill password in edit mode
        });
      } else {
        setFormData({ username: "", email: "", password: "", role: "" });
      }
      setErrors({});
    }
  }, [initialData, mode, open, isEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(
      formData,
      isEdit ? updateUserSchema : addUserSchema
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const isDisabled = isEdit
    ? !formData.username || !formData.email || !formData.role
    : !formData.username || !formData.email || !formData.password || !formData.role;

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "تعديل بيانات مستخدم" : "إضافة مستخدم جديد"}
      description={isEdit ? "تعديل بيانات مستخدم" : "إضافة مستخدم جديد"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={isDisabled}
      submitLabel={isEdit ? "حفظ التعديلات" : "إضافة مستخدم"}
    >
      <UserForm
        key={isEdit && initialData ? initialData._id : "add"}
        data={formData}
        onChange={handleChange}
        errors={errors}
        mode={mode}
      />
    </BaseModel>
  );
}
