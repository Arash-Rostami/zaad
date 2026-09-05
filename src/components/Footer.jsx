"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/services/TranslationService";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";
import localizedYear from "@/lib/localizedYear";
import MaisonReveal from "./MaisonReveal";
import SocialLinks from "./shared/SocialLinks";

function Footer({ onScrollToSection, setActiveTab }) {
  const { t, isFarsi } = useLanguage();
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
                  <Link
                    href="/glance"
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none text-left rtl:text-right block"
                  >
                    {t("zaadAtAGlance")}
                  </Link>
                </li>
                <li>
                  <a
                    href="/showcase/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-canvas transition-colors duration-700 focus:outline-none text-left rtl:text-right block"
                  >
                    {t("footerFullLookbook")}
                  </a>
                </li>
                <li>
                  <span className="text-canvas/40 block select-none">
                    {t("footerMilanZAAD")}
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-xl md:text-3xl font-serif tracking-[0.35em] uppercase font-semibold text-accent mb-4">
                ZAAD
              </p>
              <div className="mt-6">
                <h4 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                  {t("footerConnectWithUs")}
                </h4>
                <SocialLinks />
              </div>
            </div>
          </div>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.35} threshold={0.01}>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-canvas/40 tracking-widest uppercase">
            <a
              href="http://www.persolbs.com/"
              target="_blank"
              rel="noopener noreferrer"
              title={"PBS - A.R.‎"}
              className="text-center sm:text-left rtl:sm:text-right text-[length:calc(8px*var(--zaad-font-scale))] rtl:text-[length:calc(9px*var(--zaad-font-scale))] hover:text-accent transition-colors duration-700"
            >
              {wrapBrandNames(t("footerCraft"))}
            </a>
            <div
              className="mt-4 sm:mt-0 text-center sm:text-right rtl:sm:text-left"
              suppressHydrationWarning
            >
              <Link
                href="/ledger"
                className="text-canvas/40 hover:text-accent transition-colors duration-700"
                aria-hidden="true"
                tabIndex={-1}
              >
                ©
              </Link>{" "}
              {wrapLatinRuns(
                t("footerCopyright")
                  .replace("{year}", localizedYear(isFarsi))
                  .replace(/^©\s*/, ""),
                isFarsi,
              )}
            </div>
          </div>
        </MaisonReveal>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
