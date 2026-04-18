import React, { useState } from "react";
import {
  useTypeOfSchools,
  useCreateTypeOfSchool,
} from "../../hooks/useTypeOfSchool";
import EmptyState from "../../components/common/EmptyState";
import { TypesOfSchool } from "../../components/model/TypesOfSchool";
import { TypeCard } from "@/components/card/TypeCard";
import { MainHeader } from "@/components";
import { useNavigate } from "react-router-dom";
export function TypeOfSchool() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const addMutation = useCreateTypeOfSchool();
  const { data, loading, error } = useTypeOfSchools();

  if (loading) {
    return <div>جار التحميل...</div>;
  }
  if (error) {
    return <div>حدث خطأ: {error.message}</div>;
  }

  const handleAdd = (data) => {
    addMutation.mutate(data, {
      onSuccess: () => {},
    });
    setModalOpen(false);
  };
  const handleTypyClick = async (id, typeName) => {
    navigate("/type-of-school/schools", {
      state: { id, name: typeName }, // ✅ no 'schools' here
    });
  };

  return (
    <>
      <MainHeader
        title={" انواع المدارس"}
        description={` جميع انواع المدارس `}
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setModalOpen}
        btnTitle={"اضافه نوع مدرسه"}
      />

      {data?.length === 0 ? (
        <EmptyState
          title="لا بوجد نوع مدرسة"
          description="ابدأ بإضافة نوع مدرسة جديدة"
          actionText="إضافة نوع مدرسة"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3"
                : "space-y-4  px-3"
            }
          >
            {data &&
              data.map((typeOfSchool) => (
                <TypeCard
                  key={typeOfSchool._id}
                  data={typeOfSchool}
                  onClick={handleTypyClick}
                />
              ))}
          </div>
        </>
      )}
      <TypesOfSchool
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="add"
        initialData={data}
        onSubmit={handleAdd}
        isLoading={addMutation.isLoading}
      />
    </>
  );
}
