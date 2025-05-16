import { mmkvStorage } from "@/store/storage";
import { Feedback, StatsState } from "@/types/homeScreen";
import {
  generateChoices,
  getRandomInt,
  INITIAL_OPERAND_MAX,
  MAX_OPERAND_MAX,
  OPERATORS,
  STREAK_KEY,
  STREAK_TIME_KEY,
} from "@/utils";
import * as Notifications from "expo-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STREAK_REMINDER_ID = "streak-reminder";

function getDaysDiff(date1: string, date2: string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

async function scheduleStreakReminderForToday() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 0, 0, 0); // schedule at 11:00 PM today
  if (endOfDay < now) endOfDay.setDate(endOfDay.getDate() + 1);
  const secondsUntil = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);

  // Cancel any existing reminder
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID);

  // Schedule a one-off notification
  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_REMINDER_ID,
    content: {
      title: "Don't lose your streak!",
      body: "Level up today to keep your streak going.",
      sound: true,
    },
    trigger: {
      type: "timeInterval",
      seconds: secondsUntil,
      repeats: false,
    },
  });
}

async function cancelStreakReminder() {
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID);
}

// ----- Stats Slice -----
type StatsSlice = {
  stats: StatsState;
  incrementCorrect: () => void;
  incrementWrong: () => void;
  incrementQuestions: () => void;
  incrementLevel: () => void;
  resetStats: () => void;
};
const createStatsSlice = (set: any): StatsSlice => ({
  stats: { corrected: 0, failed: 0, questions: 0, level: 1 },
  incrementCorrect: () =>
    set((state: any) => ({
      stats: { ...state.stats, corrected: state.stats.corrected + 1 },
    })),
  incrementWrong: () =>
    set((state: any) => ({
      stats: { ...state.stats, failed: state.stats.failed + 1 },
    })),
  incrementQuestions: () =>
    set((state: any) => ({
      stats: { ...state.stats, questions: state.stats.questions + 1 },
    })),
  incrementLevel: () =>
    set((state: any) => ({
      stats: { ...state.stats, level: state.stats.level + 1 },
    })),
  resetStats: () =>
    set((state: any) => ({
      stats: { ...state.stats, corrected: 0, failed: 0, questions: 0 },
    })),
});

// ----- Streak Slice -----
type StreakSlice = {
  streak: number;
  streakInactive: boolean;
  loadStreak: () => void;
  recordLevelUp: () => void;
};
const createStreakSlice = (set: any, get: any): StreakSlice => ({
  streak: 0,
  streakInactive: false,
  loadStreak: async () => {
    const savedCount = parseInt(mmkvStorage.getItem(STREAK_KEY) || "0", 10);
    const lastStreakDate = mmkvStorage.getItem(STREAK_TIME_KEY) || "";
    const today = new Date().toLocaleDateString("en-CA");

    if (lastStreakDate) {
      const daysDiff = getDaysDiff(today, lastStreakDate);

      if (daysDiff >= 2) {
        mmkvStorage.setItem(STREAK_KEY, "0");
        mmkvStorage.setItem(STREAK_TIME_KEY, "");
        set({ streak: 0, streakInactive: false });
        await cancelStreakReminder();
      } else if (daysDiff === 1) {
        set({ streak: savedCount, streakInactive: true });
        await scheduleStreakReminderForToday();
      } else {
        set({ streak: savedCount, streakInactive: false });
        await cancelStreakReminder();
      }
    } else {
      set({ streak: savedCount, streakInactive: false });
      await cancelStreakReminder();
    }
  },
  recordLevelUp: async () => {
    const today = new Date().toLocaleDateString("en-CA");
    const lastStreakDate = mmkvStorage.getItem(STREAK_TIME_KEY) || "";
    const streak = get().streak;
    const daysDiff = lastStreakDate ? getDaysDiff(today, lastStreakDate) : null;

    if (
      !lastStreakDate ||
      streak === 0 ||
      (daysDiff !== null && daysDiff >= 2)
    ) {
      mmkvStorage.setItem(STREAK_KEY, "1");
      mmkvStorage.setItem(STREAK_TIME_KEY, today);
      set({ streak: 1, streakInactive: false });
      await cancelStreakReminder();
      return;
    }

    if (daysDiff === 1) {
      const next = streak + 1;
      mmkvStorage.setItem(STREAK_KEY, next.toString());
      mmkvStorage.setItem(STREAK_TIME_KEY, today);
      set({ streak: next, streakInactive: false });
      await cancelStreakReminder();
    } else if (daysDiff === 0) {
      // Already updated today, just cancel any pending reminder
      await cancelStreakReminder();
      return;
    }
  },
});

// ----- Question Slice -----
type QuestionSlice = {
  operand1: number;
  operand2: number;
  operator: "+" | "-";
  correct: number;
  choices: number[];
  selected: number | null;
  feedback: Feedback;
  newQuestion: () => void;
  onSelect: (choice: number) => void;
};
const createQuestionSlice = (set: any, get: any): QuestionSlice => ({
  operand1: 0,
  operand2: 0,
  operator: "+",
  correct: 0,
  choices: [],
  selected: null,
  feedback: null,
  newQuestion: () => {
    const { level } = get().stats;
    const scaledMax = INITIAL_OPERAND_MAX * level;
    const operandMax = Math.min(scaledMax, MAX_OPERAND_MAX);
    const op = OPERATORS[getRandomInt(OPERATORS.length - 1)] as "+" | "-";
    const a = getRandomInt(operandMax);
    const b = getRandomInt(operandMax);
    const answer = op === "+" ? a + b : a - b;
    set({
      operand1: a,
      operand2: b,
      operator: op,
      correct: answer,
      choices: generateChoices(answer, a, b, op),
      selected: null,
      feedback: null,
    });
    get().incrementQuestions();
  },
  onSelect: (choice: number) => {
    const { correct, stats } = get();
    const isCorrect = choice === correct;
    set({ selected: choice, feedback: isCorrect ? "correct" : "wrong" });
    if (isCorrect) {
      get().incrementCorrect();
      if (stats.corrected + 1 >= 10) {
        get().incrementLevel();
        get().resetStats();
        get().recordLevelUp();
      }
    } else {
      get().incrementWrong();
    }
    setTimeout(get().newQuestion, 300);
  },
});

// ----- Combine Store -----
type AppState = StatsSlice & StreakSlice & QuestionSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createStatsSlice(set),
      ...createStreakSlice(set, get),
      ...createQuestionSlice(set, get),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state: AppState) => ({
        streak: state.streak,
        streakInactive: state.streakInactive,
      }),
    }
  )
);
