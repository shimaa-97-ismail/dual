import React, { useRef } from "react";
import { StudentTable } from "@/components/table/StudentTable";
import { useLocation } from "react-router-dom";

export function Class({ showCheckbox }) {
  const location = useLocation();
  const printRef = useRef();
  // Get data from location state if not passed via props
  const data = location.state?.students;
  

  const params = location.state?.params;

  // Use params to display school, stage, etc.
  const schoolName = data?.data?.school;
  const className = params?.className || data?.data?.className;
  const stage = params?.stage || data?.data?.stage;
  const specialName =
    data?.data?.students[0]?.stdSpecial?.name || data?.data?.students[0]?.stdSpecial?.name;
  const printClass = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  return (
    <>
      <div className="flex justify-end">
        <button
          className="bg-primary text-white px-6 rounded cursor-pointer m-4"
          onClick={printClass}
        >
          اطبع
        </button>
      </div>
      <div ref={printRef} className="print-content">
        <header className="flex justify-between text-right mb-5 mt-10 px-20">
          <div>
            <h2>جمعية رؤى للتنمية بالمشاركة بقنا</h2>
            <h2>المشهورة برقم 949 لسنة2005</h2>
            <h2>الوحده الاقليمية للتعليم الفنى المزدوج</h2>
          </div>
          <div className="">
            <h2>اسم المدرسه/ {schoolName} </h2>
            <h2> القسم / {specialName}</h2>
            <div className="flex gap-4 justify-between">
              <h2> الفصل /{className}</h2>
              <h2> {stage}</h2>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto w-full">
          <StudentTable data={data?.data} showCheckbox={showCheckbox} stage={stage}  />
        </div>
      </div>
    </>
  );
}
