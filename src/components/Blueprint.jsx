"use client";

import React from "react";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "@/services/TranslationService";
import useActiveSelection from "../hooks/useActiveSelection";

function Blueprint() {
    const { t, data } = useLanguage();
    const sections = data("blueprintSections") || [];
    const { active, setActive } = useActiveSelection(sections);

    return (
        <div className="py-24 md:py-32 bg-surface min-h-screen text-left rtl:text-right">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <MaisonReveal variant="unveil" threshold={0.02}>
                    <div className="border-b border-ink/10 pb-8 mb-12">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
                            {t("studioArchives")}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light">
                            {t("zaadBlueprint")}
                        </h1>
                        <p className="text-sm md:text-base text-muted mt-2 font-light max-w-2xl leading-relaxed">
                            {t("blueprintIntroText")}
                        </p>
                    </div>
                </MaisonReveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <MaisonReveal variant="slide-up-royal" delay={0.1} className="lg:col-span-4 space-y-4">
                        <span className="text-[9px] font-mono tracking-widest text-muted block uppercase mb-2">
                            {t("exploreBriefingFiles")}
                        </span>
                        {sections.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => setActive(sec)}
                                className={`w-full text-left rtl:text-right p-5 border text-xs transition-all duration-300 rounded-xl focus:outline-none flex flex-col cursor-pointer ${active?.id === sec.id ? "bg-panel border-ink shadow-md" : "bg-panel-glass border-ink/10 hover:bg-panel"}`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] font-mono text-accent font-semibold uppercase tracking-widest">
                                        {sec.category}
                                    </span>
                                </div>
                                <span className="text-sm font-serif font-light text-ink block mb-1">
                                    {sec.title}
                                </span>
                                <span className="text-[11px] text-muted leading-relaxed font-light font-sans">
                                    {sec.summary}
                                </span>
                            </button>
                        ))}
                    </MaisonReveal>

                    <MaisonReveal
                        variant="scale-down-unveil"
                        delay={0.25}
                        className="lg:col-span-8 bg-surface-frosted p-8 border border-ink/10 shadow-sm rounded-2xl"
                    >
                        {active && (
                            <>
                                <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6 text-xs font-mono">
                                    <span className="text-accent uppercase tracking-widest font-semibold">
                                        {active.category} / {t("chapterFile")}
                                    </span>
                                    <span className="text-muted uppercase tracking-widest">
                                        {t("statusCompliant")}
                                    </span>
                                </div>

                                <div className="prose max-w-none text-ink text-sm md:text-base font-light leading-relaxed whitespace-pre-line space-y-6">
                                    {active.content}
                                </div>

                                <div className="border-t border-ink/10 pt-6 mt-8">
                                    <span className="text-[9px] font-mono text-muted uppercase block mb-3">
                                        {t("blueprintSystemTags")}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(active.tags || []).map((tg, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-panel border border-ink/10 text-[10px] font-mono px-3 py-1.5 text-ink uppercase tracking-wider rounded-full"
                                            >
                                                {tg}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </MaisonReveal>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Blueprint);