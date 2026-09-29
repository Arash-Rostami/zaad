"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/services/LanguageProvider";
import { animateScrollTo } from "@/services/ScrollService";
import useLenisScroll from "@/hooks/useLenisScroll";
import wrapBrandNames from "@/lib/wrapBrandNames";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import MaisonReveal from "../shared/MaisonReveal";
import NoiseBg from "../shared/NoiseBg";
import { ArrowUpRight } from "lucide-react";
import { ChapterHero, CallStrip } from "../house/ChapterPieces";
import Footer from "../Footer";
import GlanceChapter from "./GlanceChapter";
import GlanceHeader from "./GlanceHeader";
import ScrollButton from "../shared/ScrollButton";

const FA_INDEX_FORMAT = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });
const EN_INDEX_FORMAT = new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2, useGrouping: false });

const EMPTY_OBJECT = Object.freeze({});
const EMPTY_ARRAY = Object.freeze([]);

function GlanceRailDesktop({ chapters, active, numberFormatter, onNavigate, ariaLabel }) {
    return (
        <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-[calc(73px+3rem)]" aria-label={ariaLabel}>
                <MaisonReveal variant="unveil" delay={0.4} threshold={0.01}>
                    <ol className="space-y-4">
                        {chapters.map((chapter, index) => {
                            const isActive = active === chapter.id;
                            return (
                                <li key={chapter.id}>
                                    <button
                                        type="button"
                                        onClick={() => onNavigate(chapter.id)}
                                        aria-current={isActive ? "true" : undefined}
                                        className={`group relative block w-full p-5 text-left rtl:text-right border rounded-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                            isActive
                                                ? "bg-panel border-accent/50 shadow-card-sm"
                                                : "bg-panel-glass border-ink/10 hover:bg-panel hover:border-accent/30"
                                        }`}
                                    >
                                        <NoiseBg filterId={`glanceRailNoise-${index}`} revealOnHover />
                                        <span className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        <span className="relative z-10 flex items-baseline gap-3">
                                        <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] text-accent tabular-nums">
                                            {numberFormatter.format(index + 1)}
                                        </span>
                                        <span
                                            className={`font-serif font-farsi text-sm uppercase transition-colors duration-700 ${
                                                isActive ? "text-ink" : "text-muted group-hover:text-ink"
                                            }`}
                                        >
                                            {wrapBrandNames(chapter.label)}
                                        </span>
                                    </span>
                                        <span
                                            className={`absolute bottom-0 left-0 rtl:left-auto rtl:right-0 h-[2px] w-full bg-accent origin-left rtl:origin-right transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </MaisonReveal>
            </nav>
        </aside>
    );
}

function GlanceRailMobile({ chapters, active, numberFormatter, onNavigate, ariaLabel }) {
    return (
        <div id="glance-rail-mobile" className="lg:hidden sticky top-[61px] sm:top-[73px] z-40 py-3 bg-panel-glass backdrop-blur-[6px] border-b border-ink-faint">
            <nav
                aria-label={ariaLabel}
                data-lenis-prevent
                className="max-w-7xl mx-auto px-6 sm:px-12 flex gap-2 overflow-x-auto scrollbar-none"
            >
                {chapters.map((chapter, index) => {
                    const isActive = active === chapter.id;
                    return (
                        <button
                            key={chapter.id}
                            type="button"
                            onClick={() => onNavigate(chapter.id)}
                            aria-current={isActive ? "true" : undefined}
                            className={`shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-[length:calc(10px*var(--zaad-font-scale))] uppercase transition-colors duration-700 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                isActive
                                    ? "border-accent/60 text-accent"
                                    : "border-ink/15 text-muted hover:text-ink hover:border-ink/30"
                            }`}
                        >
                            <span className="tabular-nums">{numberFormatter.format(index + 1)}</span>
                            <span className="font-serif font-farsi tracking-normal">{wrapBrandNames(chapter.label)}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

function GlancePage() {
    const { t, data, isFarsi } = useLanguage();
    useLenisScroll();
    const glance = useMemo(() => data("glance") || EMPTY_OBJECT, [data]);
    const collection = useMemo(() => data("collection") || EMPTY_ARRAY, [data]);
    const [active, setActive] = useState("overview");
    const numberFormatter = isFarsi ? FA_INDEX_FORMAT : EN_INDEX_FORMAT;

    const chapters = useMemo(
        () => [
            { id: "overview", label: glance.overviewLabel },
            ...collection.map((item) => ({ id: item.id, label: item.name })),
            { id: "matrix", label: glance.matrixLabel },
        ],
        [glance.overviewLabel, glance.matrixLabel, collection],
    );

    const overviewCards = useMemo(
        () =>
            (glance.overview?.collections || EMPTY_ARRAY).map((entry) => ({
                entry,
                item: collection.find((c) => c.id === entry.id),
            })),
        [glance.overview, collection],
    );

    const handleNavigate = (id) => {
        const rail = document.getElementById("glance-rail-mobile");
        const extraOffset = rail && rail.offsetHeight > 0 ? rail.offsetHeight : 0;
        return animateScrollTo(`glance-${id}`, undefined, extraOffset);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id.replace("glance-", ""));
                    }
                });
            },
            { rootMargin: "-25% 0px -65% 0px" },
        );
        chapters.forEach((chapter) => {
            const el = document.getElementById(`glance-${chapter.id}`);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [chapters]);

    if (!glance.overview || !collection.length) return null;

    return (
        <div className="min-h-screen bg-surface text-ink">
            <GlanceHeader />
            <ChapterHero
                heroEyebrow={glance.eyebrow}
                heroTitle={glance.heroTitle}
                heroTitleAccent={glance.heroTitleAccent}
                heroIntro={wrapBrandNames(glance.heroIntro)}
                heroImage={glance.heroImage}
                heroImageAlt={glance.heroImageAlt}
                scrollTargetId="glance-body"
                withVideo={false}
            />

            <div id="glance-body" className="relative">
                <GlanceRailMobile
                    chapters={chapters}
                    active={active}
                    numberFormatter={numberFormatter}
                    onNavigate={handleNavigate}
                    ariaLabel={t("glanceRailLabel")}
                />

                <div className="px-6 sm:px-12">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                        <GlanceRailDesktop
                            chapters={chapters}
                            active={active}
                            numberFormatter={numberFormatter}
                            onNavigate={handleNavigate}
                            ariaLabel={t("glanceRailLabel")}
                        />

                        <div className="lg:col-span-9 lg:col-start-4">
                            <section id="glance-overview" className="section-y border-t border-ink/10">
                                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                                    <h2 className="text-2xl md:text-3xl font-serif text-ink tracking-tight font-light text-glow-subtle text-left rtl:text-right">
                                        {wrapBrandNames(glance.overview.heading)}
                                    </h2>
                                </MaisonReveal>
                                <MaisonReveal variant="slide-up-royal" delay={0.3} threshold={0.01}>
                                    <blockquote className="mt-8 md:mt-10 max-w-3xl border-s-2 border-accent/40 ps-6 md:ps-8 text-left rtl:text-right">
                                        <p className="text-lg md:text-2xl font-serif font-farsi font-light leading-relaxed text-ink text-glow-subtle">
                                            {wrapBrandNames(glance.overview.statement)}
                                        </p>
                                    </blockquote>
                                </MaisonReveal>
                                <MaisonReveal variant="unveil" delay={0.45} threshold={0.01}>
                                    <p className="mt-10 text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase text-left rtl:text-right">
                                        {glance.overview.intro}
                                    </p>
                                </MaisonReveal>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 md:mt-16">
                                    {overviewCards.map(({ entry, item }, index) => (
                                        <MaisonReveal
                                            key={entry.id}
                                            variant="slide-up-royal"
                                            delay={0.35 + index * 0.15}
                                            threshold={0.01}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleNavigate(entry.id)}
                                                className="group relative block w-full overflow-hidden bg-panel border border-ink/10 rounded-2xl p-8 md:p-10 text-left rtl:text-right transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/40 hover:shadow-ambient active:scale-[0.985] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                            >
                                                <NoiseBg filterId={`glanceCardNoise-${index}`} revealOnHover />
                                                <span className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                                <span className="relative z-10 text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-accent uppercase block mb-4">
                                                    <span className="font-serif font-latin">{item?.number}</span>
                                                </span>
                                                <h3 className="relative z-10 text-xl md:text-2xl font-serif font-light text-ink leading-tight">
                                                    {wrapBrandNames(item?.name ?? entry.id)}
                                                </h3>
                                                <p className="relative z-10 text-sm text-muted font-light leading-relaxed mt-4 max-w-md">
                                                    {wrapLatinRuns(entry.blurb, isFarsi)}
                                                </p>
                                                <span className="relative z-10 inline-flex items-center gap-2 mt-8 text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase text-ink group-hover:text-accent transition-colors duration-700">
                                                    {t("crossLinkReadMore")}
                                                    <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform duration-700 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                                </span>
                                            </button>
                                        </MaisonReveal>
                                    ))}
                                </div>
                            </section>

                            {collection.map((item, index) => (
                                <GlanceChapter
                                    key={item.id}
                                    item={item}
                                    supplement={glance.supplements?.[item.id]}
                                    labels={glance.sections}
                                    number={index + 2}
                                    numberFormatter={numberFormatter}
                                />
                            ))}

                            <section id="glance-matrix" className="section-y border-t border-ink/10">
                                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                                    <h2 className="text-2xl md:text-3xl font-serif text-ink tracking-tight font-light text-glow-subtle text-left rtl:text-right">
                                        {wrapBrandNames(glance.matrix.heading)}
                                    </h2>
                                </MaisonReveal>
                                <MaisonReveal variant="slide-up-royal" delay={0.3} threshold={0.01}>
                                    <div className="mt-10 overflow-x-auto" data-lenis-prevent>
                                        <table className="w-full min-w-[720px] border-collapse text-left rtl:text-right">
                                            <thead>
                                            <tr>
                                                {glance.matrix.table.head.map((headCell, cellIndex) => (
                                                    <th
                                                        key={cellIndex}
                                                        className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] uppercase text-accent font-semibold border-b border-ink/20 py-3 pe-4"
                                                    >
                                                        {wrapBrandNames(headCell)}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {glance.matrix.table.rows.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="border-b border-ink/10">
                                                    {row.map((cell, cellIndex) => (
                                                        <td
                                                            key={cellIndex}
                                                            className={`py-3.5 pe-4 align-top text-sm font-light leading-relaxed ${
                                                                cellIndex === 0
                                                                    ? "text-ink font-medium whitespace-nowrap"
                                                                    : "text-muted"
                                                            }`}
                                                        >
                                                            {wrapLatinRuns(cell, isFarsi)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </MaisonReveal>
                                <MaisonReveal variant="unveil" delay={0.45} threshold={0.01}>
                                    <p className="mt-14 text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase text-left rtl:text-right">
                                        {glance.sections.directory}
                                    </p>
                                </MaisonReveal>
                                <div className="mt-6">
                                    {glance.matrix.directory.map((partner, index) => (
                                        <MaisonReveal
                                            key={partner.brand}
                                            variant="slide-up-royal"
                                            delay={0.15 + index * 0.08}
                                            threshold={0.01}
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-8 border-b border-ink/10 py-5 text-left rtl:text-right">
                                                <div>
                                                    <span className="font-serif text-base text-ink">
                                                        {wrapBrandNames(partner.brand)}
                                                    </span>
                                                    <span className="block mt-1 font-mono text-[length:calc(10px*var(--zaad-font-scale))] uppercase text-muted">
                                                        {wrapLatinRuns(partner.role, isFarsi)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted font-light leading-relaxed">
                                                    {wrapLatinRuns(partner.products, isFarsi)}
                                                </p>
                                            </div>
                                        </MaisonReveal>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <CallStrip />
            <Footer />
            <ScrollButton />
        </div>
    );
}

export default React.memo(GlancePage);