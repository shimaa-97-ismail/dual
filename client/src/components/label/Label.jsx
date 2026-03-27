import React from 'react'
import { Label } from "@/components/ui/label";
export  function LabelForm({title,forHtml,required=false}) {
  return (
    <Label htmlFor={forHtml} >
        {title} 
        {required && <span className="text-red-700 text-lg">*</span>}
        </Label>
  )
}
