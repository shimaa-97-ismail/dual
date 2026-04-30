import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IntakeInput } from "../intakesInput/IntakeInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import "./form.css";
export function SchoolForm({
  data,
  onChange,
  depatementsData,
  typesOfSchools,
  specials,
  errors = {},
}) {

  return (
    <div className=" grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scrollable-form-wrapper">
        {/* اسم المدرسة */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">
            اسم المدرسة <span className="text-red-600">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={data.name}
            onChange={(e) => {
              onChange("name", e.target.value);
            }}
            placeholder="أدخل اسم المدرسة"
            required
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          {/* {!data?._id && <span className="inline text-red-700">*</span>} */}
        </div>

        {/* نوع المدرسة */}
        <div className="space-y-2  md:col-span-2">
          <Label htmlFor="type">
            نوع المدرسة<span className="text-red-600">*</span>
          </Label>
          <div className="flex items-center gap-2 ">
            {data.type && (
              <p className="text-sm text-gray-700">
                النوع الحالي:{" "}
                <span className="font-medium">{data.type.name}</span>
              </p>
            )}
            {typesOfSchools?.length > 0 ? (
              <Select
                value={data.type }
                onValueChange={(value) => onChange("type", value)}
              >
                <SelectTrigger className="text-black!">
                  <SelectValue placeholder={` اختر النوع`} />
                </SelectTrigger>
                <SelectContent>
                  {typesOfSchools?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500">جاري تحميل الإدارات...</p>
            )}
          </div>

          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        {/* اسم المدير */}
        <div className="space-y-2 ">
          <Label htmlFor="managerName">اسم المدير</Label>
          <Input
            id="managerName"
            name="managerName"
            value={data.managerName}
            onChange={(e) => onChange("managerName", e.target.value)}
            placeholder="أدخل اسم مدير المدرسة"
          />
          {errors.managerName && (
            <p className="text-sm text-red-600">{errors.managerName}</p>
          )}
        </div>

        {/* الهاتف */}
        <div className="space-y-2">
          <Label htmlFor="phone">الهاتف</Label>
          <Input
            id="phone"
            name="phone"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="أدخل رقم الهاتف"
            type="tel"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/*  شئون الطلابه */}
        <div className="space-y-2">
          <Label htmlFor="studentAffairs"> شئون الطلابه</Label>
          <Input
            id="studentAffairs"
            name="studentAffairs"
            value={data.studentAffairs}
            onChange={(e) => onChange("studentAffairs", e.target.value)}
            placeholder="شئون الطلابه"
          />
          {errors.studentAffairs && (
            <p className="text-sm text-red-600">{errors.studentAffairs}</p>
          )}
        </div>
        {/* الهاتف */}
        <div className="space-y-2">
          <Label htmlFor="studentAffairsPhone">هاتف شئون الطلابه</Label>
          <Input
            id="studentAffairsPhone"
            name="studentAffairsPhone"
            value={data.studentAffairsPhone}
            onChange={(e) => onChange("studentAffairsPhone", e.target.value)}
            placeholder="أدخل رقم الهاتف"
            type="tel"
          />
          {errors.studentAffairsPhone && (
            <p className="text-sm text-red-600">{errors.studentAffairsPhone}</p>
          )}
        </div>

        {/* العنوان */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">
            العنوان<span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="أدخل العنوان الكامل"
            rows={2}
            required
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value || null)}
            placeholder="أدخل البريد الإلكتروني"
            type="email"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* الإدارة التابعة */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="departement">
            الإدارة التابعة<span className="text-red-600">*</span>
          </Label>
          <div className="flex items-center gap-2 ">
            {data.departement && (
              <p className="text-sm text-gray-700">
                الإدارة الحالية:{" "}
                <span className="font-medium">{data.departement.name}</span>
              </p>
            )}
            <Select
              value={data.departement}
              onValueChange={(value) => onChange("departement", value)}
            >
              <SelectTrigger className="text-black!">
                <SelectValue placeholder="اختر الإدارة" />
              </SelectTrigger>
              <SelectContent>
                {/* عرض الأقسام المصفاة فقط */}
                {depatementsData?.length > 0 ? (
                  depatementsData?.map((dept) => (
                    <SelectItem
                      key={dept._id}
                      value={dept._id}
                      disabled={!dept._id || dept._id.toString().trim() === ""}
                    >
                      {dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    لا توجد إدارات متاحة
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {errors.departement && (
            <p className="text-sm text-red-600">{errors.departement}</p>
          )}
          {/* {data.departement === "" && (
            <p className="text-sm text-red-500">يرجى اختيار الإدارة التابعة</p>
          )} */}
        </div>

<div className="md:col-span-2">
        <IntakeInput value={data && data.intakes} onChange={onChange} />

</div>

        {/* التخصصات */}
   <div className="space-y-3 w-100">
  <Label>التخصصات المتاحة</Label>
  {specials?.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-lg">
      {specials.map((special) => (
        <div key={special._id} className="flex items-center space-x-2">
          <Checkbox
            id={`special-${special._id}`}
            checked={data.special?.includes(special._id) || false}
            onCheckedChange={() => onChange("special", special._id)}
            disabled={!special._id || special._id.toString().trim() === ""}
          />
          <label
            htmlFor={`special-${special._id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {special.name}
          </label>
        </div>
      ))}
    </div>
  ) : (
    <div className="p-4 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-500 text-center">
        لا توجد تخصصات متاحة. تأكد من اتصال الخادم أو استخدم بيانات افتراضية.
      </p>
    </div>
  )}
</div>
      </div>
    </div>
  );
}
