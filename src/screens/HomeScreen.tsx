import CustomText from "@/components/CustomText";
import QuestionCard from "@/components/HomeScreen/QuestionCard";
import StreakBadge from "@/components/HomeScreen/StreakBadge";
import { useTheme } from "@/context/ThemeContext";
import { useVersion } from "@/hooks/useVersion";
import { useAppStore } from "@/store/useAppStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const orientation = useAppStore((s) => s.orientation);

  const { currentVersion } = useVersion();

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width: "100%",
    minHeight: "100%",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    position: "absolute",
    left: 0,
    right: 0,
  },
  versionPortrait: {
    // Add portrait-specific styles if needed
  },
});
