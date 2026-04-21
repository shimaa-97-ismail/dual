import React, { useState, useEffect } from "react";
import { BaseModel } from "./BaseModel";
import { LabelForm } from "@/components/label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useChangeStatusOfStudents } from "../../hooks/useStudent";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { studentKeys } from "@/hooks/useStudent";

export function ChangeStatusOfStudentModel({
  open,
  onOpenChange,
  selectedStudentIds,
  currentStage ,          
  currentAcademicYear
}) {
  const mutation = useChangeStatusOfStudents();
const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    studStatus: "",
    stage_name: "",
    current_class: "",
  });

  // Reset form when modal opens (optional)
  useEffect(() => {
    if (open) {
      setFormData({
        studStatus: "",
        stage_name: "",
        current_class: "",
      });
    }
  }, [open]);
  useEffect(() => {
    if (formData.studStatus === "متخرج") {
      setFormData((prev) => ({
        ...prev,
        stage_name: "",
        current_class: "",
      }));
      console.log("asd asd");
      
    }
  }, [formData.studStatus]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

// Helper to get next stage
const getNextStage = (currentStage) => {
  const stageOrder = ["الصف الأول", "الصف الثاني", "الصف الثالث"];
  const idx = stageOrder.indexOf(currentStage);
  return idx !== -1 && idx + 1 < stageOrder.length ? stageOrder[idx + 1] : null;
};

// Helper to get next academic year (e.g., "2024/2025" -> "2025/2026")
const getNextAcademicYear = (currentAcademicYear) => {
  const [start, end] = currentAcademicYear.split("/");
  return `${parseInt(start) + 1}/${parseInt(end) + 1}`;
};

const handleSubmit = () => {
  if (selectedStudentIds.length === 0) {
    toast.error("لم يتم اختيار أي طالب");
    return;
  }

  const updates = {};

  // 1. Status
  if (formData.studStatus) updates.studStatus = formData.studStatus;

  // 2. Handle promotion and repeat separately
  if (formData.studStatus === "ناجح منقول") {
    const nextStage = getNextStage(currentStage);
    if (!nextStage) {
      toast.error("لا يمكن ترقية الطالب من الصف الثالث");
      return;
    }
    updates.stage_name = nextStage;                 // send NEW stage
    updates.academicYear = getNextAcademicYear(currentAcademicYear); // next year
    updates.current_class = formData.current_class;                    // reset class for new stage
  } 
  else if (formData.studStatus === "باقى لأعاده (راسب)") {
    updates.stage_name = currentStage;              // same stage
    updates.academicYear = currentAcademicYear;     // same year
    updates.current_class = formData.current_class;                    // reset class for new stage
 
  }
  else {
    // Normal update (status change only, or user‑selected stage/class)
    if (formData.studStatus !== "متخرج") {
      if (formData.stage_name) updates.stage_name = formData.stage_name;
      if (formData.current_class) updates.current_class = formData.current_class;
    }
  }

  if (Object.keys(updates).length === 0) {
    toast.error("يرجى اختيار بيانات للتحديث");
    return;
  }

  console.log("Sending updates:", updates);
  console.log("🔵 updates object:", JSON.stringify(updates, null, 2));
  mutation.mutate(
    { studentIds: selectedStudentIds, updates },
    {
      onSuccess: () => {
        toast.success("تم تحديث حالات الطلاب بنجاح");
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: studentKeys.all });
          setTimeout(() => {
        window.location.reload();
      }, 500);
      },
      onError: (error) => {
        toast.error("فشل التحديث: " + error.message);
      },
    }
  );
};
  const studentStatus = ["مستجد", "محول", "باقى لأعاده (راسب)", "ناجح منقول","متخرج"];
  const isGraduated = formData.studStatus === "متخرج";

  return (
    <BaseModel
      open={open}
      onOpenChange={onOpenChange}
      title="تغير حاله الطالب"
      description="تغير حاله الطالب من خلال اختيار الحاله الجديده للطالب مع تغير الفصل"
      onSubmit={handleSubmit}
      isLoading={mutation.isLoading}
      submitLabel="تغير الحاله"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center ">
          <div className="m-3 mt-6">
          <LabelForm htmlFor="studStatus" title="حاله الطالب" required={true} />
          </div>
          <Select
          className=""
            value={formData.studStatus}
            onValueChange={(value) => handleChange("studStatus", value)}
          >
            <SelectTrigger className="w-[100px] text-black!">
              <SelectValue placeholder="اختر الحاله" />
            </SelectTrigger>
            <SelectContent>
              {studentStatus.map((stat) => (
                <SelectItem key={stat} value={stat}>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!isGraduated && (
          <div className="flex items-center">
            <div className="m-3 mt-6">
              <LabelForm htmlFor="stage_name" title="المرحله الدراسيه" required={true} />
            </div>
            <Select
              value={formData.stage_name}
              onValueChange={(value) => handleChange("stage_name", value)}
            >
              <SelectTrigger className="w-[150px] text-black!">
                <SelectValue placeholder="اختر المرحله" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الصف الأول">الصف الأول</SelectItem>
                <SelectItem value="الصف الثاني">الصف الثاني</SelectItem>
                <SelectItem value="الصف الثالث">الصف الثالث</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
{!isGraduated && (
          <div className="flex items-center">
            <div className="m-3 mt-3">
              <LabelForm htmlFor="current_class" title="الفصل" required={true} />
            </div>
            <Input
              id="current_class"
              type="text"
              className="w-[100px] text-black!"
              value={formData.current_class}
              onChange={(e) => handleChange("current_class", e.target.value)}
              placeholder="1/2"
            />
          </div>
        )}
        {/* <div className="flex items-center ">
          <div className="m-3 mt-6">
          <LabelForm htmlFor="stage_name" title="المرحله الدراسيه" required={true} />

          </div>
          <Select
            value={formData.stage_name}
            onValueChange={(value) => handleChange("stage_name", value)}
          >
            <SelectTrigger className="w-[150px] text-black!">
              <SelectValue placeholder="اختر المرحله" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الصف الأول">الصف الأول</SelectItem>
              <SelectItem value="الصف الثاني">الصف الثاني</SelectItem>
              <SelectItem value="الصف الثالث">الصف الثالث</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <div className="m-3 mt-3">
          <LabelForm htmlFor="current_class" title="الفصل" required={true} />

          </div>
          <Input
            id="current_class"
            type="text"
            className="w-[100px] text-black!"
            value={formData.current_class}
            onChange={(e) => handleChange("current_class", e.target.value)}
            placeholder="1/2"
            required
          />
        </div> */}
      </div>
    </BaseModel>
  );
}