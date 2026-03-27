// components/WeekDetailsModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export const WeekDetailsModal = ({ open, onClose, weekData }) => {
  if (!weekData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            تفاصيل الأسبوع: {weekData.week_start_date} إلى {weekData.week_end_date}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">اليوم</th>
                <th className="border p-2">التاريخ</th>
                <th className="border p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {weekData.days.map((day) => (
                <tr key={day.date}>
                  <td className="border p-2">{day.day_name_ar}</td>
                  <td className="border p-2">{day.date.split('T')[0]}</td>
                  <td className="border p-2">{day.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};