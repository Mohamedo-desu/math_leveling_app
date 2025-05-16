import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ChoicesGrid = () => {
  const choices = useAppStore((s) => s.choices);
  const selected = useAppStore((s) => s.selected);
  const feedback = useAppStore((s) => s.feedback);
  const onSelect = useAppStore((s) => s.onSelect);
  const correct = useAppStore((s) => s.correct);

  const { colors } = useTheme();

  return (
    <View style={styles.choicesContainer}>
      {choices.map((c) => {
        let backgroundColor = colors.card;
        if (selected !== null) {
          if (c === selected) {
            backgroundColor =
              feedback === "correct" ? Colors.correct : Colors.wrong;
          } else if (feedback === "wrong" && c === correct) {
            backgroundColor = Colors.correct;
          }
        }
        return (
          <TouchableOpacity
            key={c}
            style={[styles.choiceButton, { backgroundColor }]}
            onPress={() => onSelect(c)}
            disabled={selected !== null}
            activeOpacity={0.8}
          >
            <CustomText variant="h1" fontWeight="bold">
              {c}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(ChoicesGrid);

const styles = StyleSheet.create({
  choicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  choiceButton: {
    width: "90%",
    height: Spacing.inputHeight,
    borderRadius: Spacing.inputBorderRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});
