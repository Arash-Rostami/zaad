import React, { memo, useMemo } from "react";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const EMPTY_ARRAY = Object.freeze([]);

const SpecCard = memo(function SpecCard({
                                            title,
                                            heading,
                                            overview,
                                            partA,
                                            partB,
                                            listSpecs,
                                            listLabel,
                                            isFarsi,
                                        }) {
    const wrappedOverview = useMemo(
        () => wrapLatinRuns(overview ?? "", isFarsi),
        [overview, isFarsi]
    );

    const parts = useMemo(() => {
        const items = [];
        if (partA) items.push(partA);
        if (partB) items.push(partB);
        return items.map((part) => ({
            title: part.title,
            wrappedBullets: Array.isArray(part.bullets)
                ? part.bullets.map((b) => wrapLatinRuns(b ?? "", isFarsi))
                : EMPTY_ARRAY,
        }));
    }, [partA, partB, isFarsi]);

    const specs = useMemo(() => {
        if (!Array.isArray(listSpecs)) return EMPTY_ARRAY;
        return listSpecs.map((s) => ({
            raw: s,
            wrapped: wrapLatinRuns(s ?? "", isFarsi),
        }));
    }, [listSpecs, isFarsi]);

    const hasSpecs = specs.length > 0;

    return (
        <div className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-[length:max(9px,calc(9.5px*var(--zaad-font-scale)))] font-mono text-accent uppercase font-semibold">
                        {title}
                    </span>
                </div>
                <h4 className="font-serif text-lg font-light text-ink mb-3">
                    {heading}
                </h4>
                <p className="text-xs text-muted leading-relaxed font-light mb-6">
                    {wrappedOverview}
                </p>
                <div className="space-y-4">
                    {parts.map((part, i) => (
                        <div
                            key={part.title || i}
                            className="bg-surface-alt/30 p-4 rounded-xl"
                        >
                            <h5 className="font-serif text-lg font-light text-ink uppercase mb-1.5">
                                {wrapLatinRuns(part.title ?? "", isFarsi)}
                            </h5>
                            <ul className="list-disc list-inside space-y-1 text-xs text-muted leading-relaxed font-light">
                                {part.wrappedBullets.map((wrapped, bIdx) => (
                                    <li key={`${part.title || i}-bullet-${bIdx}`}>
                                        {wrapped}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {hasSpecs && (
                <div className="mt-8 border-t border-ink/10 pt-6">
                    <span className="text-[length:max(9px,calc(9.5px*var(--zaad-font-scale)))] font-mono text-muted block uppercase mb-3">
                        {listLabel}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[length:calc(11px*var(--zaad-font-scale))] font-mono">
                        {specs.map(({ raw, wrapped }, sIdx) => (
                            <div
                                key={raw || sIdx}
                                className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5"
                            >
                                <span className="text-accent">▪</span>
                                <span title={raw} className="leading-relaxed">
                                    {wrapped}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

const TallUnitsCard = memo(function TallUnitsCard({ tallUnits, t, isFarsi }) {
    const overview = tallUnits?.overview;
    const parts = tallUnits?.parts;
    const adjacentA = tallUnits?.adjacentA;
    const adjacentB = tallUnits?.adjacentB;
    const listSpecs = tallUnits?.listSpecs;

    const wrappedOverview = useMemo(
        () => wrapLatinRuns(overview ?? "", isFarsi),
        [overview, isFarsi]
    );

    const towerRows = useMemo(() => {
        if (!Array.isArray(parts)) return EMPTY_ARRAY;
        return parts.map((tower) => ({
            key: tower?.key ?? "",
            wrappedKey: wrapLatinRuns(tower?.key ?? "", isFarsi),
            name: tower?.name ?? "",
            wrappedName: wrapLatinRuns(tower?.name ?? "", isFarsi),
        }));
    }, [parts, isFarsi]);

    const adjacentPlans = useMemo(() => {
        const items = [];
        if (adjacentA) {
            items.push({
                key: "adjacentA",
                bullets: Array.isArray(adjacentA.bullets)
                    ? adjacentA.bullets.map((b) => wrapLatinRuns(b ?? "", isFarsi))
                    : EMPTY_ARRAY,
                label: wrapLatinRuns(t("ergonomicsPlanA"), isFarsi),
                reason: wrapLatinRuns(adjacentA.reason ?? "", isFarsi),
            });
        }
        if (adjacentB) {
            items.push({
                key: "adjacentB",
                bullets: Array.isArray(adjacentB.bullets)
                    ? adjacentB.bullets.map((b) => wrapLatinRuns(b ?? "", isFarsi))
                    : EMPTY_ARRAY,
                label: wrapLatinRuns(t("ergonomicsPlanB"), isFarsi),
                reason: wrapLatinRuns(adjacentB.reason ?? "", isFarsi),
            });
        }
        return items;
    }, [adjacentA, adjacentB, t, isFarsi]);

    const specs = Array.isArray(listSpecs) ? listSpecs : EMPTY_ARRAY;
    const hasParts = towerRows.length > 0;
    const hasSpecs = specs.length > 0;

    return (
        <div className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-[length:max(9px,calc(10.5px*var(--zaad-font-scale)))] font-mono text-accent uppercase font-semibold">
                        {t("tallCoreArchitectures")}
                    </span>
                </div>
                <h4 className="font-serif text-lg font-light text-ink mb-3">
                    {t("symmetricHousingWall")}
                </h4>
                <p className="text-xs text-muted leading-relaxed font-light mb-6">
                    {wrappedOverview}
                </p>

                {hasParts && (
                    <div className="space-y-2 mb-6 text-[length:calc(11px*var(--zaad-font-scale))]">
                        <span className="text-[length:max(9px,calc(9.5px*var(--zaad-font-scale)))] font-mono text-muted uppercase block mb-1">
                            {t("zaadTowerRowScheduling")}
                        </span>
                        <div className="grid grid-cols-1 gap-1.5 font-mono">
                            {towerRows.map(({ key, wrappedKey, name, wrappedName }, tIdx) => (
                                <div
                                    key={key || tIdx}
                                    className="flex items-center justify-between p-2.5 bg-panel-glass dark:bg-panel/5 border border-ink/5 rounded-lg"
                                >
                                    <span className="text-accent font-bold text-[length:max(9px,calc(9px*var(--zaad-font-scale)))] shrink-0 uppercase">
                                        {wrappedKey}
                                    </span>
                                    <span title={name} className="text-muted text-end leading-relaxed">
                                        {wrappedName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {adjacentPlans.map(({ key, bullets, label, reason }) => (
                        <div
                            key={key}
                            className="bg-surface-alt/30 p-4 rounded-xl"
                        >
                            <span className="font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] text-accent block mb-1.5 uppercase">
                                {label}
                            </span>
                            <p className="text-[length:calc(11px*var(--zaad-font-scale))] text-muted mb-2">
                                {reason}
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-muted leading-relaxed font-light">
                                {bullets.map((wrapped, bIdx) => (
                                    <li key={`${key}-bullet-${bIdx}`}>
                                        {wrapped}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {hasSpecs && (
                <div className="mt-8 border-t border-ink/10 pt-6">
                    <span className="text-[length:max(9px,calc(9.5px*var(--zaad-font-scale)))] font-mono text-muted block uppercase mb-3">
                        {t("housingStructuralComponents")}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[length:calc(11px*var(--zaad-font-scale))] font-mono">
                        {specs.map((s, sIdx) => (
                            <div
                                key={s || sIdx}
                                className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5"
                            >
                                <span className="text-accent">▪</span>
                                <span title={s} className="leading-relaxed">
                                    {wrapLatinRuns(s, isFarsi)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

function TabArchitecture({ item, t, isFarsi }) {
    if (!item) return null;

    const islandSpecs = item.islandSpecs;
    const tallUnits = item.tallUnits;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {islandSpecs && (
                <SpecCard
                    title={t("coreIslandGeometries")}
                    heading={t("biMonolithCore")}
                    overview={islandSpecs.overview}
                    partA={islandSpecs.partA}
                    partB={islandSpecs.partB}
                    listSpecs={islandSpecs.listSpecs}
                    listLabel={t("constructorManualSheets")}
                    isFarsi={isFarsi}
                />
            )}
            {tallUnits && (
                <TallUnitsCard
                    tallUnits={tallUnits}
                    t={t}
                    isFarsi={isFarsi}
                />
            )}
        </div>
    );
}

export default memo(TabArchitecture);