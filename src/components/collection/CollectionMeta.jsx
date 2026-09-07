import React, { memo, useCallback, useMemo } from "react";
import { Calendar, MapPin, Scale, Sparkles, ArrowLeft } from "lucide-react";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";

const CollectionMeta = memo(function CollectionMeta({ item, t, isFarsi, onInquire, onBack }) {
    const wrappedName = useMemo(() => wrapBrandNames(item.name), [item.name]);
    const wrappedDesigner = useMemo(() => wrapBrandNames(item.designer), [item.designer]);
    const wrappedZaad = useMemo(() => wrapBrandNames(t("productZAAD")), [t]);
    const wrappedDescription = useMemo(() => wrapLatinRuns(item.description, isFarsi), [item.description, isFarsi]);
    const wrappedOrigin = useMemo(
        () => wrapBrandNames(item.specifications.origin),
        [item.specifications.origin]
    );
    const wrappedFinish = useMemo(
        () => wrapLatinRuns(item.specifications.finish, isFarsi),
        [item.specifications.finish, isFarsi]
    );

    const handleInquire = useCallback(() => onInquire(item), [onInquire, item]);

    return (
        <div className="lg:col-span-4 flex flex-col justify-start text-left rtl:text-right">
            <MaisonReveal variant="slide-up-royal" delay={0.55} threshold={0.01}>
                <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
                    {t("productArchitecturalRecord")} <span className="font-serif font-latin">{item.number}</span>
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif tracking-tight font-extralight text-headline leading-tight mb-2 text-glow-subtle">
                    {wrappedName}
                </h1>
                <p className="text-xs font-mono tracking-[0.15em] text-muted uppercase mb-6 pb-4 border-b border-ink/10">
                    {t("productCurator")}: {wrappedDesigner} •{" "}
                    {wrappedZaad} <span>{item.year}</span> {t("productRelease")}
                </p>

                <p className="text-sm md:text-base font-light text-ink leading-relaxed mb-8 rtl:text-justify">
                    {wrappedDescription}
                </p>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.75} threshold={0.01}>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-surface-alt rounded-xl p-5 border border-ink/5 mb-8 text-xs">
                    <div className="space-y-1">
                        <span className="font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-wider text-muted block uppercase">{t("productOrigin")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                            {wrappedOrigin}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-wider text-muted block uppercase">{t("productZAADWeight")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <Scale className="w-3.5 h-3.5 text-accent shrink-0" />
                            {item.specifications.weight}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-wider text-muted block uppercase">{t("productFinish")}</span>
                        <span className="font-light text-ink">{wrappedFinish}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-wider text-muted block uppercase">{t("productLeadTime")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                            {item.specifications.leadTime}
                        </span>
                    </div>
                </div>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.9} threshold={0.01}>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                    <MaisonButton
                        variant="solid"
                        onClick={handleInquire}
                        icon={Sparkles}
                        className="flex-1 text-center justify-center font-semibold text-xs py-3.5 font-sans"
                    >
                        {t("productInitiateInquiry")}
                    </MaisonButton>
                    <MaisonButton
                        variant="outline"
                        onClick={onBack}
                        icon={ArrowLeft}
                        className="text-center justify-center font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-widest text-muted"
                    >
                        {t("productReturnGrid")}
                    </MaisonButton>
                </div>
            </MaisonReveal>
        </div>
    );
});

export default CollectionMeta;