import CustomText from "@/components/CustomText";
import StatsHeader from "@/components/StatsHeader";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useTheme } from "@/context/ThemeContext";
import { mmkvStorage } from "@/store/storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPERATORS = ["+", "-"];
const INITIAL_OPERAND_MAX = 10;
const MAX_OPERAND_MAX = 999;
const CHOICE_COUNT = 4;
const STREAK_KEY = "streakCount";
const STREAK_TIME_KEY = "streakTimestamp";

// 24 hours in ms
const DAY_MS = 24 * 60 * 60 * 1000;

type Feedback = "correct" | "wrong" | null;

type StatsState = {
  corrected: number;
  failed: number;
  questions: number;
  level: number;
};

type StatsAction =
  | { type: "CORRECT" }
  | { type: "WRONG" }
  | { type: "NEW_QUESTION" }
  | { type: "RESET_STATS" }
  | { type: "INCREMENT_LEVEL" };

function statsReducer(state: StatsState, action: StatsAction): StatsState {
  switch (action.type) {
    case "CORRECT":
      return { ...state, corrected: state.corrected + 1 };
    case "WRONG":
      return { ...state, failed: state.failed + 1 };
    case "NEW_QUESTION":
      return { ...state, questions: state.questions + 1 };
    case "RESET_STATS":
      return { ...state, corrected: 0, failed: 0, questions: 0 };
    case "INCREMENT_LEVEL":
      return { ...state, level: state.level + 1 };
    default:
      return state;
  }
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function generateChoices(
  correct: number,
  op1: number,
  op2: number,
  operator: "+" | "-"
): number[] {
  const choices = new Set<number>([correct]);
  while (choices.size < CHOICE_COUNT) {
    let wrong: number;
    const rand = Math.random();
    if (rand < 0.3) {
      const offset = getRandomInt(5) + 1;
      wrong = correct + (Math.random() < 0.5 ? offset : -offset);
    } else if (operator === "-" && rand < 0.6) {
      wrong = op2 - op1;
    } else {
      wrong = Math.max(0, correct + (getRandomInt(21) - 10));
    }
    if (wrong !== correct) choices.add(wrong);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

// Memoized Streak Badge
const StreakBadge = React.memo(
  ({
    streak,
    color,
    textColor,
  }: {
    streak: number;
    color: string;
    textColor: string;
  }) => (
    <View style={styles.streakContainer}>
      <Ionicons name="flame" size={50} color={color} />
      <AnimatedNumbers
        includeComma
        animateToNumber={streak}
        fontStyle={{ ...styles.streakText, color: textColor }}
      />
    </View>
  )
);

// Memoized Question Row
const QuestionRow = React.memo(
  ({
    operand1,
    operator,
    operand2,
  }: {
    operand1: number;
    operator: string;
    operand2: number;
  }) => (
    <View style={styles.questionRow}>
      <CustomText style={styles.operand}>{operand1}</CustomText>
      <CustomText style={styles.operand}>{operator}</CustomText>
      <CustomText style={styles.operand}>{operand2}</CustomText>
    </View>
  )
);

// Memoized Choices Grid
const ChoicesGrid = React.memo(
  ({
    choices,
    selected,
    feedback,
    onSelect,
    colors,
  }: {
    choices: number[];
    selected: number | null;
    feedback: Feedback;
    onSelect: (c: number) => void;
    colors: any;
  }) => (
    <View style={styles.choicesContainer}>
      {choices.map((c) => (
        <TouchableOpacity
          key={c}
          style={[
            styles.choiceButton,
            {
              backgroundColor:
                selected === null
                  ? colors.card
                  : c === selected
                  ? feedback === "correct"
                    ? Colors.correct
                    : Colors.wrong
                  : colors.card,
            },
          ]}
          onPress={() => onSelect(c)}
          disabled={selected !== null}
          activeOpacity={0.8}
        >
          <CustomText variant="h1" fontWeight="bold">
            {c}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  )
);

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [operand1, setOperand1] = useState(0);
  const [operand2, setOperand2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [correct, setCorrect] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [stats, statsDispatch] = useReducer(statsReducer, {
    corrected: 0,
    failed: 0,
    questions: 0,
    level: 1,
  });

  const [streak, setStreak] = useState<number>(0);
  const [streakInactive, setStreakInactive] = useState(false);

  // Load streak on launch and check 24h/48h reset
  useEffect(() => {
    const savedCount = parseInt(mmkvStorage.getItem(STREAK_KEY) || "0", 10);
    const savedTs = parseInt(mmkvStorage.getItem(STREAK_TIME_KEY) || "0", 10);
    const now = Date.now();
    const elapsed = now - savedTs;

    if (elapsed > 48 * 60 * 60 * 1000) {
      // More than 48h: reset streak
      mmkvStorage.setItem(STREAK_KEY, "0");
      setStreak(0);
      setStreakInactive(false);
    } else if (elapsed > 24 * 60 * 60 * 1000) {
      // Between 24h and 48h: streak is inactive
      setStreak(savedCount);
      setStreakInactive(true);
    } else {
      setStreak(savedCount);
      setStreakInactive(false);
    }
  }, []);

  const recordLevelUp = useCallback(() => {
    const now = Date.now();
    const savedTs = parseInt(mmkvStorage.getItem(STREAK_TIME_KEY) || "0", 10);

    if (now - savedTs > DAY_MS) {
      // Only count one level-up per 24h
      const next = streak + 1;
      mmkvStorage.setItem(STREAK_KEY, next.toString());
      mmkvStorage.setItem(STREAK_TIME_KEY, now.toString());
      setStreak(next);
    }
  }, [streak]);

  const newQuestion = useCallback(() => {
    const scaledMax = INITIAL_OPERAND_MAX * stats.level;
    const operandMax = Math.min(scaledMax, MAX_OPERAND_MAX);
    const op = OPERATORS[getRandomInt(OPERATORS.length - 1)] as "+" | "-";
    const a = getRandomInt(operandMax);
    const b = getRandomInt(operandMax);
    const answer = op === "+" ? a + b : a - b;

    setOperand1(a);
    setOperand2(b);
    setOperator(op);
    setCorrect(answer);
    setChoices(generateChoices(answer, a, b, op));
    setSelected(null);
    setFeedback(null);
    statsDispatch({ type: "NEW_QUESTION" });
  }, [stats.level]);

  // Mount
  useEffect(() => {
    newQuestion();
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [newQuestion]);

  // Next after selection
  useEffect(() => {
    if (selected !== null) {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(newQuestion, 100);
    }
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [selected, newQuestion]);

  const onSelect = useCallback(
    async (choice: number) => {
      await Haptics.selectionAsync();
      setSelected(choice);
      const isCorrect = choice === correct;
      setFeedback(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        statsDispatch({ type: "CORRECT" });
        if (stats.corrected + 1 >= 10) {
          statsDispatch({ type: "INCREMENT_LEVEL" });
          statsDispatch({ type: "RESET_STATS" });
          recordLevelUp();
        }
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        statsDispatch({ type: "WRONG" });
      }
    },
    [correct, recordLevelUp, stats.corrected]
  );

  // Memoize choices to avoid unnecessary re-renders
  const memoizedChoices = useMemo(() => choices, [choices]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: colors.background,
        },
      ]}
    >
      <StreakBadge
        streak={streak}
        color={streakInactive ? colors.gray[500] : Colors.streak}
        textColor={streakInactive ? colors.gray[500] : Colors.streak}
      />
      <StatsHeader
        corrected={stats.corrected}
        failed={stats.failed}
        questions={stats.questions}
        level={stats.level}
      />
      <QuestionRow
        operand1={operand1}
        operator={operator}
        operand2={operand2}
      />
      <ChoicesGrid
        choices={memoizedChoices}
        selected={selected}
        feedback={feedback}
        onSelect={onSelect}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    marginTop: 16,
  },
  streakText: {
    color: Colors.streak,
    fontWeight: "bold",
    fontSize: 50,
    lineHeight: 56,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
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
  operand: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
  },
});
