import React, { useState } from "react";
import { ReportCard } from "../../components/card/ReportCard";
import { MainHeader } from "@/components";
import { useNavigate } from "react-router-dom";
export function Reports() {
const navigate=useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const navigateToWeeklyAbsent=()=>{
    navigate("/weeklyAbsent")
  }

  const navigateToStudentRegistration=()=>{
    navigate("/StudentRe_registration")
  }
  const navigateToClearance=()=>{
    navigate("/clearance")
  }
  const navigateToChooseClass=()=>{
  navigate("/choose-class", { state: { mode: "other" } });

  }
  return (
    <>
      <MainHeader
        setViewMode={setViewMode}
        viewMode={viewMode}
        title="التقارير"
        description="جميع التقارير تحت نظام التعليم الفنى المزدوج"
      />
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 m-6"
            : "space-y-4 p-3 m-6"

        }
      >
        <ReportCard title={"الغياب الاسبوعى"} onSubmit={navigateToWeeklyAbsent}/>
        <ReportCard title={" اعاده قيد الطالب"} onSubmit={navigateToStudentRegistration}/>
        <ReportCard title={" اخلاء طرف من المدرسه"} onSubmit={navigateToClearance}/>
      </div>
      <div
        className={
        
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-4 p-3 m-6"
            : "space-y-4  mt-4 p-3 m-6"

        } 
      >
         <ReportCard title={" طلاب الفصل"} onSubmit={navigateToChooseClass}/>
      </div>
    </>
  );
}
