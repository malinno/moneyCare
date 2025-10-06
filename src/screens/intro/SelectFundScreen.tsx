import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@contexts/AuthContext";

const { width, height } = Dimensions.get("window");

interface FundItem {
  id: string;
  name: string;
  percentage: number;
  icon: any;
  color: string;
}

const FUND_TYPES: FundItem[] = [
  {
    id: "essentials",
    name: "Cần thiết",
    percentage: 55,
    icon: require("@assets/images/canthiet.png"),
    color: "#8B5CF6",
  },
  {
    id: "education",
    name: "Đào tạo",
    percentage: 10,
    icon: require("@assets/images/daotao.png"),
    color: "#06B6D4",
  },
  {
    id: "enjoyment",
    name: "Hưởng thụ",
    percentage: 10,
    icon: require("@assets/images/huong thu.png"),
    color: "#F59E0B",
  },
  {
    id: "savings",
    name: "Tiết kiệm",
    percentage: 10,
    icon: require("@assets/images/tietkiem.png"),
    color: "#EF4444",
  },
  {
    id: "charity",
    name: "Từ thiện",
    percentage: 5,
    icon: require("@assets/images/tuthien.png"),
    color: "#EC4899",
  },
  {
    id: "freedom",
    name: "Tự do",
    percentage: 10,
    icon: require("@assets/images/tudo.png"),
    color: "#10B981",
  },
];

const CUSTOM_FUNDS: FundItem[] = [
  {
    id: "essentials",
    name: "Cần thiết",
    percentage: 55,
    icon: require("@assets/images/canthiet.png"),
    color: "#8B5CF6",
  },
  {
    id: "education",
    name: "Đào tạo",
    percentage: 5,
    icon: require("@assets/images/daotao.png"),
    color: "#06B6D4",
  },
  {
    id: "enjoyment",
    name: "Hưởng thụ",
    percentage: 10,
    icon: require("@assets/images/huong thu.png"),
    color: "#F59E0B",
  },
  {
    id: "savings",
    name: "Tiết kiệm",
    percentage: 28,
    icon: require("@assets/images/tietkiem.png"),
    color: "#EF4444",
  },
  {
    id: "charity",
    name: "Từ thiện",
    percentage: 2,
    icon: require("@assets/images/tuthien.png"),
    color: "#EC4899",
  },
  {
    id: "freedom",
    name: "Tự do",
    percentage: 5,
    icon: require("@assets/images/tudo.png"),
    color: "#10B981",
  },
];

export const SelectFundScreen: React.FC = () => {
  const navigation = useNavigation();
  const { refreshUser } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // State
  const [selectedFundType, setSelectedFundType] = useState<
    "template" | "custom"
  >("template");

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
    // Navigate to income screen
    navigation.navigate("Income" as never);
  };

  const handleCreateCustom = () => {
    // Navigate to custom fund creation screen
    // For now, just switch to custom view
    setSelectedFundType("custom");
  };

  const renderFundCard = (funds: FundItem[], title: string) => (
    <Animated.View
      style={[
        styles.fundCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }],
        },
      ]}
    >
      <Text style={styles.fundCardTitle}>{title}</Text>
      <View style={styles.fundGrid}>
        {/* Row 1: First 3 items */}
        <View style={styles.fundRow}>
          {funds.slice(0, 3).map((fund) => (
            <View key={fund.id} style={styles.fundItem}>
              <View style={styles.fundIconContainer}>
                <Image
                  source={fund.icon}
                  style={styles.fundIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.fundName}>{fund.name}</Text>
              <Text style={styles.fundPercentage}>{fund.percentage}%</Text>
            </View>
          ))}
        </View>
        {/* Row 2: Last 3 items */}
        <View style={styles.fundRow}>
          {funds.slice(3, 6).map((fund) => (
            <View key={fund.id} style={styles.fundItem}>
              <View style={styles.fundIconContainer}>
                <Image
                  source={fund.icon}
                  style={styles.fundIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.fundName}>{fund.name}</Text>
              <Text style={styles.fundPercentage}>{fund.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

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
          <Text style={styles.title}>Lựa chọn quỹ tiết kiệm?</Text>
        </Animated.View>

        {/* Fund Cards */}
        <View style={styles.fundCardsContainer}>
          {renderFundCard(FUND_TYPES, "Quỹ tiết kiệm mẫu")}
          {renderFundCard(CUSTOM_FUNDS, "Quỹ tiết kiệm hiện tại")}
        </View>

        {/* Create Custom Fund Button */}
        <Animated.View
          style={[
            styles.createCustomContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.createCustomButton}
            onPress={handleCreateCustom}
          >
            <View style={styles.plusIcon}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.createCustomText}>Tự tạo quỹ tiết kiệm</Text>
        </Animated.View>

        {/* Continue Button */}
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
          <Text style={styles.footerText}>Lựa chọn quỹ tiết kiệm sau</Text>
        </Animated.View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 36,
  },
  fundCardsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  fundCard: {
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fundCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  fundGrid: {
    flexDirection: "column",
    gap: 20,
  },
  fundRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  fundItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  fundIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fundIcon: {
    width: 24,
    height: 24,
  },
  fundName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    marginBottom: 4,
  },
  fundPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  createCustomContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  createCustomButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  plusIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6B7280",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  createCustomText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    height: 56,
    width: "100%",
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
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
});
