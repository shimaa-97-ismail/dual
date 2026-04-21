import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { StudentModel } from "../model/StudentModel";
import { ChangeStatusOfStudentModel } from "../model/ChangeStatusOfStudent";
import { useUpdateStudent,useDeleteStudent } from "@/hooks/useStudent"; // adjust import path
import "./table.css";
import { useNavigate } from "react-router-dom";

export function StudentTable({ data, showCheckbox }) {
  console.log(data);
  
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();
  const handleCheckboxChange = (studentId, checked) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  // Edit: open modal with selected student data
  const handleEdit = (studentData) => {
    setSelectedStudent(studentData);
     navigate(`/school/student/edit/${studentData._id}`);
            
    // setModalOpen(true);
  };

  // Submit update
  const handleUpdateSubmit = (formData) => {
    // Convert to FormData for file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'fatherDeathCert' || key === 'motherDeathCert') {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        }
      } else if (key === 'phones' || key === 'current_stage') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key] !== undefined ? formData[key] : '');
      }
    });

    updateMutation.mutate(
      { studentId: selectedStudent._id, data: formDataToSend },
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات الطالب بنجاح");
          setModalOpen(false);
         
        },
        onError: (error) => {
          toast.error("فشل في التحديث: " + error.message);
        },
      }
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          // toast.success('تم حذف الطالب بنجاح');
         setSelectedStudents(prev => prev.filter(sid => sid !== id));          
        }
      });
    }
  };

  return (
    <>
      <div className="w-full overflow-auto px-5 pt-5">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow>
              {showCheckbox && (
                <TableHead className="w-[50px] text-center"></TableHead>
              )}
              <TableHead className="w-[100px] text-center">اسم الطالب</TableHead>
              {/* <TableHead className="text-center">الرقم القومي</TableHead> */}
              {/* <TableHead className="text-center">رقم التليفون</TableHead>
              <TableHead className="text-center">العنوان</TableHead> */}
              <TableHead className="text-center">حاله الطالب</TableHead>
              <TableHead className="text-center">الصف</TableHead>
              <TableHead className="text-center">الدفعه</TableHead>
              <TableHead className="text-center">المنشأه التدريبيه</TableHead>
              <TableHead className="text-center"> اجمالى  المبلغ المسدد</TableHead>
              <TableHead className="text-center"> اجمالى الشهور المسدده</TableHead>
              <TableHead className="text-center hide-on-print">تعديل</TableHead>
              <TableHead className="text-center hide-on-print">حذف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.students?.map((stud) => (
              <TableRow key={stud._id}>
                {showCheckbox && (
                  <TableCell className="w-[50px] text-center">
                    <input
                      type="checkbox"
                      value={stud._id}
                      checked={selectedStudents.includes(stud._id)}
                      onChange={(e) => handleCheckboxChange(stud._id, e.target.checked)}
                      className="accent-primary"
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium text-center cursor-pointer" onClick={() => navigate(`/student/${stud._id}`)}>
                  {stud.stdName}
                </TableCell>
                {/* <TableCell className="font-medium text-center">{stud.studID}</TableCell>
                  <TableCell className="font-medium text-center">
                                    {stud.phones?.map((phone, index) => (
                                      <React.Fragment key={index}>
                                        {phone.number}
                                        {index < stud.phones.length - 1 && <br />}
                                      </React.Fragment>
                                    ))}
                                  </TableCell>
                <TableCell className="font-medium text-center">{stud.stdAddress}</TableCell> */}
                <TableCell className="font-medium text-center">{stud.studStatus}</TableCell>
                <TableCell className="font-medium text-center">{stud.current_stage?.stage_name}</TableCell>
                <TableCell className="font-medium text-center">{stud.intake}</TableCell>
                <TableCell className="font-medium text-center">{stud.stdTrainningPlace?.name}</TableCell>
                            <TableCell className="font-medium text-center">{stud.totalAmountPaid}</TableCell>
                <TableCell className="font-medium text-center">{stud.paymentsCount}</TableCell>
                <TableCell className="hide-on-print">
                  <div className="flex justify-center">
                    <button onClick={() => handleEdit(stud)}>
                      <SquarePen size={20} color="#b3ca24" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="hide-on-print">
                  <div className="flex justify-center">
                    <button onClick={() => handleDelete(stud._id)}>
                      <Trash2 size={20} color="#831e2e" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showCheckbox && (
          <div className="flex justify-end mt-4">
            <button
              className="bg-primary text-white px-6 rounded"
              onClick={() => setShowAddModal(true)}
            >
              تغير حاله الطلاب
            </button>
          </div>
        )}
      </div>

      <StudentModel
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        initialData={selectedStudent}
        onSubmit={handleUpdateSubmit}
        isLoading={updateMutation.isLoading}
      />

      <ChangeStatusOfStudentModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        selectedStudentIds={selectedStudents}
          currentStage={data?.stage}          
  currentAcademicYear={data?.intake} 
      />
    </>
  );
}