import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const navigate = useAppStore((s) => s.navigate);
  const { colors, theme, toggleTheme } = useTheme();

  // Add back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigate("Home");
        return true; // Prevent default behavior (exit app)
      }
    );

    // Cleanup listener on unmount
    return () => backHandler.remove();
  }, [navigate]);
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigate("Home")}
            activeOpacity={0.8}
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back"
              size={Spacing.iconSize}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <CustomText variant="h4" fontWeight="bold">
            Settings
          </CustomText>
        </View>
        <View style={styles.headerRight}></View>
      </View>

      {/* Theme Options */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Theme Options
        </Text>
        <Text style={[styles.placeholder, { color: colors.gray[500] }]}>
          Current theme: {theme}
        </Text>
        <Text
          style={[styles.themeToggle, { color: colors.primary }]}
          onPress={toggleTheme}
        >
          Toggle Theme
        </Text>
      </View>

      {/* Analytics Options */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Analytics Options
        </Text>
        <Text style={[styles.placeholder, { color: colors.gray[500] }]}>
          Analytics controls coming soon...
        </Text>
      </View>

      {/* Tips & Tricks Options */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Tips & Tricks
        </Text>
        <Text style={[styles.placeholder, { color: colors.gray[500] }]}>
          Tips and tricks coming soon...
        </Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  section: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 16,
  },
  themeToggle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    alignSelf: "flex-start",
  },
});
