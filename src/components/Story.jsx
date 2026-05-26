"use client";

import MaisonReveal from "./MaisonReveal";
import {useLanguage} from "@/services/TranslationService";

export default function Story() {
    const {t} = useLanguage();
    return (
        <section
            id="story"
            className="relative py-24 md:py-36 bg-surface-overlay px-6 sm:px-12 border-y border-ink/10 overflow-hidden"
        >
            {/* Absolute backgrounds - delicate circular accent or grid */}
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full bg-tone/30 pointer-events-none"></div>

            {/* Majestic Cinematic Sunbeam Glare overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                {/* Ambient golden pool backing catching the viewer's gaze from the background */}
                <div
                    className="absolute left-1/3 top-1/10 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-accent/0 via-accent/10 to-accent/0 dark:via-accent/20 mix-blend-screen transition-opacity duration-1000"/>
                <div
                    className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/15 mix-blend-screen"/>

                {/* Primary Tuscan Early Evening Window Slit Beam (diag sweep) */}
                <div
                    className="absolute top-0 left-1/4 w-[240px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.05] dark:via-white/[0.18] to-transparent sunbeam-signature-glare pointer-events-none mix-blend-overlay"
                    style={{
                        animationDuration: "26s",
                    }}
                />

                {/* Staggered secondary golden luxury sunbeam */}
                <div
                    className="absolute top-0 left-1/3 w-[140px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.02] dark:via-accent/12 to-transparent sunbeam-signature-glare pointer-events-none mix-blend-color-dodge"
                    style={{
                        animationDelay: "-8s",
                        animationDuration: "35s",
                    }}
                />

                {/* Dynamic ambient highlight spot directly behind the editorial typography */}
                <div
                    className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-transparent via-accent/5 to-transparent dark:via-accent/15 mix-blend-screen pointer-events-none"/>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-18 items-center">
                    {/* Left Column: Handcrafted materials visual catalog */}
                    <div className="lg:col-span-5 relative">
                        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                            <div
                                className="relative aspect-[3/4] w-full max-w-[420px] mx-auto overflow-hidden bg-surface border border-ink/10 shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90"
                                    alt="Travertine Mineral Slabs close-up"
                                    className="object-cover w-full h-full hover:scale-105 duration-1000"
                                    referrerPolicy="no-referrer"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                                {/* Overlay quote */}
                                <div className="absolute bottom-6 left-6 right-6 text-white text-left rtl:text-right">
                                    <p className="font-serif italic text-lg leading-relaxed font-light">
                                        "{t("storyTactile")}"
                                    </p>
                                    <span
                                        className="text-[9px] font-mono tracking-widest uppercase block mt-3 text-tone">
                    {t("storyEmilio")}
                  </span>
                                </div>
                            </div>
                        </MaisonReveal>

                        {/* Architectural structural coordinate overlapping slightly */}
                        <MaisonReveal
                            variant="slide-up-royal"
                            delay={0.3}
                            threshold={0.01}
                            className="absolute -bottom-6 -right-6 lg:-right-8 bg-panel-frost   border border-ink/10 p-5 hidden md:block shadow-md max-w-[220px] rounded-xl z-20 text-left rtl:text-right"
                        >
              <span className="text-[10px] font-mono text-accent block mb-1">
                {t("rawOrigin")}
              </span>
                            <p className="text-[12px] text-ink font-serif leading-relaxed font-medium">
                                {t("quarryLocation")}
                            </p>
                        </MaisonReveal>
                    </div>

                    {/* Right Column: High-end editorial copywriting */}
                    <MaisonReveal
                        variant="unveil"
                        delay={0.2}
                        threshold={0.01}
                        className="lg:col-span-7 flex flex-col justify-center text-left rtl:text-right"
                    >
            <span className="text-[11px] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
              {t("storyOurStory")}
            </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight leading-[1.15] text-[var(--text-primary)]">
                            {t("storyTitle")}
                        </h2>

                        <p className="text-md md:text-xl font-serif font-light text-[var(--text-bronze)] mt-6 italic leading-relaxed">
                            "{t("storyQuote2")}"
                        </p>

                        <div className="h-[1px] w-12 bg-[var(--border-color-15)] my-8"></div>

                        <div
                            className="space-y-6 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light">
                            <p>{t("storyP1")}</p>
                            <p>{t("storyP2")}</p>
                        </div>

                        {/* Spec items highlighting the quiet luxury details */}
                        <div
                            className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-[var(--border-color-15)] mt-10">
                            <div>
                <span className="font-serif italic text-2xl text-[var(--text-primary)] font-light">
                  {t("assemblyDays")}
                </span>
                                <p className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                    {t("weeksAssembly")}
                                </p>
                            </div>
                            <div>
                <span className="font-serif italic text-2xl text-[var(--text-primary)] font-light">
                  100%
                </span>
                                <p className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                    {t("sourcedItaly")}
                                </p>
                            </div>
                            <div>
                <span className="font-serif italic text-2xl text-[var(--text-primary)] font-light">
                  {t("curatedCount")}
                </span>
                                <p className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                    {t("curatedLabel")}
                                </p>
                            </div>
                        </div>
                    </MaisonReveal>
                </div>
            </div>
        </section>
    );
}
