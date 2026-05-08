import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { SchoolCard } from "../../components";
import {
  useCreateSchool,
  useUpdateSchool,
  useSchoolsByDept,
  schoolKeys,
} from "../../hooks/useSchools";
import { SchoolModel } from "../../components/model/School-model";

export function DepartmentSchool() {
  const { departmentId } = useParams();
  const queryClient = useQueryClient();

  // Fetch schools using the API from your schools hook
  const {
    data: schools = [],
    isLoading: schoolsLoading,
    error: schoolsError,
    refetch,
  } = useSchoolsByDept(departmentId);


  const addMutation = useCreateSchool(departmentId);
  const updateMutation = useUpdateSchool();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setShowAddModal(true);
  };

  const handleSubmit = (data) => {
    if (selectedSchool) {
      // Update existing school
      updateMutation.mutate(
        { id: selectedSchool._id, data },
        {
          onSuccess: () => {
            toast.success("تم تحديث المدرسة بنجاح");
            queryClient.invalidateQueries({ queryKey: schoolKeys.byDept(departmentId) });
            setShowAddModal(false);
            setSelectedSchool(null);
          },
          onError: (err) => {
            toast.error(err.message || "فشل في تحديث المدرسة");
          },
        }
      );
    } else {
      // Add new school
      const dataToSend = { ...data, department: departmentId };
      addMutation.mutate(dataToSend, {
        onSuccess: () => {
          toast.success("تم إضافة المدرسة بنجاح");
          queryClient.invalidateQueries({ queryKey: schoolKeys.byDept(departmentId) });
          setShowAddModal(false);
        },
        onError: (err) => {
          toast.error(err.message || "فشل في إضافة المدرسة");
        },
      });
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedSchool(null);
  };

  if (schoolsLoading) {
    return <div className="p-6 text-center">جاري تحميل المدارس...</div>;
  }

  if (schoolsError) {
    return (
      <div className="p-6 text-center text-red-500">
        خطأ: {schoolsError.message}
        <button onClick={() => refetch()} className="mr-2 text-blue-500">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Optional: useDepartment to get the department name
  // const { data: department } = useDepartment(departmentId);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <Link to="/department" className="text-blue-600 hover:underline">
            ← رجوع إلى الإدارات
          </Link>
        </div>

        {schools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">لا توجد مدارس في هذه الإدارة بعد</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-[#2c4d8c]"
            >
              إضافة أول مدرسة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools?.data?.data.map((school) => (
              <SchoolCard key={school._id} data={school} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      <SchoolModel
        isOpen={showAddModal}
        onClose={handleCloseModal}
        mode={selectedSchool ? "edit" : "add"}
        onSubmit={handleSubmit}
        isLoading={addMutation.isLoading || updateMutation.isLoading}
        title={selectedSchool ? "تعديل مدرسة" : "إضافة مدرسة جديدة"}
        initialData={selectedSchool}
      />
    </>
  );
}