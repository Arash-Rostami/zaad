import React from "react";
import MaisonReveal from "../MaisonReveal";
import { ChapterHero, EditorialBlock, EditorialSignature, StatGrid, CrossLinks, CallStrip } from "./ChapterPieces";

function HouseChapterShell({
    heroEyebrow,
    heroTitle,
    heroTitleAccent,
    heroIntro,
    heroImage,
    heroImageAlt,
    heroBadge,
    heroBadgeLabel,
    editorialContent,
    stats,
    siblings,
}) {
    return (
        <div className="min-h-screen bg-surface text-ink">
            <ChapterHero
                heroEyebrow={heroEyebrow}
                heroTitle={heroTitle}
                heroTitleAccent={heroTitleAccent}
                heroIntro={heroIntro}
                heroImage={heroImage}
                heroImageAlt={heroImageAlt}
                heroBadge={heroBadge}
                heroBadgeLabel={heroBadgeLabel}
            />

            {/* ── Editorial chapter ────────────────────────────────────── */}
            <section id="house-editorial" className="relative px-6 sm:px-12 section-y bg-surface-overlay border-y border-ink/10 overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <MaisonReveal variant="unveil" delay={0.1} threshold={0.01} className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
                        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight leading-[1.2] text-ink">
                            {heroTitle}
                        </h2>
                    </MaisonReveal>
                    <EditorialBlock content={editorialContent} align="center" />
                    <EditorialSignature className="mx-auto" />
                </div>
            </section>

            <section className="relative px-6 sm:px-12 section-y">
                <div className="max-w-2xl mx-auto">
                    <StatGrid stats={stats} align="center" />
                </div>
            </section>

            <CrossLinks siblings={siblings} />

            <CallStrip />
        </div>
    );
}

export default React.memo(HouseChapterShell);
