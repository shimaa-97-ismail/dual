import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpecials, useCreateSpecial } from "@/hooks/useSpecial";

import EmptyState from "@/components/common/EmptyState";
import { MainHeader } from "@/components";
import { SpecialCard } from "@/components/card/SpecialCard";
import { Special } from "@/components/model/Special";
import { toast } from "react-hot-toast";
export function Specials() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  const { data: specials, isLoading } = useSpecials();
  const addMutation = useCreateSpecial();
  const handleAddSpecial = async (formData) => {
    try {
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("تم إضافة التخصص بنجاح");
          setShowAddModal(false);
        },
      });
    } catch (error) {
      toast.error("فشل في إضافة التخصص");
      console.error("Error adding school:", error);
    }
  };
  const handleSpecialClick = async (id, specialName) => {
    navigate("/special/schools", {
      state: { id, name: specialName },
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <>
      <MainHeader
        btnTitle="إضافة تخصص"
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setShowAddModal}
        title="التخصصات"
        description="جميع التخصصات في محافظة قنا تحت نظام التعليم الفنى المزدوج"
      />

      {specials?.length === 0 ? (
        <EmptyState
          title="لا بوجد تخصص"
          description="ابدأ بإضافة تخصص جديدة"
          actionText="إضافة تخصص"
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
            {specials &&
              specials.map((special) => (
                <SpecialCard
                  key={special._id}
                  data={special}
                  onSpecialClick={handleSpecialClick}
                />
              ))}
          </div>
        </>
      )}

      <Special
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        initialData={null}
        onSubmit={handleAddSpecial}
        isLoading={addMutation.isLoading}
      />
    </>
  );
}
