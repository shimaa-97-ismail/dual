import { useState, useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { StudentForm } from "../forms/StudentForm";
import { studentValidators } from "../../schemas/studentSchemas";
import { toast } from "react-hot-toast";

const DEFAULT_PHONES = [
  { number: "", type: "primary" },
  { number: "", type: "alternate" },
];

const defaultFormState = {
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

export function StudentModel({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading,
}) {
  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens or mode/initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialData,
        phones: Array.isArray(initialData.phones)
          ? initialData.phones
          : DEFAULT_PHONES,
        current_stage: initialData.current_stage || { stage_name: "" },
      });
    } else {
      setFormData(defaultFormState);
    }
    // setErrors({});
  }, [mode, initialData, open]);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
        obj,
      );
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(studentValidators)) {
      let value;
      if (field.includes(".")) {
        value = getNestedValue(formData, field);
      } else {
        value = formData[field];
      }
      let result;
      if (field === "fatherJobDetails" || field === "motherJobDetails") {
        result = validator(value, formData);
      } else {
        result = validator(value);
      }
      if (!result.isValid) {
        newErrors[field] = result.error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // StudentModel.jsx – inside the component
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
    }
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
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "إضافة الطالب"}
    >
      <StudentForm
        value={formData}
        onChange={handleChange}
        mode={mode}
        errors={errors}
      />
    </BaseModel>
  );
}
