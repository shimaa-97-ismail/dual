// components/table/StudentTrainning.jsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateForAbsence } from "../model/DateForAbsence";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function StudentTrainning({
  students,
  pagination,
  onPageChange,
  onLimitChange,
  currentPage,
  limit,
  isFetching,
}) {
  const navigate = useNavigate();
  const { trainningId } = useParams();
  const [isDateModelOpen, setDateModelOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();

  const totalPages = pagination?.totalPages || 0;

  const addAbsent = (std) => {
    setDateModelOpen(true);
    setSelectedStudent(std);
  };

  const getSaturdayOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = day === 6 ? 0 : day + 1;
    d.setDate(d.getDate() - diff);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dayNum = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${dayNum}`;
  };

  const handleSubmit = async (date) => {
    const saturday = getSaturdayOfWeek(date);
    setDateModelOpen(false);
    navigate(`/trainning-place/${trainningId}/absent/${selectedStudent._id}`, {
      state: {
        startDate: saturday,
        student: selectedStudent,
        trainningId: trainningId,
      },
    });
  };

  const studDetails = (id) => {
    navigate(`/student/${id}`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">اسم الطالب</TableHead>
            <TableHead className="text-center">الرقم القومي</TableHead>
            <TableHead className="text-center">الدفعه</TableHead>
            <TableHead className="text-center">رقم التليفون</TableHead>
            <TableHead className="text-center">حاله الطالب</TableHead>
            <TableHead className="text-center">التخصص</TableHead>
            <TableHead className="text-center">المرحله</TableHead>
            <TableHead className="text-center">الغياب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((stud) => (
            <TableRow key={stud._id}>
              <TableCell
                className="font-medium text-center cursor-pointer text-primary hover:underline"
                onClick={() => studDetails(stud._id)}
              >
                {stud.stdName}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.studID}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.intake}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.phones?.map((phone, index) => (
                  <React.Fragment key={index}>
                    {phone.number}
                    {index < stud.phones.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.studStatus}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.stdSpecial?.name}
              </TableCell>
              <TableCell className="font-medium text-center">
                {stud.current_stage?.stage_name}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <button
                    className="text-[#97a91c]! hover:underline"
                    onClick={() => addAbsent(stud)}
                  >
                    اضافه الغياب
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 px-5">
          <div className="flex items-center gap-2">
            <label className="text-sm">عدد العناصر:</label>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="text-black!"
            >
              السابق
            </Button>
            <span className="mx-2 mt-3">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="text-black!"
            >
              التالي
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {isFetching && "جاري التحميل..."} إجمالي: {pagination.total || 0}
          </div>
        </div>
      )}

      {/* Absence Modal */}
      <DateForAbsence
        open={isDateModelOpen}
        onOpenChange={setDateModelOpen}
        title="الغياب"
        description="اختر أول يوم للأسبوع لتسجيل الغياب"
        onSubmit={handleSubmit}
        submitLabel="اضافه الغياب"
        cancelLabel="إلغاء"
        isLoading={false}
        disabled={false}
      />
    </>
  );
}
