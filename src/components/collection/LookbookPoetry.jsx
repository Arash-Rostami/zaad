import React, { memo, useMemo } from "react";
import MaisonReveal from "../shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" };

const WATERMARK_ICONS = {
  gavv: (
    <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-44 md:h-44" {...STROKE}>
      <path d="M8 30 Q 50 18 92 30" />
      <path d="M8 48 Q 50 38 92 48" />
      <path d="M8 66 Q 50 58 92 66" />
      <path d="M8 84 Q 50 78 92 84" />
    </svg>
  ),
  zivv: (
    <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-44 md:h-44" {...STROKE}>
      <path d="M50 12 A 38 38 0 0 1 88 50" />
      <path d="M50 26 A 24 24 0 0 1 74 50" />
      <path d="M50 40 A 10 10 0 0 1 60 50" />
      <path d="M50 5 V 1" />
      <path d="M95 50 H 99" />
      <path d="M82 18 L 88 12" />
      <path d="M50 60 V 96" />
      <path d="M36 60 L 30 90" />
      <path d="M64 60 L 70 90" />
    </svg>
  ),
  rakh: (
    <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-44 md:h-44" {...STROKE}>
      <path d="M26 20 V 80" />
      <path d="M38 20 V 80" />
      <path d="M50 20 V 80" />
      <path d="M62 20 V 80" />
      <path d="M74 20 V 80" />
      <path d="M12 44 H 88" />
    </svg>
  ),
  vaar: (
    <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-44 md:h-44" {...STROKE}>
      <path d="M10 24 H 90" />
      <path d="M10 44 H 66" />
      <path d="M10 64 H 90" />
      <path d="M34 84 H 90" />
    </svg>
  ),
};

const LookbookPoetry = memo(function LookbookPoetry({ item, t, isFarsi }) {
  const wrappedHeading = useMemo(
      () => wrapLatinRuns(t("lookbookHeritageHeading").replace("{name}", item.name), isFarsi),
      [t, item.name, isFarsi]
  );
  const wrappedStory = useMemo(() => wrapLatinRuns(item.story, isFarsi), [item.story, isFarsi]);
  const wrappedProvenance = useMemo(() => wrapLatinRuns(item.provenance, isFarsi), [item.provenance, isFarsi]);

  if (!item.farsiStory) return null;

  return (
      <MaisonReveal variant="unveil" delay={0.15} threshold={0.01}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch py-12 md:py-16 px-6 md:px-10 bg-surface-alt/20 dark:bg-black/15 border border-ink/5 rounded-2xl relative overflow-hidden">
          {isFarsi && (
              <>
                {WATERMARK_ICONS[item.id] && (
                    <div
                        className="absolute right-6 top-6 opacity-[0.04] select-none pointer-events-none text-ink"
                        aria-hidden="true"
                    >
                      {WATERMARK_ICONS[item.id]}
                    </div>
                )}

                <div
                    className="md:col-span-6 border-r-2 border-accent pr-6 flex flex-col justify-center text-right"
                    dir="rtl"
                >
              <span className="text-[length:calc(9px*var(--zaad-font-scale))] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
                زبان نگاه
              </span>
                  <h3 className="font-serif text-lg md:text-xl font-medium text-headline mb-4 leading-relaxed antialiased">
                    {item.farsiStory.title}
                  </h3>
                  <div className="space-y-4">
                    {item.farsiStory.paragraphs.map((p, idx) => (
                        <p
                            key={idx}
                            className="text-[length:calc(12px*var(--zaad-font-scale))] sm:text-[length:calc(13px*var(--zaad-font-scale))] text-muted leading-loose font-light antialiased rtl:text-justify"
                        >
                          {p}
                        </p>
                    ))}
                  </div>
                </div>
              </>
          )}

          <div
              className={
                isFarsi
                    ? "md:col-span-6 pl-4 flex flex-col justify-center"
                    : "md:col-span-12 flex flex-col justify-center"
              }
          >
          <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
            {t("lookbookMonographEyebrow")}
          </span>
            <h3 className="font-serif text-lg md:text-xl font-light text-headline mb-4 leading-relaxed">
              {wrappedHeading}
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-4 rtl:text-justify">
              {wrappedStory}
            </p>
            <div className="pt-2 text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-wider italic text-accent uppercase">
              {t("lookbookProvenanceLabel")} &ldquo;
              {wrappedProvenance}&rdquo;
            </div>
          </div>
        </div>
      </MaisonReveal>
  );
});

export default LookbookPoetry;