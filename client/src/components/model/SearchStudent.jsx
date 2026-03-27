import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { SearchStudentForm } from "@/components/forms/SearchStudent";
export function SearchStudent({ open, onOpenChange, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    studentName: "",
  });
  const handleChange = (field, value) => {
    console.log(field, value);

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={"   بحث عن طالب"}
      description=""
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.studentName&&
        formData.studentName.trim()===""
      }
      submitLabel={"بحث"}
    >
      <SearchStudentForm data={formData} onChange={handleChange} />
    </BaseModel>
  );
}


