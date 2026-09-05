import React, { useMemo } from "react";
import { motion } from "motion/react";
import MaisonReveal from "../MaisonReveal";
import {
  ChapterHero,
  EditorialBlock,
  StatGrid,
  CrossLinks,
  CallStrip,
} from "./ChapterPieces";
import wrapBrandNames from "@/lib/wrapBrandNames";

function ColumnHeader({ eyebrow, title, intro }) {
  const wrappedTitle = useMemo(() => wrapBrandNames(title), [title]);

  return (
    <div className="mb-10 text-left rtl:text-right">
      <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
        {eyebrow}
      </span>
      <h3 className="text-2xl md:text-3xl font-serif font-light tracking-tight leading-[1.2] text-ink">
        {wrappedTitle}
      </h3>
      {intro && (
        <p className="mt-4 text-sm text-muted font-light leading-relaxed max-w-md rtl:text-justify">
          {intro}
        </p>
      )}
    </div>
  );
}

function TwinChapter({ left, right }) {
  return (
    <section
      id="house-editorial"
      className="relative px-6 sm:px-12 section-y bg-surface-overlay border-y border-ink/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 relative">
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-10">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-px h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent origin-top"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.9,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-panel border border-accent/30 shadow-card-sm flex items-center justify-center"
            >
              <span className="font-serif italic text-accent text-lg leading-none">
                &amp;
              </span>
            </motion.div>
          </div>

          <MaisonReveal
            variant="unveil"
            threshold={0.01}
            delay={0.15}
            className="lg:pr-16 rtl:lg:pr-0 rtl:lg:pl-16"
          >
            <ColumnHeader
              eyebrow={left.eyebrow}
              title={left.title}
              intro={left.intro}
            />
            <EditorialBlock content={left.content} />
            {left.stats && left.stats.length > 0 && (
              <div className="mt-12">
                <StatGrid stats={left.stats} />
              </div>
            )}
          </MaisonReveal>

          <MaisonReveal
            variant="unveil"
            threshold={0.01}
            delay={0.5}
            className="lg:pl-16 rtl:lg:pl-0 rtl:lg:pr-16"
          >
            <ColumnHeader
              eyebrow={right.eyebrow}
              title={right.title}
              intro={right.intro}
            />
            <EditorialBlock content={right.content} />
            {right.stats && right.stats.length > 0 && (
              <div className="mt-12">
                <StatGrid stats={right.stats} />
              </div>
            )}
          </MaisonReveal>
        </div>
      </div>
    </section>
  );
}

function HouseDiptychShell({
  heroEyebrow,
  heroTitle,
  heroTitleAccent,
  heroIntro,
  heroImage,
  heroImageAlt,
  heroBadge,
  heroBadgeLabel,
  left,
  right,
  siblings,
}) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <ChapterHero
        heroEyebrow={heroEyebrow}
        heroTitle={heroTitle}
        heroTitleAccent={heroTitleAccent}
        heroIntro={heroIntro}
        heroImage={heroImage}
        heroImageAlt={heroImageAlt}
        heroBadge={heroBadge}
        heroBadgeLabel={heroBadgeLabel}
      />

      <TwinChapter left={left} right={right} />

      <CrossLinks siblings={siblings} />

      <CallStrip />
    </div>
  );
}

export default React.memo(HouseDiptychShell);
