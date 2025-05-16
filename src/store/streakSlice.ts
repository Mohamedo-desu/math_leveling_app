export type StreakSlice = {
  streak: number;
  streakInactive: boolean;
  loadStreak: () => void;
  recordLevelUp: () => void;
};

import { mmkvStorage } from "@/store/storage";
import { STREAK_KEY, STREAK_TIME_KEY } from "@/utils";
import * as Notifications from "expo-notifications";

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
  await Notifications.cancelScheduledNotificationAsync("streak-reminder");

  // Schedule a one-off notification
  await Notifications.scheduleNotificationAsync({
    identifier: "streak-reminder",
    content: {
      title: "Don't lose your streak!",
      body: "Level up today to keep your streak going.",
      sound: true,
    },
    trigger: {
      type: "timeInterval",
      seconds: secondsUntil,
      repeats: false,
    } as any,
  });
}

async function cancelStreakReminder() {
  await Notifications.cancelScheduledNotificationAsync("streak-reminder");
}

export const createStreakSlice = (set: any, get: any): StreakSlice => ({
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
