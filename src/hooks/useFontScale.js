import { useState, useEffect } from "react";

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;
const STEP = 0.05;

export default function useFontScale() {
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const cached = parseFloat(localStorage.getItem("zaad-font-scale"));
    const initial = Number.isFinite(cached) ? cached : 1;
    setFontScale(initial);
    document.documentElement.style.setProperty("--zaad-user-scale", initial);
  }, []);

  const applyScale = (value) => {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 100) / 100));
    setFontScale(clamped);
    document.documentElement.style.setProperty("--zaad-user-scale", clamped);
    localStorage.setItem("zaad-font-scale", clamped);
  };

  return {
    fontScale,
    increaseFontScale: () => applyScale(fontScale + STEP),
    decreaseFontScale: () => applyScale(fontScale - STEP),
    resetFontScale: () => applyScale(1),
    minFontScaleReached: fontScale <= MIN_SCALE,
    maxFontScaleReached: fontScale >= MAX_SCALE,
  };
}
