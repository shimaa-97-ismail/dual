import React, { useEffect } from "react";
import { useStudentSearch } from "@/hooks/useStudent";
import { useSearchParams } from "react-router-dom";
import { OctagonX } from "lucide-react";

export function SearchDetails() {
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search");

  const { data, refetch,isLoading } = useStudentSearch(searchValue, { enabled: false });

  useEffect(() => {
    if (searchValue && searchValue.length >= 2) {
      refetch();
    }
  }, [searchValue, refetch]);
  return (
   <div className="m-6">
  {isLoading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="mr-3 text-gray-500">جاري البحث...</span>
    </div>
  ) : data?.data?.data?.length > 0 ? (
    <>
      <h2 className="mb-4 text-2xl font-bold text-gray-800 border-r-4 border-primary pr-3">
        نتائج البحث عن "{searchValue}"
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.data.map((student) => (
          <div
            key={student._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
          >
            <a
              href={`/student/${student._id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{student.stdName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {student.stdSpecial?.name || 'لا يوجد تخصص'}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {student.studStatus || 'حالة غير محددة'}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-500 grid grid-cols-2 gap-2">
                <div>📚 {student.current_stage?.stage_name || 'غير محدد'}</div>
                <div>📅 {student.intake || 'غير محدد'}</div>
                <div>🏫 {student.current_class || 'غير محدد'}</div>
                
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة لـ "{searchValue}"</p>
      <p className="text-gray-400 text-sm mt-2">حاول البحث بكلمة مختلفة</p>
    </div>
  )}
</div>
  );
}
