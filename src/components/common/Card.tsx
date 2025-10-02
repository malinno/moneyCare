import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { COLORS } from '@constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  shadow?: keyof typeof SHADOWS;
  backgroundColor?: string;
  borderRadius?: keyof typeof BORDER_RADIUS;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
  shadow = 'md',
  backgroundColor = COLORS.white,
  borderRadius = 'lg',
}) => {
  const cardStyle: ViewStyle = {
    ...styles.card,
    padding: SPACING[padding],
    backgroundColor,
    borderRadius: BORDER_RADIUS[borderRadius],
    ...SHADOWS[shadow],
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
  },
});
