import React,{useState} from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function DateForAbsence({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
  isLoading = false,
  disabled = false,
}) {
  
  const [startDate, setStartDate] = useState("");
  
  
 

 

   const handleCancel = () => {
   
    onOpenChange(false);
  };
  
  return (
    <>
     <Dialog open={open} onOpenChange={onOpenChange}  dir="rtl">
      <DialogContent className="sm:max-w-[525px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className="w-full text-right">{title}</DialogTitle>
          {description && <DialogDescription className="w-full text-right">{description}</DialogDescription>}
        </DialogHeader>

        {/* Form fields go here */}
        <div className="py-4"  >
            <Input
        id="stdBOD"
        name="stdBOD"
        type="date"
        value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
        placeholder="أدخل تاريخ الميلاد"
      />
        </div>

        <DialogFooter>
          <Button variant="outline" className=" bg-[#831e2e] hover:bg-[#a42338]" 
          onClick={handleCancel} 
          type="button">
            {cancelLabel}
          </Button>
          <Button
            onClick={()=>onSubmit(startDate)}
            disabled={disabled || isLoading}
            type="button"
          >
            {isLoading ? "جاري الحفظ..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      
    </>
  );
}
