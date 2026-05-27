import React, { memo } from "react";
import { motion } from "motion/react";

const ControlsFooter = memo(function ControlsFooter({ t, language, setLanguage, themeMode, handleThemeChange }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="md:col-span-12 border-t border-ink/10 mt-5 pt-5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div className="flex items-center space-x-3.5 rtl:space-x-reverse font-mono text-[8.5px] tracking-widest text-accent/80 uppercase">
                <span>© 2026 ZAAD</span>
                <span className="opacity-30">•</span>
                <span>{t("menuDigitalEdition")}</span>
                <span className="opacity-30">•</span>
                <span>{t("menuZAADIndex")}</span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex flex-wrap items-center gap-4 bg-control-bar border border-control px-4 py-2 rounded-full shadow-canvas-mid hover:shadow-canvas-lift transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    <div className="flex items-center relative rounded-full bg-toggle-track p-0.5 font-mono text-[8px] tracking-widest h-7 w-20">
                        {["en", "fa"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`cursor-pointer flex-1 text-center h-full rounded-full transition-colors duration-700 relative z-10 uppercase text-[8.5px] font-semibold flex items-center justify-center ${language === lang ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted hover:text-headline"}`}
                            >
                                {language === lang && (
                                    <motion.div
                                        layoutId="activeLanguageBlobInNavbar"
                                        className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                                    />
                                )}
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <span className="h-3 w-[1px] bg-ink/10" />

                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse pr-0.5">
                        <span className="text-[7.5px] font-mono tracking-wider text-muted uppercase">
                            {t("menuThemeLabel")}
                        </span>
                        <div className="flex items-center relative rounded-full bg-toggle-track p-0.5 h-7">
                            {[
                                { mode: "light", label: "LMN" },
                                { mode: "mid", label: "ARA" },
                                { mode: "dark", label: "UMB" },
                            ].map(({ mode, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => handleThemeChange(mode)}
                                    className={`cursor-pointer px-2 h-full text-[8.5px] font-semibold font-mono tracking-widest rounded-full transition-colors duration-700 relative z-10 flex items-center justify-center ${themeMode === mode ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted/70 hover:text-headline"}`}
                                >
                                    {themeMode === mode && (
                                        <motion.div
                                            layoutId="activeThemeBlobInNavbar"
                                            className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                                        />
                                    )}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default ControlsFooter;
