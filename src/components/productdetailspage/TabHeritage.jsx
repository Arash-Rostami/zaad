import React, { memo, useMemo } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

const DEFAULT_TRANSLATE = (key) => key;

const HERITAGE_PILLARS = Object.freeze([
    Object.freeze({
        titleKey: "rawStoneCuration",
        descKey: "rawStoneCurationDesc",
    }),
    Object.freeze({
        titleKey: "eucalyptusVeneers",
        descKey: "eucalyptusVeneersDesc",
    }),
]);

const PillarCard = memo(function PillarCard({ title, description }) {
    return (
        <div className="space-y-1.5 p-5 bg-surface-alt/20 rounded-xl">
            <h5 className="font-mono text-[length:calc(11px*var(--zaad-font-scale))] font-bold text-accent uppercase">
                {title}
            </h5>
            <p className="text-muted leading-relaxed font-light rtl:text-justify">
                {description}
            </p>
        </div>
    );
});

function TabHeritage({ t }) {
    const translate = typeof t === "function" ? t : DEFAULT_TRANSLATE;

    const craftSeal = useMemo(() => translate("craftIntegritySeal"), [translate]);
    const architecturalHonesty = useMemo(
        () => translate("architecturalHonesty"),
        [translate]
    );
    const heritageIntro = useMemo(() => translate("heritageIntro"), [translate]);
    const certificateOfProvenance = useMemo(
        () => translate("certificateOfProvenance"),
        [translate]
    );

    const pillars = useMemo(() => {
        return HERITAGE_PILLARS.map(({ titleKey, descKey }) => ({
            key: titleKey,
            title: translate(titleKey),
            description: translate(descKey),
        }));
    }, [translate]);

    return (
        <div className="bg-panel-glass rounded-2xl border border-ink/5 p-6 sm:p-10 space-y-8">
            <div className="max-w-3xl">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-widest text-accent uppercase font-semibold">
                        {craftSeal}
                    </span>
                </div>
                <h4 className="font-serif text-2xl font-light text-headline leading-snug mb-4">
                    {architecturalHonesty}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-6 rtl:text-justify">
                    {heritageIntro}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ink/10 text-xs">
                {pillars.map(({ key, title, description }) => (
                    <PillarCard
                        key={key}
                        title={title}
                        description={description}
                    />
                ))}
            </div>

            <div className="flex items-center space-x-3 text-[length:calc(11px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-widest text-accent justify-center pt-6">
                <ShieldCheck className="w-4 h-4" />
                <span>{certificateOfProvenance}</span>
            </div>
        </div>
    );
}

export default memo(TabHeritage);