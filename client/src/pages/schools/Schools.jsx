import React, { useState, useEffect } from "react";
import { SchoolCard, MainHeader } from "../../components";
import { SchoolModel } from "../../components/model/School-model";
import { useCreateSchool, useSchools } from "../../hooks/useSchools";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { ErrorState } from "../../components";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { schoolKeys } from "@/hooks/useSchools";

export default function SchoolPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search – wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to first page when search changes
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useSchools({
    page,
    limit,
    search: debouncedSearch,
  });

  const addMutation = useCreateSchool();

  const handleAddSchool = async (formData) => {
    addMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("تم إضافة المدرسة بنجاح");
        setShowAddModal(false);
        queryClient.invalidateQueries({ queryKey: schoolKeys.all });
        setPage(1);
        refetch();
      },
      onError: (error) => {
        toast.error(`فشل في إضافة المدرسة: ${error.message}`);
      },
    });
  };

  // Pagination helpers
  const totalPages = data?.pagination?.totalPages || 0;
  const currentPage = data?.pagination?.page || page;
  const totalItems = data?.pagination?.total || 0;

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner message="جارٍ تحميل المدارس..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="خطأ في جلب البيانات"
        message="حدث خطأ أثناء جلب بيانات المدارس."
      />
    );
  }

  const schools = data?.data || [];
  const hasSchools = schools.length > 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <MainHeader
        btnTitle="إضافة مدرسة"
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setShowAddModal}
        title="المدارس"
        description="جميع المدارس في محافظة قنا تحت نظام التعليم الفنى المزدوج"
      />

      {/* Search input */}
      <div className="flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="بحث باسم المدرسة..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
        <div className="text-sm text-gray-500">
          إجمالي: {totalItems} مدرسة
        </div>
      </div>

      {/* Schools grid/list */}
      {!hasSchools ? (
        <EmptyState
          title="لا توجد مدارس"
          description={
            debouncedSearch
              ? `لا توجد نتائج لـ "${debouncedSearch}"`
              : "ابدأ بإضافة مدرسة جديدة"
          }
          actionText="إضافة مدرسة"
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
            {schools.map((school) => (
              <SchoolCard key={school._id} data={school} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
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
                <span className="mx-2 mt-2">
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
                    إجمالي: {totalItems} مدرسة
                  </div>

            </div>
          )}
        </>
      )}

      {/* Add School Modal */}
      <SchoolModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        onSubmit={handleAddSchool}
        isLoading={addMutation.isLoading}
        initialData={null}
      />
    </div>
  );
}