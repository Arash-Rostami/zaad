"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "@/services/TranslationService";
import useActiveSelection from "../hooks/useActiveSelection";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

function Blueprint() {
    const { t, data, language, isFarsi } = useLanguage();
    const sections = data("blueprintSections") || [];
    const { active, setActive } = useActiveSelection(sections);
    const gridRef = useRef(null);
    const navColRef = useRef(null);
    const panelColRef = useRef(null);
    const maxPinEndRef = useRef(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        maxPinEndRef.current = 0;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const trigger = ScrollTrigger.create({
                trigger: gridRef.current,
                pin: navColRef.current,
                start: "top top+=88",
                end: () => {
                    const delta = panelColRef.current.offsetHeight - navColRef.current.offsetHeight;
                    maxPinEndRef.current = Math.max(maxPinEndRef.current, delta, 0);
                    return "+=" + maxPinEndRef.current;
                },
                pinSpacing: false,
                invalidateOnRefresh: true,
            });

            return () => trigger.kill();
        });

        return () => mm.revert();
    }, [language, active]);

    return (
        <div className="section-y bg-surface min-h-screen text-left rtl:text-right">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                    <div className="border-b border-ink/10 pb-8 mb-12">
                        <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
                            {t("studioArchives")}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light text-glow-subtle">
                            {wrapBrandNames(t("zaadBlueprint"))}
                        </h1>
                        <p className="text-sm md:text-base text-muted mt-2 font-light max-w-2xl leading-relaxed">
                            {t("blueprintIntroText")}
                        </p>
                    </div>
                </MaisonReveal>

                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <MaisonReveal variant="slide-up-royal" delay={0.35} className="lg:col-span-4 lg:col-start-1">
                        <div ref={navColRef} className="space-y-4">
                            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-widest text-muted block uppercase mb-2">
                                {t("exploreBriefingFiles")}
                            </span>
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => setActive(sec)}
                                    className={`w-full text-left rtl:text-right p-5 border text-xs transition-all duration-300 rounded-xl focus:outline-none flex flex-col cursor-pointer ${active?.id === sec.id ? "bg-panel border-ink shadow-card-sm" : "bg-panel-glass border-ink/10 hover:bg-panel"}`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono text-accent font-semibold uppercase tracking-widest">
                                            {sec.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-serif font-farsi font-light text-ink block mb-1">
                                        {sec.title}
                                    </span>
                                    <span className="text-xs text-muted leading-relaxed font-light font-sans">
                                        {wrapLatinRuns(sec.summary, isFarsi)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </MaisonReveal>

                    <MaisonReveal
                        variant="scale-down-unveil"
                        delay={0.55}
                        className="lg:col-span-8 lg:col-start-5 bg-surface-frosted p-8 border border-ink/10 shadow-ambient rounded-2xl"
                    >
                        <div ref={panelColRef}>
                            <AnimatePresence mode="wait">
                                {active && (
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0, x: isFarsi ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isFarsi ? 20 : -20 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        onAnimationComplete={() => ScrollTrigger.refresh()}
                                    >
                                        <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6 text-xs font-mono">
                                            <span className="text-accent uppercase tracking-widest font-semibold">
                                                {active.category} / {t("chapterFile")}
                                            </span>
                                            <span className="text-muted uppercase tracking-widest">
                                                {t("statusCompliant")}
                                            </span>
                                        </div>

                                        <div className="prose max-w-none text-ink text-sm md:text-base font-light leading-relaxed whitespace-pre-line space-y-6">
                                            {wrapLatinRuns(active.content, isFarsi)}
                                        </div>

                                        <div className="border-t border-ink/10 pt-6 mt-8">
                                            <span className="text-[length:calc(9px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-3">
                                                {t("blueprintSystemTags")}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(active.tags || []).map((tg, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-panel border border-ink/10 text-[length:calc(10px*var(--zaad-font-scale))] font-mono px-3 py-1.5 text-ink uppercase tracking-wider rounded-md"
                                                    >
                                                        {tg}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </MaisonReveal>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Blueprint);