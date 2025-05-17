import { useAppStore } from "@/store/useAppStore";
import React, { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: "5%",
    marginTop: 0,
  },
  containerPortrait: {},
  containerLandscape: {},
});
