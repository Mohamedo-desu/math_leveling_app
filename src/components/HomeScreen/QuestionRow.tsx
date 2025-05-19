import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useAppStore } from "@/store/useAppStore";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const QuestionRow = () => {
  const operand1 = useAppStore((s) => s.operand1);
  const operand2 = useAppStore((s) => s.operand2);
  const questionOperator = useAppStore((s) => s.questionOperator);

  const orientation = useAppStore((s) => s.orientation);

  return (
    <View
      style={[
        styles.questionRow,
        orientation === "portrait" ? styles.rowPortrait : styles.rowLandscape,
      ]}
    >
      <CustomText
        style={[
          styles.operand,
          orientation === "portrait"
            ? styles.operandPortrait
            : styles.operandLandscape,
        ]}
      >
        {operand1}
      </CustomText>
      <CustomText
        style={[
          styles.operand,
          orientation === "portrait"
            ? styles.operandPortrait
            : styles.operandLandscape,
        ]}
      >
        {questionOperator}
      </CustomText>
      <CustomText
        style={[
          styles.operand,
          orientation === "portrait"
            ? styles.operandPortrait
            : styles.operandLandscape,
        ]}
      >
        {operand2}
      </CustomText>
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
    backgroundColor: Colors.primary,
    width: "90%",
    alignSelf: "center",
    borderRadius: Spacing.inputBorderRadius,
    borderWidth: 1.5,
    borderColor: Colors.white,
    elevation: 5,
  },
  rowPortrait: {
    height: 100,
    marginBottom: 10,
  },
  rowLandscape: {
    height: 70,
    marginBottom: 5,
  },
  operand: {
    fontWeight: "bold",
    lineHeight: 56,
    color: Colors.white,
  },
  operandPortrait: {
    fontSize: 48,
  },
  operandLandscape: {
    fontSize: 30,
  },
});
