import React, { useState } from "react";
import { SchoolCard, MainHeader } from "../../components";
import { SchoolModel } from "../../components/model/School-model";
import { useCreateSchool, useSchools } from "../../hooks/useSchools";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { ErrorState } from "../../components";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { schoolKeys } from "@/hooks/useSchools";
export default function SchoolPage() {
 const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
 
  // معالجة إضافة مدرسة جديدة

  const { data, isLoading, isError } = useSchools();
  console.log(data);

  const addMutation = useCreateSchool();

  const handleAddSchool = async (formData) => {
    try {
      // await dispatch(addSchool(formData)).unwrap();
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("تم إضافة المدرسة بنجاح");
          setShowAddModal(false);
          queryClient.invalidateQueries({ queryKey: schoolKeys.all });
        },
      });
    } catch (error) {
      toast.error("فشل في إضافة المدرسة");
      console.error("Error adding school:", error);
    }
  };

  // معالجة النقر على قسم
  const handleSpecialClick = (specialId, specialName, schoolId, schoolName) => {
    console.log("Special clicked:", {
      specialId,
      specialName,
      schoolId,
      schoolName,
    });
    //  (speacialID, special, schoolID, schoolName) => {
    navigate(`/students/${schoolName}/${specialName}`, {
      state: { schoolID: schoolId, speacialID: specialId },
    });
    // يمكنك التوجيه إلى صفحة القسم
    // navigate(`/school/${schoolId}/special/${specialId}`);
  };

  

  // عرض حالة التحميل
  if (isLoading) {
    return <LoadingSpinner message="جارٍ تحميل المدارس..." />;
  }

  // عرض حالة الخطأ
  if (isError) {
    return (
      <ErrorState
        title="خطأ في جلب البيانات"
        message="حدث خطأ أثناء جلب بيانات المدارس."
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <MainHeader
        btnTitle="إضافة مدرسة"
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setShowAddModal}
        title="المدارس"
        description="جميع المدارس في محافظة قنا تحت نظام التعليم الفنى المزدوج"
      />


      {/* قائمة المدارس */}
      {data?.length === 0 ? (
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
            
            {data &&
              data.schoolsWithCount?.map(
                (school) => (
                  console.log(school),
                  (
                    <SchoolCard
                      key={school._id}
                      data={school}
                      onSpecialClick={handleSpecialClick}
                    />
                  )
                ),
              )}
          </div>

          {/* الترقيم */}
          {/* {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
              />
            </div>
          )}*/}
        </>
      )}

      {/* مودال إضافة مدرسة */}
      <SchoolModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        onSubmit={handleAddSchool}
        isLoading={addMutation.isLoading}
        initialData={null}
      />
    </div>
  );
}
