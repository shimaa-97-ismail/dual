import { useState, useEffect } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateForm } from "@/utils/validateForm";
import { addTrainningPlaceSchema, updateTrainningPlaceSchema } from "../../schemas/trainingPlaceSchema";

export const TrainningPlaceForm = ({ onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    supervisorName: "",
    supervisorPhone: "",
    owner: "",
    ownerPhone: "",
    commercialRegister: "", // URL as string
    idCard: "",             // URL for national ID
    taxFile: "",            // URL for tax file
    socialMedia: "",        // URL for social media
    email: "",
    capacity: "",
    type: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isValidUrl = (input) => {
    if (!input) return true; // empty is allowed unless required by schema
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // First, validate URL fields manually (or rely on schema)
    const urlFields = ["commercialRegister", "idCard", "taxFile", "socialMedia"];
    const urlErrors = {};
    for (const field of urlFields) {
      const value = formData[field];
      if (value && !isValidUrl(value)) {
        urlErrors[field] = "رابط غير صالح. يجب أن يبدأ بـ http:// أو https://";
      }
    }
    if (Object.keys(urlErrors).length > 0) {
      setErrors(urlErrors);
      return;
    }

    // Use schema validation for the rest
    const schema = initialData ? updateTrainningPlaceSchema : addTrainningPlaceSchema;
    const validationErrors = validateForm(formData, schema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Place Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            اسم المكان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="أدخل اسم المكان"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="رقم الهاتف"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">البريد الالكترونى</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="البريد الالكترونى"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="العنوان الكامل"
          />
          {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* Owner Section */}
        <div className="md:col-span-2 space-y-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800">المالك</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اسم المالك <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="اسم المالك"
              />
              {errors.owner && <p className="text-sm text-red-600">{errors.owner}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="رقم الهاتف"
              />
              {errors.ownerPhone && <p className="text-sm text-red-600">{errors.ownerPhone}</p>}
            </div>
          </div>
        </div>

        {/* Supervisor Section */}
        <div className="md:col-span-2 space-y-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800">المشرف المسؤول</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">اسم المشرف</label>
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="اسم المشرف"
              />
              {errors.supervisorName && <p className="text-sm text-red-600">{errors.supervisorName}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
              <input
                type="tel"
                name="supervisorPhone"
                value={formData.supervisorPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="رقم الهاتف"
              />
              {errors.supervisorPhone && <p className="text-sm text-red-600">{errors.supervisorPhone}</p>}
            </div>
          </div>
        </div>

       

        {/* Commercial Register URL */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="commercialRegister">السجل التجاري (رابط)</FieldLabel>
            <Input
              id="commercialRegister"
              type="url"
              name="commercialRegister"
              value={formData.commercialRegister}
              onChange={handleChange}
              placeholder="https://example.com/commercial-register.pdf"
              className={errors.commercialRegister ? "border-red-500" : ""}
            />
            {errors.commercialRegister && (
              <p className="text-sm text-red-600">{errors.commercialRegister}</p>
            )}
            <FieldDescription>أدخل رابط المستند (PDF أو صورة)</FieldDescription>
          </Field>
        </div>

        {/* National ID URL */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="idCard">بطاقة قومية (رابط)</FieldLabel>
            <Input
              id="idCard"
              type="url"
              name="idCard"
              value={formData.idCard}
              onChange={handleChange}
              placeholder="https://example.com/national-id.pdf"
              className={errors.idCard ? "border-red-500" : ""}
            />
            {errors.idCard && <p className="text-sm text-red-600">{errors.idCard}</p>}
            <FieldDescription>أدخل رابط صورة البطاقة</FieldDescription>
          </Field>
        </div>

        {/* Tax File URL */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="taxFile">ملف ضريبي (رابط)</FieldLabel>
            <Input
              id="taxFile"
              type="url"
              name="taxFile"
              value={formData.taxFile}
              onChange={handleChange}
              placeholder="https://example.com/tax-file.pdf"
              className={errors.taxFile ? "border-red-500" : ""}
            />
            {errors.taxFile && <p className="text-sm text-red-600">{errors.taxFile}</p>}
            <FieldDescription>أدخل رابط المستند الضريبي</FieldDescription>
          </Field>
        </div>

        {/* Social Media URL */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="socialMedia">رابط التواصل الاجتماعي</FieldLabel>
            <Input
              id="socialMedia"
              type="url"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
              className={errors.socialMedia ? "border-red-500" : ""}
            />
            {errors.socialMedia && <p className="text-sm text-red-600">{errors.socialMedia}</p>}
            <FieldDescription>أدخل رابط صفحة التواصل (فيسبوك، تويتر، إلخ)</FieldDescription>
          </Field>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري الحفظ...
            </span>
          ) : initialData ? (
            "تحديث المكان"
          ) : (
            "إضافة المكان"
          )}
        </button>
      </div>
    </form>
  );
};