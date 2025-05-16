import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useAppStore } from "@/store/useAppStore";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const QuestionRow = () => {
  const operand1 = useAppStore((s) => s.operand1);
  const operand2 = useAppStore((s) => s.operand2);
  const operator = useAppStore((s) => s.operator);
  return (
    <View style={styles.questionRow}>
      <CustomText style={styles.operand}>{operand1}</CustomText>
      <CustomText style={styles.operand}>{operator}</CustomText>
      <CustomText style={styles.operand}>{operand2}</CustomText>
    </View>
  );
};

export default memo(QuestionRow);

const styles = StyleSheet.create({
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.secondary,
    width: "90%",
    height: 100,
    alignSelf: "center",
    borderRadius: Spacing.inputBorderRadius,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  operand: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
    color: Colors.white,
  },
});
