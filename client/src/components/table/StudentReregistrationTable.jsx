import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "./table.css";
export function StudentReregistrationTable({ isRegister, applicant, student }) {
  console.log(student);

  return (
    <Table style={{ width: "70%" }}>
      <TableBody>
        <TableRow className="bg-gray-100 h-9 p-3">
          <TableHeader className=" ">
            <TableHead className="textRight font-bold text-xl">
              أولا:مقدم الطلب
            </TableHead>
          </TableHeader>
        </TableRow>
        <TableRow>
          <TableHead className="textRight ">اسم مقدم الطلب رباعى</TableHead>
          <TableCell className="">{applicant?.applicantName}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">الوظيفة</TableHead>
          <TableCell>{applicant?.job}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">الرقم القومى</TableHead>
          <TableCell>{applicant?.ID}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">رقم الهاتف</TableHead>
          <TableCell>{applicant?.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">العنوان</TableHead>
          <TableCell>{applicant?.address}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">الصفة بالطالب</TableHead>
          <TableCell className="textRight">
            {applicant?.relationshipWithStudent}
          </TableCell>
        </TableRow>
        {/* <TableRow>
          <TableHead className="textRight">اسم مقدم الطلب رباعى</TableHead>
          <TableCell></TableCell>
        </TableRow> */}
        <TableRow className="bg-gray-100 h-9 p-3 print:color-adjust-exact">
          <TableHeader className="font-bold text-xl ">
            <TableHead className="textRight font-bold text-xl">
              ثانيا : بيانات الطالب
            </TableHead>
          </TableHeader>
        </TableRow>

        <TableRow>
          <TableHead className="textRight">اسم الطالب</TableHead>
          <TableCell>{student?.stdName}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">حالة الطالب</TableHead>
          <TableCell>{student?.studStatus}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight"> الرقم القومى</TableHead>
          <TableCell>{student?.studID}</TableCell>
        </TableRow>
        {/* /// */}
        {!isRegister && (
          <>
            <TableRow>
              <TableHead className="textRight"> رقم الهاتف</TableHead>
              <TableCell>
                {student.phones?.map((phone, index) => (
                  <React.Fragment key={index}>
                    {phone.number}
                    {index < student.phones.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">التخصص</TableHead>
              <TableCell>{student.stdSpecial?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">الصف</TableHead>
              <TableCell>{student.current_stage?.stage_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">سنة التخرج</TableHead>
              <TableCell></TableCell>
            </TableRow>
          </>
        )}
        {isRegister && (
          <>
            <TableRow>
              <TableHead className="textRight"> العام الدراسى</TableHead>
              <TableCell>{student?.intake}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">الصف الدراسى</TableHead>
              <TableCell>{student?.current_stage?.stage_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">القسم التخصصي</TableHead>
              <TableCell>{student?.stdSpecial?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight"> المدرسه الملتحق بها</TableHead>
              <TableCell>{student?.school?.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="textRight"> رقم الهاتف</TableHead>
              <TableCell>{student?.phones?.[0].number}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="textRight">
                سبب التقديم لاعادة القيد
              </TableHead>
              <TableCell>
                {isRegister ? "الرغبه فى العودة للدراسة" : ""}
              </TableCell>
            </TableRow>
          </>
        )}
        <TableRow className="bg-gray-100  h-9 p-3">
          <TableHeader className="font-bold text-xl text-black! ">
            <TableHead className="textRight font-bold text-xl">
              ثالثا: بيانات المدرسة
            </TableHead>
          </TableHeader>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">اسم المدرسة</TableHead>
          <TableCell>{student.school?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="textRight">العنوان</TableHead>
          <TableCell>{student.school?.address}</TableCell>
        </TableRow>
        <TableRow className="bg-gray-100 h-9 p-3 print:bg-gray-100 print:block">
          <TableHeader className="font-bold text-xl  text-black!  print:text-black! print:font-bold">
            <TableHead className="textRight font-bold text-xl">
              رابعا :الطلب
            </TableHead>
          </TableHeader>
        </TableRow>
      </TableBody>
    </Table>
  );
}
