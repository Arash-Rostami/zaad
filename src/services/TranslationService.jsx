"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("zaad_preferred_language");
      return stored === "fa" || stored === "en" ? stored : defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  });

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

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, data, getItemTranslations, dir, isFarsi }}
    >
      <div
        style={{ direction: dir }}
        className={isFarsi ? "font-sans rtl" : "font-sans ltr"}
      >
        {children}
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
