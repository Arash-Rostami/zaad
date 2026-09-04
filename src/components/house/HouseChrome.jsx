"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Minus, Plus, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/services/TranslationService";
import useTheme from "@/hooks/useTheme";
import useAmbientAudio from "@/hooks/useAmbientAudio";
import useFontScale from "@/hooks/useFontScale";
import AudioToggle from "../shared/AudioToggle";
import Tooltip from "../shared/Tooltip";
import ExpandOnHoverPill from "../shared/ExpandOnHoverPill";

const NAV = [
  { href: "/about", key: "footerAboutUs" },
  { href: "/story", key: "footerStoryBrandValue" },
  { href: "/sustainability", key: "footerSustainabilityResponsibility" },
];

const LANGS = ["en", "fa"];
const LANG_LABELS = { en: "EN", fa: "فا" };
const LANG_TOOLTIP_KEYS = { en: "tooltipLangEn", fa: "tooltipLangFa" };

const THEMES = [
  { mode: "light", key: "themeLabelLight" },
  { mode: "mid", key: "themeLabelMid" },
  { mode: "dark", key: "themeLabelDark" },
];
const THEME_TOOLTIP_KEYS = {
  light: "tooltipThemeLight",
  mid: "tooltipThemeMid",
  dark: "tooltipThemeDark",
};

function HouseControls() {
  const { t, language, setLanguage } = useLanguage();
  const { themeMode, handleThemeChange } = useTheme();
  const { isMuted, toggleMute } = useAmbientAudio();
  const {
    fontScale,
    increaseFontScale,
    decreaseFontScale,
    minFontScaleReached,
    maxFontScaleReached,
  } = useFontScale();
  const [isControlsHovered, setIsControlsHovered] = useState(false);

  const handleLangClick = useCallback(
    (e) => setLanguage(e.currentTarget.value),
    [setLanguage],
  );
  const handleThemeClick = useCallback(
    (e) => handleThemeChange(e.currentTarget.value),
    [handleThemeChange],
  );

  return (
    <ExpandOnHoverPill
      isExpanded={isControlsHovered}
      onHoverChange={setIsControlsHovered}
      dropdown
      className="w-9 h-9 bg-control-bar border border-control shadow-canvas-mid text-muted"
      panelClassName="bg-control-bar border border-control shadow-canvas-lift p-2"
      trigger={<SlidersHorizontal className="w-3.5 h-3.5" />}
    >
      <div className="flex items-center gap-3" suppressHydrationWarning>
        <div className="flex items-center gap-0.5 rounded-md bg-toggle-track p-0.5 h-7 px-1">
          <Tooltip label={t("fontScaleDecreaseLabel")}>
            <button
              onClick={decreaseFontScale}
              disabled={minFontScaleReached}
              aria-label={t("fontScaleDecreaseLabel")}
              className={`cursor-not-allowed w-6 h-full rounded-md flex items-center justify-center transition-colors ${
                minFontScaleReached
                  ? "bg-indicator text-on-indicator"
                  : "cursor-pointer text-muted hover:bg-indicator hover:text-on-indicator"
              }`}
            >
              <Minus className="w-3 h-3" />
            </button>
          </Tooltip>
          <span className="font-mono text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] text-muted w-7 text-center select-none tabular-nums">
            {Math.round(fontScale * 100)}%
          </span>
          <Tooltip label={t("fontScaleIncreaseLabel")}>
            <button
              onClick={increaseFontScale}
              disabled={maxFontScaleReached}
              aria-label={t("fontScaleIncreaseLabel")}
              className={`cursor-not-allowed w-6 h-full rounded-md flex items-center justify-center transition-colors ${
                maxFontScaleReached
                  ? "bg-indicator text-on-indicator"
                  : "cursor-pointer text-muted hover:bg-indicator hover:text-on-indicator"
              }`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </Tooltip>
        </div>

        <span className="h-3 w-[1px] bg-ink/10" />

        <div className="flex items-center relative rounded-md bg-toggle-track p-0.5 font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] tracking-widest h-7 w-20">
          {LANGS.map((lang) => (
            <Tooltip
              key={lang}
              label={t(LANG_TOOLTIP_KEYS[lang])}
              className="flex-1"
            >
              <button
                value={lang}
                onClick={handleLangClick}
                data-touch-slop
                className={`cursor-pointer w-full text-center h-full rounded-md transition-colors duration-700 uppercase text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-semibold flex items-center justify-center ${
                  language === lang
                    ? "bg-indicator text-on-indicator font-bold"
                    : "text-muted hover:text-headline"
                }`}
              >
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

        <div className="flex items-center relative rounded-md bg-toggle-track p-0.5 h-7">
          {THEMES.map(({ mode, key }) => (
            <Tooltip key={mode} label={t(THEME_TOOLTIP_KEYS[mode])}>
              <button
                value={mode}
                onClick={handleThemeClick}
                data-touch-slop
                className={`cursor-pointer px-2 h-full text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] rtl:text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-semibold font-mono tracking-widest rounded-md transition-colors duration-700 flex items-center justify-center ${
                  themeMode === mode
                    ? "bg-indicator text-on-indicator font-bold"
                    : "text-muted/70 hover:text-headline"
                }`}
              >
                {t(key)}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </ExpandOnHoverPill>
  );
}

function HouseChrome() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const currentNavItem = useMemo(
    () => NAV.find((item) => item.href === pathname),
    [pathname],
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-5">
        <div className="flex justify-start min-w-0">
          <Link
            href="/"
            aria-label={t("aboutBackToShowroom")}
            data-touch-boost
            className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-500 shrink-0 p-2.5 -m-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("aboutBackToShowroom")}</span>
          </Link>
        </div>

        <Link
          href="/"
          className="justify-self-center whitespace-nowrap text-ink text-lg sm:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.35em] uppercase font-semibold hover:opacity-85 transition-opacity duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ZAAD
        </Link>

        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex-1 hidden md:flex justify-center min-w-0">
            {currentNavItem && (
              <span className="relative text-xs font-mono tracking-[0.2em] uppercase text-accent font-semibold whitespace-nowrap">
                {t(currentNavItem.key)}
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-accent rounded-md" />
              </span>
            )}
          </div>
          <HouseControls />
        </div>
      </div>
    </header>
  );
}

export default React.memo(HouseChrome);
