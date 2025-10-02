import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input, Card } from '@components/common';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '@constants/theme';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  rememberMe: yup.boolean(),
});

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Ionicons
          name="wallet"
          size={64}
          color={theme.colors.primary[500]}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          MoneyCare
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Quản lý tài chính thông minh
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          Đăng nhập
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Nhập email của bạn"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              leftIcon="lock-closed"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          )}
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={navigateToForgotPassword}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.colors.primary[500] }]}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        <Button
          title="Đăng nhập"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.light }]} />
          <Text style={[styles.dividerText, { color: theme.colors.text.secondary }]}>
            hoặc
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.light }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            title="Google"
            variant="outline"
            style={styles.socialButton}
            icon={<Ionicons name="logo-google" size={20} color={theme.colors.primary[500]} />}
            onPress={() => {
              // Implement Google login
              Alert.alert('Thông báo', 'Tính năng đăng nhập Google sẽ được cập nhật sớm');
            }}
          />
          <Button
            title="Facebook"
            variant="outline"
            style={styles.socialButton}
            icon={<Ionicons name="logo-facebook" size={20} color={theme.colors.primary[500]} />}
            onPress={() => {
              // Implement Facebook login
              Alert.alert('Thông báo', 'Tính năng đăng nhập Facebook sẽ được cập nhật sớm');
            }}
          />
        </View>
      </Card>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
          Chưa có tài khoản?{' '}
        </Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={[styles.footerLink, { color: theme.colors.primary[500] }]}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  logo: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  loginButton: {
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  footerLink: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
