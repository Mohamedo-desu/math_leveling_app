export type NavigationSlice = {
  currentScreen: string;
  navigate: (screen: string) => void;
};

export const createNavigationSlice = (set: any): NavigationSlice => ({
  currentScreen: "Home",
  navigate: (screen: string) => set({ currentScreen: screen }),
});
