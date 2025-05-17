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
  };
  wrongQuestions: WrongQuestion[];
  incrementCorrect: () => void;
  incrementWrong: (wrongQuestion?: WrongQuestion) => void;
  incrementQuestions: () => void;
  incrementLevel: () => void;
  resetStats: () => void;
  resetLifetimeStats: () => void;
};

export const createStatsSlice = (set: any): StatsSlice => ({
  stats: { corrected: 0, failed: 0, questions: 0, level: 1 },
  lifetimeStats: {
    totalCorrect: 0,
    totalWrong: 0,
    totalQuestions: 0,
    highestLevel: 1,
  },
  wrongQuestions: [],
  incrementCorrect: () =>
    set((state: any) => ({
      stats: { ...state.stats, corrected: state.stats.corrected + 1 },
      lifetimeStats: {
        ...state.lifetimeStats,
        totalCorrect: state.lifetimeStats.totalCorrect + 1,
      },
    })),
  incrementWrong: (wrongQuestion?: WrongQuestion) =>
    set((state: any) => ({
      stats: { ...state.stats, failed: state.stats.failed + 1 },
      lifetimeStats: {
        ...state.lifetimeStats,
        totalWrong: state.lifetimeStats.totalWrong + 1,
      },
      wrongQuestions: wrongQuestion
        ? [...state.wrongQuestions, wrongQuestion]
        : state.wrongQuestions,
    })),
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
        highestLevel: 1,
      },
    }));
  },
});
