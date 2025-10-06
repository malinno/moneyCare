import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export const IncomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { refreshUser } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // State
  const [income, setIncome] = useState("");

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleComplete = async () => {
    // Only proceed if income is entered
    if (!income || income.trim() === "") return;

    // Set user as authenticated - RootNavigator will automatically switch to MainTabNavigator
    await refreshUser();
  };

  const handleSkip = async () => {
    // Set user as authenticated - RootNavigator will automatically switch to MainTabNavigator
    await refreshUser();
  };

  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    if (numericValue === "") return "";

    // Format with thousand separators
    const formattedValue = parseInt(numericValue).toLocaleString("vi-VN");
    return formattedValue;
  };

  const handleIncomeChange = (text: string) => {
    const formatted = formatCurrency(text);
    setIncome(formatted);
  };

  // Check if income is valid (not empty and contains numbers)
  const isIncomeValid = income.trim() !== "" && /\d/.test(income);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Question */}
        <Animated.View
          style={[
            styles.questionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.question}>
            Số tiền thu nhập hàng tháng của bạn là bao nhiêu?
          </Text>
        </Animated.View>

        {/* Input Field */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={income}
              onChangeText={handleIncomeChange}
              placeholder="0 ₫"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.completeButton,
              !isIncomeValid && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!isIncomeValid}
          >
            <Text
              style={[
                styles.completeButtonText,
                !isIncomeValid && styles.completeButtonTextDisabled,
              ]}
            >
              Hoàn tất
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Bỏ qua</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  questionContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  question: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 32,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 80,
  },
  inputWrapper: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
    minHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    height: 56,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  completeButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonTextDisabled: {
    color: "#9CA3AF",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
});
