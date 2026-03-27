import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useStudentInClassesForAttendance } from "../../hooks/useSchools";
import { DisplayWeeklyAbsenr } from "../../components/table/DisplayWeeklyAbsenr";
import EmptyState from "@/components/common/EmptyState"
export function WeeklyAbsent() {
  const printRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const receivedData = location.state?.data || {};
  console.log(receivedData);
  const { data, isLoading, isError } = useStudentInClassesForAttendance({
    school: receivedData.school,
    intake: receivedData.intake,
    special: receivedData.special,
    stage: receivedData.stage,
    className: receivedData.className,
    year: receivedData.year,
    month: receivedData.month,
    startWeek: receivedData.startWeek,
  });
  console.log(data);

  const handleChooseClass = () => {
      navigate("/choose-class", { state: { mode: "absence" } });
  };
  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }
  return (
    <>
      <div className="flex justify-end m-4">
        <Button onClick={handleChooseClass}>اختار الفصل</Button>
        <Button className="m-3" onClick={handlePrint}>
          اطبع
        </Button>
      </div>
     {!data?.students && (
          <div>
           <EmptyState
            title="اختار الفصل اولا"
            description="لتحضير الغياب"
            actionText="اختار الفصل"
            onAction={handleChooseClass}
          />
      </div>
     )}
      <div className="p-3 m-6" ref={printRef}>
        {data?.students && (
          <div className="p-3 m-6">
            <header className="flex justify-between text-right mb-5">
              <div>
                <h2>جمعية رؤى للتنمية بالمشاركة بقنا</h2>
                <h2>المشهورة برقم 949 لسنة2005</h2>
                <h2>الوحده الاقليمية للتعليم الفنى المزدوج</h2>
              </div>
              <div className="">
                <h2>اسم المدرسه/ {data?.school} </h2>

                <h2> القسم / {data?.specialization}</h2>
                <h2> {data?.stage}</h2>
              </div>
            </header>
            <DisplayWeeklyAbsenr
              students={data?.students}
              startWeek={receivedData?.startWeek}
              attendance_summary={data?.attendance_summary}
            />
          </div>
        )}
      </div>
    </>
  );
}
