import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { DatePicker } from "./DatePicker";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  rules?: any;
  disabled?: boolean;
  required?: boolean;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  format?: "short" | "long" | "datetime";
}

export const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  disabled = false,
  required = false,
  mode = "date",
  minimumDate,
  maximumDate,
  format = "short",
}: FormDatePickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={value ? new Date(value) : undefined}
          onDateChange={(date) => onChange(date.toISOString())}
          placeholder={placeholder}
          error={error?.message}
          disabled={disabled}
          required={required}
          mode={mode}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          format={format}
        />
      )}
    />
  );
};
