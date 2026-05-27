"use client";

import React from "react";
import MaisonReveal from "./MaisonReveal";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/services/TranslationService";

function Hero({ onScrollToCollection }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface">
      <MaisonReveal variant="lens-focus" className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2560&auto=format&fit=crop"
          alt="ZAAD Architecture Interior"
          className="object-cover w-full h-full opacity-[0.85] dark:opacity-70 mix-blend-multiply dark:mix-blend-screen"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/80 via-transparent to-surface/80" />
      </MaisonReveal>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center mt-24">
        <MaisonReveal variant="unveil" delay={0.2}>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-accent uppercase mb-6 sm:mb-8 block font-semibold">
            {t("heroSubtitle")}
          </span>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.4}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-ink tracking-tight leading-[1.05] mb-8 font-light text-glow-subtle mix-blend-normal">
            {t("heroTitleLine1")}
            <br />
            <span className="italic text-muted">{t("heroTitleLine2")}</span>
          </h1>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.6}>
          <p className="text-sm sm:text-base md:text-lg text-ink font-light max-w-xl mx-auto leading-relaxed mb-16 tracking-wide mix-blend-normal">
            {t("heroDescription")}
          </p>
        </MaisonReveal>

        <MaisonReveal variant="slide-up-royal" delay={0.8}>
          <button
            onClick={onScrollToCollection}
            className="group flex flex-col items-center text-muted hover:text-ink transition-colors duration-700"
            aria-label={t("scrollDown")}
          >
            <span className="text-[9px] font-mono tracking-widest uppercase mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
              {t("scrollDown")}
            </span>
            <div className="w-[1px] h-12 bg-ink/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-ink origin-top animate-scroll-line" />
            </div>
            <ArrowDown className="w-3 h-3 mt-2 opacity-40 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-700" />
          </button>
        </MaisonReveal>
      </div>
    </section>
  );
}

export default React.memo(Hero);
