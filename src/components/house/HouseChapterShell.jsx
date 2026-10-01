import React from "react";
import { ChapterHero, EditorialBlock, StatGrid, CrossLinks, CallStrip } from "./ChapterPieces";

function HouseChapterShell({
    heroEyebrow,
    heroTitle,
    heroTitleAccent,
    heroIntro,
    heroImage,
    heroImageAlt,
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
            />

            {/* ── Editorial chapter ────────────────────────────────────── */}
            <section id="house-editorial" className="relative px-6 sm:px-12 section-y bg-surface-overlay border-y border-ink/10 overflow-hidden">
                <div className="absolute left-1/3 top-1/10 w-[700px] h-[700px] pattern-diamond-grid opacity-[0.22] dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] pattern-diamond-grid opacity-[0.16] dark:opacity-[0.06] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <EditorialBlock content={editorialContent} align="center" />
                </div>
            </section>

            {stats && stats.length > 0 && (
                <section className="relative px-6 sm:px-12 section-y">
                    <div className="max-w-2xl mx-auto">
                        <StatGrid stats={stats} align="center" />
                    </div>
                </section>
            )}

            <CrossLinks siblings={siblings} />

            <CallStrip />
        </div>
    );
}

export default React.memo(HouseChapterShell);
