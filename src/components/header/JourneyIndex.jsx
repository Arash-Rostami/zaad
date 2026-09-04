import React, { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import NoiseBg from "../shared/NoiseBg";

const JourneyIndex = memo(function JourneyIndex({ journeyLinks, t, onNavigate }) {
    const handleClick = useCallback(
        (e) => {
            const key = e.target.closest("[data-journey-key]")?.dataset.journeyKey;
            if (key) onNavigate(key);
        },
        [onNavigate]
    );

    return (
        <div className="md:col-span-8 flex flex-col space-y-2">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuJourneyIndex")}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1" onClick={handleClick}>
                {journeyLinks.map((target) => (
                    <button
                        key={target.key}
                        data-journey-key={target.key}
                        className="group relative p-4 border border-ink/5 hover:border-[#C5A059]/60 bg-panel rounded-lg cursor-pointer active:scale-[0.98] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex flex-col justify-between transition-all duration-500 text-left rtl:text-right h-full overflow-hidden"
                    >
                        <NoiseBg filterId={`journeyNoise-${target.key.replace(/\//g, "")}`} revealOnHover />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/15 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <div className="flex justify-between items-start w-full mb-4 relative z-10">
                            <span className="text-lg font-serif font-farsi font-semibold text-headline group-hover:-translate-y-0.5 transition-transform duration-300">
                                {target.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-accent group-hover:text-[#C5A059] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-all duration-300" />
                        </div>
                        <span className="text-[length:calc(11px*var(--zaad-font-scale))] rtl:text-[length:calc(12.5px*var(--zaad-font-scale))] text-accent font-mono uppercase leading-tight relative z-10 group-hover:text-[#C5A059] transition-colors duration-300">
                            {target.sub}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default JourneyIndex;