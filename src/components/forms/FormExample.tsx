import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, FormDatePicker, FormSelect } from "./index";
import { Button } from "@components/common";
import { SPACING } from "@constants/theme";
import { schemas } from "@utils/validation";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@constants/index";

interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  accountId?: string;
}

export const FormExample: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: yupResolver(schemas.transaction),
    defaultValues: {
      type: "expense",
      amount: 0,
      categoryId: "",
      description: "",
      date: new Date().toISOString(),
    },
  });

  const transactionType = watch("type");

  const categoryOptions = (
    transactionType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  ).map((category) => ({
    label: category.name,
    value: category.id,
    icon: category.icon,
  }));

  const typeOptions = [
    { label: "Thu nhập", value: "income", icon: "arrow-up", color: "#84CC16" },
    {
      label: "Chi tiêu",
      value: "expense",
      icon: "arrow-down",
      color: "#FF3B30",
    },
  ];

  const onSubmit = (data: TransactionFormData) => {
    console.log("Form data:", data);
    Alert.alert("Thành công", "Giao dịch đã được tạo thành công!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FormSelect
        control={control}
        name="type"
        label="Loại giao dịch"
        placeholder="Chọn loại giao dịch"
        options={typeOptions}
        required
      />

      <FormField
        control={control}
        name="amount"
        label="Số tiền"
        placeholder="Nhập số tiền"
        keyboardType="numeric"
        leftIcon="cash"
        required
        rules={{
          required: "Số tiền là bắt buộc",
          min: { value: 1, message: "Số tiền phải lớn hơn 0" },
        }}
      />

      <FormSelect
        control={control}
        name="categoryId"
        label="Danh mục"
        placeholder="Chọn danh mục"
        options={categoryOptions}
        required
        searchable
      />

      <FormField
        control={control}
        name="description"
        label="Mô tả"
        placeholder="Nhập mô tả giao dịch"
        multiline
        numberOfLines={3}
        maxLength={500}
        helperText="Tối đa 500 ký tự"
      />

      <FormDatePicker
        control={control}
        name="date"
        label="Ngày giao dịch"
        placeholder="Chọn ngày"
        required
        maximumDate={new Date()}
      />

      <Button
        title="Tạo giao dịch"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});
