import React, { memo } from "react";
import MaisonReveal from "../MaisonReveal";

const SectionHeader = memo(function SectionHeader({ t }) {
    return (
        <MaisonReveal variant="unveil" threshold={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                    {t("acquisitionsServices")}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light mb-4">
                    {t("privateCommissions")}
                </h2>
                <p className="text-sm md:text-base text-muted font-light leading-relaxed">
                    {t("privateCommissionsSub")}
                </p>
            </div>
        </MaisonReveal>
    );
});

export default SectionHeader;
