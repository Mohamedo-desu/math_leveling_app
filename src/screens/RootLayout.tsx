import { useAppStore } from "@/store/useAppStore";
import React from "react";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";

export default function RootLayout() {
  const currentScreen = useAppStore((s) => s.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return <HomeScreen />;
      case "Settings":
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return renderScreen();
}
