import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
