import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components";
import { UserModel } from "../../components";
import {
  useUsers,
  useDeleteUser,
  useCreateUser,
  useUpdateUser,
} from "@/hooks/useUser";
import { ErrorState } from "@/components";


export function Users() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { data: users, isLoading, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUser = useDeleteUser();
const roleMapping = {
  admin: 'مسؤول النظام',
  // supervisor: 'مسؤول بيانات',
  manager: 'مسؤول بيانات'
};
  const closeEditModal = () => setEditingUser(null);

  const handleAddUser = (data) => {
    createUser.mutate(data);
    setShowAddModal(false);
  };
  useEffect(() => {
    console.log("editingUser changed:", editingUser);
  }, [editingUser]);

  const handleUpdateUser = async (formData) => {
    console.log(formData);

    await updateUserMutation.mutateAsync({ id: editingUser._id, ...formData });
    closeEditModal();
    // refresh users list if needed
  };
  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      deleteUser.mutate(id);
    }
  };
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

      <div className="p-4">
        <table className="min-w-full bg-white  ">
          <thead className="p-6">
            <tr>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(
              (user) => (
                console.log("Rendering user:", user),
                (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{roleMapping[user.role] || user.role}</td>
                
                    <td>
                      <div className="flex">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="bg-accent text-white px-3 py-1 rounded ml-2"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-secondary text-white px-3 py-1 rounded"
                          disabled={deleteUser.isPending}
                        >
                          {deleteUser.isPending ? "جاري..." : "حذف"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ),
            )}
          </tbody>
        </table>
      </div>

      <UserModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        onSubmit={handleAddUser}
        // isLoading={addMutation.isLoading}
        initialData={null}
      />
      <UserModel
        open={!!editingUser}
        onOpenChange={closeEditModal}
        mode="edit"
        onSubmit={handleUpdateUser}
        initialData={editingUser}
      />
    </div>
  );
}
