import { create } from "zustand";

type LayoutDensity = "comfortable" | "compact";
type ColorMode = "light" | "dark" | "system";

interface UiState {
  colorMode: ColorMode;
  density: LayoutDensity;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  setColorMode: (mode: ColorMode) => void;
  setDensity: (density: LayoutDensity) => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  colorMode: "system",
  density: "comfortable",
  isSidebarOpen: false,
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  setColorMode: (mode) => {
    set({ colorMode: mode });
    if (typeof document !== "undefined") {
      if (
        mode === "dark" ||
        (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
  setDensity: (density) => set({ density }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
