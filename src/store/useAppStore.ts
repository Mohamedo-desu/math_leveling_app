// store/useAppStore.js
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
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  loadStreak: () => {
    const savedCount = parseInt(mmkvStorage.getItem(STREAK_KEY) || "0", 10);
    const savedTs = parseInt(mmkvStorage.getItem(STREAK_TIME_KEY) || "0", 10);
    const now = Date.now();
    const elapsed = now - savedTs;
    if (elapsed > 48 * 60 * 60 * 1000) {
      mmkvStorage.setItem(STREAK_KEY, "0");
      set({ streak: 0, streakInactive: false });
    } else {
      set({
        streak: savedCount,
        streakInactive: elapsed > 24 * 60 * 60 * 1000,
      });
    }
  },
  recordLevelUp: () => {
    const now = Date.now();
    const savedTs = parseInt(mmkvStorage.getItem(STREAK_TIME_KEY) || "0", 10);
    const { streak } = get();
    if (now - savedTs > 24 * 60 * 60 * 1000) {
      const nextStreak = streak + 1;
      mmkvStorage.setItem(STREAK_KEY, nextStreak.toString());
      mmkvStorage.setItem(STREAK_TIME_KEY, now.toString());
      set({ streak: nextStreak, streakInactive: false });
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
    setTimeout(get().newQuestion, 100);
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
