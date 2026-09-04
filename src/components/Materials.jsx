"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {Globe, Hammer, Landmark, Sliders} from "lucide-react";
import Image from "next/image";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import {useLanguage} from "@/services/TranslationService";
import useActiveSelection from "../hooks/useActiveSelection";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

function Materials() {
    const {t, data, isFarsi} = useLanguage();
    const materialSamples = data("materialSamples") || [];
    const samples = materialSamples.length ? materialSamples : [];
    const {active, setActive} = useActiveSelection(samples);

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
                            {samples.map((mat) => (
                                <MaisonButton
                                    key={mat.id}
                                    variant="material-choice"
                                    onClick={() => setActive(mat)}
                                    className={`w-full flex items-center justify-between group ${active?.id === mat.id ? "bg-panel border-ink! shadow-card-sm" : ""}`}
                                >
                                    <div className="text-left rtl:text-right">
                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-accent font-semibold block mb-1 uppercase">
                      {wrapLatinRuns(mat.category, isFarsi)}
                    </span>
                                        <span className="text-lg md:text-xl font-serif font-farsi font-light text-ink block">
                      {mat.name}
                    </span>
                                    </div>
                                    <span className={`text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-ink transition-transform duration-300 shrink-0 ${active?.id === mat.id ? "translate-x-1 rtl:-translate-x-1 font-semibold text-accent" : "opacity-40 group-hover:opacity-100"}`}>
                    {t("hexaSample")}
                  </span>
                                </MaisonButton>
                            ))}
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
                                    <div className="relative aspect-video w-full overflow-hidden border border-ink/10 mb-6 rounded-xl shadow-ambient">
                                        <Image
                                            src={active.imageUrl}
                                            alt={`${active.name} Macro Close-up`}
                                            fill
                                            sizes="(min-width: 1024px) 50vw, 90vw"
                                            className="object-cover lux-ken-burns"
                                            referrerPolicy="no-referrer"
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

                                    <p className="text-sm text-ink font-light leading-relaxed mb-6 italic rtl:text-justify">
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
                          {wrapLatinRuns(active.history, isFarsi)}
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