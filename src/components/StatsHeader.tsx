import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/components/StatsHeader.styles";
import React, { memo } from "react";
import { View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import CustomText from "./CustomText";

const Corrected = memo(() => {
  const corrected = useAppStore((s) => s.stats.corrected);
  const strictMode = useAppStore((s) => s.strictMode);
  const animationDuration = strictMode ? 300 : 1000;

  const { colors } = useTheme();

  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Passed</CustomText>
      <AnimatedNumbers
        animationDuration={animationDuration}
        includeComma
        animateToNumber={corrected}
        fontStyle={[styles.corrected, { color: colors.text }]}
      />
    </View>
  );
});
const Failed = memo(() => {
  const failed = useAppStore((s) => s.stats.failed);
  const strictMode = useAppStore((s) => s.strictMode);
  const animationDuration = strictMode ? 300 : 1000;

  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Failed</CustomText>
      <AnimatedNumbers
        animationDuration={animationDuration}
        includeComma
        animateToNumber={failed}
        fontStyle={[styles.failed, { color: colors.text }]}
      />
    </View>
  );
});
const Questions = memo(() => {
  const questions = useAppStore((s) => s.stats.questions);
  const strictMode = useAppStore((s) => s.strictMode);
  const animationDuration = strictMode ? 300 : 1000;

  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Questions</CustomText>
      <AnimatedNumbers
        animationDuration={animationDuration}
        includeComma
        animateToNumber={questions}
        fontStyle={[styles.questions, { color: colors.text }]}
      />
    </View>
  );
});
const Level = memo(() => {
  const level = useAppStore((s) => s.stats.level);
  const strictMode = useAppStore((s) => s.strictMode);
  const animationDuration = strictMode ? 300 : 1000;
  const { colors } = useTheme();
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Level</CustomText>
      <AnimatedNumbers
        animationDuration={animationDuration}
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
