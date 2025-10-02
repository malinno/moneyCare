import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@components/common";
import { COLORS } from "@constants/colors";
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from "@constants/theme";

const { width, height } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  image?: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: "1",
    title: "Quản lý thu chi",
    description: "Quản lý thu chi chặt chẽ - tiết kiệm thời gian.",
    icon: "wallet",
    image: require("../../assets/images/thu-chi.png"),
  },
  {
    id: "2",
    title: "Làm chủ tài chính",
    description: "Làm chủ tài chính - Làm chủ cuộc sống",
    icon: "trending-up",
    image: require("../../assets/images/tai-chinh.png"),
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      },
    }
  );

  const renderSlide = ({
    item,
    index,
  }: {
    item: OnboardingSlide;
    index: number;
  }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slideContent}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            {item.image ? (
              <Image
                source={item.image}
                style={styles.illustration}
                resizeMode="contain"
              />
            ) : (
              <LinearGradient
                colors={[COLORS.primary[400], COLORS.primary[600]]}
                style={styles.iconBackground}
              >
                <Ionicons name={item.icon} size={60} color={COLORS.white} />
              </LinearGradient>
            )}
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background.white}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Money Care</Text>
        <Button
          title="Bỏ qua"
          variant="ghost"
          onPress={handleSkip}
          style={styles.skipButton}
        />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {renderPagination()}

        <View style={styles.buttonContainer}>
          <Button
            title={
              currentIndex === onboardingData.length - 1
                ? "Bắt đầu"
                : "Tiếp tục"
            }
            onPress={handleNext}
            fullWidth
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xl,
  },
  headerLeft: {
    width: 60,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  skipButton: {
    paddingHorizontal: 0,
    minWidth: 60,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  slideContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  illustrationContainer: {
    marginBottom: SPACING.xl * 2,
    height: 280,
    width: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 280,
    height: 280,
  },
  iconContainer: {
    marginBottom: SPACING.xl * 2,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContent: {
    alignItems: "center",
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 36,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  nextButton: {
    paddingVertical: SPACING.md,
  },
});
