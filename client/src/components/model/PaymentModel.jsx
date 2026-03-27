import React, { useState, useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { PaymentForm } from "@/components";

export function PaymentModel({
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
        month: initialData.month,
        year: initialData.year,
        amountDue: initialData.amountDue,
        receipt1: initialData.receipt1,
        receipt2: initialData.receipt2,
        paymentDate: initialData.paymentDate ? initialData.paymentDate.split("T")[0] : "",
        academicyearForPayment: initialData.academicyearForPayment,
      };
    } else {
      return {
        year: "",
        month: "",
        amountDue: "",
        paymentDate: "",
        receipt1: "",
        receipt2: "",
        academicyearForPayment: "",
      };
    }
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.month) newErrors.month = "الشهر مطلوب";
    if (!formData.year) newErrors.year = "السنة مطلوبة";
    if (!formData.amountDue) newErrors.amountDue = "القيمة مطلوبة";
    if (!formData.receipt1) newErrors.receipt1 = "رقم الإيصال الأول مطلوب";
    if (!formData.paymentDate) newErrors.paymentDate = "التاريخ مطلوب"
    else if(formData.year.toString().length !== 4) newErrors.year="السنة يجب ان تكون 4 أرقام  (مثال: 2024) "
    if (!formData.academicyearForPayment)
      newErrors.academicyearForPayment = "السنة الدراسية مطلوبة";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await onSubmit(formData);
      if (mode === "add") {
        setFormData({
          year: "",
          month: "",
          amountDue: "",
          paymentDate: "",
          receipt1: "",
          receipt2: "",
          academicyearForPayment: "",
        });
        setErrors({});
      }
    } catch (error) {
      let errorMessage = "حدث خطأ أثناء الإرسال";
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.statusText) {
          errorMessage = error.response.statusText;
        }
      } else if (error.request) {
        errorMessage = "لا يوجد استجابة من الخادم";
      } else {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        month: initialData.month,
        year: initialData.year,
        amountDue: initialData.amountDue,
        receipt1: initialData.receipt1,
        receipt2: initialData.receipt2,
        paymentDate: initialData.paymentDate ? initialData.paymentDate.split("T")[0] : "",
        academicyearForPayment: initialData.academicyearForPayment,
      });
    } else if (mode === "add") {
      setFormData({
        year: "",
        month: "",
        amountDue: "",
        paymentDate: "",
        receipt1: "",
        receipt2: "",
        academicyearForPayment: "",
      });
      setErrors({});
      setSubmitError(undefined);
    }
  }, [initialData, mode]);

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "تعديل المصروفات" : "إضافة المصروفات"}
      description={mode === "edit" ? "تعديل المصروفات" : "إضافة المصروفات"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel={mode === "edit" ? "حفظ التعديلات" : "تسديد المصروفات"}
    >
      {submitError && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-center">
          {submitError}
        </div>
      )}
      <PaymentForm
        key={mode === "edit" ? initialData?._id : "add"}  // use _id instead of id
        data={formData}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModel>
  );
}