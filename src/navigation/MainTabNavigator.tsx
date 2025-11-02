import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@contexts/ThemeContext";
import { MainTabParamList, HomeStackParamList } from "@/types/index";
import {
  HomeScreen,
  TransactionScreen,
  StatisticsScreen,
  ProfileScreen,
  CreateCategoryScreen,
} from "@screens/main";
import { TabIcon } from "@components/common/TabIcon";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<HomeStackParamList>();

// We create a stack navigator for the Home tab
const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
  </Stack.Navigator>
);

export const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconName: "home" | "thu_chi" | "thong_ke" | "user" | "add";

          switch (route.name) {
            case "HomeStack": // Changed from "Home"
              iconName = "home";
              break;
            case "Transactions":
              iconName = "thu_chi";
              break;
            case "AddTransaction":
              iconName = "add";
              break;
            case "Statistics":
              iconName = "thong_ke";
              break;
            case "Profile":
              iconName = "user";
              break;
            default:
              iconName = "home";
          }

          return <TabIcon name={iconName} focused={focused} size={size} />;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral.mountainMist,
        tabBarStyle: {
          backgroundColor: theme.colors.background.flashWhite,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 8,
          height: 80,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 0,
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="HomeStack" // Changed from "Home"
        component={HomeNavigator} // Use the stack navigator
        options={{
          tabBarLabel: "Trang chủ",
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{
          tabBarLabel: "Thu - chi",
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={HomeScreen} // This still goes to home screen to show a modal
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to home to show the modal
            navigation.navigate("HomeStack", { screen: "Home", params: { showAddModal: true } });
          },
        })}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButtonContainer}>
              <View style={[styles.addButton, { backgroundColor: theme.colors.primary[500] }]}>
                <TabIcon name="add" focused={true} size={24} />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: "Thống kê",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Cá nhân",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    marginTop: -15,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    width: 50,
    height: 50,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
