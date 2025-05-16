import { Spacing } from "@/constants/Spacing";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import CustomText from "./CustomText";

const Corrected = memo(() => {
  const corrected = useAppStore((s) => s.stats.corrected);
  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Corrected</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={corrected}
        fontStyle={[styles.corrected, { color: colors.text }]}
      />
    </View>
  );
});
const Failed = memo(() => {
  const failed = useAppStore((s) => s.stats.failed);
  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Failed</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={failed}
        fontStyle={[styles.failed, { color: colors.text }]}
      />
    </View>
  );
});
const Questions = memo(() => {
  const questions = useAppStore((s) => s.stats.questions);
  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Questions</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={questions}
        fontStyle={[styles.questions, { color: colors.text }]}
      />
    </View>
  );
});
const Level = memo(() => {
  const level = useAppStore((s) => s.stats.level);
  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Level</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={level}
        fontStyle={[styles.level, { color: colors.text }]}
      />
    </View>
  );
});

const StatsHeader = () => {
  return (
    <View style={styles.container}>
      <Corrected />
      <Failed />
      <Questions />
      <Level />
    </View>
  );
};

export default memo(StatsHeader);

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: Spacing.inputBorderRadius,
    alignSelf: "center",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {},
  corrected: {},
  failed: {},
  questions: {},
  level: {},
});
