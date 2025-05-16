import QuestionCard from "@/components/HomeScreen/QuestionCard";
import StreakBadge from "@/components/HomeScreen/StreakBadge";
import StatsHeader from "@/components/StatsHeader";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: colors.background,
        },
      ]}
    >
      <StreakBadge />
      <StatsHeader />
      <QuestionCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
  },
});
