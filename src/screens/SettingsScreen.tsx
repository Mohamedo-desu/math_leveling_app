import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/screen/SettingsScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect } from "react";
import {
  Alert,
  BackHandler,
  Platform,
  ScrollView,
  StyleProp,
  Switch,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Section component with optional icon
interface SectionProps {
  title: string;
  titleColorKey?: "primary" | "secondary";
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  onPressIcon?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
const Section: React.FC<SectionProps> = ({
  title,
  titleColorKey = "primary",
  iconName,
  onPressIcon,
  children,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          padding: Spacing.cardPadding,
          backgroundColor: colors.card,
          borderRadius: Spacing.inputBorderRadius,
        },
        style,
      ]}
    >
      <View style={styles.sectionHeader}>
        <CustomText
          style={{
            fontWeight: "700",
            color: colors[titleColorKey],
            fontSize: 16,
          }}
        >
          {title}
        </CustomText>
        {iconName && (
          <TouchableOpacity
            onPress={onPressIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={iconName} size={20} color={colors[titleColorKey]} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

// StatGrid component
interface StatItem {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string | number;
  label: string;
  iconColor?: string;
}
interface StatGridProps {
  items: StatItem[];
}
const StatGrid: React.FC<StatGridProps> = ({ items }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.statGrid, { backgroundColor: colors.gray[100] }]}>
      {items.map((item, idx) => (
        <View
          key={idx}
          style={[styles.grid, { backgroundColor: colors.gray[200] }]}
        >
          <Ionicons
            name={item.icon}
            size={28}
            color={colors.primary}
            style={{ marginBottom: 6 }}
          />
          <CustomText style={{ marginBottom: 2, fontSize: 13 }}>
            {item.label}
          </CustomText>

          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {item.label === "Probability (Right)" ? (
              // Render static text for Probability
              <CustomText
                style={{ fontSize: 18, color: colors.text, fontWeight: "bold" }}
              >
                {item.value}
              </CustomText>
            ) : (
              // Animate all other stats
              <AnimatedNumbers
                includeComma
                animateToNumber={parseFloat(item.value.toString())}
                fontStyle={{
                  fontSize: 18,
                  color: colors.text,
                  fontWeight: "bold",
                }}
              />
            )}

            {item.label === "Accuracy" && (
              <CustomText
                style={{ fontSize: 14, color: colors.text, marginLeft: 2 }}
              >
                %
              </CustomText>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

// Main SettingsScreen
const SettingsScreen: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const { colors, theme, toggleTheme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const lifetimeStats = useAppStore((s) => s.lifetimeStats);
  const resetLifetimeStats = useAppStore((s) => s.resetLifetimeStats);
  const setOperator = useAppStore((s) => s.setOperator);
  const operator = useAppStore((s) => s.operator);

  const strictMode = useAppStore((s) => s.strictMode);
  const toggleStrictMode = useAppStore((s) => s.toggleStrictMode);

  const timerMode = useAppStore((s) => s.timerMode);
  const toggleTimerMode = useAppStore((s) => s.toggleTimerMode);

  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      navigate("Home");
      return true;
    });
    return () => back.remove();
  }, [navigate]);

  // show confirm alert before resetting stats
  const confirmReset = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Reset all statistics?")) resetLifetimeStats();
    } else {
      Alert.alert(
        "Reset Stats",
        "Are you sure you want to reset all statistics?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: resetLifetimeStats },
        ]
      );
    }
  };

  const analyticsItems: StatItem[] = [
    {
      icon: "help-circle",
      label: "Questions",
      value: lifetimeStats.totalQuestions,
    },
    {
      icon: "checkmark-circle",
      label: "Passed",
      value: lifetimeStats.totalCorrect,
      iconColor: Colors.correct,
    },
    {
      icon: "close-circle",
      label: "Failed",
      value: lifetimeStats.totalWrong,
      iconColor: Colors.wrong,
    },
    {
      icon: "trophy",
      label: "Highest Level",
      value: lifetimeStats.highestLevel,
    },
    {
      icon: "stats-chart",
      label: "Accuracy",
      value: lifetimeStats.totalQuestions
        ? (
            (lifetimeStats.totalCorrect / lifetimeStats.totalQuestions) *
            100
          ).toFixed(1) + "%"
        : "0%",
    },
    {
      icon: "school",
      label: "IQ Level",
      value: lifetimeStats.totalQuestions
        ? Math.round(
            (lifetimeStats.totalCorrect / lifetimeStats.totalQuestions) * 100 +
              lifetimeStats.highestLevel
          )
        : lifetimeStats.highestLevel,
    },
    {
      icon: "calculator",
      label: "Probability (Right)",
      value: lifetimeStats.totalQuestions
        ? (lifetimeStats.totalCorrect / lifetimeStats.totalQuestions).toFixed(3)
        : "0.000",
    },
    {
      icon: "trending-up",
      label: "Consecutive Rights",
      value: lifetimeStats.mostConsecutiveCorrect || 0,
    },
    {
      icon: "trending-down",
      label: "Consecutive Wrongs",
      value: lifetimeStats.mostConsecutiveWrong || 0,
    },
  ];

  const tips = [
    "Break complex problems into smaller, manageable steps.",
    "Double-check your answer by reversing the operation.",
    "Use number bonds and pairs to simplify calculations.",
    "Estimate first, then adjust for accuracy.",
    "Practice mental math daily to build speed and confidence.",
    "Visualize numbers on a number line for addition and subtraction.",
    "Memorize key math facts like squares and multiplication tables.",
    "Look for patterns and shortcuts in problems.",
    "Stay calm and take your time—accuracy is more important than speed.",
    "Challenge yourself with new types of problems regularly.",
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top + 10 },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate("Home")}
          style={styles.headerButton}
        >
          <Ionicons
            name="arrow-back"
            size={Spacing.iconSize}
            color={colors.primary}
          />
        </TouchableOpacity>
        <CustomText variant="h4" fontWeight="bold">
          Settings
        </CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + 32, gap: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Theme Options">
          <CustomText>Current theme: {theme}</CustomText>
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ marginTop: Spacing.sm }}
          >
            <CustomText style={{ textDecorationLine: "underline" }}>
              Toggle Theme
            </CustomText>
          </TouchableOpacity>
        </Section>

        <Section title="Strict Mode" style={{ marginBottom: Spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomText style={{ color: colors.text, fontSize: 13 }}>
                If enabled: any 3 failed questions will restart the game and
                game speed is much faster.
              </CustomText>
            </View>
            <Switch
              value={strictMode}
              onValueChange={toggleStrictMode}
              thumbColor={strictMode ? colors.primary : colors.gray[400]}
              trackColor={{ false: colors.gray[200], true: colors.primary }}
            />
          </View>
        </Section>

        <Section title="Timer Mode" style={{ marginBottom: Spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomText style={{ color: colors.text, fontSize: 13 }}>
                If enabled: a timer ring will appear and decrease unless you
                answer correctly.
              </CustomText>
            </View>
            <Switch
              value={timerMode}
              onValueChange={toggleTimerMode}
              thumbColor={timerMode ? colors.primary : colors.gray[400]}
              trackColor={{ false: colors.gray[200], true: colors.primary }}
            />
          </View>
        </Section>

        <Section title="Practice Operation" style={{ marginTop: Spacing.md }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {["+", "-", "mix"].map((op) => (
              <TouchableOpacity
                key={op}
                onPress={() => setOperator(op as any)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  backgroundColor:
                    operator === op ? colors.primary : colors.gray[200],
                  marginRight: 8,
                }}
              >
                <CustomText
                  style={{
                    color: operator === op ? Colors.white : colors.text,
                    fontWeight: "bold",
                  }}
                >
                  {op === "+"
                    ? "Addition (+)"
                    : op === "-"
                    ? "Subtraction (-)"
                    : "Mixed"}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section
          title="Lifetime Stats"
          titleColorKey="primary"
          iconName="refresh"
          onPressIcon={confirmReset}
          style={{ marginTop: Spacing.md }}
        >
          <StatGrid items={analyticsItems} />
        </Section>

        <Section
          title="Tips & Tricks"
          titleColorKey="secondary"
          style={{ marginTop: Spacing.md }}
        >
          {tips.map((t, i) => (
            <CustomText key={i} style={{ marginBottom: Spacing.xs }}>
              • {t}
            </CustomText>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
