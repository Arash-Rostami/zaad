"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {ArrowUpRight, Sliders} from "lucide-react";
import MaisonReveal from "./shared/MaisonReveal";
import NoiseBg from "./shared/NoiseBg";
import {useLanguage} from "@/services/LanguageProvider";
import useActiveSelection from "../hooks/useActiveSelection";
import useDeferredMedia from "../hooks/useDeferredMedia";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const MATERIAL_VIDEOS = {
    "natural-eucalyptus": "eucalyptus",
    "natural-stone": "stone",
    "saddle-leather": "leather",
};

const EMPTY_ARRAY = Object.freeze([]);

const FA_INDEX_FORMAT = new Intl.NumberFormat("fa-IR", {minimumIntegerDigits: 2, useGrouping: false});
const EN_INDEX_FORMAT = new Intl.NumberFormat("en-US", {minimumIntegerDigits: 2, useGrouping: false});

const EASE_IN_OUT = Object.freeze([0.16, 1, 0.3, 1]);
const EASE_EXIT = Object.freeze([0.7, 0, 0.84, 0]);

const ROTATE_0 = Object.freeze({rotate: 0});
const ROTATE_90 = Object.freeze({rotate: 90});

const ICON_TRANSITION = Object.freeze({
    duration: 0.7,
    ease: EASE_IN_OUT,
});

const PANEL_INITIAL = Object.freeze({
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
});

const PANEL_ANIMATE = Object.freeze({
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: Object.freeze({duration: 1.1, ease: EASE_IN_OUT}),
});

const PANEL_EXIT = Object.freeze({
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: Object.freeze({duration: 0.9, ease: EASE_EXIT}),
});

function Materials() {
    const {t, data, isFarsi} = useLanguage();
    const reduceMotion = useReducedMotion();
    const samples = useMemo(() => data("materialSamples") || EMPTY_ARRAY, [data]);
    const {active, setActive} = useActiveSelection(samples, "materialSelection");
    const numberFormatter = isFarsi ? FA_INDEX_FORMAT : EN_INDEX_FORMAT;
    const [mediaReady] = useDeferredMedia({ mode: "eager" });
    const videoRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const activeIndex = useMemo(
        () => samples.findIndex((mat) => mat.id === active?.id),
        [samples, active]
    );

    const handleVideoLoadedData = useCallback(() => {
        if (reduceMotion) return;
        videoRef.current?.play().catch(() => {});
    }, [reduceMotion]);

    const handleVideoEnded = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
    }, []);

    useEffect(() => {
        if (mediaReady && !reduceMotion) {
            videoRef.current?.load();
        }
    }, [mediaReady, reduceMotion, active?.id]);

    const toggleExpanded = useCallback(() => setIsExpanded((expanded) => !expanded), []);

    const toggleHint = isExpanded ? t("materialCollapseSpecification") : t("materialShowSpecification");

    return (
        <section id="materials" className="section-y bg-surface-overlay px-6 sm:px-12 border-b border-ink/10 relative overflow-hidden text-left rtl:text-right">
            <div className="absolute bottom-0 left-0 w-72 h-72 pattern-diamond-grid opacity-[0.16] dark:opacity-[0.06] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block mb-1">
                        {t("materialArchaeology")}
                    </span>
                </MaisonReveal>
                <MaisonReveal variant="lines" delay={0.3} threshold={0.01}>
                    <h2 className="text-2xl md:text-3xl font-serif text-ink tracking-tight font-light mb-4 text-glow-subtle">
                        {t("materialStudy")}
                    </h2>
                </MaisonReveal>

                <MaisonReveal variant="unveil" delay={0.5} threshold={0.01}>
                    <div className="flex flex-row justify-center gap-4 overflow-x-auto scrollbar-none pb-1" data-lenis-prevent>
                        {samples.map((mat, index) => {
                            const isActive = active?.id === mat.id;
                            return (
                                <button
                                    key={mat.id}
                                    type="button"
                                    onClick={() => setActive(mat)}
                                    aria-pressed={isActive}
                                    className={`group relative shrink-0 w-52 sm:w-56 overflow-hidden bg-panel border rounded-2xl p-5 text-left rtl:text-right transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] ${
                                        isActive
                                            ? "border-accent/50 shadow-ambient"
                                            : "border-ink/10 hover:border-accent/40 hover:shadow-ambient"
                                    }`}
                                >
                                    <NoiseBg filterId={`materialNoise-${mat.id}`} revealOnHover />
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left rtl:origin-right transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                        isActive
                                            ? "scale-x-100"
                                            : "scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100"
                                    }`} />
                                    <div className="relative z-10 flex items-start justify-between rtl:justify-start gap-4">
                                        <div>
                                            <span className="text-xl md:text-2xl font-serif font-farsi font-light text-ink block leading-tight">
                                            {mat.name}
                                        </span>
                                        </div>
                                        <span className={`text-sm font-serif shrink-0 pt-1 rtl:order-first ${isFarsi ? "font-farsi" : "font-latin"}`}>
                                        {numberFormatter.format(index + 1)}
                                    </span>
                                    </div>
                                    <span className={`relative z-10 inline-flex items-center gap-2 mt-5 text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase transition-colors duration-700 ${isActive ? "text-accent" : "text-muted group-hover:text-accent"}`}>
                                    {t("hexaSample")}
                                        <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform duration-700 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"/>
                                </span>
                                </button>
                            );
                        })}
                    </div>
                </MaisonReveal>

                {active && (
                    <MaisonReveal variant="scale-down-unveil" delay={0.65} threshold={0.01} className="max-w-3xl mx-auto mt-12 w-full">
                        <div className="border-t border-ink/10 overflow-hidden">
                            <button
                                type="button"
                                onClick={toggleExpanded}
                                aria-expanded={isExpanded}
                                className="w-full py-5 flex items-center justify-between gap-4 group cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <div className="flex items-center gap-3 flex-wrap text-left rtl:text-right">
                                    <span className="text-lg md:text-xl font-serif font-farsi font-light text-ink">
                                        {active.name}
                                    </span>
                                    <span className={`text-xs font-serif shrink-0 rtl:order-first ${isFarsi ? "font-farsi" : "font-latin"}`}>
                                        {numberFormatter.format(activeIndex + 1)}
                                    </span>
                                    <span className="text-[length:calc(9px*var(--zaad-font-scale))] font-mono text-muted opacity-65 group-hover:opacity-100 transition-opacity">
                                        ({toggleHint})
                                    </span>
                                </div>
                                <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                                    <motion.div
                                        className="absolute w-3 h-[1px] bg-ink"
                                        animate={isExpanded ? ROTATE_0 : ROTATE_90}
                                        transition={ICON_TRANSITION}
                                    />
                                    <div className="absolute w-3 h-[1px] bg-ink"/>
                                </div>
                            </button>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active.id}
                                    initial={{opacity: 0, x: isFarsi ? -20 : 20}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: isFarsi ? 20 : -20}}
                                    transition={{duration: 0.6, ease: EASE_IN_OUT}}
                                    className="pt-2 border-t border-ink/10 mt-1"
                                >
                                    <div className="relative aspect-[1168/784] w-full overflow-hidden border border-ink/10 mb-6 rounded-xl shadow-ambient">
                                        <video
                                            key={active.id}
                                            ref={videoRef}
                                            src={`/video/material/${MATERIAL_VIDEOS[active.id]}.mp4`}
                                            poster={`/video/material/${MATERIAL_VIDEOS[active.id]}.jpg`}
                                            muted
                                            playsInline
                                            loop
                                            preload={mediaReady && !reduceMotion ? "auto" : "none"}
                                            onLoadedData={handleVideoLoadedData}
                                            onEnded={handleVideoEnded}
                                            aria-hidden="true"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={PANEL_INITIAL}
                                        animate={PANEL_ANIMATE}
                                        exit={PANEL_EXIT}
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={active.id}
                                                initial={{opacity: 0, x: isFarsi ? -20 : 20}}
                                                animate={{opacity: 1, x: 0}}
                                                exit={{opacity: 0, x: isFarsi ? 20 : -20}}
                                                transition={{duration: 0.6, ease: EASE_IN_OUT}}
                                                className="pb-8"
                                            >
                                                <h3 className="text-xl md:text-2xl font-serif font-light text-ink mb-2">
                                                    {t("materialAnalysisPrefix")} {active.name} {t("materialAnalysisSuffix")}
                                                </h3>

                                                <p className="text-sm text-ink font-light leading-relaxed mb-6">
                                                    "{wrapLatinRuns(active.philosophicalNote, isFarsi)}"
                                                </p>

                                                <div className="space-y-4 border-t border-ink/10 pt-6 text-left rtl:text-right">
                                                    <div className="flex items-start justify-start">
                                                        <Sliders className="w-4 h-4 text-accent mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0"/>
                                                        <div>
                                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-muted uppercase block">
                                      {t("physicalDensity")}
                                    </span>
                                                            <span className="text-xs text-ink font-light">{active.density}</span>
                                                            <ul className="list-disc pl-4 rtl:pl-0 rtl:pr-4 text-xs text-muted mt-2 space-y-1 font-light">
                                                                {(active.properties || []).map((prop, index) => (
                                                                    <li key={index}>{prop}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </MaisonReveal>
                )}
            </div>
        </section>
    );
}

export default React.memo(Materials);
