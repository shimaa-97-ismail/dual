import React, { useState, memo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { BookOpen } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModel";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  departmentKeys,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../hooks/useDepartments";
import { DepartmentModel } from "../model/DepartmentModel";

export const DepatmentCard = memo(({ data }) => {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleUpdate = (updatedData) => {
    updateMutation.mutate(
      { id: data._id, data: updatedData }, // ensure the key is 'data' as in our Redux‑free hook
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات الإدارة بنجاح");
          // Invalidate all department queries (list + detail)
          queryClient.invalidateQueries({ queryKey: departmentKeys.all });
          setModalOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "فشل في تحديث الإدارة");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(data._id, {
      onSuccess: () => {
        toast.success("تم حذف الإدارة بنجاح");
        queryClient.invalidateQueries({ queryKey: departmentKeys.all });
        setDeleteModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "فشل في حذف الإدارة");
      },
    });
  };

  return (
    <>
      <div className="w-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <Card className="h-full flex flex-col border-2 hover:border-primary/20">
          <CardHeader
            className="flex-grow-0 space-y-3 cursor-pointer"
            onClick={() => {
              window.location.href = `/department/${data._id}/school`;
            }}
          >
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-gray-800">
                ادارة {data.name}
              </CardTitle>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                قنا
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                معلومات الاتصال
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>المدير: {data.mangerName || "غير محدد"}</p>
                <p>الهاتف: {data.mangerPhone || "غير محدد"}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                window.location.href = `/department/${data._id}/school`;
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{data.schoolCount || 0} مدارس</span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-2"></div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border! border-green-500 text-green-600! hover:bg-green-50"
                onClick={() => setModalOpen(true)}
              >
                تعديل
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600! hover:bg-red-50"
                onClick={() => setDeleteModalOpen(true)}
              >
                حذف
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <DepartmentModel
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        initialData={data}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isLoading}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد حذف الإدارة"
        description={`هل أنت متأكد من حذف الإدارة "${data.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
});