import React from "react";
import Image from "next/image";
import MaisonReveal from "../shared/MaisonReveal";
import { EditorialBlock, StatGrid, CrossLinks, CallStrip } from "./ChapterPieces";

function HouseChapterShell({
    heroTitle,
    heroImage,
    heroImageAlt,
    editorialContent,
    stats,
    siblings,
}) {
    return (
        <div className="min-h-screen bg-surface text-ink">
            <section className="relative px-6 sm:px-12 pt-28 md:pt-40 pb-20 md:pb-28">
                <div className="max-w-7xl mx-auto">
                    <MaisonReveal variant="unveil" threshold={0.01} delay={0.1}>
                        <h1 className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block">
                            {heroTitle}
                        </h1>
                    </MaisonReveal>

                    <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
                        <div className="text-left rtl:text-right">
                            <EditorialBlock content={editorialContent} />
                        </div>
                        <MaisonReveal
                            variant="unveil"
                            threshold={0.01}
                            delay={0.3}
                            className="order-first lg:order-none"
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt border border-ink/10 shadow-ambient lux-vignette rounded-md">
                                <Image
                                    src={heroImage}
                                    alt={heroImageAlt}
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover lux-ken-burns"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foundation/50 via-foundation/10 to-transparent pointer-events-none" />
                            </div>
                        </MaisonReveal>
                    </div>
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