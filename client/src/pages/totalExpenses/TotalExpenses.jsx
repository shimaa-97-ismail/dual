import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axioInstance } from "../../api/config";
import { ReportCard } from "../../components/card/ReportCard";
import { ExpensesReportByPeriod } from "../../components/model/ExpensesReportByPeriod";
import { ExpensesReportByIntake } from "../../components/model/ExpensesReportByIntake";

const fetchPaymentSummary = async ({ monthStart, startYear, monthEnd, endYear }) => {
  const params = new URLSearchParams({
    monthStart,
    startYear,
    monthEnd,
    endYear,
  });
  const response = await axioInstance.get(`/payments/sum-by-period?${params}`);
  return response.data; // { period, totalAmountDueReceipt1, totalAmountDueReceipt2 }
};
const fetchPaymentsByIntake = async (intake) => {
  const response = await axioInstance.get(`/payments/by-intake?intake=${intake}`);
  return response.data;
};

export function TotalExpenses() {
  const [showModalByPeriod, setShowModalByPeriod] = useState(false);
   const [showModalByIntake, setShowModalByIntake] = useState(false);
  const [periodFilter, setPeriodFilter] = useState(null); 
const [intakeFilter, setIntakeFilter] = useState(null);

   // Query for period
  const periodQuery = useQuery({
    queryKey: ["paymentSummary", periodFilter],
    queryFn: () => fetchPaymentSummary(periodFilter),
    enabled: !!periodFilter,
  });

  // Query for intake
  const intakeQuery = useQuery({
    queryKey: ["paymentsByIntake", intakeFilter],
    queryFn: () => fetchPaymentsByIntake(intakeFilter),
    enabled: !!intakeFilter,
  });

    const getDataByPeriod = (data) => {
    setPeriodFilter(data); 
    setShowModalByPeriod(false);
  };

  const getDataByIntake = (data) => {
  const newIntake = data.intake;
  setIntakeFilter(newIntake);
  if (newIntake === intakeFilter) {
    intakeQuery.refetch();
  }
  setShowModalByIntake(false);
  };

  return (
    <>
      <div className="flex justify-between gap-6 p-3 m-6">
        <ReportCard
          title={"اختار الفتره"}
          onSubmit={() => setShowModalByPeriod(true)}
        />
        <ReportCard title={"اختار الدفعه"} 
          onSubmit={() => setShowModalByIntake(true)}
         />
      </div>

      <ExpensesReportByPeriod
        open={showModalByPeriod}
        onOpenChange={setShowModalByPeriod}
        onSubmit={getDataByPeriod}
      />
       <ExpensesReportByIntake
        open={showModalByIntake}
        onOpenChange={setShowModalByIntake}
        onSubmit={getDataByIntake}
      />
   {periodFilter && (
        <div className="mx-6 mt-4 p-5 bg-white rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-3">📅 ملخص الفترة</h3>
          {periodQuery.isLoading && <div>جاري التحميل...</div>}
          {periodQuery.error && <div className="text-red-600">خطأ: {periodQuery.error.message}</div>}
          {periodQuery.data && (
            <div className="space-y-2">
              <p>الفترة: {periodFilter.monthStart} {periodFilter.startYear} → {periodFilter.monthEnd} {periodFilter.endYear}</p>
              <p> اجمالى حصة الجمعية: {periodQuery.data.totalAmountDueReceipt1}</p>
              <p>  اجمالى حصة المركز الوطنى: {periodQuery.data.totalAmountDueReceipt2}</p>
            </div>
          )}
        </div>
      )}
    {intakeFilter && (
        <div className="mx-6 mt-4 p-5 bg-white rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-3">🎓 ملخص الدفعة: {intakeFilter}</h3>
          {intakeQuery.isLoading && <div>جاري التحميل...</div>}
          {intakeQuery.error && <div className="text-red-600">خطأ: {intakeQuery.error.message}</div>}
          {intakeQuery.data && (
            <div className="space-y-2">
              <p> اجمالى حصة الجمعية: {intakeQuery.data.totalAmountDueReceipt1}</p>
              <p> اجمالى حصة المركز الوطنى: {intakeQuery.data.totalAmountDueReceipt2}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
