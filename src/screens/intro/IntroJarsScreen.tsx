import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@contexts/AuthContext";
export const IntroJarsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { refreshUser } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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

  const handleContinue = () => {
    // Navigate to select fund screen
    navigation.navigate("SelectFund" as never);
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
          source={require("@assets/images/hu_tiet_kiem.png")}
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
        <Text style={styles.title}>Quy tắc 6 chiếc lọ</Text>
        <Text style={styles.description}>
          Chúng tôi đưa ra một vài quỹ tiết kiệm được các chuyên gia tư vấn. Quy
          tắc 6 chiếc lọ là một phương pháp quản lý chi tiêu được sử dụng phổ
          biến trên thế giới.
        </Text>
        <Text style={styles.description}>
          Và bạn hoàn toàn có thể tự tạo quỹ tiết kiệm riêng theo nhu cầu của
          bản thân!
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
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
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
    flex: 0.5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  illustrationImage: {
    maxWidth: 400,
    maxHeight: 400,
  },
  textContainer: {
    flex: 0.35,
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "left",
    lineHeight: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    flex: 0.15,
    paddingHorizontal: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
