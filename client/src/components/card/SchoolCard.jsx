import React, { useState, memo } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  SquarePen,
  Trash2,
  Loader2,
  MapPin,
  Users,
  BookOpen,
  BookType,
  Phone,
  CircleUser,
  Cast,
} from "lucide-react";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateSchool,
  useDeleteSchool,
  schoolKeys,
} from "../../hooks/useSchools";
import { SchoolModel } from "../model/School-model";
import ConfirmationModal from "../common/ConfirmationModel";
import { toast } from "react-hot-toast";
// import { updateSchool } from "./../../store/slices/schools";

export const SchoolCard = memo(({ data }) => {
  console.log(data);

  const { departmentId } = useParams();
  console.log(departmentId);

  const queryClient = useQueryClient();
  const updateMutation = useUpdateSchool();
  const deleteMutation = useDeleteSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // معالجة التعديل
  const handleUpdate = (updateData) => {
    console.log(updateData);

    updateMutation.mutate(
      { id: data._id, updateData, departmentId },
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات المدرسه بنجاح");
          queryClient.invalidateQueries({ queryKey: schoolKeys.all });
        },
      },
    );
    setModalOpen(false);
  };

  const handleDelete = async () => {
    console.log(data._id);

    (deleteMutation.mutate(data._id),
      {
        onSuccess: () => {
          toast.success("تم حذف المدرسه بنجاح");
          queryClient.invalidateQueries({ queryKey: schoolKeys.all });
          setDeleteModalOpen(false);
        },
      });
  };

  return (
    <>
      <div className="w-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <Card className="h-full flex flex-col border-2 hover:border-primary/20">
          <CardHeader
            className="flex-grow-0 space-y-3 cursor-pointer"
            onClick={() =>
              (window.location.href = `/department/${data?.departement?._id}/school/${data?._id}`)
            }
          >
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-gray-800">
                {data?.name}
              </CardTitle>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800`}
              >
                حكومية
              </span>
            </div>

            <CardDescription className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    ادارة: {data?.departement?.name || "غير محدد"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">
                    {data?.special?.length || 0} اقسام
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookType className="w-4 h-4" />
                <span className="text-sm">
                  {data?.type?.name || "لا يوجد نوع"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CircleUser className="w-4 h-4" />

                <span className="text-sm">
                  المدير: {data?.managerName || "غير محدد"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">
                  الهاتف: {data?.phone || "غير محدد"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {data?.address || "لا يوجد عنوان"}
                </span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <Cast className="w-5 h-5" />
                معلومات الاتصال
              </h3>
              <div className="space-y-1 text-base text-gray-600">
                <p>شئون الطلابه: {data?.studentAffairs || "غير محدد"}</p>
                <p>
                  هاتف شئون الطلابه: {data?.studentAffairsPhone || "غير محدد"}
                </p>
                <p>البريد الالكترونى: {data?.email || "غير محدد"}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <LiaLayerGroupSolid className="w-5 h-5" />
                الدفعات المتاحة
              </h3>

              <div className="space-y-1 text-base text-gray-600">
                {data?.intakes && data.intakes.length > 0 ? (
                  data.intakes.map((intake, index) => (
                    <p key={index}>{intake}</p>
                  ))
                ) : (
                  <p>لا توجد دفعات متاحة</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                الأقسام المتاحة
              </h3>
              <div className="flex flex-wrap gap-2">
                {data?.special?.length > 0 ? (
                  data?.special.map((item) => (
                    <Button
                      key={item._id}
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary  transition-colors text-black! hover:text-[#ffff]! "
                      style={{
                        border: "1px solid rgba(52, 94, 166, 0.3)",
                      }}
                      // onClick={() =>
                      //   onSpecialClick(
                      //     item._id,
                      //     item.name,
                      //     data._id,
                      //     data.name
                      //   )
                      // }
                    >
                      {item.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm py-2">
                    لا توجد أقسام متاحة
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-2"></div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border! border-green-500 text-green-600! hover:bg-green-50 cursor-pointer"
                onClick={() => setModalOpen(true)}
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SquarePen className="w-4 h-4" />
                )}
                <span className="mr-1">
                  {updateMutation.isLoading ? "جاري التحديث..." : "تعديل"}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600! hover:bg-red-50 cursor-pointer"
                onClick={() => setDeleteModalOpen(true)}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="mr-1">
                  {deleteMutation.isLoading ? "جاري الحذف..." : "حذف"}
                </span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* مودال التعديل */}
      <SchoolModel
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        initialData={data}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isLoading}
      />

      {/* مودال تأكيد الحذف */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد حذف المدرسة"
        description={`هل أنت متأكد من حذف المدرسة "${data?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={deleteMutation.isLoading}
      />
    </>
    //   );
    // }
  );
});
