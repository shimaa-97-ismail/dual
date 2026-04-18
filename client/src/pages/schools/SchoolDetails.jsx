import { SchoolCard } from "@/components/card/SchoolCard";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// import { useDepartment } from "@/hooks/useDepartments";
import {
  useSchoolById,
  useSchoolByintake,
  useClassesForAttendance,
  useStudentInClasses,
  useSchools,
} from "@/hooks/useSchools";
import { MainHeader } from "@/components";
import { StudentTable } from "@/components/table/StudentTable";
import { useNavigate } from "react-router-dom";

import { Class } from "./Class";
export function SchoolDetails() {
  const navigate = useNavigate();
  const printRef = useRef();
  const { schoolId } = useParams();
  // departmentId
  // const { data: department } = useDepartment(departmentId);
  const { data: schools } = useSchools();
  const { data: school } = useSchoolById(schoolId);
console.log(school);

  // const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSpeacial, setSelectedSpeacial] = useState("");
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [studentInClass, setStudentInClass] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    data: batches = [],
    // isLoading: batchesLoading,
    // error: batchesError,
  } = useSchoolByintake(schoolId || selectedSchool);
  console.log(selectedSchool);
  const [showCheckbox, setShowCheckbox] = useState(false);

  const toggleCheckbox = () => {
    setShowCheckbox((prev) => !prev);
  };

  const enableClassesQuery =
    schoolId ||
    (selectedSchool && selectedIntake && selectedSpeacial && selectedStage);
  const {
    data: classes,
    // isLoading: classesLoading,
    // isError: classesError,
  } = useClassesForAttendance(
    {
      school: schoolId || selectedSchool,
      intake: selectedIntake,
      special: selectedSpeacial,
      stage: selectedStage,
    },
    {
      enabled: enableClassesQuery,
    },
  );

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleSpecialChange = (e) => {
    setSelectedSpeacial(e.target.value);
  };
  const handleIntakeChange = (e) => {
    setSelectedIntake(e.target.value);
  };
  const handleStageChange = (e) => {
    setSelectedStage(e.target.value);
  };
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const {
    data,
    isLoading,
    isError,
    error: stdError,
  } = useStudentInClasses(
    {
      school: schoolId || selectedSchool,
      intake: selectedIntake,
      special: selectedSpeacial,
      stage: selectedStage,
      className: selectedClass,
    },
    {
      enabled: false,
    },
  );
  console.log(data);
  

  useEffect(() => {
    console.log(data);
    if (data) {
      setStudentInClass(data);
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setError(stdError.message);
    }
  }, [isError, stdError]);

  return (
    <>
      {/* /student/add */}
      <div className="p-6 bg-gray-50 ">
        {schoolId && (
          <MainHeader
            btnTitle="إضافة طالب"
            setViewMode={setViewMode}
            viewMode={viewMode}
            onAddButtonClick={() =>
              navigate(`/school/student/add`)
            }
            title={`${school?.name} `}
            description={`اداره ${school?.departement?.name}`}
          />
        )}
        {/* شريط البحث والفلترة */}
        <div className=" bg-white p-4 rounded-lg shadow">
          <div className="flex gap-4">
            {!schoolId && (
              <select
                className="border p-2 rounded w-1/4"
                value={selectedSchool}
                onChange={handleSchoolChange}
              >
                <option disabled value="">
                  اختر المدرسه
                </option>
                {schools &&
                  schools.length > 0 &&
                  schools.map(
                    (school, index) => (
                      console.log(school),
                      (
                        <option key={index} value={school._id}>
                          {school.name}
                        </option>
                      )
                    ),
                  )}
              </select>
            )}
            <select
              className="border p-2 rounded w-1/4"
              value={selectedSpeacial}
              onChange={handleSpecialChange}
            >
              <option disabled value="">
                اختر التخصص
              </option>
              {school?.special &&
                school?.special.length > 0 &&
                school?.special.map((special, index) => (
                  <option key={index} value={special._id}>
                    {special.name}
                  </option>
                ))}
              {!schoolId &&
                school?.special?.map(
                  (special) => (
                    console.log("kkkk"),
                    (
                      <option key={special._id} value={special._id}>
                        {special?.name}
                      </option>
                    )
                  ),
                )}
            </select>

            <select
              className="border p-2 rounded w-1/4"
              value={selectedIntake}
              onChange={handleIntakeChange}
            >
              <option disabled value="">
                اختر الدفعة
              </option>
              {batches &&
                batches.length > 0 &&
                batches.map((intake, index) => (
                  <option key={index} value={intake}>
                    {intake}
                  </option>
                ))}
            </select>

            <select
              className="border p-2 rounded w-1/4"
              value={selectedStage}
              onChange={handleStageChange}
            >
              <option disabled value="">
                اختر الصف
              </option>
              <option value="الصف الأول">الصف الاول</option>
              <option value="الصف الثاني">الصف الثانى </option>
              <option value="الصف الثالث">الصف الثالث </option>
            </select>
            <select
              className="border p-2 rounded w-1/4"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option disabled value="">
                اختر الفصل
              </option>
              {classes &&
                classes.length > 0 &&
                classes.map((cls, index) => (
                  <option key={index} value={cls}>
                    {cls}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {data?.students.length !== undefined && (
        <>
          <div className="flex gap-4 p-4  justify-end">
            <button
              className="bg-primary text-white px-6 rounded cursor-pointer m-4"
              onClick={toggleCheckbox}
            >
              حاله الطلاب والفصل
            </button>
          </div>
        
          <header className="flex justify-between text-right mb-5 mt-10 px-20">
            <div>
              <h2>جمعية رؤى للتنمية بالمشاركة بقنا</h2>
              <h2>المشهورة برقم 949 لسنة2005</h2>
              <h2>الوحده الاقليمية للتعليم الفنى المزدوج</h2>
            </div>
            <div className="">
              <h2>اسم المدرسه/ {data?.school} </h2>

              <h2> القسم / {data?.students[0]?.stdSpecial?.name}</h2>
              <div className="flex gap-4 justify-between">
                <h2> الفصل /{data?.className}</h2>
                <h2> {data?.stage}</h2>
              </div>
            </div>
          </header>
          {/* </div> */}
          <div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <StudentTable
            ref={printRef}
            data={data?.students}
            showCheckbox={showCheckbox}
          />
        </>
      )}
    </>
  );
}
