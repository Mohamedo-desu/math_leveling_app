import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import StatsHeader from "../StatsHeader";

const StreakBadge = () => {
  const streak = useAppStore((s) => s.streak);
  const streakInactive = useAppStore((s) => s.streakInactive);
  const loadStreak = useAppStore((s) => s.loadStreak);
  const navigate = useAppStore((s) => s.navigate);

  const { colors } = useTheme();

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  return (
    <LinearGradient
      colors={[Colors.primary, "transparent"]}
      start={{ x: 0.5, y: 0.1 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.streakContainer}
    >
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigate("Settings")}
        >
          <Ionicons name="settings" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="flame" size={50} color={colors.text} />
        <AnimatedNumbers
          includeComma
          animateToNumber={streak}
          fontStyle={[styles.streakText, { color: colors.text }]}
        />
      </View>
      <StatsHeader />
    </LinearGradient>
  );
};

export default memo(StreakBadge);

const styles = StyleSheet.create({
  streakContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    width: "100%",
    height: 300,
  },
  streakText: {
    fontWeight: "bold",
    fontSize: 50,
    lineHeight: 56,
  },
  settingsButton: {},
  settingsContainer: {
    width: "90%",
    alignItems: "flex-end",
  },
});
