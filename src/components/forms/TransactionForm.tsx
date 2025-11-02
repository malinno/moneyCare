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
  StatusBar,
  Dimensions,
} from "react-native";
import { useCreateTransaction } from "../../hooks/api/useTransactions";
import { useCategories } from "../../hooks/api/useCategories";
import { getIconFromString } from "../../utils/iconMapping";
import { SuccessModal } from "../common/SuccessModal";

const { width } = Dimensions.get("window");

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  type: "income" | "expense";
  onSubmit: (transaction: TransactionData) => void;
}

interface TransactionData {
  amount: string;
  category: string;
  notes: string;
  date: string;
  type: "income" | "expense";
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  visible,
  onClose,
  type,
  onSubmit,
}) => {
  // API hooks
  const createTransactionMutation = useCreateTransaction();
  const { data: apiCategories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Fallback categories nếu API không có data
  const fallbackCategories = [
    { _id: '60d5ecf4f8c7a4001c8e4d1a', name: 'Cần thiết', icon: 'food_icon', color: '#8B5CF6', percentage: 55, type: 'expense' },
    { _id: '60d5ecf4f8c7a4001c8e4d1b', name: 'Đào tạo', icon: 'education', color: '#3B82F6', percentage: 10, type: 'expense' },
    { _id: '60d5ecf4f8c7a4001c8e4d1c', name: 'Hưởng thụ', icon: 'entertainment', color: '#F97316', percentage: 10, type: 'expense' },
    { _id: '60d5ecf4f8c7a4001c8e4d1d', name: 'Tiết kiệm', icon: 'savings', color: '#EF4444', percentage: 10, type: 'expense' },
    { _id: '60d5ecf4f8c7a4001c8e4d1e', name: 'Từ thiện', icon: 'charity', color: '#EC4899', percentage: 5, type: 'expense' },
    { _id: '60d5ecf4f8c7a4001c8e4d1f', name: 'Tự do', icon: 'other_expense', color: '#10B981', percentage: 10, type: 'expense' },
  ];
  
  // Sử dụng API categories nếu có, fallback nếu không
  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories;  
  
  const [formData, setFormData] = useState<TransactionData>({
    amount: "",
    category: "",
    notes: "",
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    type: type,
  });

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    amount: boolean;
    category: boolean;
  }>({
    amount: false,
    category: false,
  });

  const modalAnim = useRef(new Animated.Value(0)).current;
  const datePickerAnim = useRef(new Animated.Value(0)).current;
  const categoryModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset form
      setFormData({
        amount: "",
        category: "",
        notes: "",
        date: new Date().toISOString().split('T')[0],
        type: type,
      });
      setValidationErrors({
        amount: false,
        category: false,
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
    // Remove currency symbol and formatting
    const cleanText = text.replace(/[₫\s]/g, '');
    const formatted = formatCurrency(cleanText);
    setFormData({ ...formData, amount: formatted });
    
    // Clear validation error when user starts typing
    if (validationErrors.amount) {
      setValidationErrors({ ...validationErrors, amount: false });
    }
  };

  const handleDatePress = () => {
    // Set selectedDate to the current form date
    setSelectedDate(new Date(formData.date));
    setIsDatePickerVisible(true);
    Animated.timing(datePickerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData({ ...formData, date: date.toISOString().split('T')[0] });
    setIsDatePickerVisible(false);
    Animated.timing(datePickerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleDatePickerClose = () => {
    setIsDatePickerVisible(false);
    Animated.timing(datePickerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCategoryPress = () => {
    // Clear validation error when user taps category
    if (validationErrors.category) {
      setValidationErrors({ ...validationErrors, category: false });
    }
    setIsCategoryModalVisible(true);
    Animated.timing(categoryModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalVisible(false);
    Animated.timing(categoryModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };


  const handleCategorySelect = (categoryName: string) => {
    setFormData({ ...formData, category: categoryName });
    handleCategoryModalClose();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getMonthName = (date: Date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()] + ' ' + date.getFullYear();
  };

  const handleFormSubmit = async () => {
    let hasErrors = false;
    const newValidationErrors = {
      amount: false,
      category: false,
    };

    // Validate amount
    const numericAmount = formData.amount.replace(/\./g, "");
    if (!numericAmount || isNaN(Number(numericAmount)) || Number(numericAmount) <= 0) {
      newValidationErrors.amount = true;
      hasErrors = true;
    }

    // Validate category
    if (!formData.category.trim()) {
      newValidationErrors.category = true;
      hasErrors = true;
    }

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      return;
    }

    // Find category ID from selected category name
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    if (!selectedCategory) {
      Alert.alert("Lỗi", "Không tìm thấy phân loại được chọn");
      return;
    }

    // Validate category ID
    if (!selectedCategory._id || selectedCategory._id === '') {
      Alert.alert("Lỗi", "Category ID không hợp lệ");
      return;
    }

    try {
      // Prepare transaction data theo format API
      const transactionData = {
        categoryId: selectedCategory._id,
        amount: Number(numericAmount),
        type: formData.type, // "expense" cho "Tiền chi", "income" cho "Tiền thu"
        description: formData.category, // Tên phân loại làm description
        notes: formData.notes || "", // Ghi chú từ form (để trống nếu không có)
        date: formData.date, // Format: "2023-06-04"
      };
      // Create transaction using API
      await createTransactionMutation.mutateAsync(transactionData);

      // Hiển thị SuccessModal thay vì Alert.alert
      setIsSuccessModalVisible(true);

      // Call the original onSubmit callback
      onSubmit({
        ...formData,
        amount: numericAmount,
      });
      
      // Đóng form sau 2 giây (khi SuccessModal tự đóng)
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert("Lỗi", "Không thể tạo giao dịch. Vui lòng thử lại.");
    }
  };

  const getTypeInfo = () => {
    return type === "income"
      ? {
          title: "Tiền thu",
          icon: "💰",
          color: "#10B981",
        }
      : {
          title: "Tiền chi",
          icon: "💸",
          color: "#EF4444",
        };
  };

  const typeInfo = getTypeInfo();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="light-content" backgroundColor={typeInfo.color} />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: typeInfo.color }]}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          <Text style={styles.headerTitle}>{typeInfo.title}</Text>
          <View style={styles.headerRight} />
          </View>

          <ScrollView
          style={styles.content}
            showsVerticalScrollIndicator={false}
          >
          {/* Date Selection */}
          <TouchableOpacity style={styles.dateCard} onPress={handleDatePress}>
            <View style={styles.dateIconContainer}>
              <Text style={styles.dateIcon}>📅</Text>
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>
                {new Date(formData.date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </Text>
            </View>
            <View style={styles.dateChevron}>
              <Text style={styles.chevronText}>▼</Text>
            </View>
          </TouchableOpacity>

          {/* Amount Input */}
            <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nhập số tiền *</Text>
            <View style={[
              styles.amountContainer,
              validationErrors.amount && styles.errorBorder
            ]}>
              <TextInput
                style={styles.amountInput}
                placeholder="0 ₫"
                placeholderTextColor="#9CA3AF"
                value={formData.amount ? `${formData.amount} ₫` : ''}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                />
              </View>
            {validationErrors.amount && (
              <Text style={styles.validationText}>Vui lòng nhập số tiền hợp lệ</Text>
            )}
            </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phân loại *</Text>
            <TouchableOpacity 
              style={[
                styles.categoryContainer,
                validationErrors.category && styles.errorBorder
              ]}
              onPress={handleCategoryPress}
            >
              <Text style={[
                styles.categoryText,
                validationErrors.category && styles.errorText
              ]}>
                {formData.category || "Lựa chọn phân loại"}
              </Text>
              <Text style={styles.categoryChevron}>▼</Text>
            </TouchableOpacity>
            {validationErrors.category && (
              <Text style={styles.validationText}>Vui lòng chọn phân loại</Text>
            )}
          </View>

          {/* Notes Input */}
            <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú</Text>
              <TextInput
              style={styles.notesInput}
              placeholder="Ghi chú"
                placeholderTextColor="#9CA3AF"
              value={formData.notes}
                onChangeText={(text) =>
                setFormData({ ...formData, notes: text })
                }
              />
            </View>
          </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.imageButton}>
            <Text style={styles.imageIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.createButton, { backgroundColor: typeInfo.color }]}
              onPress={handleFormSubmit}
              activeOpacity={0.7}
            >
            <Text style={styles.createButtonText}>Tạo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleDatePickerClose}
      >
        <View style={styles.datePickerOverlay}>
          <TouchableOpacity 
            style={styles.datePickerBackdrop} 
            activeOpacity={1} 
            onPress={handleDatePickerClose}
          />
          <Animated.View
            style={[
              styles.datePickerModal,
              {
                transform: [
                  {
                    translateY: datePickerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [700, 0],
                    }),
                  },
                ],
                opacity: datePickerAnim,
              },
            ]}
          >
            {/* Date Picker Header */}
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>{getMonthName(selectedDate)}</Text>
              <View style={styles.datePickerNavigation}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigateMonth('prev')}
                >
                  <Text style={styles.navButtonText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigateMonth('next')}
                >
                  <Text style={styles.navButtonText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarContainer}>
              {/* Days of week header */}
              <View style={styles.weekDaysHeader}>
                {['Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'CN'].map((day, index) => (
                  <Text key={index} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              {/* Calendar days */}
              <View style={styles.calendarGrid}>
                {getDaysInMonth(selectedDate).map((day, index) => {
                  if (day === null) {
                    return <View key={index} style={styles.calendarDay} />;
                  }
                  
                  const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                  const isSelected = formData.date === currentDate.toISOString().split('T')[0];
                  const isToday = new Date().getDate() === day && 
                                new Date().getMonth() === selectedDate.getMonth() &&
                                new Date().getFullYear() === selectedDate.getFullYear();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        isSelected && styles.selectedDay,
                        isToday && !isSelected && styles.todayDay,
                      ]}
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(day);
                        handleDateSelect(newDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.selectedDayText,
                          isToday && !isSelected && styles.todayDayText,
                        ]}
                      >
                        {day}
              </Text>
            </TouchableOpacity>
                  );
                })}
              </View>
          </View>
        </Animated.View>
      </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCategoryModalClose}
      >
        <View style={styles.categoryModalOverlay}>
          <TouchableOpacity 
            style={styles.categoryModalBackdrop} 
            activeOpacity={1} 
            onPress={handleCategoryModalClose}
          />
          <Animated.View
            style={[
              styles.categoryModal,
              {
                transform: [
                  {
                    translateY: categoryModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1000, 0],
                    }),
                  },
                ],
                opacity: categoryModalAnim,
              },
            ]}
          >
            {/* Category Modal Header */}
            <View style={styles.categoryModalHeader}>
              <Text style={styles.categoryModalTitle}>Phân loại</Text>
              <TouchableOpacity onPress={handleCategoryModalClose} style={styles.categoryModalCloseButton}>
                <Text style={styles.categoryModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>


            {/* Category List */}
            <View style={styles.categoryListContainer}>
              <Text style={styles.categoryListTitle}>Danh sách phân loại</Text>
              <ScrollView 
                style={styles.categoryScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoryGridContainer}
              >
                <View style={styles.categoryGrid}>
                  {categoriesLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Đang tải categories...</Text>
                    </View>
                  ) : categoriesError ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>Lỗi tải categories</Text>
                    </View>
                  ) : (
                    categories.map((category, index) => (
                    <TouchableOpacity
                      key={category._id}
                      style={[
                        styles.categoryGridItem,
                        { backgroundColor: category.color + "20" },
                        formData.category === category.name && styles.selectedCategoryItem
                      ]}
                      onPress={() => handleCategorySelect(category.name)}
                    >
                      <View style={styles.categoryGridItemHeader}>
                        <Text style={styles.categoryGridItemIcon}>{getIconFromString(category.icon)}</Text>
                        <Text style={styles.categoryGridItemName}>{category.name}</Text>
                      </View>
                      <Text style={styles.categoryGridItemPercentage}>{category.percentage}%</Text>
                    </TouchableOpacity>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessModalClose}
        message="Tạo giao dịch thành công"
      />
    </Modal>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateIcon: {
    fontSize: 20,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  dateChevron: {
    padding: 8,
  },
  chevronText: {
    fontSize: 16,
    color: "#6B7280",
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
  amountContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  categoryChevron: {
    fontSize: 16,
    color: "#6B7280",
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  imageButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  imageIcon: {
    fontSize: 24,
    color: "#6B7280",
  },
  createButton: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Date Picker Modal Styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  datePickerBackdrop: {
    flex: 1,
  },
  datePickerModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    maxHeight: "75%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  datePickerNavigation: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "bold",
  },
  calendarContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  weekDaysHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
  },
  todayDay: {
    backgroundColor: "#E0F2FE",
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  todayDayText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  // Error states
  errorBorder: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#EF4444",
  },
  validationText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  // Category Modal Styles
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  categoryModalBackdrop: {
    flex: 1,
  },
  categoryModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  categoryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  categoryModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryModalCloseText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  categoryListContainer: {
    flex: 1,
    marginTop: 0,
  },
  categoryListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  categoryScrollView: {
    flex: 1,
    maxHeight: 400,
  },
  categoryGridContainer: {
    paddingBottom: 20,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryGridItem: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  selectedCategoryItem: {
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  categoryGridItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryGridItemIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryGridItemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  categoryGridItemPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
});
