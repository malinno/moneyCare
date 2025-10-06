import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "@components/common";
import { useAuth } from "@contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@constants/theme";
import { fakeAuthService } from "@services/auth/fakeAuthService";

const { width, height } = Dimensions.get("window");

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Tên đăng nhập phải có ít nhất 2 ký tự")
    .required("Tên đăng nhập là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
});

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("Starting registration with:", data.username);
      // Register without setting isAuthenticated = true yet
      await fakeAuthService.register({
        username: data.username,
        password: data.password,
      });
      console.log("Registration successful, navigating to Welcome");
      // Navigate to Welcome screen after successful registration
      navigation.navigate("Welcome" as never);
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert("Lỗi đăng ký", error.message);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login" as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#72C6EF", "#004E89"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="person-add" size={40} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>
            Bắt đầu hành trình quản lý tài chính thông minh
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Đăng ký</Text>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  keyboardType="default"
                  autoCapitalize="none"
                  leftIcon="mail"
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Mật khẩu"
                  placeholder="Tạo mật khẩu mạnh"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  leftIcon="lock-closed"
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon="lock-closed"
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="agreeToTerms"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        borderColor: errors.agreeToTerms
                          ? "#FF3B30"
                          : value
                          ? "#3182CE"
                          : "#C7C7CC",
                        backgroundColor: value ? "#3182CE" : "transparent",
                      },
                    ]}
                    onPress={() => onChange(!value)}
                  >
                    {value && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>Tôi đồng ý với </Text>
                    <TouchableOpacity>
                      <Text style={styles.linkText}>Điều khoản sử dụng</Text>
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}> và </Text>
                    <TouchableOpacity>
                      <Text style={styles.linkText}>Chính sách bảo mật</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            {errors.agreeToTerms && (
              <Text style={styles.errorText}>
                {errors.agreeToTerms.message}
              </Text>
            )}

            <Button
              title="Tạo tài khoản"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
              size="lg"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.footerLink}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004E89",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    top: 100,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  decorativeCircle3: {
    position: "absolute",
    bottom: 200,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING["4xl"],
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: SPACING.sm,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING["2xl"],
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize["4xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BORDER_RADIUS["2xl"],
    padding: SPACING["2xl"],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: TYPOGRAPHY.fontSize["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: "#1A365D",
    textAlign: "center",
    marginBottom: SPACING["2xl"],
  },
  nameRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  nameInput: {
    flex: 1,
  },
  input: {
    marginBottom: SPACING.lg,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "#3C3C43",
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  linkText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: "#3182CE",
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "#FF3B30",
    marginTop: -SPACING.sm,
    marginBottom: SPACING.lg,
  },
  registerButton: {
    marginTop: SPACING.md,
    backgroundColor: "#3182CE",
    borderRadius: BORDER_RADIUS.lg,
    height: 56,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },
  footerLink: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: "#FFFFFF",
  },
});
