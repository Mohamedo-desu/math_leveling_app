import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/components/QuestionCard.styles";
import React, { memo, useEffect } from "react";
import { View } from "react-native";
import ChoicesGrid from "./ChoicesGrid";
import QuestionRow from "./QuestionRow";

const QuestionCard = () => {
  const newQuestion = useAppStore((s) => s.newQuestion);

  const orientation = useAppStore((s) => s.orientation);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  return (
    <View
      style={[
        styles.container,
        orientation === "portrait"
          ? styles.containerPortrait
          : styles.containerLandscape,
      ]}
    >
      <QuestionRow />
      <ChoicesGrid />
    </View>
  );
};

export default memo(QuestionCard);
