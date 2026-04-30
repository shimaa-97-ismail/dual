import React, { useEffect, useState } from "react";
import { useTrainningPlaces } from "../../hooks/useTrainngPlace";
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
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  MapPin,
  Phone,
  User,
  Building,
  Search,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
export const TrainningPlacesList = () => {
  const navigate = useNavigate();
  // Pagination & search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: trainningPlaces,
    pagination,
    isLoading,
    addTrainningPlace,
    editTrainningPlace,
    removeTrainningPlace,
    refetch,
  } = useTrainningPlaces({
    page,
    limit,
    search: debouncedSearch,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const handleEdit = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsModalOpen(false);
    try {
      if (!selectedPlace) {
        await addTrainningPlace(data);
        toast.success("تم إضافة المنشأة بنجاح");
      } else {
        await editTrainningPlace(selectedPlace._id, data);
        toast.success("تم تعديل المنشأة بنجاح");
      }
      // Refetch after mutation (query invalidation inside hook does this)
      refetch();
    } catch (error) {
      toast.error(selectedPlace ? "فشل في التعديل" : "فشل في الإضافة");
      console.error(error);
    }
  };

  const handleDeleteClick = (place) => {
    setSelectedPlace(place);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await removeTrainningPlace(selectedPlace?._id);
      toast.success("تم حذف مكان التدريب بنجاح");
      setDeleteModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("فشل في حذف مكان التدريب");
      console.error(error);
    }
  };

  // Pagination helpers
  const totalPages = pagination?.totalPages || 0;
  const currentPage = pagination?.page || page;
  const totalItems = pagination?.total || 0;

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            المنشأت التدريبيه
          </h1>
          <p className="text-gray-600 mt-2">
            جميع المنشأت التدريبيه في محافظة قنا تحت نظام التعليم الفنى المزدوج
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            إضافة منشأه تدريبيه جديد
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="بحث باسم المنشأة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600">
              جاري تحميل المنشأت التدريبيه...
            </p>
          </div>
        </div>
      ) : (
        <>
          {trainningPlaces.length === 0 ? (
            <EmptyState
              title="لا توجد منشأت تدريبيه"
              description={
                debouncedSearch
                  ? `لا توجد نتائج لـ "${debouncedSearch}"`
                  : "لم يتم إضافة أي منشأت تدريبيه بعد. ابدأ بإضافة أول منشأه تدريبيه."
              }
              actionText="إضافة منشأه تدريبيه"
              onAction={handleAddNew}
            />
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainningPlaces.map((place) => (
                  <Card
                    key={place._id}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle
                            className="text-xl cursor-pointer"
                            onClick={() =>
                              navigate(`/trainning-place/${place._id}/details`)
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
                                عرض السجل التجاري
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
                                عرض الملف الضريبي
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
                              href={`tel:${place.phone}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {place.phone}
                            </a>
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
                              <p className="text-gray-600">
                                {place.supervisorName.username}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-5">
                            <Phone className="h-5 w-4 text-gray-400" />
                            <a
                              href={`tel:${place.supervisorName.phone}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {place.supervisorName.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Owner */}
                      {place.owner && (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  المالك
                                </p>
                                <p className="text-gray-600">
                                  {place.owner}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ms-6 mt-5">
                              <Phone className="h-5 w-4 text-gray-400" />
                              <a
                                href={`tel:${place.ownerPhone}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                {place.ownerPhone}
                              </a>
                            </div>
                          </div>
                          {place.idCard && (
                            <div className="flex items-center gap-3">
                              <a
                                target="_blank"
                                href={place.idCard}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                البطاقة الشخصية للمالك
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-end border-t pt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600! hover:bg-green-50"
                          onClick={() => handleEdit(place)}
                        >
                          <Pencil className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600! hover:bg-red-50"
                          onClick={() => handleDeleteClick(place)}
                        >
                          <Trash2 className="h-4 w-4 ml-1" />
                          حذف
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">عدد العناصر:</label>
                    <select
                      value={limit}
                      onChange={(e) => changeLimit(Number(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-black!"
                    >
                      السابق
                    </button>
                    <span className="mx-2">
                      صفحة {currentPage} من {totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-black!"
                    >
                      التالي
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    إجمالي: {totalItems} منشأة
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modals */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد حذف مكان التدريب"
        description={`هل أنت متأكد من حذف مكان التدريب "${selectedPlace?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
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
        title={
          selectedPlace ? "تعديل المنشأه التدريبيه" : "إضافة منشأه تدريبيه جديد"
        }
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
