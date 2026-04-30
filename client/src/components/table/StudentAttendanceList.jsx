// components/StudentAttendanceList.jsx
import React, { useState } from "react";
import {
  useStudentAttendance,
  useDeleteWeekAttendance,
} from "../../hooks/useStudent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "react-router-dom";
import { WeekDetailsModal } from "../../components/WeekDetailsModal";
import { WeekDetailsEditor } from "../../components/WeekDetailsEditor";
import { SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModel";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const StudentAttendanceList = () => {
  const { studentId } = useParams();
  const queryClient = useQueryClient();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, isFetching } = useStudentAttendance(
    studentId,
    page,
    limit,
  );
  const deleteMutation = useDeleteWeekAttendance();
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);

  // Extract attendance data and pagination metadata from response
  const attendanceData = data?.data?.data || []; // array of weeks
  const pagination = data?.data?.pagination || {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  };
  const totalPages = pagination.totalPages;
  const currentPage = pagination.page || page;
  const totalItems = pagination.total || 0;

  // Pagination helpers
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // reset to first page when changing items per page
  };

  // Delete handler
  const handleDelete = (weekStart) => {
    deleteMutation.mutate(
      { studentId, weekDelete: weekStart },
      {
        onSuccess: () => {
          toast.success("تم حذف الأسبوع بنجاح");
          setDeleteModalOpen(false);
          setSelectedWeekStart(null);
          // Invalidate and refetch attendance list to reflect deletion
          queryClient.invalidateQueries({
            queryKey: ["student-attendance", studentId],
          });
        },
        onError: (err) => {
          toast.error("فشل الحذف: " + err.message);
        },
      },
    );
  };

  // Row click – show details modal
  const handleRowClick = (weekStart) => {
    setSelectedWeekStart(weekStart);
    setDetailsModalOpen(true);
  };

  // Edit click – open edit modal
  const handleEditClick = (weekStart, e) => {
    e.stopPropagation();
    setSelectedWeekStart(weekStart);
    setEditModalOpen(true);
  };

  // Find selected week data for modals
  const selectedWeek = attendanceData?.find(
    (w) => w.week_start_date === selectedWeekStart,
  );

  // Loading and error states
  if (isLoading)
    return <div className="text-center p-6">جاري تحميل الغياب...</div>;
  if (isError)
    return (
      <div className="text-center p-6 text-red-500">
        حدث خطأ أثناء جلب بيانات الحضور.
      </div>
    );

  if (!attendanceData.length)
    return (
      <div className="text-center p-6">لا توجد سجلات غياب لهذا الطالب.</div>
    );

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-6 px-4">
        <h2 className="text-2xl font-bold">سجل الغياب</h2>
        <div className="text-sm text-gray-500">
          {isFetching && <span className="mr-2">جاري التحميل...</span>}
          إجمالي السجلات: {totalItems}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-primary">بداية الأسبوع</TableHead>
            <TableHead className="text-center text-primary">نهاية الأسبوع</TableHead>
            <TableHead className="text-center text-primary">أيام الحضور</TableHead>
            <TableHead className="text-center text-primary">أيام الغياب</TableHead>
            <TableHead className="text-center text-primary">إجازات</TableHead>
            <TableHead className="text-center text-primary">مدرسة</TableHead>
            <TableHead className="text-center text-primary">تعديل</TableHead>
            <TableHead className="text-center">حذف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((week) => (
            <TableRow
              key={week.week_start_date}
              className="cursor-pointer text-center hover:bg-gray-100"
              onClick={() => handleRowClick(week.week_start_date)}
            >
              <TableCell>{week.week_start_date}</TableCell>
              <TableCell>{week.week_end_date}</TableCell>
              <TableCell>{week.summary?.present_days}</TableCell>
              <TableCell>{week.summary?.absent_days}</TableCell>
              <TableCell>{week.summary?.excused_absences}</TableCell>
              <TableCell>
                {week.days?.filter((d) => d.status === "مدرسه").length}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => handleEditClick(week.week_start_date, e)}
                  >
                    <SquarePen size={20} color="#b3ca24" />
                  </button>
                </div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedWeekStart(week.week_start_date);
                      setDeleteModalOpen(true);
                    }}
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash2 size={20} color="#831e2e" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 px-4">
          <div className="flex items-center gap-2 my-3">
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
        </div>
      )}

      {/* Modals */}
      <WeekDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedWeekStart(null);
        }}
        weekData={selectedWeek}
        studentId={studentId}
      />
      <WeekDetailsEditor
        open={editModalOpen}
        studentId={studentId}
        weekStart={selectedWeekStart}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedWeekStart(null);
        }}
      />
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد حذف الأسبوع"
        description={`هل أنت متأكد من حذف الأسبوع "${selectedWeekStart}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={() => {
          if (selectedWeekStart) handleDelete(selectedWeekStart);
        }}
        variant="destructive"
        isLoading={deleteMutation.isLoading}
      />
    </>
  );
};
