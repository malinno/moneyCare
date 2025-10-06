import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { SelectionModal } from "../../components/common";
import { TransactionForm } from "../../components/forms";

const { width, height } = Dimensions.get("window");

export const HomeScreen: React.FC = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const [selectedTab, setSelectedTab] = useState("Chi");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("Tháng này");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isTransactionFormVisible, setIsTransactionFormVisible] =
    useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const searchAnim = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(0)).current;
  const datePickerAnim = useRef(new Animated.Value(0)).current;

  // Fake data
  const monthlySpending = {
    totalSpent: 10500000,
    balance: 2000000,
  };

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Cần thiết",
      amount: 1000000,
      percentage: 59,
      color: "#8B5CF6",
      icon: "🛒",
    },
    {
      id: 2,
      name: "Đào tạo",
      amount: 1000000,
      percentage: 32,
      color: "#3B82F6",
      icon: "📚",
    },
    {
      id: 3,
      name: "Hưởng thụ",
      amount: 1000000,
      percentage: 10,
      color: "#F97316",
      icon: "🎉",
    },
    {
      id: 4,
      name: "Tiết kiệm",
      amount: 800000,
      percentage: 45,
      color: "#10B981",
      icon: "🐷",
    },
    {
      id: 5,
      name: "Từ thiện",
      amount: 500000,
      percentage: 25,
      color: "#EF4444",
      icon: "⛪",
    },
    {
      id: 6,
      name: "Tự do",
      amount: 300000,
      percentage: 15,
      color: "#8B5CF6",
      icon: "🤲",
    },
    {
      id: 7,
      name: "Y tế",
      amount: 200000,
      percentage: 8,
      color: "#F59E0B",
      icon: "🏥",
    },
    {
      id: 8,
      name: "Du lịch",
      amount: 1500000,
      percentage: 75,
      color: "#06B6D4",
      icon: "✈️",
    },
  ]);

  const transactions = [
    {
      id: 1,
      title: "Tiền siêu thị",
      category: "Chỉ tiêu hàng ngày",
      date: "03/06/23",
      amount: 250000,
      color: "#8B5CF6",
    },
    {
      id: 2,
      title: "Đào tạo",
      category: "Học tiếng anh",
      date: "03/06/23",
      amount: 250000,
      color: "#3B82F6",
    },
    {
      id: 3,
      title: "Hưởng thụ",
      category: "Đi công viên",
      date: "03/06/23",
      amount: 250000,
      color: "#F97316",
    },
    {
      id: 4,
      title: "Tiền tiết kiệm",
      category: "Tiền tiết kiệm",
      date: "03/06/23",
      amount: 250000,
      color: "#EC4899",
    },
    {
      id: 5,
      title: "Mua sắm",
      category: "Quần áo",
      date: "02/06/23",
      amount: 500000,
      color: "#10B981",
    },
    {
      id: 6,
      title: "Ăn uống",
      category: "Nhà hàng",
      date: "02/06/23",
      amount: 180000,
      color: "#F59E0B",
    },
    {
      id: 7,
      title: "Xăng xe",
      category: "Phương tiện",
      date: "01/06/23",
      amount: 300000,
      color: "#EF4444",
    },
    {
      id: 8,
      title: "Điện thoại",
      category: "Công nghệ",
      date: "01/06/23",
      amount: 1200000,
      color: "#8B5CF6",
    },
    {
      id: 9,
      title: "Cà phê",
      category: "Giải trí",
      date: "31/05/23",
      amount: 50000,
      color: "#6B7280",
    },
    {
      id: 10,
      title: "Sách vở",
      category: "Học tập",
      date: "31/05/23",
      amount: 150000,
      color: "#3B82F6",
    },
  ];

  const spendingLimits = [
    {
      name: "Cần thiết",
      limit: 5500000,
      spent: 5000000,
      icon: "📄",
      iconColor: "#8B5CF6",
      statusColor: "#10B981",
    },
    {
      name: "Đào tạo",
      limit: 1000000,
      spent: 800000,
      icon: "🎓",
      iconColor: "#3B82F6",
      statusColor: "#10B981",
    },
    {
      name: "Hưởng thụ",
      limit: 500000,
      spent: 800000,
      icon: "🪙",
      iconColor: "#F97316",
      statusColor: "#EF4444",
    },
    {
      name: "Tiết kiệm",
      limit: 1000000,
      spent: 800000,
      icon: "🐷",
      iconColor: "#EF4444",
      statusColor: "#10B981",
    },
    {
      name: "Từ thiện",
      limit: 1000000,
      spent: 800000,
      icon: "🎁",
      iconColor: "#EC4899",
      statusColor: "#10B981",
    },
    {
      name: "Tự do",
      limit: 1000000,
      spent: 800000,
      icon: "🤲",
      iconColor: "#10B981",
      statusColor: "#10B981",
    },
  ];

  const chartData = [
    { date: "11/6", value: 180, label: "T2" },
    { date: "12/6", value: 320, label: "T3" },
    { date: "13/6", value: 480, label: "T4" },
    { date: "14/6", value: 720, label: "T5" },
    { date: "15/6", value: 280, label: "T6" },
    { date: "16/6", value: 650, label: "T7" },
    { date: "17/6", value: 420, label: "CN" },
  ];

  const dateOptions = [
    "Tuần này",
    "Tháng này",
    "3 tháng qua",
    "6 tháng qua",
    "Năm nay",
  ];

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const addNewCategory = () => {
    const newCategory = {
      id: Date.now(), // Simple ID generation
      name: "Mới",
      amount: 0,
      percentage: 0,
      color: "#6B7280",
      icon: "➕",
    };
    setCategories([newCategory, ...categories]); // Add to beginning
  };

  const handleAddPress = () => {
    setIsAddModalVisible(true);
  };

  const handleModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleIncomePress = () => {
    setTransactionType("income");
    setIsAddModalVisible(false);
    setIsTransactionFormVisible(true);
  };

  const handleExpensePress = () => {
    setTransactionType("expense");
    setIsAddModalVisible(false);
    setIsTransactionFormVisible(true);
  };

  const handleTransactionFormClose = () => {
    setIsTransactionFormVisible(false);
  };

  const handleTransactionSubmit = (transactionData: any) => {
    console.log("handleTransactionSubmit called with:", transactionData);
    // Here you would typically save the transaction to your state or API
    // For now, we'll just log it
    setIsTransactionFormVisible(false);
  };

  const handleDatePickerPress = () => {
    if (isDatePickerVisible) {
      Animated.timing(datePickerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setIsDatePickerVisible(false);
      });
    } else {
      setIsDatePickerVisible(true);
      Animated.timing(datePickerAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    handleDatePickerPress();
  };

  // Filter transactions based on search text
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.title.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchPress = () => {
    if (isSearchVisible) {
      // Close search
      Animated.parallel([
        Animated.timing(searchAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchWidthAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsSearchVisible(false);
        setSearchText("");
      });
    } else {
      // Open search
      setIsSearchVisible(true);
      Animated.parallel([
        Animated.timing(searchAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchWidthAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Animated.View
              style={[
                styles.greetingContainer,
                {
                  opacity: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                  transform: [
                    {
                      translateX: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -50],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.greeting}>Xin chào, Hồng</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.searchContainer,
                {
                  opacity: searchAnim,
                  width: searchWidthAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width - 100],
                  }),
                },
              ]}
            >
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm giao dịch..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={isSearchVisible}
              />
            </Animated.View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  isSearchVisible && styles.activeIconButton,
                ]}
                onPress={handleSearchPress}
              >
                <Text
                  style={[
                    styles.iconText,
                    isSearchVisible && styles.activeIconText,
                  ]}
                >
                  {isSearchVisible ? "✕" : "🔍"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconText}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Monthly Spending Card */}
        <Animated.View
          style={[
            styles.monthlySpendingCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.monthlySpendingContent}>
            <View style={styles.monthlySpendingLeft}>
              <Text style={styles.monthlySpendingTitle}>
                Số tiền bạn chi trong tháng
              </Text>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceValue}>
                {formatCurrency(monthlySpending.totalSpent)}
              </Text>
              <Text style={styles.balanceLabel}>
                Số dư: {formatCurrency(monthlySpending.balance)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Spending by Category */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Chỉ theo phân loại</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={handleAddPress}
            >
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContainer}
              style={styles.categoryScrollView}
            >
              {categories.map((category) => (
                <View
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressPercentage}>
                      {category.percentage}%
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Chi" && styles.activeTab]}
              onPress={() => setSelectedTab("Chi")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Chi" && styles.activeTabText,
                ]}
              >
                Chi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Thu" && styles.activeTab]}
              onPress={() => setSelectedTab("Thu")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Thu" && styles.activeTabText,
                ]}
              >
                Thu
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionListContainer}>
            {filteredTransactions.length > 0 ? (
              <ScrollView
                style={styles.transactionScrollView}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {filteredTransactions.map((transaction, index) => (
                  <TouchableOpacity
                    key={transaction.id}
                    style={[
                      styles.transactionItem,
                      index === filteredTransactions.length - 1 &&
                        styles.lastTransactionItem,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.transactionDot,
                        { backgroundColor: transaction.color },
                      ]}
                    />
                    <View style={styles.transactionContent}>
                      <Text style={styles.transactionTitle}>
                        {transaction.title}
                      </Text>
                      <Text style={styles.transactionCategory}>
                        {transaction.category}
                      </Text>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>
                        {formatCurrency(transaction.amount)}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {searchText
                    ? "Không tìm thấy giao dịch nào"
                    : "Chưa có giao dịch nào"}
                </Text>
                <Text style={styles.noResultsSubtext}>
                  {searchText
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Bắt đầu quản lý tài chính của bạn"}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Overview */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.overviewHeader}>
            <Text style={styles.sectionTitle}>Tổng quan</Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.dateSelector}
                onPress={handleDatePickerPress}
              >
                <Text style={styles.calendarIcon}>📅</Text>
                <Text style={styles.dateText}>{selectedDate}</Text>
                <Text
                  style={[
                    styles.chevronIcon,
                    isDatePickerVisible && styles.chevronRotated,
                  ]}
                >
                  ▼
                </Text>
              </TouchableOpacity>

              {isDatePickerVisible && (
                <Animated.View
                  style={[
                    styles.datePickerDropdown,
                    {
                      opacity: datePickerAnim,
                      transform: [
                        {
                          translateY: datePickerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {dateOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dateOption,
                        selectedDate === option && styles.selectedDateOption,
                      ]}
                      onPress={() => handleDateSelect(option)}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          selectedDate === option &&
                            styles.selectedDateOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>
          </View>

          <View style={styles.overviewContent}>
            <View style={styles.overviewLeft}>
              <Text style={styles.overviewValue}>
                {formatCurrency(monthlySpending.totalSpent)}
              </Text>
              <Text style={styles.overviewLabel}>
                Số tiền đã chỉ tiêu trong tháng này
              </Text>
            </View>
            <View style={styles.chartIcon}>
              <Text style={styles.barChartIcon}>📊</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.barChart}>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>800</Text>
                <Text style={styles.yAxisLabel}>600</Text>
                <Text style={styles.yAxisLabel}>400</Text>
                <Text style={styles.yAxisLabel}>200</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
              <View style={styles.barChartArea}>
                {chartData.map((bar, index) => {
                  const barHeight = (bar.value / 800) * 100;
                  const maxValue = Math.max(...chartData.map((d) => d.value));
                  const isMaxValue = bar.value === maxValue;
                  const isHighValue = bar.value >= 600; // Highlight bars >= 600

                  return (
                    <View key={index} style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${barHeight}%`,
                            backgroundColor: isMaxValue
                              ? "#3B82F6"
                              : isHighValue
                              ? "#60A5FA"
                              : "#E0F2FE",
                            borderWidth: isMaxValue ? 2 : isHighValue ? 1 : 0,
                            borderColor: isMaxValue
                              ? "#1D4ED8"
                              : isHighValue
                              ? "#3B82F6"
                              : "transparent",
                          },
                        ]}
                      />
                      {(isMaxValue || isHighValue) && (
                        <View style={styles.barTooltip}>
                          <Text style={styles.barTooltipText}>{bar.value}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <View style={styles.xAxis}>
                {chartData.map((bar, index) => (
                  <Text key={index} style={styles.xAxisLabel}>
                    {bar.label}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Spending Limit */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.spendingLimitHeader}>
            <Text style={styles.sectionTitle}>Hạn mức chi tiêu</Text>
            <TouchableOpacity>
              <Text style={styles.viewMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spendingLimitList}>
            {spendingLimits.map((limit, index) => {
              const percentage = (limit.spent / limit.limit) * 100;
              const isOverLimit = limit.spent > limit.limit;

              return (
                <View key={index} style={styles.spendingLimitItem}>
                  <View style={styles.spendingLimitLeft}>
                    <View
                      style={[
                        styles.spendingLimitIconContainer,
                        { backgroundColor: limit.iconColor + "20" },
                      ]}
                    >
                      <Text style={styles.spendingLimitIcon}>{limit.icon}</Text>
                    </View>
                    <View style={styles.spendingLimitInfo}>
                      <Text style={styles.spendingLimitName}>{limit.name}</Text>
                      <View style={styles.spendingLimitDetails}>
                        <Text style={styles.spendingLimitLabel}>
                          Hạn mức: {formatCurrency(limit.limit)}
                        </Text>
                        <Text
                          style={[
                            styles.spendingLimitSpent,
                            { color: limit.statusColor },
                          ]}
                        >
                          Đã tiêu: {formatCurrency(limit.spent)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.spendingLimitRight}>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: limit.statusColor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressPercentage}>
                        {Math.round(percentage)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Selection Modal */}
      <SelectionModal
        visible={isAddModalVisible}
        onClose={handleModalClose}
        onIncomePress={handleIncomePress}
        onExpensePress={handleExpensePress}
      />

      {/* Transaction Form */}
      <TransactionForm
        visible={isTransactionFormVisible}
        onClose={handleTransactionFormClose}
        type={transactionType}
        onSubmit={handleTransactionSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  searchContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
  },
  activeIconButton: {
    backgroundColor: "#3B82F6",
  },
  activeIconText: {
    color: "#FFFFFF",
  },
  monthlySpendingCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#E0F2FE",
    borderRadius: 16,
    padding: 20,
  },
  monthlySpendingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthlySpendingLeft: {
    flex: 1,
  },
  monthlySpendingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#3B82F6",
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 14,
    color: "#3B82F6",
  },
  balanceBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryScrollView: {
    flex: 1,
    marginLeft: 12,
  },
  categoryScrollContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 20,
  },
  addCategoryButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "bold",
  },
  categoryCard: {
    width: 120,
    borderRadius: 12,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  transactionListContainer: {
    borderRadius: 12,
    maxHeight: 300, // Limit height to enable scrolling
    padding: 6,
  },
  transactionScrollView: {
    maxHeight: 300,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  transactionEmptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  emptyStateIcon: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorFolderImage: {
    width: 80,
    height: 80,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  createTransactionLink: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 1,
    marginVertical: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
  },
  transactionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  noResultsContainer: {
    padding: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerContainer: {
    position: "relative",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
    color: "#1F2937",
    marginRight: 4,
    fontWeight: "500",
  },
  chevronIcon: {
    fontSize: 12,
    color: "#6B7280",
    transform: [{ rotate: "0deg" }],
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  datePickerDropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    minWidth: 120,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedDateOption: {
    backgroundColor: "#E0F2FE",
  },
  dateOptionText: {
    fontSize: 14,
    color: "#1F2937",
  },
  selectedDateOptionText: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  overviewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  overviewLeft: {
    flex: 1,
  },
  overviewValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  chartIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  barChartIcon: {
    fontSize: 20,
  },
  chartContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  barChart: {
    height: 180,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  yAxis: {
    width: 35,
    height: 140,
    justifyContent: "space-between",
    marginRight: 12,
    paddingTop: 10,
  },
  yAxisLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "right",
    fontWeight: "500",
  },
  barChartArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingBottom: 25,
    paddingTop: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    position: "relative",
    marginHorizontal: 3,
  },
  bar: {
    width: "80%",
    borderRadius: 6,
    minHeight: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  barTooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "#1F2937",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  barTooltipText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  xAxis: {
    position: "absolute",
    bottom: 0,
    left: 47,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  xAxisLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    flex: 1,
    fontWeight: "500",
  },
  spendingLimitEmptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  spendingLimitEmptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  createFundButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFundText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  spendingLimitList: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  spendingLimitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  spendingLimitLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  spendingLimitIcon: {
    fontSize: 24,
  },
  spendingLimitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  spendingLimitRight: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  spendingLimitAmount: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  spendingLimitStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  spendingLimitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  spendingLimitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  spendingLimitInfo: {
    flex: 1,
  },
  spendingLimitDetails: {
    gap: 2,
  },
  spendingLimitLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  spendingLimitSpent: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressBarContainer: {
    alignItems: "center",
    width: "100%",
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
