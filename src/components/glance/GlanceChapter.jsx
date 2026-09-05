"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/services/TranslationService";
import wrapBrandNames from "@/lib/wrapBrandNames";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import MaisonReveal from "../MaisonReveal";

const EYEBROW =
    "text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3";

function SectionLabel({ children, className = "" }) {
    return <p className={`${EYEBROW} ${className}`}>{children}</p>;
}

function SpecPart({ part, isFarsi }) {
    if (!part) return null;
    return (
        <div>
            {part.title && (
                <h4 className="font-serif text-base md:text-lg font-light tracking-wide text-ink">
                    {wrapLatinRuns(part.title, isFarsi)}
                </h4>
            )}
            {part.reason && (
                <h4 className="font-serif text-base md:text-lg font-light tracking-wide text-ink">
                    {wrapLatinRuns(part.reason, isFarsi)}
                </h4>
            )}
            {part.bullets && (
                <ul className="mt-3 space-y-2">
                    {part.bullets.map((bullet, index) => (
                        <li key={index} className="flex gap-3 text-sm text-muted font-light leading-relaxed">
                            <span className="mt-[0.55em] h-px w-4 shrink-0 bg-accent/70" />
                            <span className="rtl:text-justify">{wrapLatinRuns(bullet, isFarsi)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SpecGroup({ spec, isFarsi }) {
    if (!spec) return null;
    return (
        <div className="space-y-6">
            {spec.overview && (
                <p className="text-sm md:text-base text-muted font-light leading-relaxed rtl:text-justify">
                    {wrapLatinRuns(spec.overview, isFarsi)}
                </p>
            )}
            {spec.parts && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {spec.parts.map((part) => (
                        <div key={part.key} className="border border-ink/10 rounded-xl p-4 bg-panel">
                            <dt className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-accent">
                                {wrapLatinRuns(part.key, isFarsi)}
                            </dt>
                            <dd className="mt-2 text-sm text-ink font-light leading-relaxed">
                                {wrapLatinRuns(part.name, isFarsi)}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}
            {(spec.partA || spec.partB) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SpecPart part={spec.partA} isFarsi={isFarsi} />
                    <SpecPart part={spec.partB} isFarsi={isFarsi} />
                </div>
            )}
            {(spec.adjacentA || spec.adjacentB) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SpecPart part={spec.adjacentA} isFarsi={isFarsi} />
                    <SpecPart part={spec.adjacentB} isFarsi={isFarsi} />
                </div>
            )}
            {spec.listSpecs && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5 border-t border-ink/10 pt-5">
                    {spec.listSpecs.map((line, index) => (
                        <li key={index} className="flex gap-3 text-sm text-muted font-light leading-relaxed">
                            <span className="mt-[0.55em] h-px w-3 shrink-0 bg-accent/70" />
                            <span className="rtl:text-justify">{wrapLatinRuns(line, isFarsi)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SpecTable({ table, isFarsi }) {
    if (!table) return null;
    const headCells = useMemo(() => table.head.map((cell) => wrapBrandNames(cell)), [table.head]);
    return (
        <div className="overflow-x-auto" data-lenis-prevent>
            <table className="w-full min-w-[560px] border-collapse text-left rtl:text-right">
                <thead>
                <tr>
                    {headCells.map((headCell, cellIndex) => (
                        <th
                            key={cellIndex}
                            className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-accent font-semibold border-b border-ink/20 py-3 pe-4"
                        >
                            {headCell}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-ink/10">
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className={`py-3 pe-4 align-top text-sm font-light leading-relaxed ${
                                    cellIndex === 0 ? "text-ink font-medium whitespace-nowrap" : "text-muted"
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
    );
}

function SpecCards({ entries, isFarsi }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {entries.map((entry, index) => (
                <div
                    key={index}
                    className="relative border border-ink/10 rounded-2xl p-5 md:p-6 bg-panel overflow-hidden text-left rtl:text-right"
                >
                    {entry.category && (
                        <p className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-accent">
                            {wrapLatinRuns(entry.category, isFarsi)}
                        </p>
                    )}
                    <h4 className="mt-1.5 font-serif text-base md:text-lg font-light tracking-wide text-ink">
                        {wrapLatinRuns(entry.name, isFarsi)}
                    </h4>
                    {entry.specs && (
                        <ul className="mt-3 space-y-1.5">
                            {entry.specs.map((spec, specIndex) => (
                                <li key={specIndex} className="text-sm text-muted font-light leading-relaxed rtl:text-justify">
                                    {wrapLatinRuns(spec, isFarsi)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

function GlanceChapter({ item, supplement, labels, number, numberFormatter }) {
    const { isFarsi } = useLanguage();

    const parts = useMemo(
        () => (item.partners ? Object.entries(item.partners).filter(([, value]) => Boolean(value)) : []),
        [item.partners]
    );
    const brandedName = useMemo(() => wrapBrandNames(item.name), [item.name]);

    return (
        <section id={`glance-${item.id}`} className="section-y border-t border-ink/10">
            <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] text-accent tabular-nums">
                        {numberFormatter.format(number)}
                    </span>
                    <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.3em] uppercase text-muted">
                        <span className="font-latin">{item.number}</span> · {item.year}
                    </span>
                </div>
                <h3 className="mt-3 text-3xl md:text-5xl font-serif font-light tracking-tight text-ink text-left rtl:text-right">
                    {brandedName}
                </h3>
                {supplement?.tagline && (
                    <p className="mt-2 text-base md:text-lg font-serif font-farsi font-light italic text-muted text-left rtl:text-right">
                        {wrapLatinRuns(supplement.tagline, isFarsi)}
                    </p>
                )}
            </MaisonReveal>

            {supplement?.narrative && (
                <MaisonReveal variant="slide-up-royal" delay={0.3} threshold={0.01}>
                    <div className="mt-8">
                        <SectionLabel>{labels.narrative}</SectionLabel>
                        <blockquote className="max-w-3xl border-s-2 border-accent/40 ps-6 md:ps-8">
                            {supplement.narrative.split("\n").map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-base md:text-lg font-serif font-farsi font-light leading-relaxed text-ink text-glow-subtle text-left rtl:text-right rtl:text-justify"
                                >
                                    {wrapLatinRuns(paragraph, isFarsi)}
                                </p>
                            ))}
                        </blockquote>
                    </div>
                </MaisonReveal>
            )}

            {parts.length > 0 && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.partners}</SectionLabel>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                            {parts.map(([key, value]) => (
                                <div key={key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/10 py-3">
                                    <dt className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-muted">
                                        {wrapLatinRuns(key, isFarsi)}
                                    </dt>
                                    <dd className="text-sm text-ink font-light leading-relaxed text-end rtl:text-start">
                                        {wrapLatinRuns(value, isFarsi)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </MaisonReveal>
            )}

            {item.islandSpecs && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.island}</SectionLabel>
                        <SpecGroup spec={item.islandSpecs} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {item.tallUnits && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.tallUnits}</SectionLabel>
                        <SpecGroup spec={item.tallUnits} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {supplement?.materialTable && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.materials}</SectionLabel>
                        <SpecTable table={supplement.materialTable} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {supplement?.dimensions && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.dimensions}</SectionLabel>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                            {supplement.dimensions.map((dimension, index) => (
                                <div key={index} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/10 py-3">
                                    <dt className="text-sm text-ink font-light">{wrapLatinRuns(dimension.label, isFarsi)}</dt>
                                    <dd className="text-sm text-muted font-light leading-relaxed text-end rtl:text-start">
                                        {wrapLatinRuns(dimension.value, isFarsi)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </MaisonReveal>
            )}

            {item.appliancesDetail?.length > 0 && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.appliances}</SectionLabel>
                        <SpecCards entries={item.appliancesDetail} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {supplement?.fittings?.length > 0 && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.fittings}</SectionLabel>
                        <SpecCards entries={supplement.fittings} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {supplement?.furniture && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.furniture}</SectionLabel>
                        <SpecCards entries={[supplement.furniture]} isFarsi={isFarsi} />
                    </div>
                </MaisonReveal>
            )}

            {supplement?.layouts?.length > 0 && (
                <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01}>
                    <div className="mt-12">
                        <SectionLabel>{labels.layouts}</SectionLabel>
                        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5">
                            {supplement.layouts.map((layout, index) => (
                                <li key={index} className="flex items-baseline gap-3 border-b border-ink/10 py-3 text-sm text-muted font-light leading-relaxed">
                                    <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] text-accent tabular-nums">
                                        {numberFormatter.format(index + 1)}
                                    </span>
                                    <span className="rtl:text-justify">{wrapLatinRuns(layout, isFarsi)}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </MaisonReveal>
            )}
        </section>
    );
}

export default React.memo(GlanceChapter);