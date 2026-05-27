"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { defaultLanguage, languages } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/en";
import { fa } from "@/lib/i18n/fa";

// Translation map for dynamic loading (ready for [lang] routing)
const translationMap = Object.fromEntries(
    languages.map((lang) => [
      lang.code,
      () => import(`../lib/i18n/${lang.code}`).then((module) => module[lang.code]),
    ])
);

export const useTranslation = async (locale) => {
  const loader = translationMap[locale] || translationMap[defaultLanguage];
  return await loader();
};

// Static registry used by the client Provider (avoids hydration flash)
const registry = { en, fa };

const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
  data: (key) => null,
  getItemTranslations: () => null,
  dir: "ltr",
  isFarsi: false,
});

export function LanguageProvider({ children }) {
  // PH1 FIX: Removed localStorage call from useState initializer to prevent SSR hydration mismatch.
  // Using defaultLanguage initially, and fetching from localStorage inside useEffect.
  const [language, setLanguageState] = useState(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("zaad_preferred_language");
      if (stored === "fa" || stored === "en") {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("zaad_preferred_language", lang);
    } catch (e) {
      console.warn("Could not persist language selection", e);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "fa" ? "rtl" : "ltr");
    if (language === "fa") {
      root.classList.add("farsi-mode");
    } else {
      root.classList.remove("farsi-mode");
    }
  }, [language]);

  const dir = language === "fa" ? "rtl" : "ltr";
  const isFarsi = language === "fa";

  const translations = registry[language] || registry[defaultLanguage];

  // Resolve a flat string key with fallback to default language
  const t = (key) =>
      translations[key] ?? registry[defaultLanguage][key] ?? key;

  // Resolve a structured data key (arrays, objects) with fallback
  const data = (key) =>
      translations[key] ?? registry[defaultLanguage][key] ?? null;

  // Resolve product item translations by id
  const getItemTranslations = (id) => {
    const cleanId = id.toLowerCase();
    return (
        translations.items?.[cleanId] ??
        registry[defaultLanguage].items?.[cleanId] ??
        null
    );
  };

  // Prevent rendering children until mounted to avoid hydration flash if language differs from default
  if (!mounted) {
    return (
        <div style={{ opacity: 0 }} className="w-full h-full min-h-screen" />
    );
  }

  return (
      <LanguageContext.Provider
          value={{ language, setLanguage, t, data, getItemTranslations, dir, isFarsi }}
      >
        <div
            style={{ direction: dir }}
            className={isFarsi ? "font-sans rtl" : "font-sans ltr"}
        >
          <AnimatePresence mode="wait">
            <motion.div
                key={language}
                initial={{opacity: 0}}
                animate={{
                  opacity: 1,
                  transition: {duration: 0.85, ease: [0.16, 1, 0.3, 1]},
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.05, ease: "linear" },
                }}
                className="w-full h-full min-h-screen"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
