import CustomText from "@/components/CustomText";
import QuestionCard from "@/components/HomeScreen/QuestionCard";
import StreakBadge from "@/components/HomeScreen/StreakBadge";
import { useTheme } from "@/context/ThemeContext";
import { useVersion } from "@/hooks/useVersion";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { currentVersion } = useVersion();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: colors.background,
        },
      ]}
    >
      <StreakBadge />

      <QuestionCard />

      <CustomText
        style={[
          styles.version,
          { color: colors.gray[500], bottom: insets.bottom + 10 },
        ]}
      >
        v{currentVersion}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    position: "absolute",
    left: 0,
    right: 0,
  },
});
