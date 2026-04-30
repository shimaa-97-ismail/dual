import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import { StudentReregistrationTable } from "../../components/table/StudentReregistrationTable";
import { Button } from "@/components/ui/button";
import { ApplicantModel } from "@/components/model/ApplicantModel";
import { SearchStudent } from "@/components/model/SearchStudent";
import { useStudentSearch } from "@/hooks/useStudent";
import logo2 from "../../assets/لوجو الوحدة.jpg";
export function StudentRe_registration() {
  const printRef = useRef();
  const [showApplicantModel, setShowApplicantModel] = useState(false);
  const [showStudentModel, setStudentModel] = useState(false);
  const [applicant, setApplicant] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, refetch } = useStudentSearch(searchQuery, { enabled: false });

  const handleApplicant = (applicantData) => {
    setApplicant(applicantData);
    setShowApplicantModel(false);
    setStudentModel(true);
  };
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      refetch();
    }
  }, [searchQuery, refetch]);
  const handleStudent = async (studentName) => {
     setSearchQuery(studentName.studentName);
    setStudentModel(false); // This will set the query but the hook is enabled: false so it won't run automatically.
    // Then manually refetch
    // refetch();
  };
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
      <div className="flex justify-end m-4">
        <Button onClick={() => setShowApplicantModel(true)}>
          {" "}
          بيانات مقدم الطلب
        </Button>
        <Button className="m-3" onClick={handlePrint}>
          اطبع
        </Button>
      </div>
      <div className="p-3 m-6" ref={printRef}>
        <header className="flex justify-between ">
          <div>
            <h2>جمعية رؤى للتنمية بالمشاركة بقنا</h2>
            <h2>الوحده الاقليمية للتعليم الفنى المزدوج</h2>
          </div>
          <div className="flex">
            <img src={logo} alt="logo" width={50} />
            <img src={logo2} alt="logo" width={50} />
          </div>
        </header>
        <div>
          <h2 className="text-center font-bold text-2xl">اعادة قيد الطالب</h2>
          <h2>السيد/ مدير الوحدة الاقليمية للتعليم الفنى المزدوج-قنا</h2>
          <h2>تحية طيبة وبعده</h2>
        </div>
        <StudentReregistrationTable
          applicant={applicant || {}}
          student={data?.data.data[0] || {}}
          isRegister={true}
        />
        <div  className="">
          <p>
            نحن الموقعين أدناه نرفع لسيادتكم طلب اعادة قيد الطالب فى المدرسة
            المذكورة اعلاه بعدانقطاعه عن الدراسة لفترة زمنية استثنائية نؤكد أن
            الطالب قد التزم بكافة الشروط واللوائحالخاصة بالمدرسة ويستوفى
            المتطلبات اللازمة للالتحاق مرة اخرىز كما نطالب سيادتكم باتخاذ
            الاجراءات اللازمة لاعادة قيده بالفصل الدراسي الحالى وفقا للوائح
            والتعليمات الخاصه بوزاة التربية والتعليم ولذا نرجو من سيادتكم التكرم
            بالموافقة على هذا الطلب ،مع التعهد على التزام الطالب بالحضور
            بالمدرسه.
          </p>
          <p className="text-center font-bold">
            وتفضلوا بقبول فائق الاحترام ،،،
          </p>
          <div className="flex justify-between h-18">
            <div>
              <h3 className="font-bold">
                {`الاسم مقدم الطلب : ${applicant?.applicantName || ""}`}
              </h3>

              <h3 className="font-bold">التوقيع مقدم الطلب:</h3>
            </div>

            <div>
              <h3 className="font-bold">
                {`وظيفة مقدم الطلب : ${applicant?.job || ""}`}
              </h3>
              <h3 className="font-bold">
                التاريخ: {applicant && new Date().toLocaleDateString("ar-EG")}
              </h3>
            </div>
          </div>
        </div>
        <div className=" px-3">
          <h3>
            السيد المحترم / مدير "ة"{" "}
            <strong className="text-xl">{data?.data.data[0]?.school?.name || ""}</strong>
          </h3>
          <p className="text-center ">تحية طيبة وبعد</p>
          <p>
            نحيط علم سيادتكم بان الطالب المذكور اعلاه قد اتهى جميع الاجراءات
            الاداريه ةالمالية بالوحدة وان الوحدة ليس لديها مانع من تسليم الطالب
            /ولى الامر الملف الخاص بالطالب المذكور. بما لا يخالف الاجراءات
            الفانونية ةالادارية والمالية الخاصة بالتعليم المزدوج بفنا{" "}
          </p>
          <p className="text-center  font-bold">
            وتفضلوا بقبول فائق الاحترام{" "}
          </p>
          <div className="flex justify-between h-18">
            <h3 className="font-bold">توقيع اداري الوحدة:</h3>
            <h3 className="font-bold">توقيع محاسب الوحدة:</h3>
            <div>
              <h3 className="font-bold ">مدير الوحدة:</h3>
            </div>
          </div>
        </div>

        <div className=" flex justify-between m-2">
          <h5>
            قنا - حوض عشرة امام مسجد ابو بكر الصديق- الدور الرابع - ميدان
            الشهداء
          </h5>
          <h5>01123944481</h5>
        </div>
      </div>

      <ApplicantModel
        open={showApplicantModel}
        onOpenChange={setShowApplicantModel}
        onSubmit={handleApplicant}
      />
      <SearchStudent
        open={showStudentModel}
        onOpenChange={setStudentModel}
        onSubmit={handleStudent}
      />
    </>
  );
}
