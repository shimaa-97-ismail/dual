import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentById } from "@/hooks/useStudent";
import { Button } from "@/components/ui/button";
export function StudentDetails() {
  const printRef = useRef();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { data: student } = useStudentById(studentId);
  const formatted = new Date(student?.stdBOD).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button onClick={() => navigate(`/student/absent/${studentId}`)}>
          {" "}
          الغياب
        </Button>
        <Button onClick={() => navigate(`/student/expenses/${studentId}`)}>
          استعلام عن المصروفات
        </Button>
        <Button onClick={handlePrint}> طباعه</Button>
      </div>
      <div className="p-3 m-6 pb-8" ref={printRef}>
        <header className="flex justify-between m-3">
          <h1 className="font-bold text-4xl text-primary">بيانات طالب</h1>
        </header>
        <div className="flex  m-4 mt-10 ">
          <div className="w-1/2 text-xl">
            <ul>
              <li className="p-2">
                <strong>الاسم:</strong> {student?.stdName}
              </li>
              <li className="p-2">
                <strong>الرقم القومى:</strong> {student?.studID}
              </li>
              {/* <li><strong> العمر:</strong> {student.stdAge}</li> */}
              <li className="p-2 flex ">
                <strong>رقم التليفون:</strong>
                {student?.phones?.map((phone, index) => (
                  <div key={index} className="mr-6">
                    {phone.number}
                    {index < student?.phones.length - 1 &&  <br />}
                  </div>
                ))}
              </li>
              <li className="p-2">
                <strong>تاريح الميلاد :</strong> {formatted}
              </li>
              <li className="flex p-2">
                <strong>العنوان : </strong>
                <p> {student?.stdAddress}</p>
              </li>
            </ul>
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="w-50 h-50 ">
              <img
                src={`${student?.studentImage}`}
                alt="Student"
                className="w-44 h-45 object-cover"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="w-full flex text-xl mt-5">
          <div className="w-1/2">
            <h1 className="text-3xl font-bold mr-4 underline">بيانات الاب</h1>
            <ul className="pr-4">
              <li className="p-2">
                <strong>الاسم:</strong> {student?.fatherName}
              </li>
              <li className="p-2">
                <strong>الرقم القومى:</strong> {student?.fatherID}
              </li>

              <li className="p-2">
                <strong>رقم التليفون:</strong> {student?.fatherPhone}
              </li>
              <li className="p-2">
                <strong>الوظيفه :</strong>{" "}
                {student?.fatherJobTitle || "غير محدد"}
              </li>
              {student?.fatherJobTitle === "موظف" &&
                student?.fatherJobTitle && (
                  <li>
                    <strong>تفاصيل الوظيفة :</strong> {student?.fatherJobDetails}
                  </li>
                )}
              {student?.fatherJobTitle === "متوفى" &&
                student?.fatherDeathCert && (
                  <li>
                    <strong>شهادة الوفاة :</strong>{" "}
                    <a
                      href={student?.fatherDeathCert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      عرض المستند
                    </a>
                  </li>
                )}
            </ul>
          </div>
          <div className="w-1/2">
            <h1 className="text-3xl font-bold mr-4 underline">بيانات الام</h1>
            <ul className="pr-4">
              <li className="p-2">
                <strong>الاسم:</strong> {student?.motherName}
              </li>
              <li className="p-2">
                <strong>الرقم القومى:</strong> {student?.motherID}
              </li>

              <li className="p-2">
                <strong>رقم التليفون:</strong>{" "}
                {student?.motherPhone || "لايوجد"}
              </li>
              
               <li className="p-2">
                <strong>الوظيفه :</strong>{" "}
                {student?.motherJobTitle || "غير محدد"}
              </li>
              {student?.motherJobTitle === "موظف" &&
                student?.motherJobDetails && (
                  <li>
                    <strong>تفاصيل الوظيفة :</strong> {student?.motherJobDetails}
                  </li>
                )}
              {student?.motherJobTitle === "متوفى" &&
                student?.motherDeathCert && (
                  <li>
                    <strong>شهادة الوفاة :</strong>{" "}
                    <a
                      href={student?.motherDeathCert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      عرض المستند
                    </a>
                  </li>
                )}
            </ul>
          </div>
        </div>
        <>
          <div className="w-full flex text-xl mt-5">
            <div className="w-1/2">
              <h1 className="text-3xl font-bold mr-4 underline">
                بيانات الدراسيه
              </h1>
              <ul className="pr-4">
                <li className="p-2">
                  <strong> الكود:</strong> {student?.code || "غير محدد"}
                </li>
                <li className="p-2">
                  <strong>البريد الالكترونى:</strong> {student?.email || "غير محدد"}
                </li>
              </ul>
            </div>
            <div className="w-1/2">
              <ul className="pr-4 mt-7">
                <li className="p-2">
                  <strong>مجموع الاعدادى :</strong>{" "}
                  {student?.preparatorySchoolTotalScore}
                </li>
                <li className="p-2">
                  <strong>الرقم السرى:</strong>
                  {student?.password || "غير محدد"}
                  {/* <input
                    className="border-0"
                    readOnly
                    type="password"
                    value={student?.password || "غير محدد"}
                  /> */}
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xl ">
            <ul className="pr-4">
              <li className="p-2">
                <strong> المدرسه :</strong> {student?.school?.name}
              </li>
              <li className="p-2">
                <strong> التخصص :</strong> {student?.stdSpecial?.name}
              </li>
              <li className="p-2">
                <strong> الصف :</strong> {student?.current_stage?.stage_name}
              </li>
              <li className="p-2">
                <strong> الدفعه :</strong> {student?.intake}
              </li>
              <li className="p-2">
                <strong> ورشه التدربيه :</strong>{" "}
                {student?.stdTrainningPlace?.name || "غير محدد"}
              </li>
            </ul>
          </div>
        </>
      </div>
    </>
  );
}
