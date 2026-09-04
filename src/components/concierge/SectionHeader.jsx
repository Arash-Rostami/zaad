import React, { memo } from "react";
import { Phone } from "lucide-react";
import MaisonReveal from "../MaisonReveal";

const SectionHeader = memo(function SectionHeader({ t }) {
    return (
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                    {t("acquisitionsServices")}
                </span>
            </MaisonReveal>
            <MaisonReveal variant="lines" delay={0.3} threshold={0.01}>
                <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light mb-4 text-glow-subtle">
                    {t("privateCommissions")}
                </h2>
            </MaisonReveal>
            <MaisonReveal variant="unveil" delay={0.5} threshold={0.01}>
                <p className="text-sm md:text-base text-muted font-light leading-relaxed rtl:text-justify">
                    {t("privateCommissionsSub")}
                </p>
            </MaisonReveal>
            <MaisonReveal variant="unveil" delay={0.7} threshold={0.01}>
                <a
                    href={`tel:${t("studioPhoneTel")}`}
                    className="group inline-flex items-center gap-2.5 mt-8 px-5 py-2.5 rounded-full border border-ink/15 bg-panel text-ink text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase transition-colors duration-700 hover:border-accent hover:text-accent cursor-pointer"
                >
                    <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500" />
                    <span>{t("callStudio")}</span>
                    <span dir="ltr" className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                        {t("studioPhone")}
                    </span>
                </a>
            </MaisonReveal>
        </div>
    );
});

export default SectionHeader;
