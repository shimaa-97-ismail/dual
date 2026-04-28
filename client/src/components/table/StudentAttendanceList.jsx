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
import { SquarePen, Trash2 } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModel";
import { toast } from "react-hot-toast";
export const StudentAttendanceList = () => {
  const { studentId } = useParams();
  const {
    data: attendance,
    isLoading,
    error,
  } = useStudentAttendance(studentId);
  const deleteMutation = useDeleteWeekAttendance();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);

  const handleDelete = (weekDelete) => {
    console.log(weekDelete);

    deleteMutation.mutate(
      {
        studentId,
        weekDelete,
      },
      {
        onSuccess: () => {
          toast.success("تم حذف الأسبوع بنجاح");
          setDeleteModalOpen(false);
          setSelectedWeekStart(null);
          // Invalidate and refetch attendance list
          // queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
        },
        onError: (err) => {
          toast.error("فشل الحذف: " + err.message);
        },
      },
    );
  };
  const handleRowClick = (weekStart) => {
    setSelectedWeekStart(weekStart);
    setDetailsModalOpen(true);
  };
  const handleEditClick = (weekStart, e) => {
    e.stopPropagation(); // prevent row click
    setSelectedWeekStart(weekStart);
    setEditModalOpen(true);
  };
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedWeekStart(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedWeekStart(null);
  };

  const selectedWeek = attendance?.find(
    (w) => w.week_start_date === selectedWeekStart,
  );

  if (isLoading) return <div>جاري تحميل الغياب...</div>;
  if (error) return <div>حدث خطأ: {error.message}</div>;
  if (!attendance || attendance.length === 0)
    return <div className="m-6 text-center">لا توجد سجلات غياب لهذا الطالب.</div>;

  return (
    <>
      <div className="flex justify-center items-center  mt-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">سجل الغياب</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">بداية الأسبوع</TableHead>
            <TableHead className="text-center">نهاية الأسبوع</TableHead>
            <TableHead className="text-center">أيام الحضور</TableHead>
            <TableHead className="text-center">أيام الغياب</TableHead>
            <TableHead className="text-center">إجازات</TableHead>
            <TableHead className="text-center">مدرسة</TableHead>
            <TableHead className="text-center"> تعديل </TableHead>
            <TableHead className="text-center"> حذف </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((week) => (
            <TableRow
              key={week.week_start_date}
              className="cursor-pointer text-center hover:bg-gray-100"
            >
              <TableCell onClick={() => handleRowClick(week.week_start_date)}>
                {week.week_start_date}
              </TableCell>
              <TableCell>{week.week_end_date}</TableCell>
              <TableCell>{week.summary.present_days}</TableCell>
              <TableCell>{week.summary.absent_days}</TableCell>
              <TableCell>{week.summary.excused_absences}</TableCell>
              <TableCell>
                {week.days.filter((d) => d.status === "مدرسه").length}
              </TableCell>
              <TableCell>
                <div
                  className="flex justify-center items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleEditClick(week.week_start_date, e)}
                  >
                    <SquarePen size={20} color="#b3ca24" />
                  </button>
                </div>
              </TableCell>
              <TableCell
                className="flex justify-center items-center"
                // onClick={(e) => e.stopPropagation()}
              >
                <button
                  // onClick={(e) => handleDelete(week.week_start_date, e)}
                  onClick={() => {
                    console.log("Full week object:", week);
                    console.log("Keys:", Object.keys(week));
                    console.log("week_start_date:", week.week_start_date);
                    setSelectedWeekStart(week?.week_start_date);
                    setDeleteModalOpen(true);
                  }}
                  disabled={deleteMutation.isLoading}
                >
                  <Trash2 size={20} color="#831e2e" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <WeekDetailsModal
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        weekData={selectedWeek}
        studentId={studentId}
      />
      <WeekDetailsEditor
        open={editModalOpen}
        studentId={studentId}
        weekStart={selectedWeekStart}
        onClose={closeEditModal}
      />
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="تأكيد حذف الأسبوع"
        description={`هل أنت متأكد من حذف الأسبوع "${selectedWeekStart}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، احذف"
        cancelText="إلغاء"
        onConfirm={() => {
          if (selectedWeekStart) {
            handleDelete(selectedWeekStart);
          }
        }}
        variant="destructive"
        isLoading={deleteMutation.isLoading}
      />
    </>
  );
};
