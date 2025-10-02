import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@components/common";
import { COLORS } from "@constants/colors";
import { SPACING, TYPOGRAPHY } from "@constants/theme";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  rules?: any;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  disabled?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  maxLength?: number;
  required?: boolean;
  helperText?: string;
}

export const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  autoCapitalize = "sentences",
  autoCorrect = true,
  maxLength,
  required = false,
  helperText,
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Input
            label={label}
            placeholder={placeholder}
            value={value || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            onRightIconPress={onRightIconPress}
            disabled={disabled}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            maxLength={maxLength}
            required={required}
          />
          {helperText && !error && (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
