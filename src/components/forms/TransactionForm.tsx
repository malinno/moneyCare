import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  ScrollView,
  Alert,
} from "react-native";

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  type: "income" | "expense";
  onSubmit: (transaction: TransactionData) => void;
}

interface TransactionData {
  title: string;
  category: string;
  amount: string;
  description?: string;
  type: "income" | "expense";
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  visible,
  onClose,
  type,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TransactionData>({
    title: "",
    category: "",
    amount: "",
    description: "",
    type: type,
  });

  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset form
      setFormData({
        title: "",
        category: "",
        amount: "",
        description: "",
        type: type,
      });

      // Animate in
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Animate out
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, type, modalAnim]);

  const formatCurrency = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setFormData({ ...formData, amount: formatted });
  };

  const handleFormSubmit = () => {
    // Validate
    if (!formData.title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề giao dịch");
      return;
    }
    if (!formData.category.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập danh mục");
      return;
    }
    const numericAmount = formData.amount.replace(/\./g, "");
    if (!numericAmount || isNaN(Number(numericAmount))) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    // Submit
    onSubmit({
      ...formData,
      amount: numericAmount,
    });
    onClose();
  };

  const getTypeInfo = () => {
    return type === "income"
      ? {
          title: "Thêm thu nhập",
          icon: "💰",
          color: "#10B981",
          placeholder: "Nhập nguồn thu nhập...",
        }
      : {
          title: "Thêm chi tiêu",
          icon: "💸",
          color: "#EF4444",
          placeholder: "Nhập mục chi tiêu...",
        };
  };

  const typeInfo = getTypeInfo();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
              opacity: modalAnim,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerIcon}>{typeInfo.icon}</Text>
              <Text style={styles.modalTitle}>{typeInfo.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiêu đề *</Text>
              <TextInput
                style={styles.textInput}
                placeholder={typeInfo.placeholder}
                placeholderTextColor="#9CA3AF"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập danh mục..."
                placeholderTextColor="#9CA3AF"
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số tiền *</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₫</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={formData.amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả (tùy chọn)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Nhập mô tả chi tiết..."
                placeholderTextColor="#9CA3AF"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: typeInfo.color }]}
              onPress={handleFormSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>
                {type === "income" ? "Thêm thu nhập" : "Thêm chi tiêu"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  formContent: {
    flex: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    paddingHorizontal: 12,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
