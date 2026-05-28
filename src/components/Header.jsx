"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { animateScrollTo, animateScrollToTop } from "@/services/ScrollService";
import MaisonButton from "./MaisonButton";
import { useLanguage } from "@/services/TranslationService";
import useTheme from "../hooks/useTheme";
import MenuPanel from "./header/MenuPanel";

export default function Header({
    activeTab,
    setActiveTab,
    selectedProduct,
    onSelectProduct,
    onScrollToSection,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { language, setLanguage, t, data, getItemTranslations } = useLanguage();
    const { themeMode, handleThemeChange, mounted } = useTheme();
    const collection = data("collection") || [];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between relative">
                <div className="flex items-center">
                    <MaisonButton
                        onClick={() => setMenuOpen(!menuOpen)}
                        variant="solid"
                        className="!px-3.5 sm:!px-5 h-8 sm:h-10 shadow-sm relative z-50 !rounded-full !text-[8.5px] sm:!text-[10px] !tracking-[0.15em] sm:!tracking-[0.25em] flex items-center justify-center font-sans"
                    >
                        <div className="relative w-16 h-4 overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {menuOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                                        className="absolute"
                                    >
                                        {t("menuClose")}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="browse"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                                        className="absolute"
                                    >
                                        {t("menuBrowse")}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </MaisonButton>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                    <button
                        onClick={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            setMenuOpen(false);
                            animateScrollToTop(1400);
                        }}
                        className="text-ink text-lg sm:text-2xl md:text-3xl font-serif tracking-[0.2em] sm:tracking-[0.35em] uppercase font-semibold hover:opacity-85 transition-opacity focus:outline-none flex items-center pl-[0.2em] sm:pl-[0.35em]"
                    >
                        ZAAD
                    </button>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MaisonButton
                        onClick={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            setMenuOpen(false);
                            setTimeout(() => animateScrollTo("concierge", 1500), 120);
                        }}
                        variant="outline"
                        className="!px-3 sm:!px-5 h-8 sm:h-10 !rounded-full !text-[8.5px] sm:!text-[10px] !tracking-[0.15em] sm:!tracking-[0.2em] flex items-center justify-center font-sans"
                    >
                        {t("menuInquiry")}
                    </MaisonButton>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <MenuPanel
                        t={t}
                        language={language}
                        setLanguage={setLanguage}
                        activeTab={activeTab}
                        selectedProduct={selectedProduct}
                        collection={collection}
                        getItemTranslations={getItemTranslations}
                        themeMode={themeMode}
                        handleThemeChange={handleThemeChange}
                        mounted={mounted}
                        onClose={() => setMenuOpen(false)}
                        setActiveTab={setActiveTab}
                        onSelectProduct={onSelectProduct}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}
