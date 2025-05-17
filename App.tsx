// App.tsx
import { ThemeProvider } from "@/context/ThemeContext";
import RootLayout from "@/screens/RootLayout";
import { useAppStore } from "@/store/useAppStore";
import { registerRootComponent } from "expo";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const resetStats = useAppStore((s) => s.resetStats);
  useEffect(() => {
    resetStats();
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
