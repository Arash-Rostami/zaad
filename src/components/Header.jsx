"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { animateScrollTo, animateScrollToTop } from "../lib/scroll";
import MaisonButton from "./MaisonButton";
import { COLLECTION_ITEMS } from "../lib/data";
import { useLanguage } from "../lib/TranslationService";
export default function Header({
                                   activeTab,
                                   setActiveTab,
                                   selectedProduct,
                                   onSelectProduct,
                                   onScrollToSection,
                               }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { language, setLanguage, t, getItemTranslations, isFarsi } =
        useLanguage();
    const [themeMode, setThemeMode] = useState("light");
    useEffect(() => {
        const cached = localStorage.getItem("zaad-theme");
        const initialMode = cached || "light";
        setThemeMode(initialMode);
        applyThemeClass(initialMode);
    }, []);
    const applyThemeClass = (targetMode) => {
        const root = document.documentElement;
        root.classList.remove("light", "mid", "dark");
        root.classList.add(targetMode);
    };
    const handleThemeChange = (targetMode) => {
        setThemeMode(targetMode);
        applyThemeClass(targetMode);
        localStorage.setItem("zaad-theme", targetMode);
    };
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/10 hover:bg-white/20 backdrop-blur-[6px] border-b border-[#1C1C1C]/5 transition-all duration-300">
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
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                                        className="absolute"
                                    >
                                        {isFarsi ? "بستن" : "Close"}
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
                                        {isFarsi ? "کاتالوگ" : "Browse"}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </MaisonButton>
                </div>

                {/* Center Logo/Branding - Absolutely Positioned for perfect geometry */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                    <button
                        onClick={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            setMenuOpen(false);
                            animateScrollToTop(1400);
                        }}
                        className="text-[#1C1C1C] text-lg sm:text-2xl md:text-3xl font-serif tracking-[0.2em] sm:tracking-[0.35em] uppercase font-semibold hover:opacity-85 transition-opacity focus:outline-none flex items-center pl-[0.2em] sm:pl-[0.35em]"
                    >
                        ZAAD
                    </button>
                </div>

                {/* Right Side: Clean Inquiry button */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MaisonButton
                        onClick={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            setMenuOpen(false);
                            setTimeout(() => {
                                animateScrollTo("concierge", 1500); // Luxurious custom kinetic decelerating crawl to the form
                            }, 120);
                        }}
                        variant="outline"
                        className="!px-3 sm:!px-5 h-8 sm:h-10 !rounded-full !text-[8.5px] sm:!text-[10px] !tracking-[0.15em] sm:!tracking-[0.2em] flex items-center justify-center font-sans"
                    >
                        {isFarsi ? "سفارش" : "Inquiry"}
                    </MaisonButton>
                </div>
            </div>

            {/* Slide-out highly aesthetic menu panel */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                            clipPath: "inset(0% 0% 100% 0%)",
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            clipPath: "inset(0% 0% 0% 0%)",
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            clipPath: "inset(0% 0% 100% 0%)",
                        }}
                        transition={{
                            duration: 1.1,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                        className="absolute top-full left-0 w-full !bg-[#F5F6F8] dark:bg-[#090A09]/80 mid:bg-[#0E1116]/80 border-b border-[#8E7A62]/20 dark:border-white/10 mid:border-white/10 shadow-[0_50px_110px_rgba(0,0,0,0.18)] z-40 overflow-hidden"
                    >
                        {/* Fine Architectural Grid Pattern Underlay for elite luxury technical aesthetic */}
                        {/* Luxurious Fine Noise Texture */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06] dark:opacity-[0.03] mix-blend-overlay">
                            <svg
                                viewBox="0 0 100% 100%"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                <filter id="luxuryNoise">
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.95"
                                        numOctaves="3"
                                        stitchTiles="stitch"
                                    />
                                    <feColorMatrix
                                        type="matrix"
                                        values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.3 0"
                                    />
                                </filter>
                                <rect width="100%" height="100%" filter="url(#luxuryNoise)" />
                            </svg>
                        </div>

                        {/* Elegant topographical subtle curves */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                            <svg
                                className="w-full h-full stroke-[#8E7A62]/10 dark:stroke-white/5 mid:stroke-white/5"
                                viewBox="0 0 1440 320"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                            >
                                <path
                                    fill="none"
                                    strokeWidth="0.5"
                                    d="M0,160 Q360,50 720,160 T1440,160 M0,200 Q360,90 720,200 T1440,200 M0,240 Q360,130 720,240 T1440,240"
                                />
                            </svg>
                        </div>

                        {/* Micro gold gradient thin horizontal line separator at the very top */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8E7A62]/30 dark:via-[#CBB9A7]/30 mid:via-[#F2D299]/30 to-transparent absolute top-0 left-0" />

                        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex flex-col justify-between relative z-10 max-h-[85vh] overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.9,
                                    delay: 0.2,
                                    ease: [0.76, 0, 0.24, 1],
                                }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
                            >
                                {/* Column 1: PRIMARY PORTALS (Showroom & Blueprints) */}
                                <div className="md:col-span-4 flex flex-col space-y-2">
                  <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#8E7A62] dark:text-[#CBB9A7] mid:text-[#F2D299] font-bold uppercase border-b border-[#1C1C1C]/5 dark:border-white/5 pb-1 mb-0.5 text-left rtl:text-right">
                    {isFarsi ? "بخش‌های اصلی" : "SYSTEM DIRECTORIES"}
                  </span>

                                    <button
                                        onClick={() => {
                                            setActiveTab("showroom");
                                            onSelectProduct(null);
                                            setMenuOpen(false);
                                            animateScrollToTop(1400);
                                        }}
                                        className={`group text-left rtl:text-right p-2.5 border transition-all duration-300 rounded-lg cursor-pointer flex flex-col justify-center min-h-[58px] ${activeTab === "showroom" && !selectedProduct ? "bg-[#8E7A62]/8 dark:bg-[#CBB9A7]/8 mid:bg-[#F2D299]/8 border-[#8E7A62]/40 dark:border-[#CBB9A7]/40 mid:border-[#F2D299]/40 shadow-sm font-semibold" : "border-[#1C1C1C]/5 dark:border-white/5 mid:border-white/5 hover:border-[#8E7A62]/20 dark:hover:border-[#CBB9A7]/20 mid:hover:border-[#F2D299]/20 bg-white/10 dark:bg-black/10 hover:bg-white/40 dark:hover:bg-white/5"}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-serif text-[#1C1C1C] dark:text-white mid:text-[#EBEFF5] font-semibold group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-300">
                        {isFarsi
                            ? "۱. نمایشگاه همه‌جانبه‌ی زاد"
                            : "01 / Living Showroom"}
                      </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-[#8E7A62] mid:text-[#F2D299] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[9.5px] text-[#5C5954] dark:text-[#9C9588] mid:text-[#97A5B8] font-light mt-0.5 leading-none">
                      {isFarsi
                          ? "جزیره‌های آشپزخانه و مبلمان تراورتن مونوکلتیک"
                          : "Monolithic installations & specimen explorer"}
                    </span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveTab("blueprint");
                                            onSelectProduct(null);
                                            setMenuOpen(false);
                                        }}
                                        className={`group text-left rtl:text-right p-2.5 border transition-all duration-300 rounded-lg cursor-pointer flex flex-col justify-center min-h-[58px] ${activeTab === "blueprint" ? "bg-[#8E7A62]/8 dark:bg-[#CBB9A7]/8 mid:bg-[#F2D299]/8 border-[#8E7A62]/40 dark:border-[#CBB9A7]/40 mid:border-[#F2D299]/40 shadow-sm font-semibold" : "border-[#1C1C1C]/5 dark:border-white/5 mid:border-white/5 hover:border-[#8E7A62]/20 dark:hover:border-[#CBB9A7]/20 mid:hover:border-[#F2D299]/20 bg-white/10 dark:bg-black/10 hover:bg-white/40 dark:hover:bg-white/5"}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-serif text-[#1C1C1C] dark:text-white mid:text-[#EBEFF5] font-semibold group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-300">
                        {isFarsi
                            ? "۲. نقشه‌های فنی آتلیه"
                            : "02 / Atelier Blueprints"}
                      </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-[#8E7A62] mid:text-[#F2D299] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[9.5px] text-[#5C5954] dark:text-[#9C9588] mid:text-[#97A5B8] font-light mt-0.5 leading-none">
                      {isFarsi
                          ? "کدهای مادی، فواصل هندسی و هندسه‌ی رنگ‌ها"
                          : "Visual alignment & technical guidelines"}
                    </span>
                                    </button>
                                </div>

                                {/* Column 2: CHRONOLOGY INDEX (Scroll actions) */}
                                <div className="md:col-span-4 flex flex-col space-y-2">
                  <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#8E7A62] dark:text-[#CBB9A7] mid:text-[#F2D299] font-bold uppercase border-b border-[#1C1C1C]/5 dark:border-white/5 pb-1 mb-0.5 text-left rtl:text-right">
                    {isFarsi ? "مسیرهای گالری" : "JOURNEY INDEX"}
                  </span>

                                    {[
                                        {
                                            key: "story",
                                            labelEn: "Origins & Philosophy",
                                            labelFa: "منشأ و فلسفه زاد",
                                            subEn: "CHAPTER I / MANIFESTO",
                                            subFa: "بخش اول / فلسفه‌ی مادی",
                                        },
                                        {
                                            key: "collection",
                                            labelEn: "The Curated Series",
                                            labelFa: "مجموعه اشیاء دست‌ساز",
                                            subEn: "CHAPTER II / MONOGRAPHS",
                                            subFa: "بخش دوم / تندیس‌ها",
                                        },
                                        {
                                            key: "concierge",
                                            labelEn: "Acquisitions Cabinet",
                                            labelFa: "مشاوره و تدارکات خرید",
                                            subEn: "CHAPTER III / CONCIERGE",
                                            subFa: "بخش سوم / تماس زاد",
                                        },
                                    ].map((target) => (
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
                                            className="group p-2.5 border border-[#1C1C1C]/5 dark:border-white/5 mid:border-white/5 hover:border-[#8E7A62]/20 dark:hover:border-[#CBB9A7]/20 mid:hover:border-[#F2D299]/20 bg-white/10 dark:bg-black/10 hover:bg-white/40 dark:hover:bg-white/5 rounded-lg cursor-pointer flex flex-col justify-center transition-all duration-300 text-left rtl:text-right min-h-[58px]"
                                        >
                                            <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-serif font-semibold text-[#1C1C1C] dark:text-white mid:text-[#EBEFF5]">
                          {isFarsi ? target.labelFa : target.labelEn}
                        </span>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#8E7A62] mid:text-[#F2D299] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-300" />
                                            </div>
                                            <span className="text-[9px] text-[#8E7A62] dark:text-[#CBB9A7] mid:text-[#F2D299] font-mono mt-0.5 font-semibold uppercase leading-tight">
                        {isFarsi ? target.subFa : target.subEn}
                      </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Column 3: SPECIALIZED SPECIMENS */}
                                <div className="md:col-span-4 flex flex-col space-y-2">
                  <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#8E7A62] dark:text-[#CBB9A7] mid:text-[#F2D299] font-bold uppercase border-b border-[#1C1C1C]/5 dark:border-white/5 pb-1 mb-0.5 text-left rtl:text-right">
                    {isFarsi ? "تندیس‌های کاتالوگ" : "CURATED SPECIMENS"}
                  </span>

                                    <div className="flex flex-col space-y-2">
                                        {COLLECTION_ITEMS.map((item) => {
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
                                                    className={`text-left rtl:text-right p-2.5 border transition-all duration-300 rounded-lg cursor-pointer flex items-center justify-between min-h-[58px] ${isSculptureActive ? "bg-[#8E7A62]/10 dark:bg-[#CBB9A7]/10 mid:bg-[#F2D299]/10 border-[#8E7A62]/40 dark:border-[#CBB9A7]/40 mid:border-[#F2D299]/40 font-semibold shadow-sm" : "border-[#1C1C1C]/5 dark:border-white/5 mid:border-white/5 hover:border-[#8E7A62]/20 dark:hover:border-[#CBB9A7]/20 mid:hover:border-[#F2D299]/20 bg-white/10 dark:bg-black/10 hover:bg-white/40"}`}
                                                >
                                                    <div className="flex flex-col">
                            <span className="text-xs font-serif font-semibold text-[#1C1C1C] dark:text-white mid:text-[#EBEFF5] leading-tight-none">
                              {translatedItem?.name || item.name}
                            </span>
                                                        <span className="text-[9px] font-mono text-[#8E7A62] dark:text-[#CBB9A7] mid:text-[#F2D299] mt-0.5 font-semibold leading-none">
                              {item.number}
                            </span>
                                                    </div>
                                                    <span className="text-[9px] tracking-widest text-[#5C5954] dark:text-[#9C9588] mid:text-[#97A5B8] uppercase hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-transform duration-300">
                            {isFarsi ? "مشاهده" : "VIEW"}
                          </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* SETTINGS FOOTER — Row 4 */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.4,
                                    ease: [0.76, 0, 0.24, 1],
                                }}
                                className="md:col-span-12 border-t border-[#1C1C1C]/10 dark:border-white/10 mt-5 pt-5 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div className="flex items-center space-x-3.5 rtl:space-x-reverse font-mono text-[8.5px] tracking-widest text-[#8E7A62]/80 dark:text-[#CBB9A7]/80 mid:text-[#F2D299]/80 uppercase">
                                    <span>© 2026 ZAAD ATELIER</span>
                                    <span className="opacity-30">•</span>
                                    <span>
                    {isFarsi ? "نسخه دیجیتال ۴.۰" : "DIGITAL EDITION v4.0"}
                  </span>
                                    <span className="opacity-30">•</span>
                                    <span>
                    {isFarsi
                        ? "آرشیو کارگاه شماره ۲"
                        : "ATELIER SPECIMEN INDEX N°02"}
                  </span>
                                </div>

                                {/* Right controls */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-wrap items-center gap-4 bg-white/20 dark:bg-black/40 mid:bg-black/40 border border-[#8E7A62]/25 dark:border-white/15 mid:border-white/15 px-4 py-2 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                                        {/* Language toggler */}
                                        <div className="flex items-center relative rounded-full bg-[#1C1C1C]/10 dark:bg-white/10 mid:bg-black/40 p-0.5 font-mono text-[8px] tracking-widest h-7 w-20">
                                            <button
                                                onClick={() => setLanguage("en")}
                                                className={`flex-1 text-center h-full rounded-full transition-all duration-700 relative z-10 uppercase text-[8.5px] font-semibold flex items-center justify-center ${language === "en" ? "text-white dark:text-[#111110] mid:text-[#1F242C] font-bold" : "text-[#5C5954] hover:text-[#1C1C1C] dark:text-[#9C9588] dark:hover:text-white mid:text-[#97A5B8] mid:hover:text-white"}`}
                                            >
                                                {language === "en" && (
                                                    <motion.div
                                                        layoutId="activeLanguageBlobInNavbar"
                                                        className="absolute inset-0 bg-[#1C1C1C] dark:bg-[#EDECE8] mid:bg-[#F2D299] rounded-full z-[-1]"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 25,
                                                            mass: 0.8,
                                                        }}
                                                    />
                                                )}
                                                EN
                                            </button>

                                            <button
                                                onClick={() => setLanguage("fa")}
                                                className={`flex-1 text-center h-full rounded-full transition-all duration-700 relative z-10 text-[8.5px] font-semibold flex items-center justify-center ${language === "fa" ? "text-white dark:text-[#111110] mid:text-[#1F242C] font-bold" : "text-[#5C5954] hover:text-[#1C1C1C] dark:text-[#9C9588] dark:hover:text-white mid:text-[#97A5B8] mid:hover:text-white"}`}
                                            >
                                                {language === "fa" && (
                                                    <motion.div
                                                        layoutId="activeLanguageBlobInNavbar"
                                                        className="absolute inset-0 bg-[#1C1C1C] dark:bg-[#EDECE8] mid:bg-[#F2D299] rounded-full z-[-1]"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 25,
                                                            mass: 0.8,
                                                        }}
                                                    />
                                                )}
                                                FA
                                            </button>
                                        </div>

                                        <span className="h-3 w-[1px] bg-[#1C1C1C]/15 dark:bg-white/10 mid:bg-white/10" />

                                        {/* Mode selection buttons — Re-integrate Mid(ARA) with supreme luxury layoutId slider and high readability backgrounds! */}
                                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse pr-0.5">
                      <span className="text-[7.5px] font-mono tracking-wider text-[#5C5954] dark:text-[#9C9588] mid:text-[#97A5B8] uppercase">
                        {isFarsi ? "تم" : "LUME"}
                      </span>
                                            <div className="flex items-center relative rounded-full bg-[#1C1C1C]/10 dark:bg-white/10 mid:bg-black/40 p-0.5 h-7">
                                                {["light", "mid", "dark"].map((mode) => {
                                                    const isActive = themeMode === mode;
                                                    const label =
                                                        mode === "light"
                                                            ? "LMN"
                                                            : mode === "mid"
                                                                ? "ARA"
                                                                : "UMB";
                                                    return (
                                                        <button
                                                            key={mode}
                                                            onClick={() => handleThemeChange(mode)}
                                                            className={`px-2 h-full text-[8.5px] font-semibold font-mono tracking-widest rounded-full transition-all duration-700 relative z-10 flex items-center justify-center ${isActive ? "text-white dark:text-[#111110] mid:text-[#1F242C] font-bold" : "text-[#5C5954]/70 hover:text-[#1C1C1C] dark:text-[#9C9588]/70 dark:hover:text-white mid:text-[#97A5B8]/70 mid:hover:text-white"}`}
                                                        >
                                                            {isActive && (
                                                                <motion.div
                                                                    layoutId="activeThemeBlobInNavbar"
                                                                    className="absolute inset-0 bg-[#1C1C1C] dark:bg-[#EDECE8] mid:bg-[#F2D299] rounded-full z-[-1]"
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 200,
                                                                        damping: 25,
                                                                        mass: 0.8,
                                                                    }}
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
