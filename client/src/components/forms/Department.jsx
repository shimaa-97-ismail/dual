import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function Department({ data, onChange, errors = {} }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 items-center gap-4 text-black">
        <Label htmlFor="name" className="text-right">
          اسم الإدارة
        </Label>
        <div className="col-span-3 flex flex-col">
          <input
            id="name"
            name="name"
            type="text"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className="border rounded p-2"
            required
          />
          {errors.name && (
            <span className="text-red-600 text-sm mt-1">{errors.name}</span>
          )}
        </div>
        {!data?._id && <span className="text-red-700">*</span>}
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="mangerName" className="text-right">
          اسم المدير
        </Label>
        <div className="col-span-3 flex flex-col">
          <Input
            id="mangerName"
            value={data.mangerName}
            name="mangerName"
            type="text"
            onChange={(e) => onChange("mangerName", e.target.value)}
            className="col-span-3"
          />
          {errors.mangerName && (
            <span className="text-red-600 text-sm mt-1">
              {errors.mangerName}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="mangerPhone" className="text-right">
          هاتف المدير
        </Label>
         <div className="col-span-3 flex flex-col">
 <Input
          id="mangerPhone"
          type="text"
          name="mangerPhone"
          value={data.mangerPhone}
          onChange={(e) => onChange("mangerPhone", e.target.value)}
          className="col-span-3"
        />
        {errors.mangerPhone && (
          <span className="text-red-600 text-sm mt-1">
            {errors.mangerPhone}
          </span>
        )}
         </div>
       
      </div>
    </div>
  );
}
