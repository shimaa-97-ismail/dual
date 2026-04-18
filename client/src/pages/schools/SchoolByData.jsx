import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import EmptyState from "../../components/common/EmptyState";
import { SchoolCard, MainHeader } from "../../components";
import { SchoolModel } from "../../components/model/School-model";
import {
  useCreateSchool,
  useSchoolsBySpecial,
  useGetSchoolByType,
} from "../../hooks/useSchools";
// import {useGetSchoolByType} from "../../hooks/useTypeOfSchool";
export function SchoolByData() {
  const location = useLocation();
  const { id, name } = location.state || {};
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const isSpecialRoute = location.pathname.includes("/special/schools");

  const queryKey = isSpecialRoute
    ? ["schoolsBySpecial", id]
    : ["schoolsByType", id];
  const fetchSchools = isSpecialRoute
    ? useSchoolsBySpecial
    : useGetSchoolByType;
  const addMutation = useCreateSchool();

  const { data: schools, isLoading, error } = fetchSchools(id);
  console.log(schools);

  const handleAddSchool = async (formData) => {
    addMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("تم إضافة المدرسة بنجاح");
        setShowAddModal(false);
        queryClient.invalidateQueries(queryKey);
      },
      onError: (err) => {
        toast.error("فشل في إضافة المدرسة");
        console.error("Error adding school:", err);
      },
    });
  };
  if (isLoading) {
    return <div className="p-4">جاري التحميل...</div>;
  }

  // Error state
  if (error) {
    return <div className="p-4 text-red-500">حدث خطأ: {error.message}</div>;
  }
  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        <MainHeader
          btnTitle="إضافة مدرسة"
          setViewMode={setViewMode}
          viewMode={viewMode}
          setShowAddModal={setShowAddModal}
          title={`تخصص ${name || ""}`}
          description={`جميع المدارس تحت تخصص  ${name}   في محافظة قنا تحت نظام التعليم الفنى المزدوج`}
        />
        {schools?.length === 0 ? (
          <EmptyState
            title="لا توجد مدارس"
            description="ابدأ بإضافة مدرسة جديدة"
            actionText="إضافة مدرسة"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {schools &&
                schools.map((school) => (
                  <SchoolCard key={school._id} data={school} />
                ))}
            </div>
          </>
        )}
      </div>

      <SchoolModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        onSubmit={handleAddSchool}
        isLoading={addMutation.isLoading}
        initialData={null}
      />
    </>
  );
}
