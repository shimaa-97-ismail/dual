import React from "react";
import { LabelForm } from "@/components/label/Label";
import { Input } from "@/components/ui/input";
export function ApplicantForm({ data, onChange, errors }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 items-center gap-4 text-black">
        <LabelForm
          htmlFor="applicantName"
          title={"اسم مقدم الطلب رباعى"}
          className="text-right"
        />
        <Input
          id="applicantName"
          name="applicantName"
          type="text"
          value={data.applicantName}
          onChange={(e) => onChange("applicantName", e.target.value)}
          // onBlur={(e) => onBlur("applicantName",e.target.value)}
          className="col-span-3"
          required
        />
        <span className="inline text-red-700">*</span>
        <div className="w-100 flex gap-4">
          {errors.applicantName && (
            <p className=" text-sm text-red-600">{errors.applicantName}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <LabelForm htmlFor="job" title={"الوظيفة"} className="text-right" />

        <Input
          id="job"
          value={data.job}
          name="job"
          type="text"
          onChange={(e) => onChange("job", e.target.value)}
          // onBlur={(e) => onBlur("job",e.target.value)}
          className="col-span-3"
          required={true}
        />
        <span className="inline text-red-700">*</span>
        <div className="w-100 flex gap-4">
          {" "}
          {errors.job && <p className="text-sm text-red-600">{errors.job}</p>}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <LabelForm htmlFor="ID" title={"الرقم القومى"} className="text-right" />

        <Input
          id="ID"
          value={data.ID}
          name="ID"
          type="text"
          onChange={(e) => onChange("ID", e.target.value)}
          // onBlur={(e) => onBlur("ID",e.target.value)}
          className="col-span-3"
          required={true}
        />
        <span className="inline text-red-700">*</span>
        <div className="flex w-100  gap-4">
          {errors.ID && (
            <p className="flex  text-sm text-red-600">{errors.ID}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <LabelForm
          htmlFor="phone"
          title={"رقم الهاتف"}
          className="text-right"
        />

        <Input
          id="phone"
          value={data.phone}
          name="phone"
          type="text"
          onChange={(e) => onChange("phone", e.target.value)}
          // onBlur={(e) => onBlur("phone",e.target.value)}
          className="col-span-3"
          required={true}
        />
        <span className="inline text-red-700">*</span>
        <div className="flex w-100  gap-4">
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <LabelForm
          htmlFor="address"
          title={"العنوان "}
          className="text-right"
        />

        <Input
          id="address"
          value={data.address}
          name="address"
          type="text"
          onChange={(e) => onChange("address", e.target.value)}
          // onBlur={(e) => onBlur("address",e.target.value)}
          className="col-span-3"
          required={true}
        />
        <span className="inline text-red-700">*</span>
        <div className="flex w-100  gap-4">
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <LabelForm
          htmlFor="relationshipWithStudent"
          title={"الصفة بالطالب"}
          className="text-right"
        />

        <Input
          id="relationshipWithStudent"
          value={data.relationshipWithStudent}
          name="relationshipWithStudent"
          type="text"
          onChange={(e) => onChange("relationshipWithStudent", e.target.value)}
          // onBlur={(e) => onBlur("relationshipWithStudent",e.target.value)}
          className="col-span-3"
          required={true}
        />
        <span className="inline text-red-700">*</span>
        <div className="flex w-100  gap-4">
          {errors.relationshipWithStudent && (
            <p className="text-sm text-red-600">
              {errors.relationshipWithStudent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
