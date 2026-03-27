import { useState, useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { StudentForm } from "../forms/studentForm";

export function StudentModel({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading,
}) {
  const DEFAULT_PHONES = [
    { number: "", type: "primary" },
    { number: "", type: "alternate" },
  ];
console.log(mode,initialData,);

  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && initialData) {
      // Ensure phones array exists and has correct structure
      const phones = Array.isArray(initialData.phones) ? initialData.phones : DEFAULT_PHONES;
      return {
        ...initialData,
        phones,
        // Ensure nested objects exist
        current_stage: initialData.current_stage || { stage_name: "" },
      };
    }
    // Create mode: default empty state
    return {
      stdName: "",
      studID: "",
      stdBOD: "",
      stdGender: "",
      phones: DEFAULT_PHONES,
      stdAddress: "",
      fatherName: "",
      fatherID: "",
      fatherPhone: "",
      fatherJobTitle: "",
      fatherJobDetails: "",
      fatherDeathCert: null,
      motherName: "",
      motherID: "",
      motherPhone: "",
      motherJobTitle: "",
      motherJobDetails: "",
      motherDeathCert: null,
      email: "",
      password: "",
      preparatorySchoolTotalScore: "",
      code: "",
      school: "",
      studStatus: "",
      current_stage: { stage_name: "" },
      stdSpecial: "",
      stdTrainningPlace: "",
      intake: "",
      graduationYear: "",
      current_class: "",
    };
  });

  // Update formData when initialData changes (edit mode)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialData,
        phones: Array.isArray(initialData.phones) ? initialData.phones : DEFAULT_PHONES,
        current_stage: initialData.current_stage || { stage_name: "" },
      });
    }
  }, [initialData, mode]);
console.log(formData);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      // Support dot notation for nested updates
      if (field.includes('.')) {
        const parts = field.split('.');
        return {
          ...prev,
          [parts[0]]: {
            ...(prev[parts[0]] || {}),
            [parts[1]]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = () => {
    // Convert any file objects to the format backend expects (if needed)
    // For now just pass the whole formData
    onSubmit(formData);
  };

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
      description={
        mode === "edit"
          ? "قم بتعديل معلومات الطالب أدناه."
          : "املأ تفاصيل الطالب الجديد أدناه."
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={!formData.stdName || !formData.studID || !formData.studStatus}
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة الطالب"}
    >
      <StudentForm
        value={formData}
        onChange={handleChange}
        mode={mode}
      />
    </BaseModel>
  );
}