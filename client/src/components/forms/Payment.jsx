import React from "react";
import { LabelForm } from "@/components/label/Label";
import { Input } from "@/components/ui/input";

export function PaymentForm({ data, onChange, errors = {} }) {
  const monthsArabic = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  // inside PaymentForm
const handleYearChange = (e) => {
  let value = e.target.value;
  // Remove non‑digit characters
  value = value.replace(/\D/g, '');
  // Limit to 4 digits
  if (value.length > 4) value = value.slice(0, 4);
  onChange('year', value);
};

const handleReceiptChange = (field) => (e) => {
  let value = e.target.value;
  // Remove non‑digit characters
  value = value.replace(/\D/g, '');
  onChange(field, value);
};

  return (
    <>
      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center mb-3">
          <LabelForm
            htmlFor="academicYearForPayment"
            className="text-right"
            required={true}
            title={"العام الدراسى"}
          />
          <select
            value={data?.academicyearForPayment || ""}
            onChange={(e) => onChange("academicyearForPayment", e.target.value)}
            required
            className="border p-2 rounded col-span-4 w-70"
          >
            <option value="" disabled>
              اختر السنة
            </option>
            <option value="first">العام الدراسي الأول</option>
            <option value="second">العام الدراسي الثاني</option>
            <option value="third">العام الدراسي الثالث</option>
          </select>
        </div>
        {errors.academicyearForPayment && (
          <p className="text-sm text-red-600">{errors.academicyearForPayment}</p>
        )}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center mb-3">
          <LabelForm
            htmlFor="year"
            className="text-right"
            required={true}
            title={"السنة"}
          />
          <Input
            id="year"
            value={data?.year || ""}
            name="year"
           type="text"
             onChange={handleYearChange}
            className="col-span-3"
            required
               placeholder="مثال: 2024"
          />
        </div>
        {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center w-full mb-3">
          <LabelForm
            htmlFor="month"
            title={"شهر"}
            className="text-right"
            required={true}
          />
          <select
            value={data?.month || ""}
            onChange={(e) => onChange("month", e.target.value)}
            required
            className="border p-2 rounded col-span-4 w-70"
          >
            <option value="" disabled>
              اختر الشهر
            </option>
            {monthsArabic.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        {errors.month && <p className="text-sm text-red-600">{errors.month}</p>}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center mb-3">
          <LabelForm
            htmlFor="amountDue"
            className="text-right"
            title={"القيمه"}
            required={true}
          />
          <Input
            id="amountDue"
            value={data?.amountDue || ""}
            name="amountDue"
            type="number"
            onChange={(e) => onChange("amountDue", e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        {errors.amountDue && <p className="text-sm text-red-600">{errors.amountDue}</p>}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center mb-3">
          <LabelForm
            htmlFor="paymentDate"
            required={true}
            title={"التاريخ"}
            className="text-right"
          />
          <Input
            id="paymentDate"
            value={data?.paymentDate || ""}
            name="paymentDate"
            type="date"
            onChange={(e) => onChange("paymentDate", e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        {errors.paymentDate && <p className="text-sm text-red-600">{errors.paymentDate}</p>}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center mb-3">
          <LabelForm
            htmlFor="receipt1"
            title={"رقم الايصال 1"}
            required={true}
            className="text-right"
          />
          <Input
            id="receipt1"
            value={data?.receipt1 || ""}
            name="receipt1"
            type="text"
            onChange={handleReceiptChange("receipt1")}
            className="col-span-3"
            required
          />
        </div>
        {errors.receipt1 && <p className="text-sm text-red-600">{errors.receipt1}</p>}
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-5 items-center">
          <LabelForm
            htmlFor="receipt2"
            title={"رقم الايصال 2"}
            required={true}
            className="text-right"
          />
          <Input
            id="receipt2"
            value={data?.receipt2 || ""}
            name="receipt2"
            type="text"
             onChange={handleReceiptChange("receipt2")}
            className="col-span-3"
            required
          />
        </div>
        {errors.receipt2 && <p className="text-sm text-red-600">{errors.receipt2}</p>}
      </div>
    </>
  );
}