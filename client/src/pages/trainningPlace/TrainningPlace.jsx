import React, { useEffect, useState } from "react";
import { useTrainningPlaces } from "../../hooks/useTrainningPlaces";
import { TrainningPlaceModel, TrainningPlaceForm } from "@/components";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { MainHeader } from "@/components";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  MapPin,
  Phone,
  User,
  Building,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
export const TrainningPlacesList = () => {
  const navigate = useNavigate();
  const {
    trainningPlaces,
    isLoading,
    getTrainningPlaces,
    removeTrainningPlace,
    // deleteSuccess,
    // deleteError,
    // resetStatus,
    addTrainningPlace,
    editTrainningPlace,
  } = useTrainningPlaces();
  const icons = {
    facebook: "📘",
    instagram: "📷",
    whatsapp: "💬",
    link: "🔗",
  };
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filterSupervisor, setFilterSupervisor] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // Fetch places on component mount
  useEffect(() => {
    getTrainningPlaces();
  }, [getTrainningPlaces]);

  //add new one
  const handleAddNew = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };
  //edit place
  const handleEdit = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };
  //submit form
  const handleSubmit = async (data) => {
    setIsModalOpen(false);
    // If selectedPlace is null, it's a new place
    if (!selectedPlace) {
      // Call add function from the hook
      await addTrainningPlace(data);
    } else {
      // Call edit function from the hook
      await editTrainningPlace(selectedPlace._id, data);
    }
    // Refresh the list after adding/editing
    getTrainningPlaces();
  };

  const handleDeleteClick = (place) => {
    setSelectedPlace(place);
    setDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    try {
      console.log(selectedPlace);

      await removeTrainningPlace(selectedPlace._id);
      toast.success("تم حذف مكان التدريب بنجاح");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("فشل في حذف مكان التدريب");
      console.error("Delete error:", error);
    }
  };

  // // Filter and search logic
  // const filteredPlaces = trainningPlaces.filter((place) => {
  //   const matchesSearch =
  //     place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     place.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     place.owner?.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesFilter =
  //     filterSupervisor === "all" ||
  //     (filterSupervisor === "with" && place.supervisorName) ||
  //     (filterSupervisor === "without" && !place.supervisorName);

  //   return matchesSearch && matchesFilter;
  // });

  // Extract unique supervisors for filtering
  // const supervisors = [
  //   ...new Set(
  //     trainningPlaces
  //       .filter((p) => p.supervisorName)
  //       .map((p) => p.supervisorName.name)
  //   ),
  // ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header with search and filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">أماكن التدريب</h1>
          <p className="text-gray-600 mt-2">
            جميع أماكن التدريب في محافظة قنا تحت نظام التعليم الفنى المزدوج
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            إضافة مكان تدريب جديد
          </Button>
        </div>
      </div>
      {/* <MainHeader
              title={" أماكن التدريب"}
              description={` جميع أماكن التدريب في محافظة قنا تحت نظام التعليم الفنى المزدوج `}
              // setViewMode={setViewMode}
              // viewMode={viewMode}
              // setShowAddModal={setModalOpen}
              btnTitle={"إضافة مكان تدريب جديد"}
            /> */}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600">جاري تحميل أماكن التدريب...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {trainningPlaces.length === 0 ? (
            <EmptyState
              title="لا توجد أماكن تدريب"
              description={ "لم يتم إضافة أي أماكن تدريب بعد. ابدأ بإضافة أول مكان تدريب."
              }
              actionText="إضافة مكان تدريب"
              onAction={handleAddNew}
            />
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainningPlaces.map(
                (place) => (
                  console.log(place),
                  (
                    <Card
                      key={place._id}
                      className="hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardHeader className="">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle
                              className="text-xl cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/trainning-place/${place._id}/details`,
                                )
                              }
                            >
                              {place.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {place.commercialRegister ? (
                                <a
                                  href={place.commercialRegister}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                  {icons.link} عرض السجل التجاري
                                </a>
                              ) : (
                                "بدون سجل تجاري"
                              )}
                              <br />
                              {place.taxFile ? (
                                <a
                                  href={place.taxFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                  {icons.file || icons.link} عرض الملف الضريبي
                                </a>
                              ) : (
                                "بدون ملف ضريبي"
                              )}
                            </CardDescription>
                          </div>
                          <div className="mt-3">
                            <a
                              href={place.socialMedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-primary hover:text-blue-800 transition"
                            >
                              {" "}
                              {place.socialMedia &&
                              (place.socialMedia.includes("facebook.com") ||
                                place.socialMedia.includes("fb.com")) ? (
                                <FaFacebook className="h-5 w-5" />
                              ) : place.socialMedia &&
                                (place.socialMedia.includes("instagram.com") ||
                                  place.socialMedia.includes("insta.com")) ? (
                                <FaInstagram className="h-5 w-5" />
                              ) : null}
                            </a>
                          </div>
                          {/* <Badge
                        variant={place.supervisorName ? "default" : "secondary"}
                      >
                        {place.supervisorName ? "مشرف" : "غير مكتمل"}
                      </Badge> */}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Address */}
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              العنوان
                            </p>
                            <p className="text-gray-600">
                              {place.address || "لم يتم تحديد العنوان"}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        {place.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                الهاتف
                              </p>
                              <a
                                href={`tel:${place.supervisorName.phone}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {place.phone}
                              </a>
                              {/* <p className="text-gray-600">{place.phone}</p> */}
                            </div>
                          </div>
                        )}

                        {/* Supervisor */}
                        {place.supervisorName && (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <User className="h-6 w-6 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  المشرف المسؤول
                                </p>
                                <div className="flex items-end gap-3">
                                  {/* <User className="h-5 w-5 text-gray-400" /> */}
                                  <div>
                                    <p className="text-gray-600">
                                      {place.supervisorName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className=" flex gap-2  mt-5">
                              <Phone className="h-5 w-4 text-gray-400" />
                              <a
                                href={`tel:${place.supervisorPhone}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {place.supervisorPhone}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Owner */}
                        {place.owner && (
                          <>
                            <div className="flex items-center justify-between  gap-3">
                              <div className="flex items-center gap-3">
                                <Building className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    المالك
                                  </p>
                                  <p className="text-gray-600">{place.owner}</p>
                                </div>
                              </div>
                              <div className=" flex gap-2 ms-6 mt-5">
                                <Phone className="h-5 w-4 text-gray-400" />
                                <a
                                  href={`tel:${place.ownerPhone}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  {place.ownerPhone}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {place.idCard && (
                                <a
                                target="_black"
                                  href={`${place.idCard}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  البطاقة الشخصية للمالك
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>

                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-sm text-gray-500">
                          آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className=" border-green-500 text-green-600! hover:bg-green-50"
                            onClick={() => {
                              handleEdit(place);
                            }}
                          >
                            <Pencil className="h-4 w-4 ml-1" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600! hover:bg-red-50"
                            onClick={() => handleDeleteClick(place)}
                            // onClick={() => setDeleteModalOpen(true)}
                          >
                            <Trash2 className="h-4 w-4 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                ),
              )}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {/* <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف مكان التدريب:
              <br />
              <span className="font-bold text-lg text-primary">
                {selectedPlace?.name}
              </span>
              <br />
              <span className="text-red-600 font-medium block mt-2">
                هذا الإجراء لا يمكن التراجع عنه.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، قم بالحذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد  حذف مكان التدريب"
        description={`هل أنت متأكد من  حذف مكان التدريب "${selectedPlace?.name}}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={confirmDelete}
        variant="destructive"
        
      />

      <TrainningPlaceModel
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlace(null);
        }}
        title={selectedPlace ? "تعديل مكان التدريب" : "إضافة مكان تدريب جديد"}
      >
        <TrainningPlaceForm
          onSubmit={handleSubmit}
          initialData={selectedPlace}
          loading={isLoading}
        />
      </TrainningPlaceModel>
    </div>
  );
};
