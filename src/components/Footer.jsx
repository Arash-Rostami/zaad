"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/services/TranslationService";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";
import localizedYear from "@/lib/localizedYear";
import MaisonReveal from "./MaisonReveal";

function Footer({ onScrollToSection, setActiveTab }) {
  const { t, isFarsi } = useLanguage();
  const [studio, setStudio] = useState(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Rome",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23",
      }).formatToParts(now);
      const get = (type) => parts.find((p) => p.type === type)?.value;
      const hour = parseInt(get("hour"), 10);
      const open =
        !["Sat", "Sun"].includes(get("weekday")) && hour >= 9 && hour < 18;
      const time = new Intl.DateTimeFormat(isFarsi ? "fa-IR" : "en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(now);
      setStudio({ time, open });
    };
    compute();
    const id = setInterval(compute, 30000);
    return () => clearInterval(id);
  }, [isFarsi]);
  return (
    <footer className="bg-foundation text-canvas pt-16 pb-12 px-6 sm:px-12 border-t border-foundation text-left rtl:text-right">
      <div className="max-w-7xl mx-auto">
        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-canvas/10 pb-12 mb-12">
            <div className="md:col-span-3">
              <h4 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                {t("footerShowroomDir")}
              </h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("showroom");
                      setTimeout(() => onScrollToSection("story"), 100);
                    }}
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {t("footerPhilosophy")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("showroom");
                      setTimeout(() => onScrollToSection("collection"), 100);
                    }}
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {t("footerCollection")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("showroom");
                      setTimeout(() => onScrollToSection("concierge"), 100);
                    }}
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {t("footerConcierge")}
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                {wrapBrandNames(t("footerHouseDir"))}
              </h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none text-left rtl:text-right block"
                  >
                    {t("footerAboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/story"
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none text-left rtl:text-right block"
                  >
                    {t("footerStoryBrandValue")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none text-left rtl:text-right block"
                  >
                    {t("footerSustainabilityResponsibility")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                {t("footerBlueprintTitle")}
              </h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <button
                    onClick={() => setActiveTab("blueprint")}
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {t("footerBlueprintLink")}
                  </button>
                </li>
                <li>
                  <span className="text-canvas/40 block select-none">
                    {t("footerMilanZAAD")}
                  </span>
                </li>
                <li>
                  <span className="text-canvas/40 block select-none">
                    {t("footerRapolanoStone")}
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-xl md:text-3xl font-serif tracking-[0.35em] uppercase font-semibold text-accent mb-4">
                ZAAD
              </p>
              {studio && (
                <div className="mt-6 flex items-center gap-2.5 text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-widest uppercase text-canvas/50">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${studio.open ? "bg-accent" : "bg-canvas/25"}`}
                  />
                  <span>
                    {t("atelierClockCity")} — {studio.time} ·{" "}
                    {t(studio.open ? "atelierClockOpen" : "atelierClockClosed")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.35} threshold={0.01}>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-canvas/40 tracking-widest uppercase">
            <div
              className="text-center sm:text-left rtl:sm:text-right"
              title="Arash Rostami"
            >
              {wrapBrandNames(t("footerCraft"))}
            </div>
            <div
              className="mt-4 sm:mt-0 text-center sm:text-right rtl:sm:text-left"
              suppressHydrationWarning
            >
              {wrapLatinRuns(
                t("footerCopyright").replace("{year}", localizedYear(isFarsi)),
                isFarsi,
              )}{" "}
              <Link href="/ledger" className="text-canvas/40" aria-hidden="true" tabIndex={-1}>
                ·
              </Link>
            </div>
          </div>
        </MaisonReveal>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
