import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useAppStore } from "@/store/useAppStore";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import CustomText from "./CustomText";

const Corrected = memo(() => {
  const corrected = useAppStore((s) => s.stats.corrected);
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Corrected</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={corrected}
        fontStyle={styles.corrected}
      />
    </View>
  );
});
const Failed = memo(() => {
  const failed = useAppStore((s) => s.stats.failed);
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Failed</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={failed}
        fontStyle={styles.failed}
      />
    </View>
  );
});
const Questions = memo(() => {
  const questions = useAppStore((s) => s.stats.questions);
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Questions</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={questions}
        fontStyle={styles.questions}
      />
    </View>
  );
});
const Level = memo(() => {
  const level = useAppStore((s) => s.stats.level);
  return (
    <View style={styles.item}>
      <CustomText style={styles.label}>Level</CustomText>
      <AnimatedNumbers
        includeComma
        animateToNumber={level}
        fontStyle={styles.level}
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
  corrected: {
    color: Colors.correct,
  },
  failed: {
    color: Colors.wrong,
  },
  questions: {
    color: Colors.secondary,
  },
  level: {
    color: Colors.secondary,
  },
});
