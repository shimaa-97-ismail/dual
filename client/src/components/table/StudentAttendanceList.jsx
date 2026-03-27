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

export const StudentAttendanceList = () => {
  const { studentId } = useParams();
  const {
    data: attendance,
    isLoading,
    error,
  } = useStudentAttendance(studentId);
  const deleteMutation = useDeleteWeekAttendance();
  const handleDelete = (weekStart, e) => {
    e.stopPropagation();
    if (
      window.confirm(`هل أنت متأكد من حذف الأسبوع الذي يبدأ في ${weekStart}؟`)
    ) {
      deleteMutation.mutate({ studentId, weekStart });
    }
  };

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);

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
    return <div>لا توجد سجلات غياب لهذا الطالب.</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>بداية الأسبوع</TableHead>
            <TableHead>نهاية الأسبوع</TableHead>
            <TableHead>أيام الحضور</TableHead>
            <TableHead>أيام الغياب</TableHead>
            <TableHead>إجازات</TableHead>
            <TableHead>مدرسة</TableHead>
            <TableHead> تعديل </TableHead>
            <TableHead> حذف </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((week) => (
            <TableRow
              key={week.week_start_date}
              onClick={() => handleRowClick(week.week_start_date)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{week.week_start_date}</TableCell>
              <TableCell>{week.week_end_date}</TableCell>
              <TableCell>{week.summary.present_days}</TableCell>
              <TableCell>{week.summary.absent_days}</TableCell>
              <TableCell>{week.summary.excused_absences}</TableCell>
              <TableCell>
                {week.days.filter((d) => d.status === "مدرسه").length}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleEditClick(week.week_start_date, e)}
                >
                  <SquarePen size={20} color="#b3ca24" />
                </button>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => handleDelete(week.week_start_date, e)}>
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
        l
        open={editModalOpen}
        studentId={studentId}
        weekStart={selectedWeekStart}
        onClose={closeEditModal}
      />
    </>
  );
};
