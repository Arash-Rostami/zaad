import React, { memo } from "react";
import MaisonReveal from "../MaisonReveal";

const LookbookPoetry = memo(function LookbookPoetry({ item }) {
    if (!item.farsiStory) return null;

    return (
        <MaisonReveal variant="unveil">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch py-12 md:py-16 px-6 md:px-10 bg-surface-alt/20 dark:bg-black/15 border border-ink/5 rounded-2xl mb-16 md:mb-24 relative overflow-hidden">
                <div
                    className="absolute right-6 top-6 opacity-[0.03] select-none text-[6rem] font-serif pr-4 leading-none"
                    dir="rtl"
                >
                    زمین
                </div>

                <div className="md:col-span-6 border-r-2 border-accent pr-6 flex flex-col justify-center text-right" dir="rtl">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
                        {item.farsiStory.title} — زبان نگاه
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-medium text-headline mb-4 leading-relaxed antialiased">
                        {item.farsiStory.title}
                    </h3>
                    <div className="space-y-4">
                        {item.farsiStory.paragraphs.map((p, idx) => (
                            <p key={idx} className="text-[12px] sm:text-[13px] text-muted leading-loose font-light antialiased">
                                {p}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 pl-4 flex flex-col justify-center">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
                        MATERIAL MONOGRAPH & HERITAGE NARRATIVE
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-light text-headline mb-4 leading-relaxed">
                        The Heritage of {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-4">
                        {item.story}
                    </p>
                    <div className="pt-2 text-[11px] font-mono tracking-wider italic text-accent uppercase">
                        Provenance Record: &ldquo;{item.provenance}&rdquo;
                    </div>
                </div>
            </div>
        </MaisonReveal>
    );
});

export default LookbookPoetry;
