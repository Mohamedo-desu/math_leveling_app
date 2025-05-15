import { Colors } from "@/constants/Colors";
import { mmkvStorage } from "@/store/storage";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";

// Types
type ThemeMode = "light" | "dark" | "system";

interface CustomThemeColors {
  primary: string;
  secondary: string;
  white: string;
  black: string;
  correct: string;
  wrong: string;
  streak: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  gray: {
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  };
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
  colors: CustomThemeColors;
  toggleTheme: () => void;
}

// Context
export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  colors: {
    background: Colors.black,
    card: Colors.darkGray[100],
    text: Colors.white,
    border: Colors.darkGray[200],
    notification: Colors.secondary,
    gray: {
      500: "#B0B0B0",
      400: "#8A8A8A",
      300: "#545454",
      200: "#333333",
      100: "#1B1B1B",
      50: "#1b1a1a",
    },
    ...Colors,
  },
  toggleTheme: () => {},
});

// Theme definitions
const customDarkTheme: CustomThemeColors = {
  background: Colors.black,
  card: Colors.darkGray[100],
  text: Colors.white,
  border: Colors.darkGray[200],
  notification: Colors.secondary,
  gray: {
    500: "#B0B0B0",
    400: "#8A8A8A",
    300: "#545454",
    200: "#333333",
    100: "#1B1B1B",
    50: "#1b1a1a",
  },
  ...Colors,
};

const customLightTheme: CustomThemeColors = {
  background: Colors.white,
  card: Colors.lightGray[100],
  text: Colors.black,
  border: Colors.darkGray[200],
  notification: Colors.secondary,
  gray: {
    500: "#9E9E9E",
    400: "#BDBDBD",
    300: "#E0E0E0",
    200: "#EEEEEE",
    100: "#F5F5F5",
    50: "#fafafa",
  },
  ...Colors,
};

// Provider Component
export const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  // Load saved theme or default to 'dark'
  const [theme, setTheme] = useState<ThemeMode>(
    (mmkvStorage.getItem("theme") as ThemeMode) || "dark"
  );
  const systemScheme = useColorScheme();

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      mmkvStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }, []);

  // Resolve actual theme (light/dark) based on user choice or system setting
  const resolvedTheme = useMemo<ThemeMode>(() => {
    const applied = theme === "system" ? systemScheme || "dark" : theme;
    // Persist the chosen/applied theme
    mmkvStorage.setItem("theme", applied);
    return applied;
  }, [theme, systemScheme]);

  // Select color palette
  const colors = useMemo<CustomThemeColors>(
    () => (resolvedTheme === "dark" ? customDarkTheme : customLightTheme),
    [resolvedTheme]
  );

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme, colors, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
      <SystemBars style={resolvedTheme === "dark" ? "light" : "dark"} />
    </>
  );
};

// Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
