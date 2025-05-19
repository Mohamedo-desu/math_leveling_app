import {
  createNavigationSlice,
  NavigationSlice,
} from "@/store/navigationSlice";
import { createQuestionSlice, QuestionSlice } from "@/store/questionSlice";
import { createStatsSlice, StatsSlice } from "@/store/statsSlice";
import { mmkvStorage } from "@/store/storage";
import { createStreakSlice, StreakSlice } from "@/store/streakSlice";
import { Dimensions } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ----- Combine Store -----
type OrientationType = "portrait" | "landscape";
type OrientationSlice = {
  orientation: OrientationType;
  setOrientation: (o: OrientationType) => void;
};
type AppState = StatsSlice &
  StreakSlice &
  QuestionSlice &
  NavigationSlice &
  OrientationSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createStatsSlice(set),
      ...createStreakSlice(set, get),
      ...createQuestionSlice(set, get),
      ...createNavigationSlice(set),
      orientation:
        Dimensions.get("window").width > Dimensions.get("window").height
          ? "landscape"
          : "portrait",
      setOrientation: (o) => set({ orientation: o }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state: AppState) => ({
        streak: state.streak,
        streakInactive: state.streakInactive,
        lifetimeStats: state.lifetimeStats,
        wrongQuestions: state.wrongQuestions,
        strictMode: state.strictMode,
      }),
    }
  )
);

// Listen for orientation changes globally and update the store
Dimensions.addEventListener("change", ({ window }) => {
  const o = window.width > window.height ? "landscape" : "portrait";
  useAppStore.getState().setOrientation(o);
});
