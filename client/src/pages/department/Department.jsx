import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDepartments, useAddDepartment } from "../../hooks/useDepartments";
import {
  // setSelectedDepartment,
  // setFilters,
  // clearFilters,
  // setFormData,
  clearFormData,
} from "../../store/slices/department";
import { validateName,validatePhone } from "@/store/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { DepatmentCard } from "../../components/card/DepatmentCard";

import { DepartmentModel } from "../../components/model/DepartmentModel";
import { MainHeader } from "../../components";
export const Department = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.departments);

  // استخدام TanStack Query
  const {
    data: departments,
    isLoading,
    error,
    refetch,
  } = useDepartments(filters);
  const addMutation = useAddDepartment();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [errors, setErrors] = useState({});

  const handleAdd = (data) => {
    const nameValidation = validateName(data?.name, {
      required: true,
      minLength: 3,
      maxLength: 50,
    });
    
    if (!nameValidation.isValid) {
      setErrors((prev) => ({ ...prev, name: nameValidation.error }));
      return;
    }
    const managerNameValidation = validateName(data?.mangerName, {
      required: false,
      minLength: 3,
      maxLength: 50,
    });
    if (!managerNameValidation.isValid) {
      setErrors((prev) => ({ ...prev, mangerName: managerNameValidation.error }));
      return;
    }
    const phoneValidation = validatePhone(data?.mangerPhone, { required: false });
    if (!phoneValidation.isValid) {
      setErrors((prev) => ({ ...prev, mangerPhone: phoneValidation.error }));
      return;
    }
  
    addMutation.mutate(data, {
      onSuccess: () => {
        dispatch(clearFormData());
      },
    });
    setShowAddModal(false);
  };


  if (isLoading) {
    return <div className="loading">جاري تحميل الإدارات...</div>;
  }

  return (
    <>
      <div className="departments-page">
        <MainHeader
          btnTitle="إضافة إدارة"
          setViewMode={setViewMode}
          viewMode={viewMode}
          setShowAddModal={setShowAddModal}
          title="الادارات"
          description="جميع الادارات في محافظة قنا تحت نظام التعليم الفنى المزدوج"
        />

        {/* رسائل الخطأ */}
        {error && (
          <div className="error-message">
            {error.message}
            <button onClick={() => refetch()}>إعادة المحاولة</button>
          </div>
        )}
        {departments && departments?.length === 0 ? (
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
            {departments &&
              departments.map((dept) => (
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
    </>
  );
};
