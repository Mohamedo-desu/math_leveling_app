import CustomText from "@/components/CustomText";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/components/QuestionRow.styles";
import React, { memo } from "react";
import { View } from "react-native";

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
