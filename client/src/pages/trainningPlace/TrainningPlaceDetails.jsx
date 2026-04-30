import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStudentByTrainningPlace } from "@/hooks/useStudent";
import { StudentTrainning } from "@/components/table/StudentTrainning";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/common/LoadingSpinner";
export function TrainningPlaceDetails() {
  const { trainningId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useStudentByTrainningPlace(trainningId, page, limit, debouncedSearch);


  // Extract students array and pagination metadata
  const students = response?.data || [];
  const pagination = response?.pagination || { total: 0, totalPages: 0 };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>خطا: {error.message}</div>;

  return (
    <div className="mt-5 mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        الطلبة المتدربين
      </h2>
      <div className="flex justify-between items-center gap-4 max-w-md mx-auto my-4">
        <Input
          placeholder="بحث بالاسم أو الرقم القومي..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        {isFetching && (
          <span className="text-sm text-gray-400">جاري التحميل...</span>
        )}
      </div>

      {students.length === 0 ? (
        <p className="text-center text-gray-500">
          لا يوجد طلبة متدربين في هذا المكان
        </p>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            قائمة الطلبة المتدربين في هذا المكان
          </p>
          <StudentTrainning
            students={students}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            currentPage={page}
            limit={limit}
            isFetching={isFetching}
          />
        </>
      )}
    </div>
  );
}
