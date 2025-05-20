import CustomText from "@/components/CustomText";
import QuestionCard from "@/components/HomeScreen/QuestionCard";
import StreakBadge from "@/components/HomeScreen/StreakBadge";
import TimerRing from "@/components/TimerRing";
import { useTheme } from "@/context/ThemeContext";
import { useVersion } from "@/hooks/useVersion";
import { useAppStore } from "@/store/useAppStore";
import { styles } from "@/styles/screen/HomeScreen.styles";
import React from "react";
import {
  BackHandler,
  Button,
  Platform,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Custom hook for timer mode logic
function useTimerMode() {
  const timerMode = useAppStore((s) => s.timerMode);
  const toggleTimerMode = useAppStore((s) => s.toggleTimerMode);
  const { colors } = useTheme();
  const TIMER_MAX = 1;
  const TIMER_MIN = 0;
  const TIMER_STEP = 0.02;
  const TIMER_INCREASE = 0.1;
  const [timer, setTimer] = React.useState(TIMER_MAX);
  const [gameOver, setGameOver] = React.useState(false);
  const alertShown = React.useRef(false);

  // Timer effect
  React.useEffect(() => {
    if (!timerMode) return;
    if (timer <= TIMER_MIN) {
      if (!gameOver && !alertShown.current) {
        setGameOver(true);
        alertShown.current = true;
        // Show alert
        import("react-native").then(({ Alert }) => {
          Alert.alert(
            "Game Over",
            "Time's up!",
            [
              {
                text: "Retry",
                onPress: () => {
                  setTimer(TIMER_MAX);
                  setGameOver(false);
                  alertShown.current = false;
                },
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  toggleTimerMode();
                  setGameOver(false);
                  alertShown.current = false;
                },
              },
            ],
            { cancelable: false }
          );
        });
      }
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(TIMER_MIN, prev - TIMER_STEP));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerMode, timer, gameOver, toggleTimerMode]);

  // Reset timer on new game or when timerMode toggles
  React.useEffect(() => {
    setTimer(TIMER_MAX);
    setGameOver(false);
    alertShown.current = false;
  }, [timerMode]);

  // Handler for correct answer
  const handleCorrect = React.useCallback(() => {
    setTimer((prev) => Math.min(TIMER_MAX, prev + TIMER_INCREASE));
  }, []);

  // Handler for retry button (in case you want to show it in UI)
  const handleRetry = React.useCallback(() => {
    setTimer(TIMER_MAX);
    setGameOver(false);
    alertShown.current = false;
  }, []);

  // Handler for cancel button (in case you want to show it in UI)
  const handleCancel = React.useCallback(() => {
    toggleTimerMode();
    setGameOver(false);
    alertShown.current = false;
  }, [toggleTimerMode]);

  return {
    timerMode,
    timer,
    gameOver,
    handleCorrect,
    handleRetry,
    handleCancel,
    TIMER_MAX,
    colors,
  };
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [lastBackPress, setLastBackPress] = React.useState(0);
  const orientation = useAppStore((s) => s.orientation);
  const { currentVersion } = useVersion();

  // Timer mode logic
  const {
    timerMode,
    timer,
    gameOver,
    handleCorrect,
    handleRetry,
    handleCancel,
    TIMER_MAX,
  } = useTimerMode();

  // Add back button handler
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastBackPress < 2000) {
          BackHandler.exitApp();
          return true;
        }
        if (Platform.OS === "android") {
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        }
        setLastBackPress(currentTime);
        return true;
      }
    );
    return () => backHandler.remove();
  }, [lastBackPress]);

  return (
    <View
      style={[
        styles.container,
        styles.screen,
        {
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        },
      ]}
    >
      {timerMode && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <TimerRing progress={timer} color={colors.primary} />
          {gameOver && (
            <>
              <Button
                title="Retry"
                onPress={handleRetry}
                color={colors.primary}
              />
              <Button
                title="Cancel"
                onPress={handleCancel}
                color={colors.wrong}
              />
            </>
          )}
        </View>
      )}
      <StreakBadge />
      <QuestionCard onCorrectAnswer={handleCorrect} />
      {orientation === "portrait" && (
        <CustomText
          style={[
            styles.version,
            styles.versionPortrait,
            { color: colors.gray[500], bottom: insets.bottom + 10 },
          ]}
        >
          v{currentVersion}
        </CustomText>
      )}
    </View>
  );
}
