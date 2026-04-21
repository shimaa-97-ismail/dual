import React, { useState,useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { ExpensesByPeriodForm } from "../forms/ExpensesByPeriodForm";
export function ExpensesReportByPeriod({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
 }) {
  const [formData, setFormData] = useState(() => {
    return {
      monthStart: "",
      startYear: "",
      monthEnd: "",
      endYear: "",
    };
  });
   const [errors, setErrors] = useState({});

     useEffect(() => {
    if (open) {
      setFormData({
        monthStart: "",
        startYear: "",
        monthEnd: "",
        endYear: "",
      });
      setErrors({});
    }
  }, [open]);
  
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
     setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     onSubmit(formData);

  };

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={"  اختار الفتره"}
      description={ "لجلب اجمالى المسدادات خلال فتره معينه"
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
    //   disabled={ }
      submitLabel={ "تأكيد"}
    >
      <ExpensesByPeriodForm
        data={formData}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModel>
  );
}
