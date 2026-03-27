import { useState, useEffect } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateForm } from "@/utils/validateForm";  
import { addTrainningPlaceSchema,updateTrainningPlaceSchema } from "../../schemas/trainingPlaceSchema";

export const TrainningPlaceForm = ({ onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    supervisorName: "",
    supervisorPhone: "",
    owner: "",
    ownerPhone: "",
    commercialRegister: "",
    email: "",
    capacity: "",
    type: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  // If we're editing, populate the form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // تحويل FileList إلى مصفوفة
    setSelectedFiles(files); // حفظها في state (مثلاً)
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if it's a nested supervisor field
    if (name.startsWith("supervisor.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        supervisorName: {
          ...prev.supervisorName,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder=" رقم الهاتف "
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            البريد الالكترونى
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="البريد الالكترونى  "
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

        {/*owner*/}
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
          <h3 className="text-lg font-semibold text-gray-800">
            المشرف المسؤول
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اسم المشرف 
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleChange}
                // required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="اسم المشرف"
              />
              {errors.supervisorName && <p className="text-sm text-red-600">{errors.supervisorName}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                رقم الهاتف 
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="tel"
                name="supervisorPhone"
                value={formData.supervisorPhone}
                onChange={handleChange}
                // required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="رقم الهاتف"
              />
              {errors.supervisorPhone && <p className="text-sm text-red-600">{errors.supervisorPhone}</p>}
            </div>
          </div>
        </div>
        {/* Capacity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            عدد المتدربين
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="عدد المتدربين"
          />
          {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
        </div>
        {/*commercial Register*/}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="commercialRegister">السجل تجاري</FieldLabel>
            <Input
              id="commercialRegister"
              type="file"
              name="commercialRegister"
              onChange={handleFileChange}
            />
              {errors.commercialRegister && <p className="text-sm text-red-600">{errors.commercialRegister}</p>}
            {/* <FieldDescription>Select a picture to upload.</FieldDescription> */}
          </Field>
          
        </div>
          {/*id */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="id">بطاقه القومية </FieldLabel>
            <Input
              id="id"
              type="file"
              name="id"
              onChange={handleFileChange}
            />
              {errors.id && <p className="text-sm text-red-600">{errors.id}</p>}
            {/* <FieldDescription>Select a picture to upload.</FieldDescription> */}
          </Field>
          
        </div>
         {/*id */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="id"> ملف ضربى</FieldLabel>
            <Input
              id="id"
              type="file"
              name="id"
              onChange={handleFileChange}
            />
          </Field>

          
        </div>

       {/*id */}
        <div className="md:col-span-2 space-y-2">
          <Field>
            <FieldLabel htmlFor="socialMedia"> social Media</FieldLabel>
            <Input
              id="socialMedia"
              type="url"
              name="socialMedia"
              onChange={handleFileChange}
            />
          </Field>
          
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
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
