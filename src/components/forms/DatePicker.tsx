import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@components/common";
import { COLORS } from "@constants/colors";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@constants/theme";
import { formatDate } from "@utils/index";

interface DatePickerProps {
  label?: string;
  value?: Date;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  format?: "short" | "long" | "datetime";
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onDateChange,
  placeholder = "Chọn ngày",
  error,
  disabled = false,
  required = false,
  mode = "date",
  minimumDate,
  maximumDate,
  format = "short",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === "android") {
        onDateChange(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onDateChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  const getDisplayText = () => {
    if (value) {
      return formatDate(value, format);
    }
    return placeholder;
  };

  const getContainerStyle = () => {
    return [
      styles.container,
      {
        borderColor: error
          ? COLORS.action.coralRed
          : COLORS.border.light,
        backgroundColor: disabled 
          ? COLORS.background.flashWhite 
          : COLORS.background.white,
      },
    ];
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={getContainerStyle()}
        onPress={handlePress}
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
            {getDisplayText()}
          </Text>
          <Ionicons
            name="calendar"
            size={20}
            color={disabled ? COLORS.neutral.mountainMist : COLORS.neutral.mountainMist}
          />
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {Platform.OS === "ios" ? (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Button
                  title="Hủy"
                  variant="ghost"
                  onPress={handleCancel}
                  style={styles.modalButton}
                />
                <Text style={styles.modalTitle}>
                  {mode === "date" ? "Chọn ngày" : mode === "time" ? "Chọn giờ" : "Chọn ngày giờ"}
                </Text>
                <Button
                  title="Xong"
                  variant="ghost"
                  onPress={handleConfirm}
                  style={styles.modalButton}
                />
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
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
    paddingBottom: SPACING.xl,
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
  modalButton: {
    paddingHorizontal: 0,
    minWidth: 60,
  },
  picker: {
    backgroundColor: COLORS.background.white,
  },
});
