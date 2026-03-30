import { create } from "zustand";

export type Theme = "Light" | "Dark" | "System";
export type Font = "Sans-serif" | "Serif" | "Monospace";

interface SettingsState {
  theme: Theme;
  font: Font;
  setTheme: (theme: Theme) => void;
  setFont: (font: Font) => void;
  initializeSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "System",
  font: "Sans-serif",

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("theme", theme);
  },

  setFont: (font) => {
    set({ font });
    localStorage.setItem("font", font);
  },

  initializeSettings: () => {
    const VALID_THEMES: Theme[] = ["Light", "Dark", "System"];
    const VALID_FONTS: Font[] = ["Sans-serif", "Serif", "Monospace"];
    const storedTheme = localStorage.getItem("theme");
    const storedFont = localStorage.getItem("font");
    if (storedTheme && VALID_THEMES.includes(storedTheme as Theme))
      set((s) => ({ ...s, theme: storedTheme as Theme }));
    if (storedFont && VALID_FONTS.includes(storedFont as Font))
      set((s) => ({ ...s, font: storedFont as Font }));
  },
}));
