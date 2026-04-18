import React, { useState, useEffect } from "react";
import { PaymentModel } from "@/components/model/PaymentModel";
import { axioInstance } from "../../api/config";
import { useParams } from "react-router-dom";
import { useStudentById } from "@/hooks/useStudent";
import { ExpensesTable } from "@/components/table/ExpensesTable";
import "./expenses.css";
import EmptyState from "@/components/common/EmptyState";

export function ExpensesOfStudent() {
  const { studentId } = useParams();
  const [showExpModal, setShowExpModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const { data: student, isLoading, error } = useStudentById(studentId);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

      const isGraduated = student?.studStatus === "متخرج";
  // Fetch all enrollments for this student
  const fetchEnrollments = async (studentId) => {
    const res = await axioInstance.get(`/student/${studentId}/enrollments`);
    setEnrollments(res.data);
  };

  useEffect(() => {
    if (studentId) fetchEnrollments(studentId);
  }, [studentId]);

  // Create initial enrollment for the student's current stage (if none exist)
  const createInitialEnrollment = async () => {
    console.log(student.intake);

    if (!student?.current_stage?.stage_name) {
      alert("لا يمكن تحديد المرحلة الدراسية للطالب");
      return;
    }
    if (!student?.intake) {
      alert("لا يمكن تحديد السنة الدراسية");
      return;
    }
    // Build academicYear from student.intake (e.g., 2024 -> "2024/2025")
    const academicYear = student.intake;
    try {
      await axioInstance.post(`/student/${studentId}/enrollments`, {
        stage_name: student.current_stage.stage_name,
        academicYear: academicYear, // pass it explicitly
      });
      await fetchEnrollments(studentId);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء السنة الدراسية");
    }
  };
  // Create a repeat enrollment for an existing stage
  const createRepeatStage = async (stage_name) => {
    try {
      await axioInstance.post(`/student/${studentId}/repeat-stage`, {
        stage_name,
      });
      await fetchEnrollments(studentId);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء السنة المكررة");
    }
  };

  // Add a new payment to a specific enrollment
  const handleAdd = (enrollmentId) => {
      if (isGraduated) {
      alert("الطالب متخرج، لا يمكن إضافة مصروفات جديدة");
      return;
    }
    setModalMode("add");
    setSelectedPayment(null);
    setEditingEnrollmentId(enrollmentId);
    setEditingPaymentId(null);
    setShowExpModal(true);
  };

  // Update an existing payment
  const handleUpdate = async (enrollmentId, paymentId) => {
      if (isGraduated) {
      alert("الطالب متخرج، لا يمكن إضافة مصروفات جديدة");
      return;
    }
    setEditingEnrollmentId(enrollmentId);
    setEditingPaymentId(paymentId);
    setModalMode("edit");
    setShowExpModal(true);
    const res = await axioInstance.get(
      `/student/${studentId}/enrollments/${enrollmentId}/payments/${paymentId}`,
    );
    setSelectedPayment(res.data);
  };

  // Delete a payment
  const handleDelete = async (enrollmentId, paymentId) => {
      if (isGraduated) {
      alert("الطالب متخرج، لا يمكن إضافة مصروفات جديدة");
      return;
    }
    if (!window.confirm("هل أنت متأكد من حذف هذا السداد؟")) return;
    try {
      const res = await axioInstance.delete(
        `/student/${studentId}/enrollments/${enrollmentId}/payments/${paymentId}`,
      );
      if (res.status === 200) {
        await fetchEnrollments(studentId);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  // Submit add/edit form data
  const handlePayment = async (formData) => {
    setLoading(true);
    try {
      if (modalMode === "edit") {
        const res = await axioInstance.put(
          `/student/${studentId}/enrollments/${editingEnrollmentId}/payments/${editingPaymentId}`,
          {
            month: formData.month,
            year: parseInt(formData.year),
            amountDueReceipt1: parseFloat(formData.amountDueReceipt1),
           amountDueReceipt2: parseFloat(formData.amountDueReceipt2),
            receipt1: formData.receipt1,
            receipt2: formData.receipt2,
            paymentDate: formData.paymentDate,
            academicyearForPayment: formData.academicyearForPayment,
          },
        );
        if (res.status === 200) {
          await fetchEnrollments(studentId);
        }
      } else if (modalMode === "add") {
        const res = await axioInstance.post(
          `/student/${studentId}/enrollments/${editingEnrollmentId}/payments`,
          {
            month: formData.month,
            year: parseInt(formData.year),
            amountDueReceipt1: parseFloat(formData.amountDueReceipt1),
            receipt1: formData.receipt1,
            amountDueReceipt2: parseFloat(formData.amountDueReceipt2),
            receipt2: formData.receipt2,
            paymentDate: formData.paymentDate,
            academicyearForPayment: formData.academicyearForPayment,
          },
        );
        if (res.status === 201) {
          await fetchEnrollments(studentId);
        }
      }
    } catch (error) {
      console.error("Error in payment operation:", error);
      throw error; // let modal handle it
    } finally {
      setLoading(false);
      setShowExpModal(false);
      setEditingEnrollmentId(null);
      setEditingPaymentId(null);
      setSelectedPayment(null);
      setModalMode(null);
    }
  };

  const handleModalClose = () => {
    setShowExpModal(false);
    setEditingEnrollmentId(null);
    setEditingPaymentId(null);
    setSelectedPayment(null);
    setModalMode(null);
  };
  const promoteStage = async (stage_name, academicYear) => {
    if (!window.confirm(`هل أنت متأكد من انتقال الطالب إلى المرحلة التالية؟`))
      return;
    try {
      await axioInstance.post(`/student/${studentId}/promote`, {
        stage_name,
        academicYear,
      });
      await fetchEnrollments(studentId);
    } catch (error) {
      console.error("Promote error:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء الانتقال للمرحلة التالية",
      );
    }
  };
  // Helper: months per stage
  const stageMonths = {
    "الصف الأول": [
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
    ],
    "الصف الثاني": [
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
    ],
    "الصف الثالث": [
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
      "يناير",
      "فبراير",
      "مايو",
    ],
  };

  const stageEnrollmentCount = {};
  enrollments.forEach(enrollment => {
    const stage = enrollment.stage_name;
    stageEnrollmentCount[stage] = (stageEnrollmentCount[stage] || 0) + 1;
  });
  const getMonthsForStage = (stage) => stageMonths[stage] || [];

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ أثناء تحميل بيانات الطالب</div>;

  return (
    <>
      {/* Header with student info (optional, you can uncomment if needed) */}
      <div className="my-10 mb-10">
        <header>
          <h1 className="font-bold text-center text-primary text-3xl underline">
            {student?.stdName}
          </h1>
          <div className="flex justify-between mx-6 text-lg">
            <div className="m-4">
              <h2>
                <strong>المدرسة</strong> : {student?.school?.name}
              </h2>
              <h2>
                <strong>الدفعة</strong> : {student?.intake}
              </h2>
            </div>
            <div className="m-4">
              <h2>
                <strong>المنشأة التدريبية</strong> :{" "}
                {student?.stdTrainningPlace?.name}
              </h2>
              <h2>
                <strong>القسم</strong> : {student?.stdSpecial?.name}
              </h2>
            </div>
          </div>
          <h3 className="text-2xl mt-6 font-bold underline text-primary text-center">
            بيان السداد
          </h3>
        </header>
        {isGraduated  && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4  rounded relative text-center mt-4"
            role="alert"
          >
            <strong className="font-bold">تهانينا!</strong>
            <span className="block sm:inline">
              
              لقد أكمل الطالب جميع المصروفات بنجاح وتخرج{" "}
              {student.graduationYear ? `في عام ${student.graduationYear}` : ""}
              .
            </span>
          </div>
        )}
      </div>

      {/* List of all enrollments (each academic year) */}
      <div className="m-10">
        {enrollments.length > 0 ? (
          enrollments.map((enrollment) => {
             const canRepeat = !isGraduated && stageEnrollmentCount[enrollment.stage_name] < 2;
            return (
            
            <div key={enrollment._id} className="m-auto mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">
                  {enrollment.stage_name} {enrollment.academicYear}
                  {enrollment.isRepeat && " (إعادة)"}
                </h3>
                <button
                  className="bg-accent text-white px-4 py-2 rounded"
                  onClick={() => handleAdd(enrollment._id)}
                >
                  تسديد مصروفات لهذه السنة
                </button>
                <div className="space-x-2 flex justify-between items-center">
                  <div>
                     {!isGraduated && enrollment.stage_name !== "الصف الثالث" && (
                      <button
                        className="bg-primary text-white px-4 py-2 rounded"
                        onClick={() => promoteStage(enrollment.stage_name, enrollment.academicYear)}
                      >
                        الانتقال للمرحلة التالية
                      </button>
                    )}
                    {canRepeat && (
                      <button
                        className="bg-secondary text-white px-4 py-2 rounded"
                        onClick={() => createRepeatStage(enrollment.stage_name)}
                      >
                        إعادة السنة
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <ExpensesTable
                data={enrollment.payments}
                academicYear={enrollment.academicYear}
                stage_name={enrollment.stage_name}
                title={`${enrollment.stage_name} ${enrollment.academicYear}`}
                months={getMonthsForStage(enrollment.stage_name)}
                handleUpdate={handleUpdate}
                onDelete={handleDelete}
                enrollmentId={enrollment._id}
              />
            </div>
          )})
        ) : (
          <EmptyState
            title="لا يوجد تسجيلات مصروفات"
            description="ابدأ بإضافة سنة دراسية جديدة"
            actionText="إضافة سنة دراسية"
            onAction={createInitialEnrollment}
          />
        )}
      </div>

      <PaymentModel
        open={showExpModal}
        onOpenChange={handleModalClose}
        mode={modalMode}
        initialData={selectedPayment}
        onSubmit={handlePayment}
        isLoading={loading}
      />
    </>
  );
}
