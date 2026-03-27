import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export function TypesOfSchoolForm({  
  data ,
  onChange,
  errors = {},
}) {

  return (
     <div className="grid gap-4">
              <div className="grid grid-cols-5 items-center gap-4">
               <Label htmlFor="name" className="text-right">
                 نوع المدرسه 
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
              {!data?._id && ( // Show only when adding (no _id exists)
                 <span className="inline text-red-700">*</span>
               )}
             </div>
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
             
              
           </div>
  )
}
