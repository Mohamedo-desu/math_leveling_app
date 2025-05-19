import { Spacing } from "@/constants/Spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  choicesContainer: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  choiceButton: {
    borderRadius: Spacing.inputBorderRadius,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    borderWidth: 2,
  },
});
