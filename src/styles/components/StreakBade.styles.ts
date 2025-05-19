import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  streakContainer: {
    width: "100%",
    alignItems: "center",
  },
  streakPortrait: {
    height: "40%",
    gap: "10%",
  },
  streakLandscape: {
    height: "40%",
    gap: 0,
  },
  streakInner: {
    height: "100%",
    justifyContent: "center",
    gap: "10%",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: 2,
  },
  flameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  flamePortrait: {
    position: "relative",
    top: 0,
    left: 0,

    borderRadius: 50,
    height: 100,
    aspectRatio: 1,
  },
  flameLandscape: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  streakText: {
    fontWeight: "bold",
  },
});
