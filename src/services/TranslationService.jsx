"use client";

import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {defaultLanguage, languages} from "@/lib/i18n/config";
import {en} from "@/lib/i18n/en";
import {fa} from "@/lib/i18n/fa";

const registry = {en, fa};

const LanguageContext = createContext({
    language: defaultLanguage,
    setLanguage: () => {
    },
    t: (key) => key,
    data: (key) => null,
    dir: "ltr",
    isFarsi: false,
});

export function LanguageProvider({initialLanguage = defaultLanguage, children}) {
    const [language, setLanguageState] = useState(initialLanguage);

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        try {
            localStorage.setItem("zaad_preferred_language", lang);
        } catch (e) {
            console.warn("Could not persist language selection", e);
        }
        document.cookie = `zaad_preferred_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }, []);

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


    useEffect(() => {
        let stored = null;
        try {
            const match = document.cookie.match(/(?:^|; )zaad_preferred_language=([^;]+)/);
            stored = match ? decodeURIComponent(match[1]) : localStorage.getItem("zaad_preferred_language");
        } catch (e) {
            // ignore — defaults remain
        }
        if (stored && languages.some((l) => l.code === stored) && stored !== language) {
            setLanguageState(stored);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dir = language === "fa" ? "rtl" : "ltr";
    const isFarsi = language === "fa";
    const translations = registry[language] || registry[defaultLanguage];

    const t = useCallback(
        (key) => translations[key] ?? registry[defaultLanguage][key] ?? key,
        [translations]
    );

    const data = useCallback(
        (key) => translations[key] ?? registry[defaultLanguage][key] ?? null,
        [translations]
    );

    const value = useMemo(
        () => ({language, setLanguage, t, data, dir, isFarsi}),
        [language, setLanguage, t, data, dir, isFarsi]
    );

    return (
        <LanguageContext.Provider value={value}>
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
                            transition: {duration: 0.5, ease: [0.16, 1, 0.3, 1]},
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