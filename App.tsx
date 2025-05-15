// App.tsx
import { ThemeProvider } from "@/context/ThemeContext";
import HomeScreen from "@/screens/HomeScreen";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
