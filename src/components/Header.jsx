"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { animateScrollTo, animateScrollToTop } from "@/services/ScrollService";
import MaisonButton from "./MaisonButton";
import { useLanguage } from "@/services/TranslationService";
import useTheme from "../hooks/useTheme";
import MenuPanel from "./header/MenuPanel";
import NoiseBg from "./shared/NoiseBg";

const EMPTY_COLLECTION = [];
const BRAND_LETTERS = "ZAAD".split("");

export default function Header({
                                 activeTab,
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
    setActiveTab("showroom");
    onSelectProduct(null);
    setMenuOpen(false);
    setTimeout(() => animateScrollTo("concierge", 1500), 120);
  }, [setActiveTab, onSelectProduct]);

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
                data-touch-slop
                className="!px-3.5 sm:!px-5 h-8 sm:h-10 shadow-card-sm relative z-50 !text-[length:calc(10px*var(--zaad-font-scale))] sm:!text-[length:calc(11px*var(--zaad-font-scale))] !tracking-[0.15em] sm:!tracking-[0.25em] flex items-center justify-center font-sans overflow-visible!"
            >
              <div className="relative w-20 h-4 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                      <motion.span
                          key="close"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute flex items-center justify-center gap-1.5 whitespace-nowrap"
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
                          className="absolute flex items-center justify-center gap-1.5 whitespace-nowrap"
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
                className="group text-lg sm:text-2xl md:text-3xl font-serif tracking-[0.2em] sm:tracking-[0.35em] uppercase font-semibold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent flex items-center pl-[0.2em] sm:pl-[0.35em]"
            >
            <span dir="ltr" aria-hidden="true" className="flex">
              {BRAND_LETTERS.map((letter, index) => (
                  <span
                      key={index}
                      className="inline-block text-ink group-hover:text-accent transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translateZ(0)]"
                      style={{ transitionDelay: `${index * 60}ms` }}
                  >
                  {letter}
                </span>
              ))}
            </span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <MaisonButton
                onClick={handleInquiryClick}
                variant="outline"
                icon={Sparkles}
                data-touch-slop
                className="!px-3 sm:!px-5 h-8 sm:h-10 !text-[length:calc(10px*var(--zaad-font-scale))] sm:!text-[length:calc(11px*var(--zaad-font-scale))] !tracking-[0.15em] sm:!tracking-[0.2em] flex items-center justify-center font-sans overflow-visible!"
            >
              {t("menuInquiry")}
            </MaisonButton>
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
                  activeTab={activeTab}
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