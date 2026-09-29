import React, { memo, useCallback, useMemo } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";

const CollectionMeta = memo(function CollectionMeta({ item, t, isFarsi, onInquire, onBack }) {
    const wrappedName = useMemo(() => wrapBrandNames(item.name), [item.name]);
    const wrappedDescription = useMemo(() => wrapLatinRuns(item.description, isFarsi), [item.description, isFarsi]);

    const handleInquire = useCallback(() => onInquire(item), [onInquire, item]);

    return (
        <div className="lg:col-span-4 flex flex-col justify-start text-left rtl:text-right">
            <MaisonReveal variant="slide-up-royal" delay={0.55} threshold={0.01}>
                <h1 className="text-4xl sm:text-5xl font-serif tracking-tight font-light text-ink leading-tight mb-2 text-glow-subtle">
                    {wrappedName}
                </h1>

                <p className="text-sm md:text-base font-light text-ink leading-relaxed mb-8">
                    {wrappedDescription}
                </p>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.9} threshold={0.01}>
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-4">
                    <MaisonButton
                        variant="solid"
                        onClick={handleInquire}
                        icon={Sparkles}
                        className="flex-1 text-center justify-center font-semibold text-xs py-3.5 font-sans !px-5"
                    >
                        {t("productInitiateInquiry")}
                    </MaisonButton>
                    <MaisonButton
                        variant="outline"
                        onClick={onBack}
                        icon={ArrowLeft}
                        className="text-center justify-center font-mono text-[length:calc(11px*var(--zaad-font-scale))] text-muted"
                    >
                        {t("productReturnGrid")}
                    </MaisonButton>
                </div>
            </MaisonReveal>
        </div>
    );
});

export default CollectionMeta;