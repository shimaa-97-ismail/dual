import React, { useState, useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { SchoolForm } from "@/components";
import { useSpecials } from "../../hooks/useSpecial";
import { useDepartments } from "../../hooks/useDepartments";
import { useTypeOfSchools } from "@/hooks/useTypeOfSchool";
import { validateForm } from "../../utils/validateForm";
import { schoolSchema, updateSchoolSchema } from "../../schemas/schoolSchemas";
// import { toast } from "react-hot-toast";
// Helper to convert populated data to form-friendly format
const normalizeInitialData = (data) => {
  if (!data) return null;
  return {
    name: data.name || "",
    type: data.type?._id || data.type || "",          // extract id from populated object
    address: data.address || "",
    phone: data.phone ||  "" ,
    email: data.email || null,
    managerName: data.managerName || "",
    departement: data.departement?._id || data.departement || "",
    special: data.special?.map(s => s._id) || [],     // store only IDs
    intakes: data.intakes || [],
    studentAffairs: data.studentAffairs || "",
    studentAffairsPhone: data.studentAffairsPhone || "",
  };
};

// Helper to convert form data to backend format
const formatForSubmit = (formData) => ({
  ...formData,

  special: formData.special,                         // already array of IDs
  email: formData.email || undefined,                // avoid empty string
  intakes: formData.intakes || [],
});

export const SchoolModel = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { data: specials } = useSpecials();
  const { data: typesOfSchools } = useTypeOfSchools();
  const { data: depatementsData } = useDepartments();

  const [formData, setFormData] = useState(() => {
    const defaultData = {
      name: "",
      type: "",
      address: "",
      phone: "",
      email: null,
      managerName: "",
      departement: "",
      special: [],
      intakes: [],
      studentAffairs: "",
      studentAffairsPhone: "",
    };
    if (mode === "edit" && initialData) {
      // return normalizeInitialData(initialData);
      return initialData
    }
    return defaultData;
  });

  const [errors, setErrors] = useState({});

  const isUpdate = mode === "edit";
  const schema = isUpdate ? updateSchoolSchema : schoolSchema;

  // Update form when initialData changes (e.g., after fetch)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(normalizeInitialData(initialData));
    }
  }, [initialData, mode]);

  const handleChange = (field, value) => {
    if (field === "special") {
      setFormData((prev) => {
        const isSelected = prev.special.includes(value);
        if (isSelected) {
          return { ...prev, special: prev.special.filter(id => id !== value) };
        } else {
          return { ...prev, special: [...prev.special, value] };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, schema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const submitData = formatForSubmit(formData);
    onSubmit(submitData);
  };

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات المدرسة" : "إضافة مدرسة جديدة"}
      description={mode === "edit" ? "تعديل بيانات المدرسة" : "إضافة مدرسة جديدة"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={!formData.name || (!initialData?._id && formData.name.trim() === "")}
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة المدرسة"}
    >
      <SchoolForm
        data={formData}
        onChange={handleChange}
        depatementsData={depatementsData}
        typesOfSchools={typesOfSchools}
        specials={specials}
        errors={errors}
      />
    </BaseModel>
  );
};