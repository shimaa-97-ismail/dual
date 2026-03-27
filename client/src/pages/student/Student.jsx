import React, { useState } from "react";
import { StudentTable, DropDown } from "../../components";
import { Button } from "@/components/ui/button";
import { axioInstance } from "../../api/config";
import { toast } from "react-toastify";
import { StudentModel } from "../../components/model/StudentModel";
import { useNavigate } from "react-router-dom";
export function Student() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const handleAddStudent = async (newStudent) => {
    setLoading(true);
    try {
      const response = await axioInstance.post("student", { newStudent });

      if (response.status === 200) {
        setStudents((prev) => [...prev, newStudent]);

        toast.success("تم اضافه المدرسة بنجاح");
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add student:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="m-6 flex justify-between">
        <div>{/* <DropDown label="المدارس" /> */}</div>
        {/* <Button onClick={() => navigate(`/student/add`)}>اضافه طالب جديد</Button> */}
      </div>

      <StudentTable />

      <StudentModel
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        mode="add"
        onSubmit={handleAddStudent}
        isLoading={loading}
      />
    </>
  );
}
