import React from "react";
import { LabelForm } from "@/components/label/Label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobField } from "../jobField/JobField";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "react-router-dom";
import { useSchoolById, useSchools } from "@/hooks/useSchools";
import { useTrainningPlaces } from "@/hooks/useTrainngPlace";

export const StudentForm = ({ value, onChange, mode }) => {
  console.log(value);
  const { schoolId } = useParams();
  const { data: allSchool } = useSchools();
  const { data: school, isLoading, isError, error, refetch } = useSchoolById(value?.school);
  const { data: trainningPlaces } = useTrainningPlaces();

  const DEFAULT_PHONES = [
    { number: "", type: "primary" },
    { number: "", type: "alternate" },
  ];

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const studentStatus = ["مستجد", "محول", "باقى(راسب)"];

  const handleFieldChange = (field, fieldValue) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      onChange(parts[0], {
        ...(value[parts[0]] || {}),
        [parts[1]]: fieldValue,
      });
    } else {
      onChange(field, fieldValue);
    }
  };

  const handlePhoneChange = (index, number) => {
    const currentPhones = Array.isArray(value.phones) ? value.phones : DEFAULT_PHONES;
    const updatedPhones = [...currentPhones];
    if (!updatedPhones[index]) {
      updatedPhones[index] = {
        number: "",
        type: index === 0 ? "primary" : "alternate",
      };
    }
    updatedPhones[index].number = number;
    onChange("phones", updatedPhones);
  };

  const handleJobSelect = (parent, jobValue) => {
    onChange(`${parent}JobTitle`, jobValue);
    onChange(`${parent}JobDetails`, "");
    onChange(`${parent}DeathCert`, null);
  };

  const handleJobDetailsChange = (parent, details) => {
    onChange(`${parent}JobDetails`, details);
  };

  const handleFileChange = (parent, file) => {
    onChange(`${parent}DeathCert`, file);
  };

  const changeSchool = (selectedId) => {
    onChange("school", selectedId);
    onChange("stdSpecial", "");
  };

  if (isLoading) return <div>بيانات المدارس بتتحمل...</div>;
  if (isError)
    return (
      <div>
        <p>حدث خطأ: {error.message}</p>
        <button onClick={() => refetch()}>إعادة المحاولة</button>
      </div>
    );

  return (
    <div className="m-2">
      {/* Personal Info */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">المعلومات الشخصية</h2>
        <div className="space-y-2 m-2 w-1/2">
          <LabelForm htmlFor="name" title="اسم الطالب" required />
          <Input
            id="name"
            value={value?.stdName || ""}
            onChange={(e) => onChange("stdName", e.target.value)}
            placeholder="أدخل اسم الطالب"
            required
          />
        </div>
        <div className="space-y-2 w-1/2 m-2">
          <LabelForm htmlFor="studID" title="رقم القومى" required />
          <Input
            id="studID"
            value={value?.studID || ""}
            onChange={(e) => onChange("studID", e.target.value)}
            placeholder="أدخل رقم القومى"
            required
          />
        </div>
        <div className="flex w-full justify-between items-center flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="stdBOD" title="تاريخ الميلاد" required />
            <Input
              id="stdBOD"
              type="date"
              value={formatDateForInput(value?.stdBOD)}
              onChange={(e) => onChange("stdBOD", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 w-1/2 mb-2">
            <LabelForm htmlFor="stdGender" title="الجنس" required />
            <RadioGroup
              className="flex"
              dir="rtl"
              value={value?.stdGender || ""}
              onValueChange={(val) => onChange("stdGender", val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ذكر" id="option-one" />
                <Label htmlFor="option-one">ذكر</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="أنثى" id="option-two" />
                <Label htmlFor="option-two">أنثى</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex w-full justify-between items-center flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="primaryPhone" title="رقم التليفون" required />
            <Input
              id="primaryPhone"
              type="text"
              value={value?.phones?.[0]?.number || ""}
              onChange={(e) => handlePhoneChange(0, e.target.value)}
              placeholder="أدخل رقم التليفون"
              required
            />
          </div>
          <div className="space-y-2 w-1/2 mt-6 m-3">
            <LabelForm htmlFor="alternatePhone" title="رقم تليفون اخر" />
            <Input
              id="alternatePhone"
              type="text"
              value={value?.phones?.[1]?.number || ""}
              onChange={(e) => handlePhoneChange(1, e.target.value)}
              placeholder="أدخل رقم تليفون بديل"
            />
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <LabelForm htmlFor="stdAddress" title="العنوان" required />
          <textarea
            name="stdAddress"
            value={value?.stdAddress || ""}
            onChange={(e) => onChange("stdAddress", e.target.value)}
            className="border"
            rows="4"
            cols="100"
          />
        </div>
      </section>

      {/* Father Info */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">المعلومات الاب</h2>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="fatherName" title="اسم الاب" required />
            <Input
              id="fatherName"
              value={value?.fatherName || ""}
              onChange={(e) => onChange("fatherName", e.target.value)}
              placeholder="أدخل اسم الاب"
              required
            />
          </div>
          <div className="space-y-2 w-1/2 m-2">
            <LabelForm htmlFor="fatherID" title="رقم القومى" required />
            <Input
              id="fatherID"
              value={value?.fatherID || ""}
              onChange={(e) => onChange("fatherID", e.target.value)}
              placeholder="أدخل رقم القومى"
              required
            />
          </div>
        </div>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="fatherPhone" title="رقم التليفون" required />
            <Input
              id="fatherPhone"
              value={value?.fatherPhone || ""}
              onChange={(e) => onChange("fatherPhone", e.target.value)}
              placeholder="أدخل رقم التليفون"
              required
            />
          </div>
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="fatherJobTitle" title="وظيفه الاب" required />
            <JobField
              label="بيانات الأب"
              jobValue={value?.fatherJobTitle}
              onJobChange={(val) => handleJobSelect("father", val)}
              detailsValue={value?.fatherJobDetails}
              onDetailsChange={(val) => handleJobDetailsChange("father", val)}
              onFileChange={(file) => handleFileChange("fatherDeathCert", file)}
            />
          </div>
        </div>
      </section>

      {/* Mother Info (similar to father) */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">المعلومات الام</h2>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="motherName" title="اسم الام" required />
            <Input
              id="motherName"
              value={value?.motherName || ""}
              onChange={(e) => onChange("motherName", e.target.value)}
              placeholder="أدخل اسم الام"
              required
            />
          </div>
          <div className="space-y-2 w-1/2 m-2">
            <LabelForm htmlFor="motherID" title="رقم القومى" required />
            <Input
              id="motherID"
              value={value?.motherID || ""}
              onChange={(e) => onChange("motherID", e.target.value)}
              placeholder="أدخل رقم القومى"
              required
            />
          </div>
        </div>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="motherPhone" title="رقم التليفون" />
            <Input
              id="motherPhone"
              value={value?.motherPhone || ""}
              onChange={(e) => onChange("motherPhone", e.target.value)}
              placeholder="أدخل رقم التليفون"
            />
          </div>
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="motherJobTitle" title="وظيفه الام" required />
            <JobField
              label="بيانات الأم"
              jobValue={value?.motherJobTitle}
              onJobChange={(val) => handleJobSelect("mother", val)}
              detailsValue={value?.motherJobDetails}
              onDetailsChange={(val) => handleJobDetailsChange("mother", val)}
              onFileChange={(file) => handleFileChange("motherDeathCert", file)}
            />
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">معلومات إضافية</h2>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="email" title="البريد الالكترونى" />
            <Input
              id="email"
              type="email"
              value={value?.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="أدخل البريد الالكترونى"
            />
          </div>
          <div className="space-y-2 w-1/2 m-2">
            <LabelForm htmlFor="password" title="رقم السرى" />
            <Input
              id="password"
              type="password"
              value={value?.password || ""}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="أدخل رقم السرى"
            />
          </div>
        </div>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="preparatorySchoolTotalScore" title="مجموع الاعدادى" required />
            <Input
              id="preparatorySchoolTotalScore"
              type="number"
              value={value?.preparatorySchoolTotalScore || ""}
              onChange={(e) => onChange("preparatorySchoolTotalScore", e.target.value)}
              placeholder="أدخل المجموع"
              required
            />
          </div>
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="code" title="الكود" />
            <Input
              id="code"
              value={value?.code || ""}
              onChange={(e) => onChange("code", e.target.value)}
              placeholder="أدخل الكود"
            />
          </div>
        </div>
      </section>

      {/* Academic Info */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">المعلومات الدراسيه</h2>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="school" title="المدرسه" required />
            <Select value={value?.school} onValueChange={changeSchool}>
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر المدرسه" />
              </SelectTrigger>
              <SelectContent>
                {allSchool?.map((sh) => (
                  <SelectItem key={sh._id} value={sh._id}>{sh.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="studStatus" title="حاله الطالب" required />
            <Select
              value={value?.studStatus || ""}
              onValueChange={(val) => onChange("studStatus", val)}
            >
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر الحاله" />
              </SelectTrigger>
              <SelectContent>
                {studentStatus.map((stat) => (
                  <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 m-2 w-1/2">
            <LabelForm htmlFor="stage_name" title="المرحله الدراسيه" required />
            <Select
              value={value?.current_stage?.stage_name || ""}
              onValueChange={(val) => handleFieldChange("current_stage.stage_name", val)}
            >
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الصف الأول">الصف الأول</SelectItem>
                <SelectItem value="الصف الثاني">الصف الثاني</SelectItem>
                <SelectItem value="الصف الثالث">الصف الثالث</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-1/2 m-2">
            <LabelForm htmlFor="stdSpecial" title="التخصص" required />
            <Select
              value={value?.stdSpecial || ""}
              onValueChange={(val) => onChange("stdSpecial", val)}
              disabled={!value?.school}
            >
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر التخصص" />
              </SelectTrigger>
              <SelectContent>
                {school?.special?.map((spec) => (
                  <SelectItem key={spec._id} value={spec._id}>{spec.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full justify-between flex-wrap lg:flex-nowrap">
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="stdTrainningPlace" title="ورشه التدريب" />
            <Select
              value={value?.stdTrainningPlace || ""}
              onValueChange={(val) => onChange("stdTrainningPlace", val)}
            >
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر الورشه" />
              </SelectTrigger>
              <SelectContent>
                {trainningPlaces?.map((trainnig) => (
                  <SelectItem key={trainnig._id} value={trainnig._id}>{trainnig.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="intake" title="الدفعه" />
            <Input
              id="intake"
              value={value?.intake || ""}
              onChange={(e) => onChange("intake", e.target.value)}
              placeholder="2025/2026"
            />
          </div>
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="graduationYear" title="سنة التخرج" />
            <Input
              id="graduationYear"
              value={value?.graduationYear || ""}
              onChange={(e) => onChange("graduationYear", e.target.value)}
              placeholder="2026"
            />
          </div>
          <div className="space-y-2 w-1/2 m-3">
            <LabelForm htmlFor="current_class" title="الفصل" />
            <Input
              id="current_class"
              value={value?.current_class || ""}
              onChange={(e) => onChange("current_class", e.target.value)}
              placeholder="1/2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};