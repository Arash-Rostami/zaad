import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    // PH1 FIX: Initializing theme based on localStorage inside useEffect to avoid SSR hydration mismatch
    const cached = localStorage.getItem("zaad-theme");
    if (cached) {
      setThemeState(cached);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "mid", "dark");
    if (theme !== "light") {
        root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (mode) => {
    setThemeState(mode);
    localStorage.setItem("zaad-theme", mode);
  };

  return { theme, setTheme };
}
