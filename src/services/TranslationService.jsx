"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {defaultLanguage, languages} from "@/lib/i18n/config";
import {en} from "@/lib/i18n/en";
import {fa} from "@/lib/i18n/fa";

const translationMap = {
    en: () => import("../lib/i18n/en").then(m => m.en),
    fa: () => import("../lib/i18n/fa").then(m => m.fa)
};

export const useTranslation = async (locale) => {
    const loader = translationMap[locale] || translationMap[defaultLanguage];
    return await loader();
};

const registry = {en, fa};

const LanguageContext = createContext({
    language: defaultLanguage,
    setLanguage: () => {
    },
    t: (key) => key,
    data: (key) => null,
    getItemTranslations: () => null,
    dir: "ltr",
    isFarsi: false,
});

export function LanguageProvider({initialLanguage = defaultLanguage, children}) {
    const [language, setLanguageState] = useState(initialLanguage);

    const setLanguage = (lang) => {
        setLanguageState(lang);
        try {
            localStorage.setItem("zaad_preferred_language", lang);
        } catch (e) {
            console.warn("Could not persist language selection", e);
        }
        document.cookie = `zaad_preferred_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
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

    const t = (key) =>
        translations[key] ?? registry[defaultLanguage][key] ?? key;

    const data = (key) =>
        translations[key] ?? registry[defaultLanguage][key] ?? null;

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
            value={{language, setLanguage, t, data, getItemTranslations, dir, isFarsi}}
        >
            <div
                style={{direction: dir}}
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
                            transition: {duration: 0.05, ease: "linear"},
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