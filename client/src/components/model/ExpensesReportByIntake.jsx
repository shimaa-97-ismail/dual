// components/model/ExpensesReportByIntake.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog"; // or your modal library
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function ExpensesReportByIntake({ open, onOpenChange, onSubmit }) {
  const [intake, setIntake] = useState("");
  const handleSubmit = () => {
    // e.preventDefault();
    if (intake.trim()) {
      onSubmit({ intake });
      setIntake("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (value) => {
  if (value === true) {
    setIntake("");
  }
  onOpenChange(value);
};
  return (
    <Dialog open={open} onOpenChange={handleOpenChange} dir="rtl">
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle className="text-right">اختر الدفعة </DialogTitle>
          <DialogDescription className="text-right">
            أدخل سنة الدفعة مثلاً:2025/2026
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="text"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            placeholder="مثال:2025/2026" 
            className="w-full"
            autoFocus
          />
        </div>
        <DialogFooter className="gap-2 text-right" dir="rtl">
           <Button onClick={handleSubmit} disabled={!intake.trim()}>
            تأكيد
          </Button>
          <Button className="bg-secondary" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
