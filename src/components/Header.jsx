"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { animateScrollToTop } from "@/services/ScrollService";
import MaisonButton from "./shared/MaisonButton";
import { useLanguage } from "@/services/LanguageProvider";
import useTheme from "../hooks/useTheme";
import MenuPanel from "./header/MenuPanel";
import NoiseBg from "./shared/NoiseBg";
import { HouseControls } from "./house/HouseChrome";

const EMPTY_COLLECTION = [];

export default function Header({
                                 setActiveTab,
                                 selectedProduct,
                                 onSelectProduct,
                                 onScrollToSection,
                               }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, t, data } = useLanguage();
  const { themeMode, handleThemeChange } = useTheme();
  const collection = useMemo(() => data("collection") || EMPTY_COLLECTION, [data]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const previouslyFocused = document.activeElement;

    const getPanelFocusables = () => {
      const panel = document.querySelector("[data-menu-panel]");
      if (!panel) return [];
      return [
        ...panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => !el.disabled);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const control = document.activeElement?.closest?.(
            "[data-menu-language], [data-menu-theme], [data-menu-font]",
        );
        if (!control) return;
        e.preventDefault();
        const isRtl = document.documentElement.dir === "rtl";
        const forward = e.key === (isRtl ? "ArrowLeft" : "ArrowRight");
        if (control.hasAttribute("data-menu-font")) {
          const step = control.querySelector(
              forward ? "[data-font-increase]" : "[data-font-decrease]",
          );
          if (step && !step.disabled) {
            step.click();
            step.focus();
          }
          return;
        }
        const options = [...control.querySelectorAll("button")];
        const current = options.indexOf(
            document.activeElement.closest("button"),
        );
        if (current === -1) return;
        const target =
            options[
            (current + (forward ? 1 : -1) + options.length) % options.length
                ];
        target.click();
        target.focus();
        return;
      }
      const focusable = getPanelFocusables();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeIndex = focusable.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusable[(activeIndex + 1) % focusable.length].focus();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusable[
            activeIndex === -1
                ? focusable.length - 1
                : (activeIndex - 1 + focusable.length) % focusable.length
            ].focus();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        last.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const handleTouchMove = (e) => {
      if (e.target.closest("[data-menu-scroll-panel]")) return;
      e.preventDefault();
    };
    const scrollPanel = document.querySelector("[data-menu-scroll-panel]");
    let touchStartY = null;
    let touchStartTop = 0;
    const handlePanelTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTop = scrollPanel?.scrollTop ?? 0;
    };
    const handlePanelTouchMove = (e) => {
      if (touchStartY === null) return;
      if (touchStartTop <= 0 && e.touches[0].clientY - touchStartY > 80) {
        touchStartY = null;
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    scrollPanel?.addEventListener("touchstart", handlePanelTouchStart, {
      passive: true,
    });
    scrollPanel?.addEventListener("touchmove", handlePanelTouchMove, {
      passive: true,
    });
    document.querySelector("[data-menu-panel]")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchmove", handleTouchMove);
      scrollPanel?.removeEventListener("touchstart", handlePanelTouchStart);
      scrollPanel?.removeEventListener("touchmove", handlePanelTouchMove);
      previouslyFocused?.focus?.();
    };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleBrandClick = useCallback(() => {
    setActiveTab("showroom");
    onSelectProduct(null);
    setMenuOpen(false);
    animateScrollToTop(1400);
  }, [setActiveTab, onSelectProduct]);

  const handleInquiryClick = useCallback(() => {
    setMenuOpen(false);
    setTimeout(() => onScrollToSection("concierge"), 120);
  }, [onScrollToSection]);

  return (
      <header
          data-site-header="true"
          className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between relative">
          <div className="flex items-center">
            <MaisonButton
                onClick={toggleMenu}
                variant="solid"
                aria-expanded={menuOpen}
                aria-controls="site-menu-panel"
                data-touch-slop
                className="!px-3.5 sm:!px-5 h-8 sm:h-10 shadow-card-sm relative z-50 !text-[length:calc(10px*var(--zaad-font-scale))] sm:!text-[length:calc(11px*var(--zaad-font-scale))] flex items-center justify-center font-sans overflow-visible!"
            >
              <div className="relative h-4 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                      <motion.span
                          key="close"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <span>{t("menuClose")}</span>
                        <X className="w-3 h-3 shrink-0 rtl:-scale-x-100" />
                      </motion.span>
                  ) : (
                      <motion.span
                          key="browse"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <span>{t("menuBrowse")}</span>
                        <Menu className="w-3 h-3 shrink-0" />
                      </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </MaisonButton>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
            <button
                onClick={handleBrandClick}
                aria-label="ZAAD"
                className="text-ink w-20 sm:w-28 md:w-32 hover:opacity-85 transition-opacity duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent flex items-center"
            >
              <svg
                  viewBox="0 0 219.72 54.22"
                  className="w-full h-auto"
                  role="img"
                  aria-label="ZAAD"
                  fill="currentColor"
              >
                <polygon points="17.84 38.11 39.66 38.11 39.66 40.99 13.67 40.99 13.67 38.82 35.16 9.65 13.87 9.65 13.87 6.77 39.32 6.77 39.32 8.95 17.84 38.11" />
                <path d="M71.58,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34L56.9,6.77h3.68l14.44,34.22h-3.44ZM50.89,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                <path d="M106.94,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34l14.44-34.22h3.68l14.44,34.22h-3.44ZM86.26,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                <path d="M126.28,6.77c4.92,0,9.03,1.62,12.3,4.87,3.27,3.27,4.92,7.34,4.92,12.23s-1.65,8.99-4.92,12.23c-3.27,3.27-7.39,4.89-12.3,4.89h-13.06V6.77h13.06ZM126.23,38.11c4.05,0,7.41-1.36,10.1-4.07,2.69-2.71,4.05-6.1,4.05-10.17s-1.36-7.44-4.05-10.15c-2.69-2.71-6.05-4.07-10.1-4.07h-9.98v28.46h9.98Z" />
                <path d="M197.86,10.94l2.95-4.12,3.59,2.54c.38.25.44.76.19,1.14l-2.38,3.39-4.35-2.95Z" />
                <polygon points="176.77 6.88 173.06 6.88 174.01 41.64 176.77 41.64 176.77 6.88" />
                <polygon points="187.09 6.88 183.38 6.88 184.34 41.64 187.04 41.64 187.09 41.6 187.09 6.88" />
                <path d="M167.13,28.11c-1.11-3.73-2.19-6.84-3.26-9.77h-4.31l6.5,17.22c-2.54,1.49-6.25,1.87-8.63,1.87-2.16,0-4.03-.25-5.2-1.08-.89-.63-1.43-1.55-1.43-2.92,0-.23.06-.98.21-2.58h-2.46c-.27,2.55-.36,3.45-.36,4.14,0,3.68,1.78,6.57,8.79,6.57s11.33-2.54,11.33-7.11c0-1.68-.1-2.73-1.17-6.35" />
                <path d="M201.82,18.42l3.96,15.58c-5.46,6.66-9.14,10.12-13.14,10.12-1.52,0-2.38-.13-4.66-.86l-1.36,2.28c2.92,1.08,5.71,1.9,7.65,1.9,6.82,0,13.9-9.33,13.9-14.15,0-4.13-.65-8.26-2.11-14.88h-4.23Z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <MaisonButton
                onClick={handleInquiryClick}
                variant="outline"
                icon={Sparkles}
                data-touch-slop
                className="!px-3 sm:!px-5 h-8 sm:h-10 !text-[length:calc(10px*var(--zaad-font-scale))] sm:!text-[length:calc(11px*var(--zaad-font-scale))] flex items-center justify-center font-sans overflow-visible!"
            >
              {t("menuInquiry")}
            </MaisonButton>
            <HouseControls />
          </div>
        </div>

        {mounted &&
            createPortal(
                <AnimatePresence>
                  {menuOpen && (
                      <motion.div
                          key="menu-backdrop"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transitionEnd: { pointerEvents: "none" } }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="fixed inset-0 bg-foundation/40 z-30 cursor-zoom-out"
                          onClick={closeMenu}
                      >
                        <NoiseBg filterId="menuBackdropNoise" />
                      </motion.div>
                  )}
                </AnimatePresence>,
                document.body,
            )}

        <AnimatePresence>
          {menuOpen && (
              <MenuPanel
                  t={t}
                  language={language}
                  setLanguage={setLanguage}
                  selectedProduct={selectedProduct}
                  collection={collection}
                  themeMode={themeMode}
                  handleThemeChange={handleThemeChange}
                  onClose={closeMenu}
                  setActiveTab={setActiveTab}
                  onSelectProduct={onSelectProduct}
                  onScrollToSection={onScrollToSection}
              />
          )}
        </AnimatePresence>
      </header>
  );
}