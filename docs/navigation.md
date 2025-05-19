# Navigation

## Overview

The Math Leveling App uses a simple, custom navigation system to switch between the Home (training) screen and the Settings screen. Navigation state is managed using Zustand, and the UI adapts to device orientation and platform.

## Screen Structure

- **HomeScreen**: Main training interface (questions, streak, level)
- **SettingsScreen**: App settings, analytics, theme toggle, strict mode

## Navigation Implementation

### RootLayout

- Acts as the main navigation container
- Maintains the current screen state (e.g., 'Home' or 'Settings')
- Provides navigation methods to child components via Zustand store

```typescript
// Example navigation slice
const createNavigationSlice = (set) => ({
  currentScreen: "Home",
  navigate: (screen) => set({ currentScreen: screen }),
});
```

### Navigating Between Screens

- Navigation is triggered by UI actions (e.g., pressing a settings icon)
- The `navigate` function updates the current screen in the store
- The RootLayout component renders the appropriate screen based on state

### Back Button Handling

- On Android, the hardware back button is handled using React Native's `BackHandler`
- If on the Home screen, back button may exit the app (with optional double-tap to exit)
- If on the Settings screen, back button returns to Home

```typescript
useEffect(() => {
  const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
    if (currentScreen === "Settings") {
      navigate("Home");
      return true;
    }
    // Optionally handle double-tap to exit on Home
    return false;
  });
  return () => backHandler.remove();
}, [currentScreen]);
```

### State Persistence

- Navigation state is kept in memory for simplicity
- App state (stats, streaks, theme) is persisted with MMKV for seamless user experience

## Best Practices

1. Keep navigation logic simple and predictable
2. Always provide a way to return to the Home screen
3. Handle hardware back button appropriately on Android
4. Use Zustand for global navigation state
5. Ensure navigation actions provide visual feedback
