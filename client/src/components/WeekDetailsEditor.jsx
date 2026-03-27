// components/WeekDetailsEditor.jsx
import React, { useState, useEffect } from 'react';
import { useWeekAttendance } from '../hooks/useStudent';
import { useUpdateWeekAttendance } from '../hooks/useStudent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export const WeekDetailsEditor = ({ studentId, weekStart, onClose ,open}) => {
  const { data: weekData, isLoading, error } = useWeekAttendance(studentId, weekStart);
  const updateMutation = useUpdateWeekAttendance();
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (weekData) {
      setDays(weekData.days);
    }
  }, [weekData]);

  const handleStatusChange = (index, newStatus) => {
    const updatedDays = [...days];
    updatedDays[index].status = newStatus;
    setDays(updatedDays);
  };

  const handleSave = () => {
    updateMutation.mutate({
      studentId,
      weekStart,
      days,
    },{
        onSuccess: () => {
          onClose(); // close dialog after successful update
        },
      });
  };

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error.message}</div>;
  if (!weekData) return <div>لا توجد بيانات لهذا الأسبوع</div>;

  return (
        <Dialog open={open} onOpenChange={onClose}  dir="rtl">
   <DialogContent className="p-4 border rounded-lg">
      <DialogTitle className="text-lg font-bold mb-4">
        تعديل الغياب للأسبوع: {weekData.week_start_date} إلى {weekData.week_end_date}
      </DialogTitle>
      <DialogDescription className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">اليوم</th>
              <th className="border p-2">التاريخ</th>
              <th className="border p-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, idx) => (
              <tr key={day.date}>
                <td className="border p-2">{day.day_name_ar}</td>
                <td className="border p-2">{day.date.split('T')[0]}</td>
                <td className="border p-2">
                  <select
                    value={day.status}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="حاضر">حاضر</option>
                    <option value="غائب">غائب</option>
                    <option value="اجازه">إجازة</option>
                    <option value="مدرسه">مدرسة</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogDescription>
      <DialogFooter className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSave} disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </Button>
      </DialogFooter>
    </DialogContent>
        </Dialog>
 
  );
};