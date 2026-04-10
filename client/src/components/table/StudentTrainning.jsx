import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import toast from "react-hot-toast";
import { DateForAbsence } from "../model/DateForAbsence";
import { useNavigate, useParams } from "react-router-dom";
export function StudentTrainning({ data }) {
  const navigate = useNavigate();
  const { trainningId } = useParams();
  const [isDateModelOpen, setDateModelOpen] = useState(false);
  const [student, setStudent] = useState();
  const addAbsent = (std) => {
    setDateModelOpen(true);
    setStudent(std);
  };
const getSaturdayOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);               // midnight local time
  const day = d.getDay();               // 0=Sunday, ..., 6=Saturday
  const diff = day === 6 ? 0 : day + 1; // days to go back to Saturday
  d.setDate(d.getDate() - diff);

  // Build YYYY-MM-DD from local date components (no UTC conversion)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
};

  const handleSubmit = async (date) => {
  const saturday = getSaturdayOfWeek(date);
  setDateModelOpen(false);
  navigate(`/trainning-place/${trainningId}/absent/${student._id}`, {
    state: {
      startDate: saturday,
      student: student,
      trainningId: trainningId
    }
  });
};
  const studDetails = (id) => {
    navigate(`/student/${id}`);
  };

  return (
    <>
      {/* <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          تسجيل الحضور الأسبوعي
        </h2>
        <p className="text-gray-600">
          اختر الأسبوع ثم سجل حضور كل يوم من السبت إلى الجمعة
        </p>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">اسم الطالب</TableHead>
            <TableHead className="text-center">الرقم القومي</TableHead>
            <TableHead className="text-center">الدفعه</TableHead>
            <TableHead className="text-center">رقم التليفون</TableHead>
            <TableHead className="text-center">حاله الطالب</TableHead>
            <TableHead className="text-center"> التخصص</TableHead>
            <TableHead className="text-center"> المرحله</TableHead>
            <TableHead className="text-center"> الغياب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map(
            (stud) => (
              console.log(stud),
              (
                <TableRow>
                  <TableCell
                    className="font-medium text-center"
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
                    {stud.phone}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {stud.studStatus}
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    {stud.stdSpecial?._id}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {stud.current_stage.stage_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <button
                        className="text-[#97a91c]!"
                        onClick={() => addAbsent(stud)}
                      >
                        اضافه الغياب
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            ),
          )}
        </TableBody>
      </Table>
      <DateForAbsence
        open={isDateModelOpen}
        onOpenChange={setDateModelOpen}
        title="الغياب"
        description={"اختار اول يوم لاسبوع للغياب"}
        onSubmit={handleSubmit}
        submitLabel="اضافه الغياب"
        cancelLabel="إلغاء"
        isLoading={false}
        disabled={false}
      />
    </>
  );
}

///////////////////////////
// import React, { useState, useEffect } from 'react';
// import { Calendar, Check, X, BookOpen, Umbrella } from 'lucide-react';

// export const StudentTrainning = ({ onSubmit, initialData = {} }) => {
//   const [selectedWeek, setSelectedWeek] = useState('');
//   const [attendance, setAttendance] = useState({});
//   const [notes, setNotes] = useState({});
//   const [currentWeekDates, setCurrentWeekDates] = useState([]);

//   // الحالات المتاحة
//   const statusOptions = [
//     { value: 'حاضر', label: 'حاضر', icon: Check, color: 'bg-green-100 text-green-700' },
//     { value: 'غائب', label: 'غائب', icon: X, color: 'bg-red-100 text-red-700' },
//     { value: 'اجازه', label: 'إجازة', icon: Umbrella, color: 'bg-blue-100 text-blue-700' },
//     { value: 'مدرسه', label: 'مدرسة', icon: BookOpen, color: 'bg-purple-100 text-purple-700' }
//   ];

//   // توليد أسابيع الشهر
//   const generateWeekOptions = () => {
//     const today = new Date();
//     const currentMonth = today.getMonth() + 1;
//     const currentYear = today.getFullYear();
//     const weeks = [];

//     // توليد 4 أسابيع
//     for (let week = 1; week <= 4; week++) {
//       const saturday = new Date(currentYear, currentMonth - 1, 1);
//       const dayOfWeek = saturday.getDay();
//       const daysToAdd = (6 - dayOfWeek + 7) % 7 + (week - 1) * 7;
//       saturday.setDate(saturday.getDate() + daysToAdd);

//       const friday = new Date(saturday);
//       friday.setDate(saturday.getDate() + 6);

//       const label = `الأسبوع ${week} (${formatDate(saturday)} إلى ${formatDate(friday)})`;
//       weeks.push({ value: `${currentYear}-${currentMonth}-${week}`, label });
//     }

//     return weeks;
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('ar-SA', {
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getWeekDates = (weekKey) => {
//     const [year, month, week] = weekKey.split('-').map(Number);
//     const saturday = new Date(year, month - 1, 1);
//     const dayOfWeek = saturday.getDay();
//     const daysToAdd = (6 - dayOfWeek + 7) % 7 + (week - 1) * 7;
//     saturday.setDate(saturday.getDate() + daysToAdd);

//     const dates = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(saturday);
//       date.setDate(saturday.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   useEffect(() => {
//     const weeks = generateWeekOptions();
//     if (weeks.length > 0 && !selectedWeek) {
//       setSelectedWeek(weeks[0].value);
//       const dates = getWeekDates(weeks[0].value);
//       setCurrentWeekDates(dates);
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedWeek) {
//       const dates = getWeekDates(selectedWeek);
//       setCurrentWeekDates(dates);
//     }
//   }, [selectedWeek]);

//   const handleStatusChange = (date, status) => {
//     const dateStr = date.toISOString().split('T')[0];
//     setAttendance(prev => ({
//       ...prev,
//       [dateStr]: status
//     }));

//     // إذا كان غائباً، إظهار حقل الملاحظة
//     if (status === 'غائب') {
//       setNotes(prev => ({
//         ...prev,
//         [dateStr]: notes[dateStr] || 'غياب بدون إذن'
//       }));
//     }
//   };

//   const handleNoteChange = (date, note) => {
//     const dateStr = date.toISOString().split('T')[0];
//     setNotes(prev => ({
//       ...prev,
//       [dateStr]: note
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // دمج الحضور والملاحظات
//     const submissionData = {};
//     Object.keys(attendance).forEach(date => {
//       submissionData[date] = attendance[date];
//       if (notes[date]) {
//         submissionData[`${date}_note`] = notes[date];
//       }
//     });

//     onSubmit({
//       week: selectedWeek,
//       attendance: submissionData
//     });
//   };

//   const getDayName = (date) => {
//     const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
//     return days[date.getDay()];
//   };

//   const getStatusForDate = (date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     return attendance[dateStr] || 'حاضر';
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg">
//       {/* عنوان النموذج */}

//       {/* اختيار الأسبوع */}
//       <div className="mb-8 p-4 bg-white rounded-lg shadow">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           <Calendar className="inline-block w-5 h-5 mr-2" />
//           اختر الأسبوع
//         </label>
//         <select
//           value={selectedWeek}
//           onChange={(e) => setSelectedWeek(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           {generateWeekOptions().map(option => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* شبكة أيام الأسبوع */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//           {currentWeekDates.map((date, index) => {
//             const dayName = getDayName(date);
//             const dateStr = date.toISOString().split('T')[0];
//             const currentStatus = getStatusForDate(date);

//             return (
//               <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
//                 {/* عنوان اليوم */}
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-semibold text-gray-800">{dayName}</span>
//                     <span className="text-sm text-gray-500">{formatDate(date)}</span>
//                   </div>
//                 </div>

//                 {/* خيارات الحالة */}
//                 <div className="p-4">
//                   <div className="space-y-2 mb-4">
//                     {statusOptions.map((option) => {
//                       const Icon = option.icon;
//                       const isSelected = currentStatus === option.value;

//                       return (
//                         <button
//                           key={option.value}
//                           type="button"
//                           onClick={() => handleStatusChange(date, option.value)}
//                           className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
//                             isSelected
//                               ? `${option.color} ring-2 ring-offset-1 ring-opacity-50`
//                               : 'hover:bg-gray-50 border border-gray-200'
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             <Icon className="w-5 h-5 ml-2" />
//                             <span className="font-medium">{option.label}</span>
//                           </div>
//                           {isSelected && (
//                             <div className="w-3 h-3 rounded-full bg-current"></div>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {/* حقل الملاحظات (يظهر فقط للغياب) */}
//                   {currentStatus === 'غائب' && (
//                     <div className="mt-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         سبب الغياب
//                       </label>
//                       <textarea
//                         value={notes[dateStr] || ''}
//                         onChange={(e) => handleNoteChange(date, e.target.value)}
//                         placeholder="أدخل سبب الغياب..."
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         rows="2"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ملخص الأسبوع */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">ملخص الأسبوع</h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {statusOptions.map(option => {
//               const count = Object.values(attendance).filter(s => s === option.value).length;
//               return (
//                 <div key={option.value} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <option.icon className={`w-5 h-5 ml-2 ${option.color.replace('bg-', 'text-').split(' ')[0]}`} />
//                   <span className="font-medium">{option.label}</span>
//                   <span className="mr-auto text-lg font-bold">{count}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* أزرار التحكم */}
//         <div className="flex justify-end space-x-4 space-x-reverse">
//           <button
//             type="button"
//             onClick={() => {
//               setAttendance({});
//               setNotes({});
//             }}
//             className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             مسح الكل
//           </button>
//           <button
//             type="submit"
//             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
//           >
//             حفظ الحضور الأسبوعي
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
