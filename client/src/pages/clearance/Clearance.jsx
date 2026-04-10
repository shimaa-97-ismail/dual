import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.jpeg";
import logo2 from "../../assets/لوجو الوحدة.jpg";
import { StudentReregistrationTable } from "../../components/table/StudentReregistrationTable";
import { ApplicantModel } from "@/components/model/ApplicantModel";
import { SearchStudent } from "@/components/model/SearchStudent";
import { useStudentSearch } from "@/hooks/useStudent";
export function Clearance() {
  const printRef = useRef();
  const [showApplicantModel, setShowApplicantModel] = useState(false);
  const [showStudentModel, setStudentModel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [applicant, setApplicant] = useState();
  const handleApplicant = (applicantData) => {
    setApplicant(applicantData);
    console.log(applicantData);
    setShowApplicantModel(false);
    setStudentModel(true);
  };
  const { data, refetch } = useStudentSearch(searchQuery, { enabled: false });
  console.log(data);
  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  const handleStudent = async (studentName) => {
    console.log(studentName);

    setSearchQuery(studentName.studentName);
    setStudentModel(false); // This will set the query but the hook is enabled: false so it won't run automatically.
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      refetch();
    }
  }, [searchQuery, refetch]);
  return (
    <>
      <div className="flex justify-end m-2">
        <Button onClick={() => setShowApplicantModel(true)}>
          بيانات مقدم الطلب{" "}
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
        <div className="mb-6">
          <h2 className="text-center font-bold text-2xl">
            اخلاء طرف من المدرسة
          </h2>
          <h2>السيد الفاضل/ مدير الوحدة الاقليمية للتعليم الفنى المزدوج-قنا</h2>
          <h2>تحية طيبة وبعده</h2>
          <p>
            تقدم اليكم بهذا الطلب لاخلاء طرفى من المدرسة المقرر أن أنهى دراستى
            بها ، وذلك وفقأ للاجراءات المتبعة فى التعليم الفنى المزدوج .
          </p>
        </div>
        <StudentReregistrationTable
          isRegister={false}
          applicant={applicant}
          student={data?.data.data[0] || {}}
        />
        <p>
          حيث اننى ارغب فى اخلاء طرفى من الوحدة الاقليميه ، وانهاء جميع
          الاجراءات الاداريه بها وانى ارغب فى استلام الملف الخاص بى /بابنى من
          المدرسه وانهاء الاجراءات اللازمه لاستلام الملف أرجو من سيادتكم اتخاذ
          الالجراءات اللازمة لاصدار شهادة اخلاء الطرف الخاصة بى ، وتقديم كافة
          المستندات المطلوبه لاستكمال الاجراءات أشكر لكم حسن تعاونكو ، وأتطلع
          ألى استلام أخلاء الطرف فى أقرب وقت ممكن .
        </p>
        <p>مع فائق الاحترام والتقدير ،</p>

        {/* <div>
          <p> الاسم التوقيع التاريخ </p>
        </div> */}
        <div className="mt-4 flex flex-col justify-between">
          <h3 className="font-bold">
            {" "}
            {`الاسم: ${data?.data.data[0]?.stdName || ""}`}
          </h3>
          <h3 className="font-bold">التوقيع:</h3>
          <h3 className="font-bold">
            التاريخ:{" "}
            {data?.data.data[0] && new Date().toLocaleDateString("ar-EG")}
          </h3>

          <div>
            <h3>
              السيد المحترم / مدير "ة"  <strong className="text-xl">{data?.data.data[0]?.school?.name || ""}</strong>
            </h3>
            <p className="text-center pb-1">تحية طيبة وبعد</p>
            <p>
              نحيط علم سيادتكم بان الطالب المذكور اعلاه قد اتهى جميع الاجراءات
              الاداريه ةالمالية بالوحدة وان الوحدة ليس لديها مانع من تسليم
              الطالب /ولى الامر الملف الخاص بالطالب المذكور. بما لا يخالف
              الاجراءات الفانونية ةالادارية والمالية الخاصة بالتعليم المزدوج
              بفنا{" "}
            </p>
            <p className="text-center py-1">وتفضلوا بقبول فائق الاحترام </p>
            <div className="flex justify-between h-18">
              <h3 className="font-bold">توقيع اداري الوحدة:</h3>
              <h3 className="font-bold">توقيع محاسب الوحدة:</h3>
              <div>
                <h3 className="font-bold ">مدير الوحدة:</h3>
              </div>
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
