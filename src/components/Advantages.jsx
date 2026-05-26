"use client";

import {useLanguage} from "@/services/TranslationService";
import MaisonReveal from "./MaisonReveal";
import {Hammer, ShieldCheck, Sparkles} from "lucide-react";

const ICON_MAP = {I: Hammer, II: Sparkles, III: ShieldCheck};

export default function Advantages() {
    const {t, data} = useLanguage();
    const cards = data("advantageCards") || [];

    return (
        <section
            id="advantages"
            className="relative py-24 md:py-36 bg-surface-overlay px-6 sm:px-12 border-b border-ink/10 overflow-hidden text-left rtl:text-right"
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                <div
                    className="absolute left-1/4 top-1/10 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-accent/0 via-accent/10 to-accent/0 dark:via-accent/20 mix-blend-screen transition-opacity duration-1000"/>
                <div
                    className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/15 mix-blend-screen"/>
                <div
                    className="absolute top-0 left-1/3 w-[240px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.04] dark:via-white/[0.14] to-transparent sunbeam-signature-glare pointer-events-none mix-blend-overlay"
                    style={{animationDuration: "28s"}}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="max-w-3xl mb-16 md:mb-24">
                    <MaisonReveal variant="unveil" delay={0.1}>
            <span className="text-[11px] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
              {t("advantagesBadge")}
            </span>
                    </MaisonReveal>

                    <MaisonReveal variant="unveil" delay={0.2}>
                        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight leading-tight text-[var(--text-primary)]">
                            {t("advantagesTitle")}
                        </h2>
                    </MaisonReveal>

                    <MaisonReveal variant="unveil" delay={0.3}>
                        <div className="h-[1px] w-12 bg-[var(--border-color-15)] my-6"></div>
                        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                            {t("advantagesSub")}
                        </p>
                    </MaisonReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, idx) => {
                        const IconComponent = ICON_MAP[card.num] || Hammer;
                        return (
                            <div key={card.id}>
                                <MaisonReveal variant="slide-up-royal" delay={0.1 * idx}>
                                    <div
                                        className="group h-full relative p-8 md:p-10 bg-[var(--bg-card-trans)]   border border-[var(--border-color-10)] hover:border-[var(--text-bronze)]/50 transition-all duration-700 rounded-2xl flex flex-col justify-between overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/3 dark:to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>

                                        <div>
                                            <div className="flex justify-between items-center mb-8">
                        <span className="font-mono text-xs tracking-widest text-[var(--text-bronze)] font-semibold">
                          {card.num}
                        </span>
                                                <div
                                                    className="p-3 bg-[var(--border-color-5)] rounded-xl text-[var(--text-bronze)] group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                                                    <IconComponent className="w-5 h-5 stroke-[1.25]"/>
                                                </div>
                                            </div>

                                            <h3 className="text-lg md:text-xl font-serif font-medium text-[var(--text-primary)] mb-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-500">
                                                {card.title}
                                            </h3>

                                            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-light font-sans">
                                                {card.desc}
                                            </p>
                                        </div>

                                        <div
                                            className="mt-8 pt-4 border-t border-[var(--border-color-10)] flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-widest text-[var(--text-bronze)]/50 uppercase">
                        {t("ZAADCertified")}
                      </span>
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-[var(--text-bronze)] scale-75 opacity-30 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"/>
                                        </div>
                                    </div>
                                </MaisonReveal>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
