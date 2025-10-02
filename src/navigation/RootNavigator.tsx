import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@contexts/AuthContext";
import { LoadingSpinner } from "@components/common";
import { IntroNavigator } from "./IntroNavigator";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabNavigator } from "./MainTabNavigator";
import { STORAGE_KEYS } from "@constants/index";
import { RootStackParamList } from "@/types";

const Stack = createStackNavigator<RootStackParamList>();

type AppState = "loading" | "intro" | "auth" | "main";

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>("loading");

  useEffect(() => {
    checkAppState();
  }, [isAuthenticated, isLoading]);

  const checkAppState = async () => {
    if (isLoading) {
      setAppState("loading");
      return;
    }

    try {
      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem(
        STORAGE_KEYS.HAS_SEEN_ONBOARDING
      );

      if (hasSeenOnboarding !== "true") {
        // First time user - show intro
        setAppState("intro");
      } else if (isAuthenticated) {
        // Returning authenticated user
        setAppState("main");
      } else {
        // Returning user but not authenticated
        setAppState("auth");
      }
    } catch (error) {
      console.error("Error checking app state:", error);
      // Default to intro for safety
      setAppState("intro");
    }
  };

  const handleIntroComplete = () => {
    // After intro, check if user is already authenticated
    if (isAuthenticated) {
      setAppState("main");
    } else {
      setAppState("auth");
    }
  };

  if (appState === "loading") {
    return <LoadingSpinner text="Đang khởi tạo ứng dụng..." overlay />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {appState === "intro" && (
          <Stack.Screen name="Intro">
            {() => <IntroNavigator onComplete={handleIntroComplete} />}
          </Stack.Screen>
        )}
        {(appState === "auth" ||
          (!isAuthenticated && appState !== "intro")) && (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        {(appState === "main" || (isAuthenticated && appState !== "intro")) && (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
