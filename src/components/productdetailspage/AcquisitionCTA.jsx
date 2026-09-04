import React, { memo, useCallback } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import MaisonButton from "../MaisonButton";
import MaisonReveal from "../MaisonReveal";

const AcquisitionCTA = memo(function AcquisitionCTA({ item, t, onInquire, onBack }) {
    const handleInquire = useCallback(() => onInquire(item), [onInquire, item]);

    return (
        <MaisonReveal variant="slide-up-royal" delay={0.15} threshold={0.01} className="bg-surface-alt rounded-2xl p-8 md:p-12 border border-ink/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.4s_ease-out_1] pointer-events-none" />

            <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent uppercase block mb-3 font-semibold">
                {t("acquisitionPrivileges")}
            </span>
            <h3 className="font-serif text-2xl md:text-4xl text-headline font-light tracking-tight max-w-2xl leading-snug mb-4">
                {t("acquisitionHeading")}
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-xl font-light mb-8 leading-relaxed rtl:text-justify">
                {t("acquisitionDesc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <MaisonButton
                    variant="solid"
                    onClick={handleInquire}
                    icon={Sparkles}
                    className="!px-8 !py-3.5 text-xs font-semibold"
                >
                    {t("productInitiateInquiry")}
                </MaisonButton>
                <MaisonButton
                    variant="outline"
                    onClick={onBack}
                    icon={ArrowLeft}
                    className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-muted px-6 py-3"
                >
                    {t("productReturnGrid")}
                </MaisonButton>
            </div>
        </MaisonReveal>
    );
});

export default AcquisitionCTA;