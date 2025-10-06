import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "@screens/auth/LoginScreen";
import { RegisterScreen } from "@screens/auth/RegisterScreen";
import { WelcomeScreen } from "@screens/auth/WelcomeScreen";
import { IntroJarsScreen } from "@screens/intro/IntroJarsScreen";
import { SelectFundScreen } from "@screens/intro/SelectFundScreen";
import { IncomeScreen } from "@screens/intro/IncomeScreen";
import { AuthStackParamList } from "@/types/index";

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="IntroJars" component={IntroJarsScreen} />
      <Stack.Screen name="SelectFund" component={SelectFundScreen} />
      <Stack.Screen name="Income" component={IncomeScreen} />
    </Stack.Navigator>
  );
};
