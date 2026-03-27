// pages/WeekDetailsPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeekAttendance } from '../hooks/useStudent';
import { WeekDetailsTable } from '../components/WeekDetailsTable';

export const WeekDetailsPage = () => {
  const { studentId, weekStart } = useParams();
  const navigate = useNavigate();
  const { data: weekData, isLoading, error } = useWeekAttendance(studentId, weekStart);

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error.message}</div>;
  if (!weekData) return <div>لا توجد بيانات لهذا الأسبوع</div>;

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">← رجوع</button>
      <h2 className="text-xl font-bold mb-4">
        تفاصيل الأسبوع: {weekData.week_start_date} إلى {weekData.week_end_date}
      </h2>
      <WeekDetailsTable days={weekData.days} />
    </div>
  );
};