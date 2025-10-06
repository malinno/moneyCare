import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "@contexts/ThemeContext";
import { MainTabParamList } from "@/types/index";
import {
  HomeScreen,
  TransactionScreen,
  EditTransactionScreen,
  StatisticsScreen,
  ProfileScreen,
} from "@screens/main";
import { TabIcon } from "@components/common/TabIcon";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconName: "home" | "thu_chi" | "thong_ke" | "user" | "add";

          switch (route.name) {
            case "Home":
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
          paddingBottom: 10,
          paddingTop: 8,
          height: 60,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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
        component={TransactionScreen} // Placeholder for now
        options={{
          tabBarLabel: "",
          tabBarButton: (props) => {
            const { onPress, ...restProps } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#3B82F6",
                  borderRadius: 35,
                  width: 60,
                  height: 60,
                  marginTop: -30,
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 3,
                  borderColor: "#FFFFFF",
                }}
              >
                <TabIcon name="add" focused={true} size={28} />
              </TouchableOpacity>
            );
          },
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
      <Tab.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
    </Tab.Navigator>
  );
};
