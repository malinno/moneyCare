import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "./src/providers/index";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProviders>
  );
}
