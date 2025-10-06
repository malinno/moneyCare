import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@contexts/AuthContext";

const { width, height } = Dimensions.get("window");
export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { refreshUser } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Simple entrance animation
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

  const handleGetStarted = () => {
    // Navigate to intro jars screen without setting authenticated yet
    navigation.navigate("IntroJars" as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Illustration Section */}
      <Animated.View
        style={[
          styles.illustrationContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("@assets/images/intro_app_lr.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text Section */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Text style={styles.title}>
          Chào mừng bạn đến với{" "}
          <Text style={styles.highlightedText}>Money care</Text>
        </Text>
        <Text style={styles.subtitle}>
          Chúng tôi đem đến giải pháp giúp bạn quản lý chi tiêu cực kỳ dễ dàng
          và hiệu quả
        </Text>
      </Animated.View>

      {/* Button Section */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.startButton} onPress={handleGetStarted}>
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  illustrationContainer: {
    flex: 0.6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationImage: {
    maxWidth: 500,
    maxHeight: 500,
  },
  textContainer: {
    flex: 0.25,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  highlightedText: {
    color: "#3B82F6",
    fontSize: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 0.15,
    paddingHorizontal: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
