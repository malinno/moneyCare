import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@components/common";
import { COLORS } from "@constants/colors";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@constants/theme";

interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  rules?: any;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

export const FormSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Chọn một tùy chọn",
  options,
  rules,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
}: FormSelectProps<T>) => {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const getDisplayText = (value: any) => {
    if (!value) return placeholder;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find((opt) => opt.value === value[0]);
        return option?.label || placeholder;
      }
      return `${value.length} mục đã chọn`;
    }

    const option = options.find((opt) => opt.value === value);
    return option?.label || placeholder;
  };

  const getContainerStyle = (error?: string) => {
    return [
      styles.container,
      {
        borderColor: error ? COLORS.action.coralRed : COLORS.border.light,
        backgroundColor: disabled
          ? COLORS.background.flashWhite
          : COLORS.background.white,
      },
    ];
  };

  const handleSelect = (
    option: SelectOption,
    currentValue: any,
    onChange: (value: any) => void
  ) => {
    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentArray.includes(option.value);

      if (isSelected) {
        onChange(currentArray.filter((val) => val !== option.value));
      } else {
        onChange([...currentArray, option.value]);
      }
    } else {
      onChange(option.value);
      setShowModal(false);
    }
  };

  const isSelected = (option: SelectOption, value: any) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(option.value);
    }
    return value === option.value;
  };

  const renderOption = (
    option: SelectOption,
    value: any,
    onChange: (value: any) => void
  ) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.option,
        isSelected(option, value) && styles.selectedOption,
      ]}
      onPress={() => handleSelect(option, value, onChange)}
    >
      <View style={styles.optionContent}>
        {option.icon && (
          <Ionicons
            name={option.icon as any}
            size={20}
            color={option.color || COLORS.text.primary}
            style={styles.optionIcon}
          />
        )}
        <Text
          style={[
            styles.optionText,
            isSelected(option, value) && styles.selectedOptionText,
          ]}
        >
          {option.label}
        </Text>
      </View>
      {isSelected(option, value) && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary[500]} />
      )}
    </TouchableOpacity>
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {label && (
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          )}

          <TouchableOpacity
            style={getContainerStyle(error?.message)}
            onPress={() => !disabled && setShowModal(true)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View style={styles.content}>
              <Text
                style={[
                  styles.text,
                  {
                    color: value
                      ? COLORS.text.primary
                      : COLORS.text.placeholder,
                  },
                ]}
              >
                {getDisplayText(value)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.neutral.mountainMist}
              />
            </View>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error.message}</Text>}

          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {label || "Chọn tùy chọn"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={COLORS.text.primary}
                    />
                  </TouchableOpacity>
                </View>

                {searchable && (
                  <View style={styles.searchContainer}>
                    <Ionicons
                      name="search"
                      size={20}
                      color={COLORS.neutral.mountainMist}
                      style={styles.searchIcon}
                    />
                    <Text
                      style={styles.searchInput}
                      onChangeText={setSearchText}
                    >
                      {searchText}
                    </Text>
                  </View>
                )}

                <ScrollView style={styles.optionsList}>
                  {filteredOptions.map((option) =>
                    renderOption(option, value, onChange)
                  )}
                </ScrollView>

                {multiple && (
                  <View style={styles.modalFooter}>
                    <Button
                      title="Xong"
                      onPress={() => setShowModal(false)}
                      style={styles.doneButton}
                    />
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.action.coralRed,
  },
  container: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.base,
    flex: 1,
  },
  error: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.action.coralRed,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background.flashWhite,
    borderRadius: BORDER_RADIUS.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  selectedOption: {
    backgroundColor: COLORS.primary[50] || `${COLORS.primary[500]}10`,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    marginRight: SPACING.sm,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  selectedOptionText: {
    color: COLORS.primary[500],
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  doneButton: {
    width: "100%",
  },
});
