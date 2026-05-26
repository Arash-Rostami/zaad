"use client";

import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {ChevronRight} from "lucide-react";
import {animateScrollTo, animateScrollToTop} from "@/services/ScrollService";
import MaisonButton from "./MaisonButton";
import {useLanguage} from "@/services/TranslationService";
import useTheme from "../hooks/useTheme";

export default function Header({
                                   activeTab,
                                   setActiveTab,
                                   selectedProduct,
                                   onSelectProduct,
                                   onScrollToSection,
                               }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const {language, setLanguage, t, data, getItemTranslations} = useLanguage();
    const {themeMode, handleThemeChange} = useTheme();
    const collection = data("collection") || [];

    const journeyLinks = [
        {
            key: "story",
            label: t("menuOriginsPhilosophy"),
            sub: t("menuChapter1"),
        },
        {
            key: "collection",
            label: t("menuCuratedSeries"),
            sub: t("menuChapter2"),
        },
        {
            key: "concierge",
            label: t("menuAcquisitionsCabinet"),
            sub: t("menuChapter3"),
        },
    ];

    return (
        <header
            className="fixed top-0 left-0 w-full z-50 bg-panel/10 hover:bg-panel/20 backdrop-blur-[6px] border-b border-ink/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between relative">

                {/* Left Side: Elegant Trigger Button */}
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
                                        initial={{y: 20, opacity: 0}}
                                        animate={{y: 0, opacity: 1}}
                                        exit={{y: -20, opacity: 0}}
                                        transition={{duration: 0.6, ease: [0.76, 0, 0.24, 1]}}
                                        className="absolute"
                                    >
                                        {t("menuClose")}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="browse"
                                        initial={{y: -20, opacity: 0}}
                                        animate={{y: 0, opacity: 1}}
                                        exit={{y: 20, opacity: 0}}
                                        transition={{duration: 0.6, ease: [0.76, 0, 0.24, 1]}}
                                        className="absolute"
                                    >
                                        {t("menuBrowse")}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </MaisonButton>
                </div>

                {/* Center Logo */}
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

                {/* Right Side: Inquiry button */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MaisonButton
                        onClick={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            setMenuOpen(false);
                            setTimeout(() => {
                                animateScrollTo("concierge", 1500);
                            }, 120);
                        }}
                        variant="outline"
                        className="!px-3 sm:!px-5 h-8 sm:h-10 !rounded-full !text-[8.5px] sm:!text-[10px] !tracking-[0.15em] sm:!tracking-[0.2em] flex items-center justify-center font-sans"
                    >
                        {t("menuInquiry")}
                    </MaisonButton>
                </div>
            </div>

            {/* Slide-out menu panel */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{opacity: 0, height: 0, clipPath: "inset(0% 0% 100% 0%)"}}
                        animate={{opacity: 1, height: "auto", clipPath: "inset(0% 0% 0% 0%)"}}
                        exit={{opacity: 0, height: 0, clipPath: "inset(0% 0% 100% 0%)"}}
                        transition={{duration: 1.1, ease: [0.76, 0, 0.24, 1]}}
                        className="absolute top-full left-0 w-full bg-overlay-panel border-b border-accent/20 shadow-deep z-40 overflow-hidden"
                    >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.4] dark:opacity-[0.25] mix-blend-overlay">
                            <svg viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <filter id="luxuryNoise">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="3"
                                                  stitchTiles="stitch"/>
                                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.3 0"/>
                                </filter>
                                <rect width="100%" height="100%" filter="url(#luxuryNoise)"/>
                            </svg>
                        </div>

                        <div
                            className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                            <svg
                                className="w-full h-full stroke-accent/10"
                                viewBox="0 0 1440 320"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                            >
                                <path fill="none" strokeWidth="0.5"
                                      d="M0,160 Q360,50 720,160 T1440,160 M0,200 Q360,90 720,200 T1440,200 M0,240 Q360,130 720,240 T1440,240"/>
                            </svg>
                        </div>

                        <div
                            className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent absolute top-0 left-0"/>

                        <div
                            className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex flex-col justify-between relative z-10 max-h-[85vh] overflow-y-auto">
                            <motion.div
                                initial={{opacity: 0, y: 30}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                transition={{duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1]}}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
                            >
                                {/* ROW 1: PRIMARY PORTALS (1/3) & JOURNEY INDEX (2/3) */}
                                <div className="md:col-span-4 flex flex-col space-y-2">
                                      <span
                                          className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                                        {t("menuSystemDirectories")}
                                      </span>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full pb-1">
                                        <button
                                            onClick={() => {
                                                setActiveTab("showroom");
                                                onSelectProduct(null);
                                                setMenuOpen(false);
                                                animateScrollToTop(1400);
                                            }}
                                            className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden ${activeTab === "showroom" && !selectedProduct ? "bg-[#C5A059]/10 border-[#C5A059]/50 shadow-md font-semibold" : "border-ink/10 hover:border-[#C5A059]/60 bg-panel/20 hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="flex justify-end w-full">
                                                <span className="text-[10px] font-mono tracking-widest text-accent/60 group-hover:text-[#C5A059] transition-colors duration-300 uppercase">SYS.01</span>
                                            </div>
                                            <div className="flex flex-col mt-6 relative z-10">
                                                <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                                                    {t("menuLivingShowroom")}
                                                </span>
                                                <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">{t("menuLivingShowroomSub")}</span>
                                                    <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveTab("pdf");
                                                onSelectProduct(null);
                                                setMenuOpen(false);
                                            }}
                                            className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden ${activeTab === "blueprint" ? "bg-[#C5A059]/10 border-[#C5A059]/50 shadow-md font-semibold" : "border-ink/10 hover:border-[#C5A059]/60 bg-panel/20 hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="flex justify-end w-full">
                                                <span className="text-[10px] font-mono tracking-widest text-accent/60 group-hover:text-[#C5A059] transition-colors duration-300 uppercase">SYS.02</span>
                                            </div>
                                            <div className="flex flex-col mt-6 relative z-10">
                                                <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                                                    {t("menuAtelierBlueprints")}
                                                </span>
                                                <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">{t("menuAtelierBlueprintsSub")}</span>
                                                    <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Column 2: JOURNEY INDEX (Stretches across 2/3 space, items side-by-side) */}
                                <div className="md:col-span-8 flex flex-col space-y-2">
                                  <span
                                      className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                                    {t("menuJourneyIndex")}
                                  </span>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 pb-1">
                                        {journeyLinks.map((target, index) => (
                                            <button
                                                key={target.key}
                                                onClick={() => {
                                                    setActiveTab("showroom");
                                                    onSelectProduct(null);
                                                    setMenuOpen(false);
                                                    setTimeout(() => {
                                                        animateScrollTo(target.key, 1400);
                                                    }, 120);
                                                }}
                                                className="group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden border-ink/10 hover:border-[#C5A059]/60 bg-panel/20 hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                                <div className="flex justify-end w-full">
                                                    <span className="text-[10px] font-mono tracking-widest text-accent/60 group-hover:text-[#C5A059] transition-colors duration-300 uppercase">CH.{String(index + 1).padStart(2, "0")}</span>
                                                </div>
                                                <div className="flex flex-col mt-6 relative z-10">
                                                    <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                                                      {target.label}
                                                    </span>
                                                    <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                        <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">{target.sub}</span>
                                                        <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ELEGANT DIVIDER */}
                                <div className="md:col-span-12 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent my-1 sm:my-2" />

                                {/* ROW 2: CURATED SPECIMENS (Spans full width, 4 items horizontal) */}
                                <div className="md:col-span-12 flex flex-col space-y-2">
                                  <span
                                      className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                                    {t("menuCuratedSpecimens")}
                                  </span>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                        {collection.map((item) => {
                                            const isSculptureActive = selectedProduct?.id === item.id;
                                            const translatedItem = getItemTranslations(item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setActiveTab("showroom");
                                                        onSelectProduct(item);
                                                        setMenuOpen(false);
                                                    }}
                                                    className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden ${isSculptureActive ? "bg-[#C5A059]/10 border-[#C5A059]/50 font-semibold shadow-md" : "border-ink/10 hover:border-[#C5A059]/60 bg-panel/20 hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"}`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                    <div className="flex justify-end w-full">
                                                        <span
                                                            className="text-xs font-mono tracking-widest text-accent/80 group-hover:text-[#C5A059] transition-colors duration-300">
                                                          {item.number}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col mt-6 relative z-10">
                                                        <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                                                          {translatedItem?.name || item.name}
                                                        </span>
                                                        <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                            <span
                                                                className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">
                                                              {t("menuView")}
                                                            </span>
                                                            <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                </motion.div>

                            {/* Settings footer */}
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.8, delay: 0.4, ease: [0.76, 0, 0.24, 1]}}
                                className="md:col-span-12 border-t border-ink/10 mt-5 pt-5 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div
                                    className="flex items-center space-x-3.5 rtl:space-x-reverse font-mono text-[8.5px] tracking-widest text-accent/80 uppercase">
                                    <span>© 2026 ZAAD ATELIER</span>
                                    <span className="opacity-30">•</span>
                                    <span>{t("menuDigitalEdition")}</span>
                                    <span className="opacity-30">•</span>
                                    <span>{t("menuAtelierIndex")}</span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div
                                        className="flex flex-wrap items-center gap-4 bg-control-bar border border-control px-4 py-2 rounded-full shadow-canvas-mid hover:shadow-canvas-lift transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                                        {/* Language toggler */}
                                        <div
                                            className="flex items-center relative rounded-full bg-toggle-track p-0.5 font-mono text-[8px] tracking-widest h-7 w-20">
                                            <button
                                                onClick={() => setLanguage("en")}
                                                className={`cursor-pointer flex-1 text-center h-full rounded-full transition-colors duration-700 relative z-10 uppercase text-[8.5px] font-semibold flex items-center justify-center ${language === "en" ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted hover:text-headline"}`}
                                            >
                                                {language === "en" && (
                                                    <motion.div
                                                        layoutId="activeLanguageBlobInNavbar"
                                                        className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                                        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, ease: "easeInOut" }}
                                                    />
                                                )}
                                                EN
                                            </button>

                                            <button
                                                onClick={() => setLanguage("fa")}
                                                className={`cursor-pointer flex-1 text-center h-full rounded-full transition-colors duration-700 relative z-10 text-[8.5px] font-semibold flex items-center justify-center ${language === "fa" ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted hover:text-headline"}`}
                                            >
                                                {language === "fa" && (
                                                    <motion.div
                                                        layoutId="activeLanguageBlobInNavbar"
                                                        className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                                        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, ease: "easeInOut" }}
                                                    />
                                                )}
                                                FA
                                            </button>
                                        </div>

                                        <span className="h-3 w-[1px] bg-ink/10"/>

                                        {/* Theme selector */}
                                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse pr-0.5">
                      <span className="text-[7.5px] font-mono tracking-wider text-muted uppercase">
                        {t("menuThemeLabel")}
                      </span>
                                            <div
                                                className="flex items-center relative rounded-full bg-toggle-track p-0.5 h-7">
                                                {["light", "mid", "dark"].map((mode) => {
                                                    const isActive = themeMode === mode;
                                                    const label =
                                                        mode === "light" ? "LMN" : mode === "mid" ? "ARA" : "UMB";
                                                    return (
                                                        <button
                                                            key={mode}
                                                            onClick={() => handleThemeChange(mode)}
                                                            className={`cursor-pointer px-2 h-full text-[8.5px] font-semibold font-mono tracking-widest rounded-full transition-colors duration-700 relative z-10 flex items-center justify-center ${isActive ? "text-on-indicator font-bold drop-shadow-sm" : "text-muted/70 hover:text-headline"}`}
                                                        >
                                                            {isActive && (
                                                                <motion.div
                                                                    layoutId="activeThemeBlobInNavbar"
                                                                    className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                                                    transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5, ease: "easeInOut" }}
                                                                />
                                                            )}
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
