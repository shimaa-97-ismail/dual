import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function UserForm({ data, onChange, errors = {},mode }) {
  console.log(data);
  
  const roles = [
  { value: 'admin', label: 'مسؤول النظام' },
  // { value: 'supervisor', label: 'مسؤول بيانات' },
  { value: 'manager', label: 'مسؤول بيانات' }
];
  return (
    <div className=" gap-4">
      <div className="flex   items-center gap-4 text-black">
        <Label htmlFor="username" className="text-right">
          اسم المستخدم
        </Label>
        <div className="flex flex-col pr-2">
          <input
            id="username"
            name="username"
            type="text"
            value={data.username || ""}
            onChange={(e) => onChange("username", e.target.value)}
            className="border w-75 rounded p-2"
            required
          />
          {errors.username && (
            <span className="text-red-600 text-sm mt-1">{errors.username}</span>
          )}
        </div>
        {!data?._id && <span className="text-red-700">*</span>}
      </div>
      <div className=" flex gap-4 my-5">
        <Label htmlFor="email" className="text-right">
          البريد الالكترونى
        </Label>
        <div className=" flex flex-col ">
          <Input
            id="email"
            value={data.email}
            name="email"
            type="email"
            onChange={(e) => onChange("email", e.target.value)}
            className="border w-75 rounded p-2"
          />
          {errors.email && (
            <span className="text-red-600 text-sm mt-1">{errors.email}</span>
          )}
        </div>
        {!data?._id && <span className="text-red-700">*</span>}

      </div>
   {mode!=="edit" &&  <div className="flex gap-4">
        <Label htmlFor="password" className="text-right">
          الرقم السرى
        </Label>
        <div className="col-span-3 flex flex-col ">
          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            className="border w-75 rounded mr-6"
          />
          {errors.password && (
            <span className="text-red-600 text-sm mt-1">{errors.password}</span>
          )}
        </div>
        {!data?._id && <span className="text-red-700">*</span>}

      </div>}  
   
      <div className="space-y-2 flex ">
        <Label htmlFor="role" >
          اختر الدور
        </Label>
        <div className="flex items-center gap-2 p-3 mr-10">
          {data.role && (
            <p className="text-sm text-gray-700">
              النوع الحالي: <span className="font-medium">{data.role}</span>
            </p>
          )}

          <Select
            value={data.role}
            onValueChange={(value) => onChange("role", value)}
          >
            <SelectTrigger className="text-black!">
              <SelectValue placeholder={` اختر الدور`} />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
         {!data?._id && <span className="text-red-700 mt-7">*</span>}

      </div>
    </div>
  );
}
