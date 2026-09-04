import React, { memo, useMemo } from "react";
import MaisonReveal from "../MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

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
                <div
                    className="absolute right-6 top-6 opacity-[0.03] select-none text-[6rem] font-serif font-farsi pr-4 leading-none"
                    dir="rtl"
                >
                  زمین
                </div>

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