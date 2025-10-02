import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { COLORS } from "@constants/colors";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@constants/theme";

interface AlertProps {
  visible: boolean;
  type?: "warning" | "success" | "error" | "info";
  title: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

export const Alert: React.FC<AlertProps> = ({
  visible,
  type = "info",
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  showCloseButton = true,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case "warning":
      case "error":
        return {
          name: "alert-circle" as keyof typeof Ionicons.glyphMap,
          backgroundColor: COLORS.action.coralRed,
          color: COLORS.white,
        };
      case "success":
        return {
          name: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
          backgroundColor: COLORS.action.lima,
          color: COLORS.white,
        };
      case "info":
      default:
        return {
          name: "information-circle" as keyof typeof Ionicons.glyphMap,
          backgroundColor: COLORS.action.azureRadiance,
          color: COLORS.white,
        };
    }
  };

  const iconConfig = getIconConfig();

  const handleBackdropPress = () => {
    if (showCloseButton && onClose) {
      onClose();
    }
  };

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />

        <View style={styles.alertContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconConfig.backgroundColor },
            ]}
          >
            <Ionicons
              name={iconConfig.name}
              size={32}
              color={iconConfig.color}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {secondaryButtonText && (
              <Button
                title={secondaryButtonText}
                variant="outline"
                onPress={handleSecondaryPress}
                style={
                  [
                    styles.button,
                    primaryButtonText
                      ? styles.secondaryButton
                      : styles.fullButton,
                  ] as any
                }
              />
            )}

            {primaryButtonText && (
              <Button
                title={primaryButtonText}
                variant={
                  type === "error" || type === "warning" ? "danger" : "primary"
                }
                onPress={handlePrimaryPress}
                style={
                  [
                    styles.button,
                    secondaryButtonText
                      ? styles.primaryButton
                      : styles.fullButton,
                  ] as any
                }
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alertContainer: {
    backgroundColor: COLORS.background.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING["3xl"],
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    alignItems: "center",
    maxWidth: screenWidth - SPACING.xl * 2,
    minWidth: 280,
    shadowColor: COLORS.neutral.bastille,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  content: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: SPACING.md,
  },
  button: {
    minHeight: 48,
  },
  fullButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
});
