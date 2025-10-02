import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, OnboardingScreen } from "@screens/intro";
import { STORAGE_KEYS } from "@constants/index";

interface IntroNavigatorProps {
  onComplete: () => void;
}

export const IntroNavigator: React.FC<IntroNavigatorProps> = ({
  onComplete,
}) => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingFinish = async () => {
    try {
      // Mark onboarding as seen
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, "true");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }

    // Complete intro flow
    onComplete();
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // After splash, always show onboarding for first-time users
  return <OnboardingScreen onFinish={handleOnboardingFinish} />;
};
