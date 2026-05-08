import React, { useState } from "react";
import { useDepartments, useAddDepartment } from '../../hooks/useDepartments';
import EmptyState from "../../components/common/EmptyState";
import { DepatmentCard } from "../../components/card/DepatmentCard";
import { DepartmentModel } from "../../components/model/DepartmentModel";
import { MainHeader } from "../../components";

export const Department = () => {
  const [filters] = useState({}); // future: search, pagination, etc.
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [errors, setErrors] = useState({});

  // Fetch departments
  const {
    data: departments,
    isLoading,
    error,
    refetch,
  } = useDepartments(filters);

  // Add mutation
  const addMutation = useAddDepartment();

  const handleAdd = (data) => {
      addMutation.mutate(data, {
      onSuccess: () => {
        // Invalidation is already done inside useAddDepartment (departmentKeys.all)
        // But we also want to close modal and clear errors
        setShowAddModal(false);
        setErrors({});
      },
      onError: (err) => {
        setErrors((prev) => ({ ...prev, form: err.message }));
      },
    });
  };

  if (isLoading) return <div className="loading">جاري تحميل الإدارات...</div>;

  return (
    <>
      <div className="departments-page">
        <MainHeader
          btnTitle="إضافة إدارة"
          setViewMode={setViewMode}
          viewMode={viewMode}
          setShowAddModal={setShowAddModal}
          title="الإدارات التعليميه"
          description="جميع الادارات في محافظة قنا تحت نظام التعليم الفنى المزدوج"
        />

        {error && (
          <div className="error-message">
            {error.message}
            <button onClick={() => refetch()}>إعادة المحاولة</button>
          </div>
        )}

        {departments?.length === 0 ? (
          <EmptyState
            title="لا توجد ادارات"
            description="ابدأ بإضافة ادارة جديدة"
            actionText="إضافة ادارة"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3"
                : "space-y-4 px-3"
            }
          >
            {departments?.map((dept) => (
              <DepatmentCard key={dept._id} data={dept} />
            ))}
          </div>
        )}
      </div>

      <DepartmentModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        initialData={null}
        onSubmit={handleAdd}
        isLoading={addMutation.isLoading}
        errors={errors}
      />

      {/* Optional: display global mutation error */}
      {errors.form && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {errors.form}
        </div>
      )}
    </>
  );
};