import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { ApplicantForm } from "./../forms/Applicant";
import { applicantSchema } from "@/schemas/applicantSchema";
import { validateForm } from "../../utils/validateForm";
export function ApplicantModel({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
}) {
  const [localErrors, setLocalErrors] = useState({});
  const allErrors = { ...localErrors, ...error };
  const [formData, setFormData] = useState({
    applicantName: "",
    job: "",
    ID: "",
    phone: "",
    address: "",
    relationshipWithStudent: "",
  });

  const handleChange = (field, value) => {
    console.log(field, value);

    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  //   const handleBlur = (fieldName, value) => {
  //   validateField(fieldName, value);
  // };

  const handleSubmit = async () => {
    console.log(formData);

    const validationErrors = validateForm(formData, applicantSchema);

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({}); // clear all fields
      setLocalErrors({});
    } catch (errror) {
      console.log(errror);
    }
  };
  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={" بيانات مقدم الطلب"}
      description=""
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.applicantName?.trim() ||
        !formData.job?.trim() ||
        !formData.ID?.trim() ||
        !formData.phone?.trim() ||
        !formData.address?.trim() ||
        !formData.relationshipWithStudent?.trim()
      }
      submitLabel={"حفظ"}
    >
      <ApplicantForm
        data={formData}
        onChange={handleChange}
        // onBlur={handleBlur}
        errors={allErrors}
      />
    </BaseModel>
  );
}
