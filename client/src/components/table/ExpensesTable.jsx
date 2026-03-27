import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";

export function ExpensesTable({
  data,
  // academicYear,    // not used in this version, but kept for compatibility
  title,
  months,
  handleUpdate,
  onDelete,
  enrollmentId,    // <-- new prop
}) {
  return (
    <Table className="border-collapse border border-gray-300">
      <TableHeader>
        <TableRow>
          <TableHead
            colSpan={3}
            className="border border-gray-300 w-[50px] font-bold text-lg text-center text-primary"
          >
            {title}
          </TableHead>
          <TableHead className="customBorder font-bold text-lg text-center text-primary">
            القيمة
          </TableHead>
          <TableHead className="customBorder font-bold text-lg text-center text-primary">
            إجمالي المسدد
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableHeader>
        <TableRow>
          <TableHead className="customBorder">الشهر</TableHead>
          <TableHead className="customBorder">العام</TableHead>
          <TableHead className="customBorder">القيمة</TableHead>
          <TableHead className="customBorder">رقم الايصال</TableHead>
          <TableHead className="customBorder">رقم الايصال</TableHead>
          <TableHead className="customBorder">التاريخ</TableHead>
          <TableHead className="customBorder">تعديل</TableHead>
          <TableHead className="customBorder">حذف</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {months.map((month) => {
          const payment = data?.find((p) => p.month === month);
          const hasPayment = Boolean(payment);

          return (
            <TableRow key={month}>
              <TableCell className="customBorder">{month}</TableCell>
              <TableCell className="customBorder">{payment?.year}</TableCell>
              <TableCell className="customBorder">{payment?.amountDue}</TableCell>
              <TableCell className="customBorder">{payment?.receipt1}</TableCell>
              <TableCell className="customBorder">{payment?.receipt2}</TableCell>
              <TableCell className="customBorder">
                {payment?.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString("ar-EG")
                  : ""}
              </TableCell>

              {/* Edit cell */}
              <TableCell className="customBorder">
                <div className="flex justify-center">
                  {hasPayment ? (
                    <button onClick={() => handleUpdate(enrollmentId, payment._id)}>
                      <SquarePen size={20} color="#b3ca24" />
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </TableCell>

              {/* Delete cell */}
              <TableCell className="customBorder">
                <div className="flex justify-center">
                  {hasPayment ? (
                    <button onClick={() => onDelete(enrollmentId, payment._id)}>
                      <Trash2 size={20} color="#831e2e" />
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}