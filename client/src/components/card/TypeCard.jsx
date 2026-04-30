import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useDeleteTypeOfSchool,
  useUpdateTypeOfSchool,
} from "../../hooks/useTypeOfSchool";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import ConfirmationModal from "../common/ConfirmationModel";
import { TypesOfSchool } from "../model/TypesOfSchool";
export function TypeCard({ data,onClick }) {
  const updateMutation = useUpdateTypeOfSchool();
  const deleteMutation = useDeleteTypeOfSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleUpdate = (updateData) => {
    updateMutation.mutate(
      { id: data._id, updateData },
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات بنجاح");
          setModalOpen(false);
        },
        
      }
    );
    
  };

  const handleDelete = async () => {
    deleteMutation.mutate(data._id),
      {
        onSuccess: () => {
          toast.success("تم حذف بنجاح");
          // queryClient.invalidateQueries({ queryKey: departmentKeys.all });
          setDeleteModalOpen(false);
        },
      };
  };
  return (
    <>
      <div className="w-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <Card className="h-full flex flex-col border-2 hover:border-primary/20">
          <CardHeader
            className="flex-grow-0 space-y-3 cursor-pointer"
            onClick={()=>onClick(data._id,data.name)}
          >
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-gray-800">
                {data.name}
              </CardTitle>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800`}
              >
                قنا
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                عدد المدارس : {data.count}
              </h3>
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
                // disabled={isUpdating}
              >
                تعديل
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600! hover:bg-red-50"
                onClick={() => setDeleteModalOpen(true)}
                //   disabled={isDeleting}
              >
                حذف
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <TypesOfSchool
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
        title="تأكيد حذف "
        description={`هل أنت متأكد من حذف "${data.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        variant="destructive"
        // isLoading={isDeleting}
      />
    </>
  );
}
