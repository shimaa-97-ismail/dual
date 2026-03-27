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

export function ChangeStatusOfStudentModel({
  open,
  onOpenChange,
  selectedStudentIds,
}) {
  const mutation = useChangeStatusOfStudents();

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (selectedStudentIds.length === 0) {
      toast.error("لم يتم اختيار أي طالب");
      return;
    }

    // Prepare updates object
    const updates = {};
    if (formData.studStatus) updates.studStatus = formData.studStatus;
    if (formData.stage_name) updates.stage_name = formData.stage_name;
    if (formData.current_class) updates.current_class = formData.current_class;

    if (Object.keys(updates).length === 0) {
      toast.error("يرجى اختيار بيانات للتحديث");
      return;
    }

    mutation.mutate(
      {
        studentIds: selectedStudentIds,
        updates,
      },
      {
        onSuccess: () => {
          toast.success("تم تحديث حالات الطلاب بنجاح");
          onOpenChange(false); // close modal
        },
        onError: (error) => {
          toast.error("فشل التحديث: " + error.message);
        },
      }
    );
  };

  const studentStatus = ["مستجد", "محول", "باقى(راسب)", "ناجح منقول"];

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

        <div className="flex items-center ">
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
        </div>
      </div>
    </BaseModel>
  );
}