import { useAppStore } from "@/store/useAppStore";
import React, { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ChoicesGrid from "./ChoicesGrid";
import QuestionRow from "./QuestionRow";

const QuestionCard = () => {
  const newQuestion = useAppStore((s) => s.newQuestion);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  return (
    <View style={styles.container}>
      <QuestionRow />
      <ChoicesGrid />
    </View>
  );
};

export default memo(QuestionCard);

const styles = StyleSheet.create({
  container: {
    gap: "10%",
  },
});
