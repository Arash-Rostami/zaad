import React, {memo, useCallback, useMemo} from "react";
import Link from "next/link";
import {AnimatePresence, motion} from "motion/react";
import {ArrowUpRight, ShieldCheck, Sparkles} from "lucide-react";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";

const CATALOGUE_PAGES = Object.freeze({
    gavv: 4,
    zivv: 26,
    rakh: 50,
    vaar: 62,
});

const EASE_IN_OUT = Object.freeze([0.16, 1, 0.3, 1]);
const EASE_EXIT = Object.freeze([0.7, 0, 0.84, 0]);

const ROTATE_0 = Object.freeze({rotate: 0});
const ROTATE_90 = Object.freeze({rotate: 90});

const ICON_TRANSITION = Object.freeze({
    duration: 0.7,
    ease: EASE_IN_OUT,
});

const SPECS_INITIAL = Object.freeze({
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
});

const SPECS_ANIMATE = Object.freeze({
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: Object.freeze({duration: 1.1, ease: EASE_IN_OUT}),
});

const SPECS_EXIT = Object.freeze({
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: Object.freeze({duration: 0.9, ease: EASE_EXIT}),
});

const EMPTY_ARRAY = Object.freeze([]);

function CollectionPanel({
                          selectedItem,
                          showcase,
                          t,
                          isFarsi,
                          onInquireItem,
                          onViewDetails,
                      }) {
    const {isSpecsExpanded = false, toggleSpecs} = showcase ?? {};
    const cataloguePage = CATALOGUE_PAGES[selectedItem?.id];
    const catalogueHref = cataloguePage ? `/showcase/index.html#p=${cataloguePage}` : null;

    const name = selectedItem?.name;
    const description = selectedItem?.description;
    const dimensions = selectedItem?.dimensions;
    const finish = selectedItem?.specifications?.finish;
    const weight = selectedItem?.specifications?.weight;
    const leadTime = selectedItem?.specifications?.leadTime;

    const wrappedName = useMemo(() => wrapBrandNames(name ?? ""), [name]);
    const wrappedDescription = useMemo(
        () => wrapLatinRuns(description ?? "", isFarsi),
        [description, isFarsi]
    );

    const specs = useMemo(() => {
        if (!selectedItem) return EMPTY_ARRAY;
        return [
            {
                label: t("showcaseScopeDimensions"),
                value: wrapLatinRuns(dimensions ?? "", isFarsi),
            },
            {
                label: t("showcaseFinishDetails"),
                value: wrapLatinRuns(finish ?? "", isFarsi),
            },
            {
                label: t("showcaseZAADWeight"),
                value: wrapLatinRuns(weight ?? "", isFarsi),
            },
            {
                label: t("showcaseCuratedDelivery"),
                value: wrapLatinRuns(leadTime ?? "", isFarsi),
            },
        ];
    }, [t, dimensions, finish, weight, leadTime, isFarsi, selectedItem]);

    const handleInquire = useCallback(() => {
        onInquireItem?.(selectedItem);
    }, [onInquireItem, selectedItem]);

    const handleViewDetails = useCallback(() => {
        onViewDetails?.(selectedItem);
    }, [onViewDetails, selectedItem]);

    if (!selectedItem) return null;

    const materials = Array.isArray(selectedItem.materials)
        ? selectedItem.materials
        : EMPTY_ARRAY;

    const toggleLabel = isSpecsExpanded
        ? t("showcaseCollapse")
        : t("showcaseShowStats");

    return (
        <MaisonReveal
            variant="slide-up-royal"
            delay={0.6}
            className="lg:col-span-6 flex flex-col h-full w-full text-left rtl:text-right"
        >
            <h3 className="text-4xl sm:text-5xl font-serif font-light tracking-tight text-ink mb-2 leading-tight text-glow-subtle">
                {wrappedName}
            </h3>

            <p className="text-sm sm:text-base text-ink font-light leading-relaxed mb-6">
                {wrappedDescription}
            </p>

            <div className="border-t border-b border-ink/10 mb-8 overflow-hidden">
                <button
                    type="button"
                    onClick={toggleSpecs}
                    className="w-full py-5 flex items-center justify-between group cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <div className="flex items-center space-x-3 text-left rtl:text-right">
                        <span
                            className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase">
                            {t("showcaseStudioLookbook")}
                        </span>
                        <span
                            className="text-[length:calc(9px*var(--zaad-font-scale))] font-mono text-muted opacity-65 group-hover:opacity-100 transition-opacity">
                            ({toggleLabel})
                        </span>
                    </div>
                    <div className="relative w-4 h-4 flex items-center justify-center">
                        <motion.div
                            className="absolute w-3 h-[1px] bg-ink"
                            animate={isSpecsExpanded ? ROTATE_0 : ROTATE_90}
                            transition={ICON_TRANSITION}
                        />
                        <div className="absolute w-3 h-[1px] bg-ink"/>
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {isSpecsExpanded && (
                        <motion.div
                            initial={SPECS_INITIAL}
                            animate={SPECS_ANIMATE}
                            exit={SPECS_EXIT}
                        >
                            <div className="pt-2 pb-6 border-t border-ink/10 mt-1 space-y-6">
                                <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-xs">
                                    {specs.map(({label, value}) => (
                                        <div key={label} className="space-y-1">
                                            <span
                                                className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono text-muted block uppercase">
                                                {label}
                                            </span>
                                            <span
                                                className="text-ink font-light text-[length:calc(11px*var(--zaad-font-scale))] block leading-relaxed">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="col-span-2">
                                        <span
                                            className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono text-muted block uppercase mb-2">
                                            {t("showcasePrimaryMaterials")}
                                        </span>
                                        <div
                                            className="flex flex-row gap-1.5 overflow-x-auto scrollbar-none"
                                            data-lenis-prevent
                                        >
                                            {materials.map((mat, i) => (
                                                <span
                                                    key={mat || i}
                                                    className="shrink-0 whitespace-nowrap text-[length:calc(9px*var(--zaad-font-scale))] bg-panel-glass dark:bg-panel/5 border border-ink/10 px-3 py-1 text-ink uppercase font-mono rounded-md"
                                                >
                                                    {wrapLatinRuns(mat, isFarsi)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <span
                                        className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted leading-relaxed max-w-sm uppercase text-left rtl:text-right">
                                        {wrapLatinRuns(t("showcaseCatalogueText"), isFarsi)}
                                    </span>
                                    <Link
                                        href={catalogueHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-[length:calc(10.5px*var(--zaad-font-scale))] bg-accent text-on-indicator hover:bg-ink dark:hover:bg-panel dark:hover:text-ink py-2.5 px-5 rounded-md uppercase font-medium flex items-center space-x-2 shrink-0 whitespace-nowrap transition-all duration-300 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer hover:shadow-md"
                                    >
                                        <span>{t("showcaseRevealDossier")}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.8] rtl:-scale-x-100"/>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-auto">
                <div
                    className="flex items-center gap-2 mb-4 text-muted/70 text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono justify-start">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent"/>
                    <span>{t("showcaseAirfreight")}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <MaisonButton variant="solid" onClick={handleInquire} icon={Sparkles} className="w-full">
                        {t("showcasePrivateInquiry")}
                    </MaisonButton>
                    <MaisonButton variant="outline" onClick={handleViewDetails} icon={ArrowUpRight} className="w-full">
                        {t("showcaseOpenPiece")}
                    </MaisonButton>
                </div>
            </div>
        </MaisonReveal>
    );
}

export default memo(CollectionPanel);