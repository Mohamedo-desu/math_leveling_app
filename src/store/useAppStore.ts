import {
  createNavigationSlice,
  NavigationSlice,
} from "@/store/navigationSlice";
import { createQuestionSlice, QuestionSlice } from "@/store/questionSlice";
import { createStatsSlice, StatsSlice } from "@/store/statsSlice";
import { mmkvStorage } from "@/store/storage";
import { createStreakSlice, StreakSlice } from "@/store/streakSlice";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ----- Combine Store -----
type AppState = StatsSlice & StreakSlice & QuestionSlice & NavigationSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createStatsSlice(set),
      ...createStreakSlice(set, get),
      ...createQuestionSlice(set, get),
      ...createNavigationSlice(set),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state: AppState) => ({
        streak: state.streak,
        streakInactive: state.streakInactive,
        stats: state.stats,
        lifetimeStats: state.lifetimeStats,
        wrongQuestions: state.wrongQuestions,
      }),
    }
  )
);
