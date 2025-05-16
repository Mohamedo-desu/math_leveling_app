import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";

const StreakBadge = () => {
  const streak = useAppStore((s) => s.streak);
  const streakInactive = useAppStore((s) => s.streakInactive);
  const loadStreak = useAppStore((s) => s.loadStreak);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  const color = streakInactive ? Colors.lightGray[500] : Colors.streak;
  const textColor = streakInactive ? Colors.lightGray[500] : Colors.streak;

  return (
    <View style={styles.streakContainer}>
      <Ionicons name="flame" size={50} color={color} />
      <AnimatedNumbers
        includeComma
        animateToNumber={streak}
        fontStyle={{ ...styles.streakText, color: textColor }}
      />
    </View>
  );
};

export default memo(StreakBadge);

const styles = StyleSheet.create({
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    marginTop: 16,
  },
  streakText: {
    color: Colors.streak,
    fontWeight: "bold",
    fontSize: 50,
    lineHeight: 56,
  },
});
