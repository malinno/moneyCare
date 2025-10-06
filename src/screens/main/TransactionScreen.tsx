import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "@components/common/Alert";
import { useAlert } from "@hooks/useAlert";

interface Transaction {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  color: string;
  date: string;
  type: "income" | "expense";
}

interface TransactionGroup {
  date: string;
  transactions: Transaction[];
}

export const TransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Tháng này");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "expense" | "income"
  >("all");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { alertState, hideAlert, showConfirm, showSuccess } = useAlert();

  // Modal automatically covers the entire screen including bottom navigation

  // Sample data based on the Figma design
  const allTransactionData: TransactionGroup[] = [
    {
      date: "Hôm nay",
      transactions: [
        {
          id: "1",
          category: "Tiền lương",
          subCategory: "Thu nhập",
          amount: 10500000,
          color: "#10B981",
          date: "2023-06-16",
          type: "income",
        },
        {
          id: "2",
          category: "Tiền bán quần áo cũ",
          subCategory: "Thu nhập phụ",
          amount: 500000,
          color: "#10B981",
          date: "2023-06-16",
          type: "income",
        },
        {
          id: "3",
          category: "Tiền siêu thị",
          subCategory: "Chi tiêu hàng ngày",
          amount: 250000,
          color: "#8B5CF6",
          date: "2023-06-16",
          type: "expense",
        },
        {
          id: "4",
          category: "Học tiếng anh",
          subCategory: "Đào tạo",
          amount: 250000,
          color: "#06B6D4",
          date: "2023-06-16",
          type: "expense",
        },
      ],
    },
    {
      date: "15/06/2023",
      transactions: [
        {
          id: "5",
          category: "Tiền mẹ cho",
          subCategory: "Thu nhập",
          amount: 1000000,
          color: "#10B981",
          date: "2023-06-15",
          type: "income",
        },
        {
          id: "6",
          category: "Tiền siêu thị",
          subCategory: "Chi tiêu hàng ngày",
          amount: 250000,
          color: "#8B5CF6",
          date: "2023-06-15",
          type: "expense",
        },
        {
          id: "7",
          category: "Học tiếng anh",
          subCategory: "Đào tạo",
          amount: 250000,
          color: "#06B6D4",
          date: "2023-06-15",
          type: "expense",
        },
      ],
    },
    {
      date: "14/06/2023",
      transactions: [
        {
          id: "8",
          category: "Tiền tiết kiệm",
          subCategory: "Tiết kiệm",
          amount: 250000,
          color: "#EC4899",
          date: "2023-06-14",
          type: "expense",
        },
        {
          id: "9",
          category: "Du lịch Mộc Châu",
          subCategory: "Hưởng thụ",
          amount: 250000,
          color: "#F97316",
          date: "2023-06-14",
          type: "expense",
        },
      ],
    },
    {
      date: "10/06/2023",
      transactions: [
        {
          id: "10",
          category: "Tiền siêu thị",
          subCategory: "Chi tiêu hàng ngày",
          amount: 250000,
          color: "#8B5CF6",
          date: "2023-06-10",
          type: "expense",
        },
        {
          id: "11",
          category: "Học tiếng anh",
          subCategory: "Đào tạo",
          amount: 250000,
          color: "#06B6D4",
          date: "2023-06-10",
          type: "expense",
        },
      ],
    },
  ];

  const totalExpense = 10000000;
  const totalIncome = 12000000;

  // Filter transactions based on selected filter
  const filteredTransactionData = allTransactionData
    .map((group) => ({
      ...group,
      transactions: group.transactions.filter((transaction) => {
        if (selectedFilter === "all") return true;
        return transaction.type === selectedFilter;
      }),
    }))
    .filter((group) => group.transactions.length > 0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const handleCardPress = (type: "expense" | "income") => {
    setSelectedFilter(type);
  };

  const handleMonthPress = () => {
    setShowMonthDropdown(!showMonthDropdown);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCloseFilter = () => {
    setShowFilterModal(false);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = () => {
    if (selectedTransaction) {
      setShowDetailModal(false);
      setSelectedTransaction(null);
      // Navigate to edit screen
      (navigation as any).navigate("EditTransaction", {
        transaction: selectedTransaction,
      });
    }
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      showConfirm(
        "Bạn có chắc chắn muốn xóa giao dịch này?",
        undefined,
        () => {
          // Confirm deletion
          console.log("Delete transaction:", selectedTransaction.id);
          setShowDetailModal(false);
          setSelectedTransaction(null);
          // Show success message after a short delay
          setTimeout(() => {
            showSuccess("Bạn đã xóa thành công giao dịch");
          }, 300);
        },
        () => {
          // Cancel deletion
          console.log("Cancelled deletion");
        }
      );
    }
  };

  // Month options
  const monthOptions = [
    "Tháng này",
    "Tháng trước",
    "Tháng 1/2024",
    "Tháng 2/2024",
    "Tháng 3/2024",
    "Tháng 4/2024",
    "Tháng 5/2024",
    "Tháng 6/2024",
  ];

  // Filter categories
  const filterCategories = [
    { id: "canthiet", name: "Cần thiết", color: "#8B5CF6" },
    { id: "daotao", name: "Đào tạo", color: "#06B6D4" },
    { id: "huongthu", name: "Hưởng thụ", color: "#F97316" },
    { id: "tietkiem", name: "Tiết kiệm", color: "#EC4899" },
    { id: "tuthien", name: "Từ thiện", color: "#10B981" },
    { id: "tudo", name: "Tự do", color: "#6366F1" },
  ];

  // Calendar SVG content
  const calendarSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 2V5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 2V5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.5 9.08997H20.5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6947 13.7H15.7037" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6947 16.7H15.7037" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9955 13.7H12.0045" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9955 16.7H12.0045" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.29431 13.7H8.30329" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.29431 16.7H8.30329" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  // Arrow down SVG content
  const arrowDownSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 14C9.41667 14 8.83333 13.775 8.39167 13.3333L2.95833 7.89997C2.71667 7.6583 2.71667 7.2583 2.95833 7.01664C3.2 6.77497 3.6 6.77497 3.84167 7.01664L9.275 12.45C9.675 12.85 10.325 12.85 10.725 12.45L16.1583 7.01664C16.4 6.77497 16.8 6.77497 17.0417 7.01664C17.2833 7.2583 17.2833 7.6583 17.0417 7.89997L11.6083 13.3333C11.1667 13.775 10.5833 14 10 14Z" fill="white"/>
</svg>`;

  // Arrow left SVG content
  const arrowLeftSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 12H3.75" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  // Filter SVG content
  const filterSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.39999 2.09998H18.6C19.7 2.09998 20.6 2.99998 20.6 4.09998V6.29998C20.6 7.09998 20.1 8.09998 19.6 8.59998L15.3 12.4C14.7 12.9 14.3 13.9 14.3 14.7V19C14.3 19.6 13.9 20.4 13.4 20.7L12 21.6C10.7 22.4 8.89999 21.5 8.89999 19.9V14.6C8.89999 13.9 8.49999 13 8.09999 12.5L4.29999 8.49998C3.79999 7.99998 3.39999 7.09998 3.39999 6.49998V4.19998C3.39999 2.99998 4.29999 2.09998 5.39999 2.09998Z" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.93 2.09998L6 9.99998" stroke="#6B7280" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const renderTransactionItem = (transaction: Transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={styles.transactionItem}
      onPress={() => handleTransactionPress(transaction)}
    >
      <View style={styles.transactionLeft}>
        <View
          style={[styles.categoryIcon, { backgroundColor: transaction.color }]}
        />
        <View style={styles.transactionInfo}>
          <Text style={styles.categoryText}>{transaction.category}</Text>
          <Text style={styles.subCategoryText}>{transaction.subCategory}</Text>
        </View>
      </View>
      <Text style={styles.amountText}>
        {formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionGroup = (group: TransactionGroup) => (
    <View key={group.date} style={styles.transactionGroup}>
      <Text style={styles.groupDate}>{group.date}</Text>
      {group.transactions.map(renderTransactionItem)}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Thu - Chi</Text>
        </View>

        <TouchableOpacity
          style={styles.monthSelector}
          onPress={handleMonthPress}
        >
          <SvgXml
            xml={calendarSvg}
            width={20}
            height={20}
            style={styles.calendarIcon}
          />
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <SvgXml xml={arrowDownSvg} width={16} height={16} />
        </TouchableOpacity>

        {/* Month Dropdown */}
        {showMonthDropdown && (
          <View style={styles.monthDropdown}>
            {monthOptions.map((month, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthOption,
                  selectedMonth === month && styles.selectedMonthOption,
                ]}
                onPress={() => handleMonthSelect(month)}
              >
                <Text
                  style={[
                    styles.monthOptionText,
                    selectedMonth === month && styles.selectedMonthOptionText,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.summaryCards}>
          <View
            style={
              selectedFilter === "expense" ? styles.selectedCardWrapper : null
            }
          >
            <TouchableOpacity
              style={[
                styles.summaryCard,
                styles.expenseCard,
                selectedFilter === "expense" && styles.selectedCard,
              ]}
              onPress={() => handleCardPress("expense")}
            >
              <Text style={styles.cardLabel}>Tiền chi</Text>
              <Text style={styles.cardAmount}>
                {formatCurrency(totalExpense)}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              selectedFilter === "income" ? styles.selectedCardWrapper : null
            }
          >
            <TouchableOpacity
              style={[
                styles.summaryCard,
                styles.incomeCard,
                selectedFilter === "income" && styles.selectedCard,
              ]}
              onPress={() => handleCardPress("income")}
            >
              <Text style={styles.cardLabel}>Tiền thu</Text>
              <Text style={styles.cardAmount}>
                {formatCurrency(totalIncome)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* White Content Section with Rounded Corners */}
      <View style={styles.contentSection}>
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm giao dịch"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <SvgXml xml={filterSvg} width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <ScrollView
          style={styles.transactionList}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactionData.map(renderTransactionGroup)}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      {showFilterModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc theo phân loại</Text>
              <TouchableOpacity onPress={handleCloseFilter}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryList}>
              {filterCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleCategoryToggle(category.id)}
                >
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.categoryColor,
                        { backgroundColor: category.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      selectedCategories.includes(category.id) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedCategories.includes(category.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Transaction Detail Modal */}
      <Modal
        visible={showDetailModal && !!selectedTransaction}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        {selectedTransaction && (
          <View style={styles.detailModalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.detailModalHeader}>
                <Text style={styles.detailModalTitle}>Chi tiết tiền chi</Text>
                <TouchableOpacity onPress={handleCloseDetail}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailContent}>
                <View style={styles.detailTransactionItem}>
                  <View style={styles.detailTransactionLeft}>
                    <View
                      style={[
                        styles.detailCategoryIcon,
                        { backgroundColor: selectedTransaction.color },
                      ]}
                    />
                    <View style={styles.detailTransactionInfo}>
                      <Text style={styles.detailCategoryText}>
                        {selectedTransaction.category}
                      </Text>
                      <Text style={styles.detailSubCategoryText}>
                        {selectedTransaction.subCategory}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailDateAmount}>
                  <Text style={styles.detailDate}>
                    {new Date(selectedTransaction.date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Text>
                  <Text style={styles.detailAmount}>
                    {formatCurrency(selectedTransaction.amount)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteTransaction}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditTransaction}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                  <Text style={styles.editText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Alert Component */}
      <Alert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        primaryButtonText={alertState.primaryButtonText}
        secondaryButtonText={alertState.secondaryButtonText}
        onPrimaryPress={alertState.onPrimaryPress}
        onSecondaryPress={alertState.onSecondaryPress}
        onClose={hideAlert}
        showCloseButton={alertState.showCloseButton}
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginRight: -30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Compensate for back button width
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  calendarIcon: {
    marginRight: 12,
  },
  monthText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 10,
  },
  chevronIcon: {
    // Removed as we're now using SVG
  },
  monthDropdown: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
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
  monthOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedMonthOption: {
    backgroundColor: "#F3F4F6",
  },
  monthOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedMonthOptionText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },
  summaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 24,
    flex: 1,
    minWidth: 0,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  expenseCard: {
    backgroundColor: "#1E40AF",
    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  incomeCard: {
    backgroundColor: "#2563EB",
    opacity: 0.9,
    minWidth: 0,
  },
  selectedCardWrapper: {
    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
    borderBottomWidth: 3,
    borderBottomColor: "rgba(255, 255, 255, 0.8)",
  },
  cardLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "left",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 28,
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 50,
    paddingTop: 20,
    minHeight: 0,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: "#9CA3AF",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  filterButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    // Removed as we're now using SVG
  },
  transactionList: {
    flex: 1,
  },
  transactionGroup: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  groupDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  subCategoryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  // Filter Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 9999,
  },
  filterModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "bold",
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Transaction Detail Modal Styles
  detailModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  detailModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  detailModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  detailTransactionItem: {
    marginBottom: 20,
  },
  detailTransactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailCategoryIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  detailTransactionInfo: {
    flex: 1,
  },
  detailCategoryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  detailSubCategoryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailDateAmount: {
    alignItems: "flex-end",
  },
  detailDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  detailAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  detailActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  editIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0284C7",
  },
});
