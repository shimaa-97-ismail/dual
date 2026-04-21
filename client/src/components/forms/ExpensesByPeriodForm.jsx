import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ExpensesByPeriodForm({ data, onChange, errors = {} }) {
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
  return (
    <div className="grid gap-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center w-full mb-3">
          <label htmlFor="month" className="text-right" required>
             البداية 
          </label>
          <div class="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-3">
            <select
              value={data?.monthStart || ""}
              onChange={(e) => onChange("monthStart", e.target.value)}
              required
             className="border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:border-blue-400 w-full md:w-1/2"
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
            <input
              type="number"
              name="startYear"
              value={data.startYear || ""}
              id="startYear"
              required
              className="border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:border-blue-400 w-full md:w-1/2"
            onChange={(e) => onChange("startYear", e.target.value)}
              placeholder="السنة"
            />
          </div>
        </div>
        {errors.month && <p className="text-sm text-red-600">{errors.month}</p>}
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center w-full mb-3">
          <label htmlFor="monthEnd" className="text-right" required>
             النهاية 
          </label>
          <div class="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-3">
            <select
              value={data?.monthEnd || ""}
              onChange={(e) => onChange("monthEnd", e.target.value)}
              required
             className="border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:border-blue-400 w-full md:w-1/2"
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
            <input
                value={data.endYear || ""}
              type="number"
              id="endYear"
              name="endYear"
            onChange={(e) => onChange("endYear", e.target.value)}
              required
              className="border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:border-blue-400 w-full md:w-1/2"
              step="1"
              placeholder="السنة"
            />
          </div>
        </div>
        {errors.month && <p className="text-sm text-red-600">{errors.month}</p>}
      </div>
    </div>
  );
}
