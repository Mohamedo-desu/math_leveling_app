import { mmkvStorage } from "@/store/storage";

export type WrongQuestion = {
  operand1: number;
  operand2: number;
  operator: "+" | "-";
  correct: number;
  selected: number;
  timestamp: number;
};

export type StatsSlice = {
  stats: import("@/types/homeScreen").StatsState;
  lifetimeStats: {
    totalCorrect: number;
    totalWrong: number;
    totalQuestions: number;
    highestLevel: number;
    mostConsecutiveCorrect: number;
    mostConsecutiveWrong: number;
  };
  wrongQuestions: WrongQuestion[];
  currentConsecutiveCorrect: number;
  currentConsecutiveWrong: number;
  incrementCorrect: () => void;
  incrementWrong: (wrongQuestion?: WrongQuestion) => void;
  incrementQuestions: () => void;
  incrementLevel: () => void;
  resetStats: () => void;
  resetLifetimeStats: () => void;
  strictMode: boolean;
  toggleStrictMode: () => void;
  timerMode: boolean;
  toggleTimerMode: () => void;
};

export const createStatsSlice = (set: any): StatsSlice => ({
  stats: { corrected: 0, failed: 0, questions: 0, level: 1 },
  lifetimeStats: {
    totalCorrect: 0,
    totalWrong: 0,
    totalQuestions: 0,
    highestLevel: 1,
    mostConsecutiveCorrect: 0,
    mostConsecutiveWrong: 0,
  },
  wrongQuestions: [],
  currentConsecutiveCorrect: 0,
  currentConsecutiveWrong: 0,
  strictMode: false,
  toggleStrictMode: () =>
    set((state: any) => ({
      strictMode: !state.strictMode,
    })),
  timerMode: false,
  toggleTimerMode: () =>
    set((state: any) => ({
      timerMode: !state.timerMode,
    })),
  incrementCorrect: () =>
    set((state: any) => {
      const newCurrentCorrect = (state.currentConsecutiveCorrect || 0) + 1;
      const newMostCorrect = Math.max(
        state.lifetimeStats.mostConsecutiveCorrect || 0,
        newCurrentCorrect
      );
      return {
        stats: { ...state.stats, corrected: state.stats.corrected + 1 },
        lifetimeStats: {
          ...state.lifetimeStats,
          totalCorrect: state.lifetimeStats.totalCorrect + 1,
          mostConsecutiveCorrect: newMostCorrect,
        },
        currentConsecutiveCorrect: newCurrentCorrect,
        currentConsecutiveWrong: 0,
      };
    }),
  incrementWrong: (wrongQuestion?: WrongQuestion) =>
    set((state: any) => {
      const newCurrentWrong = (state.currentConsecutiveWrong || 0) + 1;
      const newMostWrong = Math.max(
        state.lifetimeStats.mostConsecutiveWrong || 0,
        newCurrentWrong
      );
      return {
        stats: { ...state.stats, failed: state.stats.failed + 1 },
        lifetimeStats: {
          ...state.lifetimeStats,
          totalWrong: state.lifetimeStats.totalWrong + 1,
          mostConsecutiveWrong: newMostWrong,
        },
        wrongQuestions: wrongQuestion
          ? [...state.wrongQuestions, wrongQuestion]
          : state.wrongQuestions,
        currentConsecutiveCorrect: 0,
        currentConsecutiveWrong: newCurrentWrong,
      };
    }),
  incrementQuestions: () =>
    set((state: any) => ({
      stats: { ...state.stats, questions: state.stats.questions + 1 },
      lifetimeStats: {
        ...state.lifetimeStats,
        totalQuestions: state.lifetimeStats.totalQuestions + 1,
      },
    })),
  incrementLevel: () =>
    set((state: any) => ({
      stats: { ...state.stats, level: state.stats.level + 1 },
      lifetimeStats: {
        ...state.lifetimeStats,
        highestLevel: Math.max(
          state.lifetimeStats.highestLevel,
          state.stats.level + 1
        ),
      },
    })),
  resetStats: () =>
    set((state: any) => ({
      stats: { ...state.stats, corrected: 0, failed: 0, questions: 0 },
    })),
  resetLifetimeStats: () => {
    mmkvStorage.removeItem("stats");
    mmkvStorage.removeItem("lifetimeStats");
    set((state: any) => ({
      stats: { corrected: 0, failed: 0, questions: 0, level: 1 },
      lifetimeStats: {
        totalCorrect: 0,
        totalWrong: 0,
        totalQuestions: 0,
        highestLevel: 0,
        mostConsecutiveCorrect: 0,
        mostConsecutiveWrong: 0,
      },
      currentConsecutiveCorrect: 0,
      currentConsecutiveWrong: 0,
    }));
  },
});
