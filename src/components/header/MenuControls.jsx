import React, { memo, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import useAmbientAudio from "@/hooks/useAmbientAudio";
import useFontScale from "@/hooks/useFontScale";
import AudioToggle from "../shared/AudioToggle";
import Tooltip from "../shared/Tooltip";

const LANG_LABELS = { en: "EN", fa: "فا" };
const BRAND_NAME = { en: "ZAAD", fa: "زاد" };
const LANG_TOOLTIP_KEYS = { en: "tooltipLangEn", fa: "tooltipLangFa" };
const THEME_TOOLTIP_KEYS = {
  light: "tooltipThemeLight",
  mid: "tooltipThemeMid",
  dark: "tooltipThemeDark",
};
const LANGUAGES = ["en", "fa"];
const THEMES = [
  { mode: "light", key: "themeLabelLight" },
  { mode: "mid", key: "themeLabelMid" },
  { mode: "dark", key: "themeLabelDark" },
];
const TIME_FORMATTERS = {
  en: new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  fa: new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
};
const WEEKDAY_FORMATTERS = {
  en: new Intl.DateTimeFormat("en-US", { weekday: "short" }),
  fa: new Intl.DateTimeFormat("fa-IR", { weekday: "long" }),
};
const DATE_FORMATTERS = {
  en: new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  fa: new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};
const MONTH_YEAR_FORMATTERS = {
  en: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }),
  fa: new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    month: "long",
    year: "numeric",
  }),
};

const MenuControls = memo(function MenuControls({
  t,
  language,
  setLanguage,
  themeMode,
  handleThemeChange,
}) {
  const { isMuted, toggleMute } = useAmbientAudio();
  const {
    fontScale,
    increaseFontScale,
    decreaseFontScale,
    minFontScaleReached,
    maxFontScaleReached,
  } = useFontScale();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const stripLabel = useMemo(() => {
    const time = TIME_FORMATTERS[language].format(now);
    const weekday = WEEKDAY_FORMATTERS[language].format(now);
    const date = DATE_FORMATTERS[language].format(now);
    return `${time} (${weekday}), ${date}`;
  }, [language, now]);
  const stripLabelCompact = useMemo(
    () => MONTH_YEAR_FORMATTERS[language].format(now),
    [language, now],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="md:col-span-12 border-t border-ink/10 mt-5 pt-5 flex flex-col md:flex-row md:rtl:flex-row-reverse items-center justify-between gap-4"
    >
      <div className="flex items-center gap-x-3 font-mono text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] tracking-[0.25em] text-accent/50 uppercase antialiased">
        <span className="cursor-default select-none transition-opacity duration-500 hover:opacity-100">
          <span className="font-serif font-farsi">{BRAND_NAME[language]}</span>{" "}
          {t("editionVersion")}
        </span>

        <div aria-hidden="true" className="flex items-center justify-center">
          ᯓ
        </div>

        <span className="cursor-default select-none transition-opacity duration-500 hover:opacity-100 tabular-nums hidden md:inline">
          {stripLabel}
        </span>
        <span className="cursor-default select-none transition-opacity duration-500 hover:opacity-100 tabular-nums md:hidden">
          {stripLabelCompact}
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex items-center bg-control-bar border border-control shadow-canvas-mid rounded-md p-2">
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <div
              data-menu-language
              className="flex items-center relative rounded-md bg-toggle-track p-0.5 font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] tracking-widest h-7 w-20"
            >
              {LANGUAGES.map((lang) => (
                <Tooltip
                  key={lang}
                  label={t(LANG_TOOLTIP_KEYS[lang])}
                  className="flex-1"
                >
                  <button
                    onClick={() => setLanguage(lang)}
                    data-touch-slop
                    className={`cursor-pointer w-full text-center h-full rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-700 relative z-10 uppercase text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-semibold flex items-center justify-center ${language === lang ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted hover:text-headline"}`}
                  >
                    {language === lang && (
                      <motion.div
                        layoutId="activeLanguageBlobInNavbar"
                        className="absolute inset-0 bg-indicator rounded-md z-[-1]"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          mass: 0.5,
                        }}
                      />
                    )}
                    {LANG_LABELS[lang]}
                  </button>
                </Tooltip>
              ))}
            </div>

            <span className="h-3 w-[1px] bg-ink/10" />

            <Tooltip label={t(isMuted ? "audioPlayLabel" : "audioMuteLabel")}>
              <AudioToggle
                isMuted={isMuted}
                onToggle={toggleMute}
                label={t(isMuted ? "audioPlayLabel" : "audioMuteLabel")}
              />
            </Tooltip>

            <span className="h-3 w-[1px] bg-ink/10" />

            <div
              data-menu-font
              className="flex items-center gap-0.5 rounded-md bg-toggle-track p-0.5 h-7"
            >
              <Tooltip label={t("fontScaleDecreaseLabel")}>
                <button
                  data-font-decrease
                  onClick={decreaseFontScale}
                  disabled={minFontScaleReached}
                  aria-label={t("fontScaleDecreaseLabel")}
                  data-touch-slop
                  className={`cursor-not-allowed px-1.5 h-full rounded-md flex items-center justify-center transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    minFontScaleReached
                      ? "bg-indicator text-on-indicator"
                      : "cursor-pointer text-muted hover:bg-indicator hover:text-on-indicator"
                  }`}
                >
                  <Minus className="w-3 h-3 stroke-[1.5]" />
                </button>
              </Tooltip>
              <span className="font-mono text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] text-muted w-8 text-center select-none tabular-nums">
                {Math.round(fontScale * 100)}%
              </span>
              <Tooltip label={t("fontScaleIncreaseLabel")}>
                <button
                  data-font-increase
                  onClick={increaseFontScale}
                  disabled={maxFontScaleReached}
                  aria-label={t("fontScaleIncreaseLabel")}
                  data-touch-slop
                  className={`cursor-not-allowed px-1.5 h-full rounded-md flex items-center justify-center transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    maxFontScaleReached
                      ? "bg-indicator text-on-indicator"
                      : "cursor-pointer text-muted hover:bg-indicator hover:text-on-indicator"
                  }`}
                >
                  <Plus className="w-3 h-3 stroke-[1.5]" />
                </button>
              </Tooltip>
            </div>

            <span className="h-3 w-[1px] bg-ink/10" />

            <div
              data-menu-theme
              className="flex items-center relative rounded-md bg-toggle-track p-0.5 h-7"
            >
              {THEMES.map(({ mode, key }) => (
                <Tooltip key={mode} label={t(THEME_TOOLTIP_KEYS[mode])}>
                  <button
                    onClick={() => handleThemeChange(mode)}
                    data-touch-slop
                    className={`cursor-pointer px-2 h-full text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-semibold font-mono tracking-widest rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-700 relative z-10 flex items-center justify-center ${themeMode === mode ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted/70 hover:text-headline"}`}
                  >
                    {themeMode === mode && (
                      <motion.div
                        layoutId="activeThemeBlobInNavbar"
                        className="absolute inset-0 bg-indicator rounded-md z-[-1]"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          mass: 0.5,
                        }}
                      />
                    )}
                    {t(key)}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
export default MenuControls;
