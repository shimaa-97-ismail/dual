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
export  function JobField({ label, jobValue, onJobChange, detailsValue, onDetailsChange, onFileChange,fileValue,disabled = false  }) {
 console.log(label, jobValue, onJobChange, detailsValue, onDetailsChange, onFileChange);
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
          <SelectValue  placeholder="اختر الوظيفة" />
        </SelectTrigger>
        <SelectContent>
          {jobOptions.map((job) => (
            <SelectItem key={job} value={job}>{job}</SelectItem>
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
          <Label>شهادة الوفاة (صورة)</Label>
          <Input 
            type="file" 
            accept="image/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onFileChange(file);
            }}
            disabled={disabled}
          />
          {fileValue && (
            <p className="text-sm text-gray-600">الملف المحدد: {fileValue.name}</p>
          )}
        </div>
      )}
    </div>
  );
}
