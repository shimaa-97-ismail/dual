import React from 'react'
import { LabelForm } from "@/components/label/Label";
import { Input } from "@/components/ui/input";
export function SearchStudentForm({data,onChange}) {
  return (
     <div className="grid gap-4">
          <div className="grid grid-cols-5 items-center gap-4 text-black">
            <LabelForm
              htmlFor="studentName"
              title={"اسم الطالب او رقم القومى"}
              className="text-right"
            />
            <Input
              id="studentName"
              name="studentName"
              type="text"
              value={data.studentName}
              onChange={(e) => onChange("studentName",e.target.value)}
              className="col-span-3"
              required
            />
            <span className="inline text-red-700">*</span>
          </div>          
        </div>
  )
}
