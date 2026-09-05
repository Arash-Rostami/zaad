"use client";

import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {ArrowUpRight, Globe, Hammer, Landmark, Sliders} from "lucide-react";
import MaisonReveal from "./MaisonReveal";
import NoiseBg from "./shared/NoiseBg";
import {useLanguage} from "@/services/TranslationService";
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

function Materials() {
    const {t, data, isFarsi} = useLanguage();
    const reduceMotion = useReducedMotion();
    const samples = useMemo(() => data("materialSamples") || EMPTY_ARRAY, [data]);
    const {active, setActive} = useActiveSelection(samples, "materialSelection");
    const numberFormatter = isFarsi ? FA_INDEX_FORMAT : EN_INDEX_FORMAT;
    const [mediaReady, mediaRef] = useDeferredMedia();
    const videoRef = useRef(null);

    const preparedSamples = useMemo(
        () => samples.map((mat) => ({ ...mat, wrappedCategory: wrapLatinRuns(mat.category, isFarsi) })),
        [samples, isFarsi]
    );

    const wrappedActiveHistory = useMemo(
        () => (active ? wrapLatinRuns(active.history, isFarsi) : ""),
        [active, isFarsi]
    );

    const handleVideoLoadedData = useCallback(() => {
        if (reduceMotion) return;
        videoRef.current?.play().catch(() => {});
    }, [reduceMotion]);

    useEffect(() => {
        if (mediaReady && !reduceMotion) {
            videoRef.current?.load();
        }
    }, [mediaReady, reduceMotion, active?.id]);

    return (
        <section className="section-y bg-surface-overlay px-6 sm:px-12 border-b border-ink/10 relative overflow-hidden text-left rtl:text-right">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6">
                        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                            <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                                {t("materialArchaeology")}
                            </span>
                        </MaisonReveal>
                        <MaisonReveal variant="lines" delay={0.3} threshold={0.01}>
                            <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light mb-8 text-glow-subtle">
                                {t("materialStudy")}
                            </h2>
                        </MaisonReveal>

                        <MaisonReveal variant="unveil" delay={0.5} threshold={0.01}>
                            <div className="space-y-4">
                                {preparedSamples.map((mat, index) => {
                                    const isActive = active?.id === mat.id;
                                    return (
                                        <button
                                            key={mat.id}
                                            type="button"
                                            onClick={() => setActive(mat)}
                                            aria-pressed={isActive}
                                            className={`group relative block w-full overflow-hidden bg-panel border rounded-2xl p-6 md:p-7 text-left rtl:text-right transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] ${
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
                                            <div className="relative z-10 flex items-start justify-between gap-4">
                                                <div>
                                                <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-accent block mb-2 uppercase !font-light">
                                                    {mat.wrappedCategory}
                                                </span>
                                                    <span className="text-xl md:text-2xl font-serif font-farsi font-light text-ink block leading-tight">
                                                    {mat.name}
                                                </span>
                                                </div>
                                                <span className={`text-sm font-serif tracking-widest shrink-0 pt-1 ${isFarsi ? "font-farsi" : "font-latin"}`}>
                                                {numberFormatter.format(index + 1)}
                                            </span>
                                            </div>
                                            <span className={`relative z-10 inline-flex items-center gap-2 mt-5 text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase transition-colors duration-700 ${isActive ? "text-accent" : "text-muted group-hover:text-accent"}`}>
                                            {t("hexaSample")}
                                                <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform duration-700 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"/>
                                        </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </MaisonReveal>
                    </div>

                    <MaisonReveal variant="scale-down-unveil" delay={0.65} threshold={0.01} className="lg:col-span-6">
                        <AnimatePresence mode="wait">
                            {active && (
                                <motion.div
                                    key={active.id}
                                    initial={{opacity: 0, x: isFarsi ? -20 : 20}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: isFarsi ? 20 : -20}}
                                    transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
                                    className="bg-surface border border-ink/10 p-8 shadow-card-lg relative rounded-2xl"
                                >
                                    <div ref={mediaRef} className="relative aspect-[1168/784] w-full overflow-hidden border border-ink/10 mb-6 rounded-xl shadow-ambient">
                                        <video
                                            key={active.id}
                                            ref={videoRef}
                                            src={`/video/material/${MATERIAL_VIDEOS[active.id]}.mp4`}
                                            poster={`/video/material/${MATERIAL_VIDEOS[active.id]}.jpg`}
                                            muted
                                            playsInline
                                            preload={mediaReady && !reduceMotion ? "auto" : "none"}
                                            onLoadedData={handleVideoLoadedData}
                                            aria-hidden="true"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                        <div className="absolute top-4 right-4 bg-ink text-on-indicator px-3 py-1 font-mono text-[length:calc(9px*var(--zaad-font-scale))] tracking-widest uppercase rounded-md">
                                            {t("macroPreview")}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-serif font-light text-ink mb-2">
                                        {t("materialAnalysisPrefix")} {active.name} {t("materialAnalysisSuffix")}
                                    </h3>
                                    <p className="text-xs text-muted font-mono tracking-widest uppercase mb-4 border-b border-ink/10 pb-4 flex items-center justify-start">
                                        <Globe className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 text-accent"/>
                                        {t("geographicalOrigin")} {active.origins}
                                    </p>

                                    <p className="text-sm text-ink font-light leading-relaxed mb-6 rtl:text-justify">
                                        "{active.philosophicalNote}"
                                    </p>

                                    <div className="space-y-4 border-t border-ink/10 pt-6 text-left rtl:text-right">
                                        <div className="flex items-start justify-start">
                                            <Sliders className="w-4 h-4 text-accent mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0"/>
                                            <div>
                        <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-muted tracking-widest uppercase block">
                          {t("physicalDensity")}
                        </span>
                                                <span className="text-xs text-ink font-light">{active.density}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-start">
                                            <Landmark className="w-4 h-4 text-accent mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0"/>
                                            <div>
                        <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-muted tracking-widest uppercase block">
                          {t("historicalProvenance")}
                        </span>
                                                <span className="text-xs text-ink font-light leading-relaxed">
                          {wrappedActiveHistory}
                        </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-start">
                                            <Hammer className="w-4 h-4 text-accent mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0"/>
                                            <div>
                        <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-muted tracking-widest uppercase block">
                          {t("coreSurfaceQualities")}
                        </span>
                                                <ul className="list-disc pl-4 rtl:pl-0 rtl:pr-4 text-xs text-muted mt-1 space-y-1 font-light">
                                                    {(active.properties || []).map((prop, index) => (
                                                        <li key={index}>{prop}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </MaisonReveal>
                </div>
            </div>
        </section>
    );
}

export default React.memo(Materials);