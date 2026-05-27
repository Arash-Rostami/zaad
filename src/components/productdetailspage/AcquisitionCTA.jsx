import React, { memo } from "react";
import MaisonButton from "../MaisonButton";

const AcquisitionCTA = memo(function AcquisitionCTA({ item, t, onInquire, onBack }) {
    return (
        <div className="bg-surface-alt rounded-2xl p-8 md:p-12 border border-ink/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />

            <span className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase block mb-3 font-semibold">
                ACQUISITION PRIVILEGES
            </span>
            <h3 className="font-serif text-2xl md:text-4xl text-headline font-light tracking-tight max-w-2xl leading-snug mb-4">
                Establish an Archetype of Permanent Symmetry inside Your Home
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-xl font-light mb-8 leading-relaxed">
                Through ZAAD concierge services, each bespoke order is supervised from stone selection at the quarry to local installation by master technicians.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <MaisonButton
                    variant="solid"
                    onClick={() => onInquire(item)}
                    className="!px-8 !py-3.5 text-xs font-semibold"
                >
                    {t("productInitiateInquiry")}
                </MaisonButton>
                <MaisonButton
                    variant="outline"
                    onClick={onBack}
                    className="text-[10px] font-mono tracking-widest text-muted px-6 py-3"
                >
                    {t("productReturnGrid")}
                </MaisonButton>
            </div>
        </div>
    );
});

export default AcquisitionCTA;
