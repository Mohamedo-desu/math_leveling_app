import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/components/StreakBade.styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatsHeader from "../StatsHeader";

const StreakBadge = () => {
  const streak = useAppStore((s) => s.streak);
  const streakInactive = useAppStore((s) => s.streakInactive);
  const loadStreak = useAppStore((s) => s.loadStreak);
  const navigate = useAppStore((s) => s.navigate);

  const { top } = useSafeAreaInsets();

  const orientation = useAppStore((s) => s.orientation);

  const { colors } = useTheme();

  // Determine color based on streakInactive
  const streakColor =
    streakInactive || streak === 0 ? colors.gray[500] : colors.streak;

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  return (
    <LinearGradient
      colors={[Colors.primary, "transparent"]}
      start={{ x: 0.5, y: 0.1 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.streakContainer,
        orientation === "portrait"
          ? styles.streakPortrait
          : styles.streakLandscape,
      ]}
    >
      <View style={[styles.streakInner, { marginTop: top + 10 }]}>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigate("Settings")}
          >
            <Ionicons
              name="settings"
              size={orientation === "portrait" ? 25 : 20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.flameRow,
            orientation === "portrait"
              ? [
                  styles.flamePortrait,
                  {
                    backgroundColor: colors.isDark
                      ? "rgba(0,0,0,.1)"
                      : "rgba(255,255,255,.3)",
                  },
                ]
              : styles.flameLandscape,
          ]}
        >
          <Ionicons
            name="flame"
            size={orientation === "portrait" ? 50 : 20}
            color={streakColor}
          />
          <AnimatedNumbers
            includeComma
            animateToNumber={streak}
            fontStyle={[
              styles.streakText,
              {
                color: streakColor,
                fontSize: orientation === "portrait" ? 50 : 20,
              },
            ]}
          />
        </View>
        <StatsHeader />
      </View>
    </LinearGradient>
  );
};

export default memo(StreakBadge);
