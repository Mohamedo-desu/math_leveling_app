import { mmkvStorage } from "@/store/storage";
import { STREAK_KEY, STREAK_TIME_KEY } from "@/utils";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

const REMINDER_ID_KEY = "streak-reminder-id";

function getDaysDiffLocal(date1: string, date2: string) {
  const [y1, m1, d1] = date1.split("-").map(Number);
  const [y2, m2, d2] = date2.split("-").map(Number);
  const day1 = new Date(y1, m1 - 1, d1);
  const day2 = new Date(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((day1.getTime() - day2.getTime()) / msPerDay);
}

async function getPersistedReminderId(): Promise<string | null> {
  return mmkvStorage.getItem(REMINDER_ID_KEY) || null;
}

async function setPersistedReminderId(id: string) {
  mmkvStorage.setItem(REMINDER_ID_KEY, id);
}

async function clearPersistedReminderId() {
  mmkvStorage.removeItem(REMINDER_ID_KEY);
}

async function ensureNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

async function scheduleStreakReminderForTomorrow() {
  // Check notification permissions first
  const hasPermission = await ensureNotificationPermissions();
  if (!hasPermission) {
    Alert.alert(
      "Enable Notifications",
      "Notification permissions are required to receive streak reminders. Please enable notifications in your device settings.",
      [{ text: "OK" }]
    );
    return;
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(23, 0, 0, 0); // 11:00 PM local time tomorrow

  const secondsUntil = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

  // Cancel any existing reminder
  const existingId = await getPersistedReminderId();
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch {}
    await clearPersistedReminderId();
  }

  const id = await Notifications.scheduleNotificationAsync({
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

  await setPersistedReminderId(id);
}

async function cancelStreakReminder() {
  const existingId = await getPersistedReminderId();
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch {}
    await clearPersistedReminderId();
  }
}

export type StreakSlice = {
  streak: number;
  streakInactive: boolean;
  loadStreak: () => Promise<void>;
  recordLevelUp: () => Promise<void>;
};

export const createStreakSlice = (set: any, get: any): StreakSlice => ({
  streak: 0,
  streakInactive: false,

  loadStreak: async () => {
    const savedCount = parseInt(mmkvStorage.getItem(STREAK_KEY) || "0", 10);
    const lastStreakDate = mmkvStorage.getItem(STREAK_TIME_KEY) || "";
    const today = new Date().toLocaleDateString("en-CA");

    if (lastStreakDate) {
      const daysDiff = getDaysDiffLocal(today, lastStreakDate);

      if (daysDiff >= 2) {
        // Reset streak after missing two or more days
        mmkvStorage.setItem(STREAK_KEY, "0");
        mmkvStorage.setItem(STREAK_TIME_KEY, "");
        set({ streak: 0, streakInactive: false });
        await cancelStreakReminder();
      } else if (daysDiff === 1) {
        // Streak still valid but user must act today
        set({ streak: savedCount, streakInactive: true });
        await scheduleStreakReminderForTomorrow();
      } else {
        // Already acted today (daysDiff === 0) or clock skew
        set({ streak: savedCount, streakInactive: false });
        await scheduleStreakReminderForTomorrow();
      }
    } else {
      // No previous streak record
      set({ streak: savedCount, streakInactive: false });
      await scheduleStreakReminderForTomorrow();
    }
  },

  recordLevelUp: async () => {
    const today = new Date().toLocaleDateString("en-CA");
    const lastStreakDate = mmkvStorage.getItem(STREAK_TIME_KEY) || "";
    const streak = get().streak;
    const daysDiff = lastStreakDate
      ? getDaysDiffLocal(today, lastStreakDate)
      : null;

    if (
      !lastStreakDate ||
      streak === 0 ||
      (daysDiff !== null && daysDiff >= 2)
    ) {
      // Start a new streak
      mmkvStorage.setItem(STREAK_KEY, "1");
      mmkvStorage.setItem(STREAK_TIME_KEY, today);
      set({ streak: 1, streakInactive: false });
      await cancelStreakReminder();
      await scheduleStreakReminderForTomorrow();
      return;
    }

    if (daysDiff === 1) {
      // Continue existing streak
      const next = streak + 1;
      mmkvStorage.setItem(STREAK_KEY, next.toString());
      mmkvStorage.setItem(STREAK_TIME_KEY, today);
      set({ streak: next, streakInactive: false });
      await cancelStreakReminder();
      await scheduleStreakReminderForTomorrow();
    } else if (daysDiff === 0) {
      // Already recorded today
      await cancelStreakReminder();
      await scheduleStreakReminderForTomorrow();
      return;
    }
  },
});
