import { Spacing } from "@/constants/Spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.screenPadding },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  headerButton: { flex: 1 },
  headerRight: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.xs,
    marginVertical: Spacing.sm,
  },
  grid: {
    width: "48%",
    marginBottom: Spacing.sm,
    borderRadius: Spacing.inputBorderRadius,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
});
