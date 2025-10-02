# Form Components

Hệ thống form components được thiết kế để tạo ra các form validation mạnh mẽ và dễ sử dụng trong ứng dụng MoneyCare.

## Components

### 1. FormField

Component input field với validation tích hợp sẵn.

```tsx
import { FormField } from "@components/forms";

<FormField
  control={control}
  name="email"
  label="Email"
  placeholder="Nhập email của bạn"
  keyboardType="email-address"
  leftIcon="mail"
  required
  rules={{
    required: "Email là bắt buộc",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Email không hợp lệ",
    },
  }}
/>;
```

**Props:**

- `control` - React Hook Form control
- `name` - Field name
- `label` - Label text
- `placeholder` - Placeholder text
- `rules` - Validation rules
- `keyboardType` - Keyboard type
- `secureTextEntry` - Password field
- `multiline` - Multiline input
- `leftIcon/rightIcon` - Icons
- `required` - Required field indicator
- `helperText` - Helper text below input

### 2. FormDatePicker

Component chọn ngày với validation.

```tsx
import { FormDatePicker } from "@components/forms";

<FormDatePicker
  control={control}
  name="date"
  label="Ngày giao dịch"
  placeholder="Chọn ngày"
  mode="date"
  maximumDate={new Date()}
  required
/>;
```

**Props:**

- `control` - React Hook Form control
- `name` - Field name
- `label` - Label text
- `mode` - "date" | "time" | "datetime"
- `minimumDate/maximumDate` - Date constraints
- `format` - Display format
- `required` - Required field indicator

### 3. FormSelect

Component dropdown select với search và multi-select.

```tsx
import { FormSelect } from "@components/forms";

const options = [
  { label: "Thu nhập", value: "income", icon: "arrow-up", color: "#84CC16" },
  { label: "Chi tiêu", value: "expense", icon: "arrow-down", color: "#FF3B30" },
];

<FormSelect
  control={control}
  name="type"
  label="Loại giao dịch"
  options={options}
  searchable
  required
/>;
```

**Props:**

- `control` - React Hook Form control
- `name` - Field name
- `options` - Array of options
- `searchable` - Enable search
- `multiple` - Multi-select mode
- `required` - Required field indicator

### 4. DatePicker (Standalone)

Component chọn ngày độc lập, không cần form.

```tsx
import { DatePicker } from "@components/forms";

<DatePicker
  label="Ngày sinh"
  value={selectedDate}
  onDateChange={setSelectedDate}
  mode="date"
  maximumDate={new Date()}
/>;
```

## Validation System

### Pre-built Validation Rules

```tsx
import { validationRules } from "@utils/validation";

// Sử dụng validation rules
const rules = {
  email: validationRules.email(),
  password: validationRules.password(8),
  amount: validationRules.amount(1, 1000000),
  phone: validationRules.phone(),
  required: validationRules.required("Trường này bắt buộc"),
};
```

### Pre-built Schemas

```tsx
import { schemas } from "@utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";

// Sử dụng schema có sẵn
const { control, handleSubmit } = useForm({
  resolver: yupResolver(schemas.transaction),
});
```

**Available Schemas:**

- `schemas.login` - Form đăng nhập
- `schemas.register` - Form đăng ký
- `schemas.transaction` - Form giao dịch
- `schemas.budget` - Form ngân sách
- `schemas.profile` - Form hồ sơ
- `schemas.changePassword` - Form đổi mật khẩu

### Custom Validation

```tsx
import * as yup from "yup";

const customSchema = yup.object().shape({
  customField: yup
    .string()
    .required("Bắt buộc")
    .min(5, "Tối thiểu 5 ký tự")
    .max(50, "Tối đa 50 ký tự"),
});
```

## Complete Form Example

```tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, FormDatePicker, FormSelect } from "@components/forms";
import { Button } from "@components/common";
import { schemas } from "@utils/validation";

interface FormData {
  type: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
}

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemas.transaction),
    defaultValues: {
      type: "",
      amount: 0,
      categoryId: "",
      description: "",
      date: new Date().toISOString(),
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const typeOptions = [
    { label: "Thu nhập", value: "income" },
    { label: "Chi tiêu", value: "expense" },
  ];

  return (
    <View>
      <FormSelect
        control={control}
        name="type"
        label="Loại giao dịch"
        options={typeOptions}
        required
      />

      <FormField
        control={control}
        name="amount"
        label="Số tiền"
        keyboardType="numeric"
        required
      />

      <FormField
        control={control}
        name="description"
        label="Mô tả"
        multiline
        numberOfLines={3}
      />

      <FormDatePicker control={control} name="date" label="Ngày" required />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
```

## Features

### ✅ Form Validation

- React Hook Form integration
- Yup schema validation
- Real-time validation
- Custom validation rules
- Error handling

### ✅ Date Picker

- iOS/Android native pickers
- Date, time, datetime modes
- Min/max date constraints
- Custom formatting
- Modal presentation on iOS

### ✅ Select Component

- Single/multi-select
- Search functionality
- Icon support
- Custom styling
- Modal presentation

### ✅ Field Components

- All Input component features
- Validation integration
- Helper text support
- Required field indicators
- Error state handling

### ✅ Accessibility

- Screen reader support
- Proper labeling
- Focus management
- Touch target sizes

### ✅ Styling

- Design system integration
- Consistent theming
- Dark mode support
- Responsive design

## Validation Rules Available

- `required(message?)` - Required field
- `email(message?)` - Email validation
- `password(minLength?, message?)` - Password with complexity
- `confirmPassword(message?)` - Password confirmation
- `phone(message?)` - Phone number
- `number(min?, max?, message?)` - Number validation
- `positiveNumber(message?)` - Positive numbers only
- `amount(min?, max?, message?)` - Money amount
- `date(message?)` - Date validation
- `dateRange(start?, end?, message?)` - Date range
- `select(message?)` - Select validation
- `multiSelect(minItems?, message?)` - Multi-select
- `url(message?)` - URL validation
- `minLength(length, message?)` - Minimum length
- `maxLength(length, message?)` - Maximum length
- `alphanumeric(message?)` - Letters and numbers only
- `noSpecialChars(message?)` - No special characters

## Best Practices

1. **Use TypeScript interfaces** for form data
2. **Use pre-built schemas** when possible
3. **Provide helpful error messages** in Vietnamese
4. **Use appropriate keyboard types** for better UX
5. **Add helper text** for complex fields
6. **Test validation** on both success and error cases
7. **Handle loading states** during form submission
