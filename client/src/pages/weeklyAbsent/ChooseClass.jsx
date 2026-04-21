import { useState } from "react";
import {
  useSchools,
  useSchoolByintake,
  useClassesForAttendance,
  useStudentInClasses,
  fetchStudents
} from "../../hooks/useSchools";
import "./absent.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
export const ChooseClass = () => {
  const location = useLocation();
  const mode = location.state?.mode;
  const queryClient = useQueryClient(); 
  const [step, setStep] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [majorsList, setMajorsList] = useState([]); // ✅ مصفوفة التخصصات
  const [selectedMajorId, setSelectedMajorId] = useState(""); // ✅ ID التخصص المختار
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [startWeek, setStartWeek] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const steps =
    mode === "absence"
      ? [
          "1. المدرسة",
          "2. الدفعة",
          "3. التخصص",
          "4. المرحلة",
          "5. الفصل",
          "6. الاسبوع",
        ]
      : ["1. المدرسة", "2. الدفعة", "3. التخصص", "4. المرحلة", "5. الفصل"];

  const {
    data: schools,
    isLoading: schoolsLoading,
    isError: schoolsError,
  } = useSchools();

  // 2. جلب الدفعات (تعتمد على المدرسة المختارة)
  const {
    data: batches = [],
    isLoading: batchesLoading,
    error: batchesError,
  } = useSchoolByintake(selectedSchool);

  // 3. جلب الفصول (تعتمد على التخصص والمرحلة المختارة)
  const {
    data: classes,
    isLoading: classesLoading,
    isError: classesError,
  } = useClassesForAttendance({
    school: selectedSchool,
    intake: selectedBatch,
    special: selectedMajorId, // ✅ استخدام ID التخصص المختار
    stage: selectedStage,
  });

  // Handler functions
  const handleSchoolSelect = (school) => {
    setSelectedSchool(school._id);
    setMajorsList(school.special || []); // ✅ تخزين قائمة التخصصات كمصفوفة
    setSelectedMajorId(""); // ✅ إعادة تعيين التخصص المختار
    setSelectedBatch("");
    setSelectedStage("");
    setStep(2);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setSelectedStage("");
    setStep(3);
  };

  const handleMajorSelect = (majorId) => {
    setSelectedMajorId(majorId); // ✅ تخزين ID التخصص
    setStep(4);
  };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
    setStep(5);
  };
  const { data: student } = useStudentInClasses(
    {
      school: selectedSchool,
      intake: selectedBatch,
      special: selectedMajorId,
      stage: selectedStage,
      className: selectedClass,
    },
    {
      enabled: !!selectedClass,
    },
  );
  console.log(student);

  const handleClassSelection = async (Class) => {
    setSelectedClass(Class);
    if (mode === "other") {
      const newParams = {
      school: selectedSchool,
      intake: selectedBatch,
      special: selectedMajorId,
      stage: selectedStage,
      className: Class,
    };
       const data = await queryClient.fetchQuery({
      queryKey: ["studentsInClass", newParams],
      queryFn: () => fetchStudents(newParams),
    });

  navigate("/student-class", { state: { students: data, params: newParams } });
      
    } else {
      setStep(6);
    }
  };

  const handleChange = (field, value) => {
    setStartWeek(value);
    const [year, month] = value.split("-");
    setMonth(month);
    setYear(year);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const goToWeeklyAbsent = () => {
    navigate("/weeklyAbsent", {
      state: {
        data: {
          school: selectedSchool,
          intake: selectedBatch,
          special: selectedMajorId, // ✅ استخدام ID التخصص
          stage: selectedStage,
          className: selectedClass,
          day: startWeek,
          year: year,
          month: month,
          startWeek: startWeek,
        },
      },
    });
  };
  if(schoolsLoading){
    return <div className="text-center p-8">جاري تحميل بيانات ...</div>
  }
if(schoolsError){
  return <div>حدث خطا.....</div>
}
  return (
    <div className="attendance-container">
      <div className="progress-steps">
        {steps.map((label, idx) => (
          <div key={idx} className={`step ${step >= idx + 1 ? "active" : ""}`}>
            {label}
          </div>
        ))}
      </div>

      <div className="selection-area">
        {/* Step 1: Schools */}
        {step === 1 && (
          <div className="step-content">
            <h3>اختر المدرسة</h3>
            <div className="cards-grid">
              {schools?.schoolsWithCount?.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  isSelected={selectedSchool === school.id}
                  onSelect={handleSchoolSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Batches */}
        {step === 2 && (
          <div className="step-content">
            <h3>اختر الدفعة</h3>
            {batchesLoading ? (
              <div className="loading-state">جاري تحميل الدفعات...</div>
            ) : batchesError ? (
              <div className="error-state">خطأ في تحميل الدفعات</div>
            ) : (
              <div className="cards-grid">
                {batches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    isSelected={selectedBatch === batch.id}
                    onSelect={handleBatchSelect}
                  />
                ))}
              </div>
            )}
            <button className="back-btn" onClick={handleBack}>
              ← رجوع
            </button>
          </div>
        )}

        {/* Step 3: Majors */}
        {step === 3 && (
          <div className="step-content">
            <h3>اختر التخصص</h3>
            <div className="cards-grid">
              {majorsList.map(
                (
                  major, // ✅ استخدام majorsList
                ) => (
                  <MajorCard
                    key={major._id}
                    major={major}
                    isSelected={selectedMajorId === major._id} // ✅ مقارنة بالـ ID المختار
                    onSelect={handleMajorSelect}
                  />
                ),
              )}
            </div>
            <button className="back-btn" onClick={handleBack}>
              ← رجوع
            </button>
          </div>
        )}

        {/* Step 4: Stage */}
        {step === 4 && (
          <div className="step-content">
            <h3>اختر المرحلة</h3>
            <div className="stages-grid">
              {["الصف الأول", "الصف الثاني", "الصف الثالث"].map(
                (stage, index) => (
                  <StageCard
                    key={index}
                    stage={stage}
                    isSelected={selectedStage === stage}
                    onSelect={handleStageSelect}
                  />
                ),
              )}
            </div>
            <button className="back-btn" onClick={handleBack}>
              ← رجوع
            </button>
          </div>
        )}

        {/* Step 5: Classes */}
        {step === 5 && (
          <div className="step-content">
            <h3>اختر الفصل</h3>
            {classesLoading ? (
              <div className="loading-state">جاري تحميل الفصول...</div>
            ) : classesError ? (
              <div className="error-state">خطأ في تحميل الفصول</div>
            ) : (
              <div className="classes-grid ">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem}
                    classItem={classItem}
                    onSelect={() => handleClassSelection(classItem)}
                  />
                ))}
              </div>
            )}
            <button className="back-btn bg-gray-500" onClick={handleBack}>
              ← رجوع
            </button>
          </div>
        )}

        {/* Step 6: Week */}
        {mode === "absence" && step === 6 && (
          <div className="step-content">
            <h3>اختر الاسبوع للغياب</h3>
            <input
              type="date"
              onChange={(e) => handleChange("date", e.target.value)}
            />
            <button className="back-btn bg-gray-500" onClick={handleBack}>
              ← رجوع
            </button>
            <button className="back-btn bg-gray-500" onClick={goToWeeklyAbsent}>
              الغياب الاسبوعى
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// مكونات Card (تبقى كما هي)
const SchoolCard = ({ school, isSelected, onSelect }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onSelect(school)}
  >
    <h4>{school.name}</h4>
  </div>
);

const BatchCard = ({ batch, isSelected, onSelect }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onSelect(batch)}
  >
    <h4>دفعة {batch}</h4>
  </div>
);

const MajorCard = ({ major, isSelected, onSelect }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onSelect(major._id)}
  >
    <h4>{major.name}</h4>
  </div>
);

const StageCard = ({ stage, isSelected, onSelect }) => (
  <div
    className={`stage-card ${isSelected ? "selected" : ""}`}
    onClick={() => onSelect(stage)}
  >
    <h4>{stage}</h4>
  </div>
);

const ClassCard = ({ classItem, onSelect }) => (
  <div className="class-card" onClick={onSelect}>
    <h4>{classItem}</h4>
  </div>
);
