import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DisplayWeeklyAbsenr({
  students,
  startWeek,
  attendance_summary,
}) {
  // حساب الإحصائيات لكل طالب
  const calculateStudentStats = (days) => {
    if (!days || !Array.isArray(days)) {
      return { present: 0, absent: 0, school: 0, excused: 0, total: 0 };
    }

    return days.reduce(
      (stats, day) => {
        stats.total++;
        if (day.status === "حاضر") stats.present++;
        if (day.status === "غائب") stats.absent++;
        if (day.status === "مدرسه") stats.school++;
        if (day.status === "اجازه") stats.excused++;
        return stats;
      },
      { present: 0, absent: 0, school: 0, excused: 0, total: 0 },
    );
  };

  function getWeekDates(startDate) {
  const dates = [];
  const [year, month, day] = startDate.split("-").map(Number);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(year, month - 1, day + i);
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
  }
  return dates;
}
const weekDates =startWeek?getWeekDates(startWeek):[];
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead
              colSpan={14}
              className="text-center p-2 bg-gray-100 text-lg font-bold"
            >
              كشف حضور وغياب فى الفتره من السبت الموافق
              {new Date(startWeek).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TableHead>
          </TableRow>
          <TableRow className="bg-gray-50">
            <TableHead rowSpan={2} className="text-center p-2 w-12">
              م
            </TableHead>
            <TableHead rowSpan={2} className="text-center p-2 min-w-[150px]">
              الاسم
            </TableHead>

            {/* أيام الأسبوع */}
            <TableHead className="text-center p-2">السبت</TableHead>
            <TableHead className="text-center p-2">الأحد</TableHead>
            <TableHead className="text-center p-2">الاثنين</TableHead>
            <TableHead className="text-center p-2">الثلاثاء</TableHead>
            <TableHead className="text-center p-2">الأربعاء</TableHead>
            <TableHead className="text-center p-2">الخميس</TableHead>
            <TableHead className="text-center p-2">الجمعة</TableHead>

            {/* الإحصائيات */}
            <TableHead className="text-center p-2 bg-green-50">ح</TableHead>
            <TableHead className="text-center p-2 bg-red-50">غ</TableHead>
            <TableHead className="text-center p-2 bg-purple-50">م</TableHead>
            <TableHead className="text-center p-2 bg-blue-50">اج</TableHead>
            <TableHead
              rowSpan={2}
              className="text-center p-2 bg-gray-50"
              style={{ writingMode: "vertical-lr" }}
            >
              الإجمالي ايام الاسبوع
            </TableHead>
          </TableRow>
          <TableRow>
            {/* Second row: dates for weekdays */}

            
            {weekDates.length > 0 ? (
    weekDates.map((date, idx) => (
      <TableHead key={idx} className="text-center p-2 text-gray-600  [writing-mode:vertical-rl]">
        {new Date(date).toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </TableHead>
    ))
  ) : (
    // Fallback: 7 empty columns
    Array.from({ length: 7 }).map((_, i) => (
      <TableHead key={i} className="text-center p-2 text-gray-300">
        -
      </TableHead>
    ))
  )}
           
             
            <TableHead className="text-center p-0 text-gray-600">
              <div
                className="flex items-center justify-center text-base"
                style={{
                  height: "100%", // Take full cell height
                  minHeight: "150px", // Ensure enough space for the rotated text
                  writingMode: "vertical-rl",
                  textOrientation: "mixed", // Keep Arabic letters upright
                }}
              >
                حضور التدريب
              </div>
            </TableHead>
            <TableHead className="text-center p-0 text-gray-600">
              <div
                className="flex items-center justify-center text-base"
                style={{
                  height: "100%", // Take full cell height
                  minHeight: "150px", // Ensure enough space for the rotated text
                  writingMode: "vertical-rl",
                  textOrientation: "mixed", // Keep Arabic letters upright
                }}
              >
                غياب التدريب
              </div>
            </TableHead>
            <TableHead className="text-center p-0 text-gray-600">
              <div
                className="flex items-center justify-center text-base"
                style={{
                  height: "100%", // Take full cell height
                  minHeight: "150px", // Ensure enough space for the rotated text
                  writingMode: "vertical-rl",
                  textOrientation: "mixed", // Keep Arabic letters upright
                }}
              >
                الدراسه بالمدرسه
              </div>
            </TableHead>
            <TableHead className="text-center p-0 text-gray-600">
              <div
                className="flex items-center justify-center text-base"
                style={{
                  height: "100%", // Take full cell height
                  minHeight: "150px", // Ensure enough space for the rotated text
                  writingMode: "vertical-rl",
                  textOrientation: "mixed", // Keep Arabic letters upright
                }}
              >
                عطلات رسميه
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students?.map((student, index) => {
            const stats = calculateStudentStats(student.days);

            return (
              <TableRow key={student._id} className="hover:bg-gray-50">
                {/* رقم الطالب */}
                <TableCell className="text-center p-2">{index + 1}</TableCell>

                {/* اسم الطالب */}
                <TableCell className="text-center p-2 font-medium">
                  <div className="text-right">{student.stdName}</div>
                </TableCell>
                {student.days &&
                  student.days.length > 0 &&
                  student.days.map((day, dayIndex) => (
                    <TableCell
                      key={day._id || dayIndex}
                      className="text-center p-2"
                    >
                      {day.status}
                    </TableCell>
                  ))}

                {/* الإحصائيات */}
                <TableCell className="text-center p-2 bg-green-50 font-bold">
                  {stats.present}
                </TableCell>
                <TableCell className="text-center p-2 bg-red-50 font-bold">
                  {stats.absent}
                </TableCell>
                <TableCell className="text-center p-2 bg-purple-50 font-bold">
                  {stats.school}
                </TableCell>
                <TableCell className="text-center p-2 bg-blue-50 font-bold">
                  {stats.excused}
                </TableCell>
                <TableCell className="text-center p-2 bg-gray-50 font-bold">
                  {stats.total}
                </TableCell>
              </TableRow>
            );
          })}

          {/* صف الإجمالي */}
          {attendance_summary && (
            <TableRow className="bg-gray-100 font-bold">
              <TableCell colSpan={2} className="text-center p-2">
                الإجمالي
              </TableCell>

              {/* الأيام (يمكن تركها فارغة أو وضع إجمالي لكل عمود) */}
              {Array.from({ length: 7 }).map((_, i) => (
                <TableCell key={i} className="text-center p-2">
                  -
                </TableCell>
              ))}

              {/* إجمالي الإحصائيات */}
              <TableCell className="text-center p-2 bg-green-100">
                {attendance_summary.total_present_days ||
                  attendance_summary.present_students ||
                  0}
                {}
              </TableCell>
              <TableCell className="text-center p-2 bg-red-100">
                {attendance_summary.total_absent_days ||
                  attendance_summary.absent_students ||
                  0}
              </TableCell>
              <TableCell className="text-center p-2 bg-purple-100">
                {attendance_summary.total_school_days || 0}
              </TableCell>
              <TableCell className="text-center p-2 bg-blue-100">
                {attendance_summary.total_excused_days || 0}
              </TableCell>
              <TableCell className="text-center p-2 bg-gray-100">
                {students?.length || 0}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ملخص عام */}
      {attendance_summary && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">ملخص الحضور</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <div className="text-gray-500">إجمالي الطلاب</div>
              <div className="text-2xl font-bold">
                {attendance_summary.total_students || students?.length || 0}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="text-green-600">الحاضرون</div>
              <div className="text-2xl font-bold">
                {attendance_summary.present_students || 0}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="text-red-600">الغائبون</div>
              <div className="text-2xl font-bold">
                {attendance_summary.absent_students || 0}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="text-blue-600">نسبة الحضور</div>
              <div className="text-2xl font-bold">
                {attendance_summary.attendance_percentage || "0%"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
