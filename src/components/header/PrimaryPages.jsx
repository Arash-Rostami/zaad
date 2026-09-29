import React, { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import NoiseBg from "../shared/NoiseBg";

const PrimaryPages = memo(function PrimaryPages({ pageLinks, t, onNavigate }) {
    const handleClick = useCallback(
        (e) => {
            const key = e.target.closest("[data-page-key]")?.dataset.pageKey;
            if (key) onNavigate(key);
        },
        [onNavigate]
    );

    return (
        <div className="flex flex-col space-y-2">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuSystemDirectories")}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2" onClick={handleClick}>
                {pageLinks.map((target) => (
                    <button
                        key={target.key}
                        data-page-key={target.key}
                        className="group relative p-4 border border-ink/5 hover:border-[#C5A059]/60 bg-panel rounded-lg cursor-pointer active:scale-[0.98] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex flex-col justify-between text-left rtl:text-right min-h-[140px] overflow-hidden transition-all duration-500"
                    >
                        <NoiseBg
                            filterId={`primaryPageNoise-${target.key.replace(/\//g, "") || "home"}`}
                            revealOnHover
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/15 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <div className="flex justify-between items-start w-full relative z-10">
                            <span className="text-base font-serif font-farsi font-semibold text-headline group-hover:-translate-y-0.5 transition-transform duration-300">
                                {target.label}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-accent group-hover:text-[#C5A059] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
                        </div>
                        {target.sub && (
                            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11.5px*var(--zaad-font-scale))] text-accent font-mono uppercase leading-tight relative z-10 group-hover:text-[#C5A059] transition-colors duration-300">
                                {target.sub}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default PrimaryPages;
