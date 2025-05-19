import { Spacing } from "@/constants/Spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  corrected: {},
  failed: {},
  questions: {},
  level: {},
});
