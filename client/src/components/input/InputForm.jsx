import React from "react";
import {Input} from "@/components/ui/input"
export function InputForm({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <Input
      id={id}
      name="stdName"
      type={type}
      value={value}
      onChange={(e) => {
        onChange(name, e.target.value);
      }}
      placeholder={placeholder}
      required={required}
    />
  );
}
