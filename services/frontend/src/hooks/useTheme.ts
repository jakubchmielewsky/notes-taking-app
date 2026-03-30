import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export function useTheme() {
  const { theme, font, initializeSettings } = useSettingsStore();

  useEffect(() => {
    initializeSettings();
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    const applyTheme = () => {
      html.classList.remove("dark");
      if (theme === "Dark") {
        html.classList.add("dark");
      } else if (theme === "System") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
          html.classList.add("dark");
      }
    };

    applyTheme();

    if (theme === "System") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);
      return () => mq.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("font-serif", "font-mono");

    if (font === "Serif") html.classList.add("font-serif");
    else if (font === "Monospace") html.classList.add("font-mono");
  }, [font]);
}
