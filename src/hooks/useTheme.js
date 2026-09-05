import { useState, useEffect, useCallback } from "react";

const THEME_COLORS = { light: "#F4F1ED", mid: "#1F242C", dark: "#111110" };

function applyThemeClass(mode) {
  const root = document.documentElement;
  root.classList.remove("light", "mid", "dark");
  root.classList.add(mode);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[mode]);
}

export default function useTheme() {
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    const cached = localStorage.getItem("zaad-theme");
    const initialMode = cached || "light";
    setThemeMode(initialMode);
    applyThemeClass(initialMode);
  }, []);

  const handleThemeChange = useCallback((mode) => {
    setThemeMode(mode);
    applyThemeClass(mode);
    localStorage.setItem("zaad-theme", mode);
  }, []);

  return { themeMode, handleThemeChange };
}