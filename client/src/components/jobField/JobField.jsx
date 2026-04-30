import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function JobField({
  label,
  jobValue,
  onJobChange,
  detailsValue,
  onDetailsChange,
  onFileChange,
  fileValue,
  disabled = false,
}) {
 
  const jobOptions = ["موظف", "معاش", "لا يعمل", "ربه منزل", "متوفى"];
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <Label className="font-semibold text-lg">{label}</Label>

      <Select
        value={jobValue}
        onValueChange={onJobChange}
        // disabled={disabled}
      >
        <SelectTrigger className="text-black!">
          <SelectValue placeholder="اختر الوظيفة" />
        </SelectTrigger>
        <SelectContent>
          {jobOptions.map((job) => (
            <SelectItem key={job} value={job}>
              {job}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Conditional fields based on job selection */}
      {jobValue === "موظف" && (
        <div className="space-y-2">
          <Label>المسمى الوظيفي</Label>
          <Input
            placeholder="أدخل مسمى الوظيفة"
            value={detailsValue || ""}
            onChange={(e) => onDetailsChange(e.target.value)}
          />
        </div>
      )}

      {jobValue === "متوفى" && (
        <div className="space-y-2">
          <Label>شهادة الوفاة (pdf)</Label>
          <div className="space-y-2 w-full m-3">
            {/* <Label >شهادة وفاة (إن وجدت)</Label> */}
            <Input
              id="fatherDeathCert"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
              const file = e.target.files?.[0];
              onFileChange(file);
            }}
            disabled={disabled}
            />
           {fileValue && typeof fileValue === "string" && (
            <a
              href={`http://localhost:5000/${fileValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              عرض الملف الحالي
            </a>
          )}
          {fileValue && fileValue instanceof File && (
            <p className="text-sm text-gray-600">الملف المحدد: {fileValue.name}</p>
          )}
          </div>
         
        </div>
      )}
    </div>
  );
}
