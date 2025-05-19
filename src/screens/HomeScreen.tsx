import CustomText from "@/components/CustomText";
import QuestionCard from "@/components/HomeScreen/QuestionCard";
import StreakBadge from "@/components/HomeScreen/StreakBadge";
import { useTheme } from "@/context/ThemeContext";
import { useVersion } from "@/hooks/useVersion";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/screen/HomeScreen.styles";
import React, { useEffect, useState } from "react";
import { BackHandler, Platform, ToastAndroid, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [lastBackPress, setLastBackPress] = useState(0);

  const orientation = useAppStore((s) => s.orientation);

  const { currentVersion } = useVersion();

  // Add back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastBackPress < 2000) {
          // If pressed within 2 seconds, exit the app
          BackHandler.exitApp();
          return true;
        }
        // Show toast message and update last press time
        if (Platform.OS === "android") {
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        }
        setLastBackPress(currentTime);
        return true; // Prevent default behavior
      }
    );

    // Cleanup listener on unmount
    return () => backHandler.remove();
  }, [lastBackPress]);

  return (
    <View
      style={[
        styles.container,
        styles.screen,
        {
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        },
      ]}
    >
      <StreakBadge />
      <QuestionCard />
      {orientation === "portrait" && (
        <CustomText
          style={[
            styles.version,
            styles.versionPortrait,
            { color: colors.gray[500], bottom: insets.bottom + 10 },
          ]}
        >
          v{currentVersion}
        </CustomText>
      )}
    </View>
  );
}
