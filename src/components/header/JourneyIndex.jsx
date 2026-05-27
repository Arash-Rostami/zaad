import React, { memo } from "react";
import { ChevronRight } from "lucide-react";

const JourneyIndex = memo(function JourneyIndex({ journeyLinks, t, onNavigate }) {
    return (
        <div className="md:col-span-8 flex flex-col space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuJourneyIndex")}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                {journeyLinks.map((target) => (
                    <button
                        key={target.key}
                        onClick={() => onNavigate(target.key)}
                        className="group relative p-4 border border-ink/5 hover:border-[#C5A059]/60 bg-panel rounded-lg cursor-pointer flex flex-col justify-between transition-all duration-500 text-left rtl:text-right h-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex justify-between items-start w-full mb-4 relative z-10">
                            <span className="text-lg font-serif font-semibold text-headline group-hover:-translate-y-0.5 transition-transform duration-300">
                                {target.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-accent group-hover:text-[#C5A059] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all duration-300" />
                        </div>
                        <span className="text-[11px] text-accent font-mono uppercase leading-tight relative z-10 group-hover:text-[#C5A059] transition-colors duration-300">
                            {target.sub}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default JourneyIndex;
