import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import React from "react";
import { StyleSheet, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import CustomText from "./CustomText";

interface StatsHeaderProps {
  corrected: number;
  failed: number;
  questions: number;
  level: number;
}

const StatsHeader = ({
  corrected,
  failed,
  questions,
  level,
}: StatsHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <CustomText style={styles.label}>corrected</CustomText>
        <AnimatedNumbers
          includeComma
          animateToNumber={corrected}
          fontStyle={styles.corrected}
        />
      </View>
      <View style={styles.item}>
        <CustomText style={styles.label}>Failed</CustomText>
        <CustomText style={styles.failed}>{failed}</CustomText>
      </View>

      <View style={styles.item}>
        <CustomText style={styles.label}>questions</CustomText>
        <CustomText style={styles.questions}>{questions}</CustomText>
      </View>
      <View style={styles.item}>
        <CustomText style={styles.label}>Level</CustomText>
        <CustomText style={styles.level}>{level}</CustomText>
      </View>
    </View>
  );
};

export default StatsHeader;

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
