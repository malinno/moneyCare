import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getIconFromString } from "../../utils/iconMapping";
import { useCreateCategory } from "../../hooks/api/useCategories";
import { SuccessModal } from "../../components/common";

const { width } = Dimensions.get("window");

interface CreateCategoryScreenProps {
  navigation: any;
}

export const CreateCategoryScreen: React.FC<CreateCategoryScreenProps> = ({
  navigation,
}) => {
  // API hook
  const createCategoryMutation = useCreateCategory();
  
  // State cho form tạo category
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    icon: "food_icon",
    color: "#8B5CF6",
    budgetLimit: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: false,
  });

  // Success modal state
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleFormSubmit = async () => {
    let hasErrors = false;
    const newValidationErrors = {
      name: false,
    };

    // Validate name
    if (!categoryFormData.name.trim()) {
      newValidationErrors.name = true;
      hasErrors = true;
    }

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      return;
    }

    try {
      // Prepare API data
      const apiData = {
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon,
        color: categoryFormData.color,
        type: 'expense' as const, // Mặc định là expense
        budgetLimit: Number(categoryFormData.budgetLimit.replace(/\./g, '')) || 0,
        percentage: 10, // Mặc định 10%
      };

      console.log('Creating category with data:', apiData);
      
      // Call API
      await createCategoryMutation.mutateAsync(apiData);
      
      // Hiển thị success modal
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert("Lỗi", "Không thể tạo phân loại. Vui lòng thử lại.");
    }
  };

  const handleNameChange = (text: string) => {
    setCategoryFormData({ ...categoryFormData, name: text });
    // Clear validation error when user starts typing
    if (validationErrors.name) {
      setValidationErrors({ ...validationErrors, name: false });
    }
  };

  const handleBudgetLimitChange = (text: string) => {
    // Format currency input
    const numericValue = text.replace(/[^0-9]/g, "");
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setCategoryFormData({ ...categoryFormData, budgetLimit: formatted });
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo phân loại mới</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tên phân loại *</Text>
          <View style={[
            styles.inputContainer,
            validationErrors.name && styles.errorBorder
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên phân loại"
              placeholderTextColor="#9CA3AF"
              value={categoryFormData.name}
              onChangeText={handleNameChange}
            />
          </View>
          {validationErrors.name && (
            <Text style={styles.validationText}>Vui lòng nhập tên phân loại</Text>
          )}
        </View>

        {/* Category Icon */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {['food_icon', 'education', 'entertainment', 'savings', 'charity', 'other_expense'].map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconOption,
                  categoryFormData.icon === icon && styles.selectedIconOption
                ]}
                onPress={() => setCategoryFormData({ ...categoryFormData, icon })}
              >
                <Text style={styles.iconOptionText}>{getIconFromString(icon)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Màu sắc</Text>
          <View style={styles.colorGrid}>
            {['#8B5CF6', '#3B82F6', '#F97316', '#EF4444', '#EC4899', '#10B981'].map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  categoryFormData.color === color && styles.selectedColorOption
                ]}
                onPress={() => setCategoryFormData({ ...categoryFormData, color })}
              />
            ))}
          </View>
        </View>

        {/* Budget Limit */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hạn mức ngân sách</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập hạn mức (VND)"
              placeholderTextColor="#9CA3AF"
              value={categoryFormData.budgetLimit ? `${categoryFormData.budgetLimit} ₫` : ''}
              onChangeText={handleBudgetLimitChange}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Preview */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Xem trước</Text>
          <View style={styles.previewContainer}>
            <View style={[
              styles.previewCard,
              { backgroundColor: categoryFormData.color + "20" }
            ]}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewIcon}>{getIconFromString(categoryFormData.icon)}</Text>
                <Text style={styles.previewName}>
                  {categoryFormData.name || "Tên phân loại"}
                </Text>
              </View>
              <Text style={styles.previewAmount}>
                {categoryFormData.budgetLimit ? `${categoryFormData.budgetLimit} ₫` : "0 ₫"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.createButton,
            createCategoryMutation.isPending && styles.createButtonDisabled
          ]}
          onPress={handleFormSubmit}
          disabled={createCategoryMutation.isPending}
        >
          <Text style={styles.createButtonText}>
            {createCategoryMutation.isPending ? "Đang tạo..." : "Tạo phân loại"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={isSuccessModalVisible}
        message="Tạo phân loại thành công"
        onClose={handleSuccessModalClose}
        autoClose={true}
        autoCloseDelay={2000}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#1F2937",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // Giảm padding bottom vì không còn bottom navigation
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  errorBorder: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  validationText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedIconOption: {
    borderColor: "#3B82F6",
    backgroundColor: "#E0F2FE",
  },
  iconOptionText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorOption: {
    borderColor: "#1F2937",
    borderWidth: 3,
  },
  previewContainer: {
    alignItems: "center",
  },
  previewCard: {
    width: 200,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  previewIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  previewAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  bottomContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20, // Giảm padding bottom vì không còn bottom navigation
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  createButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  createButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
});
