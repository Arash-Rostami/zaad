import React, { memo, useMemo } from "react";
import NoiseBg from "../shared/NoiseBg";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";

const EMPTY_ARRAY = Object.freeze([]);

const PartnersSection = memo(function PartnersSection({ partners, t, isFarsi }) {
    const typology = partners?.typology ?? "";
    const hardware = partners?.hardware ?? "";
    const appliances = partners?.appliances ?? "";
    const accessories = partners?.accessories ?? "";
    const light = partners?.light ?? "";

    const partnerRows = useMemo(
        () => [
            {
                label: t("chassisTypology"),
                value: wrapLatinRuns(typology, isFarsi),
            },
            {
                label: t("hardwareCore"),
                value: wrapLatinRuns(hardware, isFarsi),
            },
            {
                label: t("integratedGlassware"),
                value: wrapLatinRuns(appliances, isFarsi),
            },
            {
                label: t("smartAccLed"),
                value: wrapLatinRuns(`${accessories} • ${light}`, isFarsi),
            },
        ],
        [t, typology, hardware, appliances, accessories, light, isFarsi]
    );

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-panel-glass border border-ink/5 p-6 rounded-2xl shadow-ambient text-xs">
            {partnerRows.map(({ label, value }) => (
                <div key={label} className="space-y-1">
                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-muted block uppercase">
                        {label}
                    </span>
                    <strong className="text-[length:calc(11px*var(--zaad-font-scale))] text-ink uppercase font-mono block">
                        {value}
                    </strong>
                </div>
            ))}
        </div>
    );
});

const ApplianceCard = memo(function ApplianceCard({ app, index, isFarsi, ratingLabel, gaggenauRating }) {
    const category = useMemo(
        () => wrapLatinRuns(app?.category ?? "", isFarsi),
        [app?.category, isFarsi]
    );

    const name = useMemo(
        () => wrapLatinRuns(app?.name ?? "", isFarsi),
        [app?.name, isFarsi]
    );

    const specs = useMemo(() => {
        if (!Array.isArray(app?.specs)) return EMPTY_ARRAY;
        return app.specs.map((s) => wrapLatinRuns(s ?? "", isFarsi));
    }, [app?.specs, isFarsi]);

    const cardKey = app?.id ?? app?.name ?? index;

    return (
        <div className="group relative overflow-hidden bg-panel-glass p-5 sm:p-6 rounded-2xl border border-ink/5 flex flex-col justify-between">
            <NoiseBg filterId={`applianceNoise-${index}`} revealOnHover />
            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <span className="text-[length:max(9px,calc(8.5px*var(--zaad-font-scale)))] bg-accent text-on-indicator py-0.5 px-2 rounded-md font-mono font-medium">
                        {category}
                    </span>
                </div>
                <h5 className="font-serif text-lg font-light text-ink">
                    {name}
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-muted ps-1 font-light leading-relaxed">
                    {specs.map((s, sIdx) => (
                        <li key={`${cardKey}-spec-${sIdx}`}>{s}</li>
                    ))}
                </ul>
            </div>
            <div className="relative z-10 mt-5 pt-3 border-t border-ink/5 flex items-center justify-between">
                <span className="text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-mono text-muted uppercase">
                    {ratingLabel}
                </span>
                <span className="text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-mono font-bold text-accent">
                    {wrapLatinRuns(gaggenauRating, isFarsi)}
                </span>
            </div>
        </div>
    );
});

const AccessoryCard = memo(function AccessoryCard({ acc, index, isFarsi }) {
    const name = useMemo(
        () => wrapLatinRuns(acc?.name ?? "", isFarsi),
        [acc?.name, isFarsi]
    );

    const specs = useMemo(() => {
        if (!Array.isArray(acc?.specs)) return EMPTY_ARRAY;
        return acc.specs.map((s) => wrapLatinRuns(s ?? "", isFarsi));
    }, [acc?.specs, isFarsi]);

    const cardKey = acc?.id ?? acc?.name ?? index;

    return (
        <div className="space-y-2">
            <h6 className="font-serif text-lg font-light text-ink uppercase">
                {name}
            </h6>
            <div className="text-[length:calc(11px*var(--zaad-font-scale))] bg-surface-alt/30 p-3 rounded-lg border border-ink/5">
                <ul className="list-disc list-inside space-y-1 text-muted">
                    {specs.map((s, sIdx) => (
                        <li key={`${cardKey}-spec-${sIdx}`} className="font-light">
                            {s}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

function TabAppliances({ item, t, isFarsi }) {
    const partners = item?.partners;
    const appliancesDetail = item?.appliancesDetail;
    const accessoriesDetail = item?.accessoriesDetail;

    const gaggenauSpecificsTitle = useMemo(
        () => wrapBrandNames(t("gaggenauIntegrationSpecifics")),
        [t]
    );

    const ratingLabel = useMemo(() => t("integrationRating"), [t]);
    const gaggenauRating = useMemo(() => t("gaggenauRating"), [t]);
    const kessebohmerTitle = useMemo(() => t("kessebohmerStructures"), [t]);

    if (!item) return null;

    const hasPartners = Boolean(partners);
    const hasAppliances = Array.isArray(appliancesDetail) && appliancesDetail.length > 0;
    const hasAccessories = Array.isArray(accessoriesDetail) && accessoriesDetail.length > 0;

    return (
        <div className="space-y-8">
            {hasPartners && (
                <PartnersSection partners={partners} t={t} isFarsi={isFarsi} />
            )}

            {hasAppliances && (
                <div className="space-y-4">
                    <span className="text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-mono text-accent uppercase block">
                        {gaggenauSpecificsTitle}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appliancesDetail.map((app, idx) => (
                            <ApplianceCard
                                key={app?.id ?? app?.name ?? idx}
                                app={app}
                                index={idx}
                                isFarsi={isFarsi}
                                ratingLabel={ratingLabel}
                                gaggenauRating={gaggenauRating}
                            />
                        ))}
                    </div>
                </div>
            )}

            {hasAccessories && (
                <div className="bg-panel-glass p-6 rounded-2xl border border-ink/5 space-y-4 mt-8">
                    <span className="text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] font-mono text-accent block uppercase">
                        {wrapLatinRuns(kessebohmerTitle, isFarsi)}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {accessoriesDetail.map((acc, aIdx) => (
                            <AccessoryCard
                                key={acc?.id ?? acc?.name ?? aIdx}
                                acc={acc}
                                index={aIdx}
                                isFarsi={isFarsi}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(TabAppliances);