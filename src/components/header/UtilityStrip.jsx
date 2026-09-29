import React, { memo } from "react";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";

const UtilityStrip = memo(function UtilityStrip({
    t,
    onOpenCatalogue,
    onNavigateToConcierge,
}) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch bg-surface-alt/40 border border-ink/5 rounded-lg overflow-hidden sm:divide-x divide-y sm:divide-y-0 divide-ink/10">
            <button
                type="button"
                onClick={onOpenCatalogue}
                className="group flex-1 flex items-center gap-2.5 px-4 py-3 text-left rtl:text-right cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-500 hover:bg-[#C5A059]/5"
            >
                <BookOpen className="w-4 h-4 shrink-0 text-accent group-hover:text-[#C5A059] transition-colors duration-300" />
                <span className="flex flex-col min-w-0">
                    <span className="text-sm font-serif font-farsi font-semibold text-headline">
                        {t("menuZAADCatalogue")}
                    </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto rtl:mr-auto rtl:ml-0 text-accent group-hover:text-[#C5A059] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
            </button>
            <button
                type="button"
                onClick={onNavigateToConcierge}
                className="group flex-1 flex items-center gap-2.5 px-4 py-3 text-left rtl:text-right cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-500 hover:bg-[#C5A059]/5"
            >
                <Sparkles className="w-4 h-4 shrink-0 text-accent group-hover:text-[#C5A059] transition-colors duration-300" />
                <span className="text-sm font-serif font-farsi font-semibold text-headline truncate">
                    {t("zaadDigitalCurator")}
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto rtl:mr-auto rtl:ml-0 text-accent group-hover:text-[#C5A059] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
            </button>
        </div>
    );
});

export default UtilityStrip;
