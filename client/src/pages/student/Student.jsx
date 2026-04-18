import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StudentForm } from "@/components/forms/StudentForm";
import { useCreateStudent, useUpdateStudent, useStudentById } from "@/hooks/useStudent";

// Helper to normalize backend data to form structure
const normalizeStudentData = (data) => ({
  stdName: data.stdName || "",
  studID: data.studID || "",
  stdBOD: data.stdBOD ? data.stdBOD.split("T")[0] : "",
  stdGender: data.stdGender || "",
  studentImage:data.studentImage||"",
  phones: data.phones || [{ number: "", type: "primary" }, { number: "", type: "alternate" }],
  stdAddress: data.stdAddress || "",
  fatherName: data.fatherName || "",
  fatherID: data.fatherID || "",
  fatherPhone: data.fatherPhone || "",
  fatherJobTitle: data.fatherJobTitle || "",
  fatherJobDetails: data.fatherJobDetails || "",
  motherName: data.motherName || "",
  motherID: data.motherID || "",
  motherPhone: data.motherPhone || "",
  motherJobTitle: data.motherJobTitle || "",
  motherJobDetails: data.motherJobDetails || "",
  email: data.email || "",
  password: data.password || "",
  preparatorySchoolTotalScore: data.preparatorySchoolTotalScore || "",
  code: data.code || "",
  school: data.school?._id || data.school || "",
  studStatus: data.studStatus || "",
  current_stage: data.current_stage || { stage_name: "" },
  stdSpecial: data.stdSpecial?._id || data.stdSpecial || "",
  stdTrainningPlace: data.stdTrainningPlace?._id || data.stdTrainningPlace || "",
  intake: data.intake || "",
  graduationYear: data.graduationYear || "",
  current_class: data.current_class || "",
  is_active: data.is_active ?? true,
});

export function Student() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!studentId;

  const { data: studentData, isLoading: isLoadingStudent } = useStudentById(studentId, {
    enabled: isEditMode,
  });

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  const [formData, setFormData] = useState(() => ({
    stdName: "",
    studID: "",
    stdBOD: "",
    stdGender: "",
    studentImage:"",
    phones: [{ number: "", type: "primary" }, { number: "", type: "alternate" }],
    stdAddress: "",
    fatherName: "",
    fatherID: "",
    fatherPhone: "",
    fatherJobTitle: "",
    fatherJobDetails: "",
    motherName: "",
    motherID: "",
    motherPhone: "",
    motherJobTitle: "",
    motherJobDetails: "",
    email: "",
    password: "",
    preparatorySchoolTotalScore: "",
    code: "",
    school: "",
    studStatus: "",
    current_stage: { stage_name: "" },
    stdSpecial: "",
    stdTrainningPlace: "",
    intake: "",
    graduationYear: "",
    current_class: "",
    is_active: true,
  }));

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditMode && studentData) {
      setFormData(normalizeStudentData(studentData));
    }
  }, [isEditMode, studentData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {

    if (isEditMode) {
      updateMutation.mutate(
        { studentId, data: formData },
        {
          onSuccess: () => {
            toast.success("تم تحديث الطالب بنجاح");
            navigate(-1);
          },
          onError: (error) => {
            toast.error("فشل في تحديث الطالب: " + error.message);
          },
        }
      );
    } else {
      console.log(formData.studID);
      createMutation.mutate(formData, {
        
        onSuccess: () => {
          toast.success("تم إضافة الطالب بنجاح");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("فشل في إضافة الطالب: " + error.message);
        },
      });
    }
  };

  if (isEditMode && isLoadingStudent) {
    return <div className="text-center p-8">جاري تحميل بيانات الطالب...</div>;
  }

  return (
    <>
      <div className="m-6 flex justify-center">
        <h2 className="text-3xl font-bold underline">
          {isEditMode ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
        </h2>
      </div>

      <StudentForm
        value={formData}               // always use formData, not studentData
        onChange={handleChange}
        mode={isEditMode ? "edit" : "add"}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </>
  );
}