"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/services/LanguageProvider";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";
import localizedYear from "@/lib/localizedYear";
import { animateScrollToTop } from "@/services/ScrollService";
import MaisonReveal from "./shared/MaisonReveal";
import SocialLinks from "./shared/SocialLinks";

const EMPTY_ARRAY = Object.freeze([]);

function Footer({ onScrollToSection, setActiveTab, onSelectProduct }) {
  const { t, isFarsi, data } = useLanguage();
  const router = useRouter();
  const collections = useMemo(() => data("collection") || EMPTY_ARRAY, [data]);

  const handleSection = (sectionId) => {
    if (onScrollToSection) {
      setActiveTab("showroom");
      setTimeout(() => onScrollToSection(sectionId), 100);
      return;
    }
    router.push(`/#${sectionId}`);
  };

  const handleMainPage = () => {
    if (onScrollToSection) {
      setActiveTab("showroom");
      onSelectProduct?.(null);
      setTimeout(() => animateScrollToTop(1400), 100);
      return;
    }
    router.push("/");
  };
  return (
    <footer className="bg-foundation text-canvas pt-16 pb-12 px-6 sm:px-12 border-t border-foundation text-left rtl:text-right">
      <div className="max-w-7xl mx-auto">
        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-canvas/10 pb-12 mb-12">
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={handleMainPage}
                className="block text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4 text-left rtl:text-right hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer"
              >
                {t("menuMainPage")}
              </button>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <button
                    onClick={() => handleSection("vision")}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right"
                  >
                    {t("manifestoBadge")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSection("collection")}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right"
                  >
                    {t("menuCuratedSpecimens")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSection("advantages")}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right"
                  >
                    {t("advantagesBadge")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSection("materials")}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right"
                  >
                    {t("materialsBadge")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSection("concierge")}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right"
                  >
                    {wrapLatinRuns(t("zaadDigitalCurator"), isFarsi)}
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                {t("menuJourneyIndex")}
              </h3>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <Link
                    href="/glance"
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block"
                  >
                    {t("zaadAtAGlance")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block"
                  >
                    {t("menuOriginsPhilosophy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/story"
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block"
                  >
                    {t("menuStoryBrandValue")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block"
                  >
                    {t("menuSustainabilityResponsibility")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                {t("footerBlueprintTitle")}
              </h3>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                <li>
                  <a
                    href="/showcase/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block"
                  >
                    {t("footerFullLookbook")}
                  </a>
                </li>
                {collections.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/collection/${item.id}`}
                      className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right block text-[length:calc(11px*var(--zaad-font-scale))] rtl:text-[length:calc(13px*var(--zaad-font-scale))]"
                    >
                      {wrapLatinRuns(item.name, isFarsi)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
              <div className="md:col-span-3">
                <p className="text-xl md:text-3xl font-serif tracking-[0.35em] uppercase font-semibold text-accent mb-4">
                  ZAAD
                </p>
                <p className="text-xs font-mono tracking-widest uppercase text-canvas/40 block select-none mb-4">
                  <sup aria-hidden="true"> 𖡡 </sup>
                  {t("footerMilanZAAD")}
                </p>
                <p className="text-xs font-mono tracking-widest uppercase text-canvas/40 block select-none mb-4">
                  <sup aria-hidden="true"> 🕻 </sup>
                  <span dir="ltr">{t("studioPhone")}</span>
                </p>
                <div>
                  <sup title={t("footerConnectWithUs")} aria-hidden="true"
                      className="text-xs font-mono tracking-widest uppercase text-canvas/40 block select-none"> ⌕ </sup>
                  <SocialLinks/>
                </div>
              </div>
          </div>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.35} threshold={0.01}>
          <div
              className="flex flex-col sm:flex-row items-center justify-between text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-canvas/40 tracking-widest uppercase">
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
