import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DatePickerModal } from "@components/forms/DatePickerModal";

interface Transaction {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  color: string;
  date: string;
  type: "income" | "expense";
  note?: string;
}

export const EditTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction } = route.params as { transaction: Transaction };
  const [amount, setAmount] = useState(
    transaction?.amount?.toString() || "1000000"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.subCategory || "Chi tiêu cần thiết"
  );
  const [note, setNote] = useState(transaction?.note || "Tiền siêu thị");
  const [selectedDate, setSelectedDate] = useState(
    new Date(transaction?.date || "2023-06-03")
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Arrow left SVG content
  const arrowLeftSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 12H3.75" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  // Calendar SVG content
  const calendarSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 2V5" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 2V5" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.5 9.08997H20.5" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6947 13.7H15.7037" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6947 16.7H15.7037" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9955 13.7H12.0045" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9955 16.7H12.0045" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.29431 13.7H8.30329" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.29431 16.7H8.30329" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  // Arrow down SVG content
  const arrowDownSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 14C9.41667 14 8.83333 13.775 8.39167 13.3333L2.95833 7.89997C2.71667 7.6583 2.71667 7.2583 2.95833 7.01664C3.2 6.77497 3.6 6.77497 3.84167 7.01664L9.275 12.45C9.675 12.85 10.325 12.85 10.725 12.45L16.1583 7.01664C16.4 6.77497 16.8 6.77497 17.0417 7.01664C17.2833 7.2583 17.2833 7.6583 17.0417 7.89997L11.6083 13.3333C11.1667 13.775 10.5833 14 10 14Z" fill="#6B7280"/>
</svg>`;

  // Image/Receipt SVG content
  const imageSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 16V8C21 5 19.5 3 16 3H8C4.5 3 3 5 3 8V16C3 19 4.5 21 8 21H16C19.5 21 21 19 21 16Z" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z" fill="#3B82F6"/>
<path d="M21 15L16 10L13 13L8 8L3 13" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const categories = [
    "Chi tiêu cần thiết",
    "Đào tạo",
    "Hưởng thụ",
    "Tiết kiệm",
    "Từ thiện",
    "Tự do",
  ];

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^\d]/g, "");
    setAmount(numericValue);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const formatDate = (date: Date) => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${dayName}, ${day}/${month}/${year}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save transaction:", {
      ...transaction,
      amount: parseInt(amount.replace(/[^\d]/g, "")),
      subCategory: selectedCategory,
      note: note,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <SvgXml xml={arrowLeftSvg} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiền chi</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selector */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setShowDatePicker(true)}
        >
          <SvgXml xml={calendarSvg} width={20} height={20} />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <SvgXml xml={arrowDownSvg} width={16} height={16} />
        </TouchableOpacity>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Nhập số tiền</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              value={formatCurrency(amount) + " ₫"}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0 ₫"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Phân loại</Text>
          <TouchableOpacity
            style={styles.dropdownContainer}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
            <SvgXml xml={arrowDownSvg} width={16} height={16} />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View style={styles.dropdown}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.dropdownItemText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Note Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Ghi chú</Text>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Nhập ghi chú..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.imageButton}>
          <SvgXml xml={imageSvg} width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Cập nhật</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onClose={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B82F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  amountInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  amountInput: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "500",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
  },
  noteInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
  },
  noteInput: {
    fontSize: 16,
    color: "#374151",
    textAlignVertical: "top",
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  imageButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
