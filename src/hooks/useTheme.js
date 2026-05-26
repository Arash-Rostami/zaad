import { useState, useEffect } from "react";

export default function useTheme() {
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    const cached = localStorage.getItem("zaad-theme");
    const initialMode = cached || "light";
    setThemeMode(initialMode);
    applyThemeClass(initialMode);
  }, []);

  const applyThemeClass = (mode) => {
    const root = document.documentElement;
    root.classList.remove("light", "mid", "dark");
    root.classList.add(mode);
  };

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    applyThemeClass(mode);
    localStorage.setItem("zaad-theme", mode);
  };

  return { themeMode, handleThemeChange };
}
