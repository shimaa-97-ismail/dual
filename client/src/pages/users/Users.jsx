import React, { useState } from "react";
import { MainHeader } from "@/components";
import { UserModel } from "../../components";

export function Users() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  return (
    <div className="p-4 md:p-6 space-y-6">
      <MainHeader
        btnTitle="إضافة مستخدم"
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setShowAddModal}
        title="المستخدمين"
        description=""
      />

      

      <UserModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        // onSubmit={handleAddUser}
        // isLoading={addMutation.isLoading}
        initialData={null}
      />
    </div>
  );
}
