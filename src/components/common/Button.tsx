import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from "@constants/theme";
import { COLORS } from "@constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[size],
      ...(fullWidth && styles.fullWidth),
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? COLORS.neutral.spunPearl
            : COLORS.primary[500],
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? COLORS.divider.silverSand
            : COLORS.action.lima,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled
            ? COLORS.neutral.spunPearl
            : COLORS.primary[500],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? COLORS.neutral.spunPearl
            : COLORS.action.coralRed,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...styles[
        `text${
          size.charAt(0).toUpperCase() + size.slice(1)
        }` as keyof typeof styles
      ],
    };

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.neutral.mountainMist : COLORS.white,
        };
      case "outline":
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.neutral.mountainMist : COLORS.primary[500],
        };
      case "ghost":
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.neutral.mountainMist : COLORS.primary[500],
        };
      default:
        return baseTextStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? COLORS.primary[500]
              : COLORS.white
          }
        />
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === "left" && icon}
          <Text
            style={[
              getTextStyle(),
              textStyle,
              icon ? styles.textWithIcon : null,
            ]}
          >
            {title}
          </Text>
          {iconPosition === "right" && icon}
        </>
      );
    }

    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  sm: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  md: {
    height: 44,
    paddingHorizontal: SPACING.lg,
  },
  lg: {
    height: 52,
    paddingHorizontal: SPACING.xl,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: "center",
  },
  textSm: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  textMd: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  textLg: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
  },
  textWithIcon: {
    marginHorizontal: SPACING.xs,
  },
});
