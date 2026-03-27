import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, BookOpen, Umbrella } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAddAttendanceStudent } from "@/hooks/useStudent";
import "./table.css";

export function SetAbsencesTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainningId, studentId } = useParams();

  // Extract startDate (Saturday) and student from navigation state
  const { startDate, student } = location.state || {};

  const attendanceMutation = useAddAttendanceStudent();
  const [attendance, setAttendance] = useState({});

  // Days of the week starting with Saturday
  const arabicDays = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // Generate 7 days starting from the given start date (no shift)
  const calculateWeekDays = (start) => {
    console.log(start);

    if (!start) return [];
    const startDateObj = new Date(start);
    startDateObj.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDateObj);
      currentDay.setDate(startDateObj.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    if (startDate) {
      setWeekDays(calculateWeekDays(startDate));
    } else {
      setWeekDays([]);
    }
  }, [startDate]);

  const handleAttendanceChange = (date, status) => {
    setAttendance((prev) => ({ ...prev, [date]: status }));
  };

  const handleSubmit = () => {
    if (!startDate) {
      alert("لا يوجد تاريخ بدء الأسبوع");
      return;
    }
    attendanceMutation.mutate({
      studentId,
      startDate,
      attendanceData: attendance,
    });
    navigate(`/trainning-place/${trainningId}/details`);
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          تسجيل الحضور الأسبوعي
        </h2>
        <p className="text-gray-600">سجل حضور كل يوم من السبت إلى الجمعة</p>
        <h2>{student?.stdName}</h2>
      </div>
      <div className="py-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="text-center w-50">اليوم</TableHead>
              <TableHead className="text-center w-50">التاريخ</TableHead>
              <TableHead>
                <div className="titleAndIcon text-red-700">
                  <X
                    size={20}
                    color="oklch(50.5% 0.213 27.518)"
                    className="m-2"
                  />{" "}
                  غائب
                </div>
              </TableHead>
              <TableHead>
                <div className="titleAndIcon text-primary">
                  <Check size={20} className="m-2 text-primary" /> حاضر
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="titleAndIcon text-purple-700">
                  <BookOpen
                    size={20}
                    color="oklch(49.6% 0.265 301.924)"
                    className="m-2"
                  />{" "}
                  مدرسه
                </div>
              </TableHead>
              <TableHead>
                <div className="titleAndIcon text-green-700">
                  <Umbrella
                    size={20}
                    color="oklch(52.7% 0.154 150.069)"
                    className="m-2"
                  />{" "}
                  اجازه
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weekDays.map((day, index) => {
            const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const dayName = arabicDays[index];
              const formattedDate = day.toLocaleDateString("ar-EG");
              const currentStatus = attendance[dateString] || "";
              console.log(day, dateString, dayName);
              return (
                <TableRow key={dateString}>
                  <TableCell className="font-medium text-center bg-gray-100">
                    {dayName}
                  </TableCell>
                  <TableCell className="font-medium text-center bg-gray-100">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <input
                      type="radio"
                      name={`attendance-${dateString}`}
                      checked={currentStatus === "غائب"}
                      onChange={() =>
                        handleAttendanceChange(dateString, "غائب")
                      }
                    />
                    <span className="mr-2">غائب</span>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <input
                      type="radio"
                      name={`attendance-${dateString}`}
                      checked={currentStatus === "حاضر"}
                      onChange={() =>
                        handleAttendanceChange(dateString, "حاضر")
                      }
                    />
                    <span className="mr-2">حاضر</span>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <input
                      type="radio"
                      name={`attendance-${dateString}`}
                      checked={currentStatus === "مدرسه"}
                      onChange={() =>
                        handleAttendanceChange(dateString, "مدرسه")
                      }
                    />
                    <span className="mr-2">مدرسه</span>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <input
                      type="radio"
                      name={`attendance-${dateString}`}
                      checked={currentStatus === "اجازه"}
                      onChange={() =>
                        handleAttendanceChange(dateString, "اجازه")
                      }
                    />
                    <span className="mr-2">اجازه</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end m-4">
          <Button onClick={handleSubmit}>اضافه الغياب</Button>
        </div>
      </div>
    </>
  );
}
