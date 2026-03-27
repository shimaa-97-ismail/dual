import React, { useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import {  useLocation } from "react-router-dom";
import { SchoolCard, MainHeader } from "../../components";
import { SchoolModel } from "../../components/model/School-model";
import { useCreateSchool } from "../../hooks/useSchools";
import { toast } from "react-hot-toast";
export function SchoolByData() {
  const location = useLocation();
  const { id, name, schools } = location.state || {};
  console.log(schools);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const addMutation = useCreateSchool();

  const handleAddSchool = async (formData) => {
    try {
      // await dispatch(addSchool(formData)).unwrap();
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("تم إضافة المدرسة بنجاح");
          setShowAddModal(false);
        },
      });
    } catch (error) {
      toast.error("فشل في إضافة المدرسة");
      console.error("Error adding school:", error);
    }
  };
  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        <MainHeader
          btnTitle="إضافة مدرسة"
          setViewMode={setViewMode}
          viewMode={viewMode}
          setShowAddModal={setShowAddModal}
          title={`تخصص ${name}`}
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
                  <SchoolCard
                    key={school._id}
                    data={school}
                    //   onSpecialClick={handleSpecialClick}
                  />
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
