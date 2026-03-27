import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function SpecialForm({ data, onChange, errors = {} }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          اسم التخصص
        </Label>
        <Input
          id="name"
          value={data.name}
          name="name"
          type="text"
          onChange={(e) => onChange("name", e.target.value)}
          className="col-span-3"
          required
        />
        {!data?._id && ( 
          <span className="inline text-red-700">*</span>
        )}
      </div>
      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

      <div className="flex space-y-2  ">
        <Label htmlFor="name" className="text-right mt-3">
          تخصص
        </Label>
        <Label htmlFor="stdGender" title={"التخصص "} className="mt-2" />
        <RadioGroup
          className="flex ms-8"
          dir="rtl"
          value={String(data.is_active)}
          onValueChange={(value) => onChange("is_active", value === "true")}
        >
          <div className="flex items-center justify-center space-x-2 me-2 mx-6">
            <Label htmlFor="option-one" className="mt-2">
              نشط
            </Label>
            <RadioGroupItem value="true" id="option-one" />
          </div>
          <div className="flex items-center justify-center space-x-2 mx-6">
            <Label htmlFor="option-two" className="mt-2">
              غير نشط
            </Label>
            <RadioGroupItem value="false" id="option-two" />
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
