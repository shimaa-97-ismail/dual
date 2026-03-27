import React, { useState } from "react";
import { BaseModel } from "./BaseModel";
import { SchoolForm } from "@/components";
// import { toast } from "react-hot-toast";
import { useSpecials } from "../../hooks/useSpecial";
import { useDepartments } from "../../hooks/useDepartments";
import { useTypeOfSchools } from "@/hooks/useTypeOfSchool";
import { validateForm } from "../../utils/validateForm";
import { schoolSchema, updateSchoolSchema } from "../../schemas/schoolSchemas";
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
    if (mode === "edit" && initialData) {
      console.log("initialData:", initialData);
      
      return {
        name: initialData?.name || "",
        type: initialData?.type || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        managerName: initialData.managerName || "",
        departement: initialData.departement || "",
        special: initialData.special || "",
        intakes: initialData.intakes || []
      };
    }
    return {
      name: "",
      type: "",
      address: "",
      phone: "",
      email: null,
      managerName: "",
      departement: "",
      special: [],
      intakes:[]
    };
  });
  const [errors, setErrors] = useState({});

  const isUpdate = !!mode && mode === "edit";
  console.log("isUpdate:", isUpdate);
  
  const schema = isUpdate ? updateSchoolSchema : schoolSchema;

  const handleChange = (field, value) => {
    console.log(field, value);
    if (field === "special") {
      setFormData((prev) => {
        const specialToAdd = specials.find((s) => s._id === value);
        const isExists = prev.special.some((item) => item._id === value);
        if (isExists) {
          return {
            ...prev,
            special: prev.special.filter((item) => item._id !== value),
          };
        } else {
          // إذا لم يكن موجودًا، نضيف الكائن الكامل
          return {
            ...prev,
            special: [...prev.special, specialToAdd],
          };
        }
      });
    } else setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // إرسال النموذج
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(formData, schema);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    onSubmit(formData);
  };
  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل بيانات المدرسه" : "إضافة مدرسه جديدة"}
      description={
        mode === "edit" ? "تعديل بيانات المدرسه" : "إضافة مدرسه جديدة"
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
      disabled={
        !formData.name || (!initialData?._id && formData.name.trim() === "")
      }
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة المدرسه"}
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
