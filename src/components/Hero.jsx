"use client";

import {motion} from "motion/react";
import {ArrowDown} from "lucide-react";
import MaisonButton from "./MaisonButton";
import {useLanguage} from "@/services/TranslationService";

export default function Hero({onScrollToCollection}) {
    const {t} = useLanguage();
    return (
        <section
            className="relative min-h-screen pt-32 pb-16 px-6 sm:px-12 flex flex-col justify-between overflow-hidden bg-surface">
            {/* Decorative architectural grid overlay - faint and precise */}
            <div
                className="absolute inset-x-0 top-0 h-full pointer-events-none grid grid-cols-4 max-w-7xl mx-auto px-6 sm:px-12">
                <div className="border-l border-ink/10 h-full w-[1px]"></div>
                <div className="border-l border-ink/10 h-full w-[1px]"></div>
                <div className="border-l border-ink/10 h-full w-[1px]"></div>
                <div className="border-l border-ink/10 h-full w-[1px] border-r"></div>
            </div>
            <div></div>
            {/* Spacer */}
            {/* Main Hero Content - Framed organically */}
            <div
                className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
                {/* Left Column: Typographical statements (Curator focus) */}
                <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right z-20">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mb-4"
                    >
            <span
                className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
              {t("bespokeObjects")}
            </span>
                    </motion.div>

                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1.4,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.1,
                        }}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-serif tracking-tight leading-[1.12] text-ink font-light"
                    >
                        {t("heroTitle_1")} <br/>
                        <span className="italic font-normal font-serif-luxury text-accent">
              {t("heroTitle_italic")}
            </span>{" "}
                        <br/>
                        {t("heroTitle_2")}
                    </motion.h1>

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.3,
                        }}
                        className="mt-8 text-sm sm:text-base md:text-lg text-muted font-light max-w-lg leading-relaxed"
                    >
                        {t("heroDesc")}
                    </motion.p>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.5,
                        }}
                        className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse w-full sm:w-auto"
                    >
                        <MaisonButton variant="solid" onClick={onScrollToCollection}>
                            {t("exploreCollection")}
                        </MaisonButton>
                        <MaisonButton
                            variant="outline"
                            onClick={() => {
                                const element = document.getElementById("story");
                                if (element) {
                                    element.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                }
                            }}
                        >
                            {t("ourPhilosophy")}
                        </MaisonButton>
                    </motion.div>
                </div>

                {/* Right Column: Architectural Framed Imagery */}
                <div className="lg:col-span-5 relative mt-12 lg:mt-0 z-10 w-full pl-0 lg:pl-6">
                    <motion.div
                        initial={{
                            scale: 1.05,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 1.8,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative aspect-[3/4] w-full max-w-[450px] mx-auto overflow-hidden bg-surface-alt shadow-canvas-low border border-ink/10"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90"
                            alt="ZAAD Architectural Lounge Space"
                            className="object-cover w-full h-full transition-transform duration-[3s] hover:scale-105"
                            referrerPolicy="no-referrer"
                        />
                        {/* Museum-like object card watermark in corner */}
                        <div
                            className="absolute bottom-6 left-[inherit] right-6 rtl:right-[inherit] rtl:left-6 bg-panel/90 backdrop-blur-sm p-4 border border-ink/10 max-w-[200px] shadow-sm text-left rtl:text-right">
              <span className="text-[9px] font-mono tracking-widest text-accent block mb-1 uppercase">
                {t("heroExhibition")}
              </span>
                            <p className="text-[11px] font-medium tracking-wider text-ink uppercase font-sans">
                                {t("heroTravertineBase")}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Hero Bottom: Scroll Indicator, Location, and Core Philosophy line */}
            <div
                className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-ink/10 pt-8 mt-16 text-muted">
                <div className="md:col-span-4 flex items-center space-x-4">
                    <button
                        onClick={onScrollToCollection}
                        className="flex items-center space-x-3 text-[11px] font-mono uppercase tracking-[0.2em] hover:text-ink transition-colors group"
                    >
            <span className="p-2 border border-ink/10 rounded-full group-hover:bg-ink/5 transition-all">
              <ArrowDown className="w-3.5 h-3.5"/>
            </span>
                        <span>{t("monograph")}</span>
                    </button>
                </div>

                <div
                    className="md:col-span-4 text-left md:text-center text-[11px] font-light leading-relaxed max-w-xs mx-auto">
                    "{t("heroQuote")}"
                </div>

                <div
                    className="md:col-span-4 text-left md:text-right rtl:text-left text-[11px] font-mono tracking-widest">
                    {t("estFlorence")}
                </div>
            </div>
        </section>
    );
}
