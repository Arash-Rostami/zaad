import React, { useMemo } from "react";
import { motion } from "motion/react";
import MaisonReveal from "../shared/MaisonReveal";
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
      <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block mb-1">
        {eyebrow}
      </span>
      <h2 className="text-2xl md:text-3xl font-serif text-ink tracking-tight font-light text-glow-subtle">
        {wrappedTitle}
      </h2>
      {intro && (
        <p className="mt-4 text-sm text-muted font-light leading-relaxed max-w-md">
          {intro}
        </p>
      )}
    </div>
  );
}

function TwinChapter({ left, right }) {
  const stats = useMemo(
    () => [...(left?.stats || []), ...(right?.stats || [])],
    [left, right],
  );

  return (
    <section
      id="house-editorial"
      className="relative px-6 sm:px-12 section-y bg-surface-overlay border-y border-ink/10 overflow-hidden"
    >
      <div className="absolute left-1/3 top-1/10 w-[700px] h-[700px] pattern-diamond-grid opacity-[0.22] dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] pattern-diamond-grid opacity-[0.16] dark:opacity-[0.06] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 relative">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-10"
          >
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
              <span className="font-serif text-accent text-lg leading-none">
                &amp;
              </span>
            </motion.div>
          </div>

          <MaisonReveal
            variant="unveil"
            threshold={0.01}
            delay={0.15}
            className="order-1 lg:order-none lg:pr-16 rtl:lg:pr-0 rtl:lg:pl-16"
          >
            <ColumnHeader
              eyebrow={left.eyebrow}
              title={left.title}
              intro={left.intro}
            />
            <EditorialBlock content={left.content} />
          </MaisonReveal>

          <MaisonReveal
            variant="unveil"
            threshold={0.01}
            delay={0.5}
            className="order-3 lg:order-none lg:pl-16 rtl:lg:pl-0 rtl:lg:pr-16"
          >
            <ColumnHeader
              eyebrow={right.eyebrow}
              title={right.title}
              intro={right.intro}
            />
            <EditorialBlock content={right.content} />
          </MaisonReveal>
        </div>

        {stats.length > 0 && (
          <div className="mt-16 md:mt-20 max-w-2xl mx-auto">
            <StatGrid stats={stats} align="center" />
          </div>
        )}
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
      />

      <TwinChapter left={left} right={right} />

      <CrossLinks siblings={siblings} />

      <CallStrip />
    </div>
  );
}

export default React.memo(HouseDiptychShell);
