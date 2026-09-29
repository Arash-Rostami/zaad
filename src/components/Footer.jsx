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
import RibbonScroll from "./shared/RibbonScroll";
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
    <footer className="bg-foundation text-canvas pt-12 pb-0 border-t border-foundation text-left rtl:text-right">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-canvas/10 pb-10 mb-8">
            <div className="md:col-span-4">
              <ul className="space-y-3 text-xs uppercase text-canvas/80 font-mono">
                <li>
                  <button
                    onClick={handleMainPage}
                    className="hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas cursor-pointer text-left rtl:text-right block w-full"
                  >
                    {t("aboutBackToShowroom")}
                  </button>
                </li>
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

            <div className="md:col-span-4">
              <h3 className="font-serif text-lg font-light text-canvas/40 uppercase mb-4">
                {t("footerBlueprintTitle")}
              </h3>
              <ul className="space-y-3 text-xs uppercase text-canvas/80 font-mono">
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
              <div className="md:col-span-4">
                <p className="text-canvas w-24 md:w-32 mb-4">
                  <svg
                      viewBox="0 0 219.72 54.22"
                      className="w-full h-auto"
                      role="img"
                      aria-label="ZAAD"
                      fill="currentColor"
                  >
                    <polygon points="17.84 38.11 39.66 38.11 39.66 40.99 13.67 40.99 13.67 38.82 35.16 9.65 13.87 9.65 13.87 6.77 39.32 6.77 39.32 8.95 17.84 38.11" />
                    <path d="M71.58,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34L56.9,6.77h3.68l14.44,34.22h-3.44ZM50.89,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                    <path d="M106.94,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34l14.44-34.22h3.68l14.44,34.22h-3.44ZM86.26,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                    <path d="M126.28,6.77c4.92,0,9.03,1.62,12.3,4.87,3.27,3.27,4.92,7.34,4.92,12.23s-1.65,8.99-4.92,12.23c-3.27,3.27-7.39,4.89-12.3,4.89h-13.06V6.77h13.06ZM126.23,38.11c4.05,0,7.41-1.36,10.1-4.07,2.69-2.71,4.05-6.1,4.05-10.17s-1.36-7.44-4.05-10.15c-2.69-2.71-6.05-4.07-10.1-4.07h-9.98v28.46h9.98Z" />
                    <path d="M197.86,10.94l2.95-4.12,3.59,2.54c.38.25.44.76.19,1.14l-2.38,3.39-4.35-2.95Z" />
                    <polygon points="176.77 6.88 173.06 6.88 174.01 41.64 176.77 41.64 176.77 6.88" />
                    <polygon points="187.09 6.88 183.38 6.88 184.34 41.64 187.04 41.64 187.09 41.6 187.09 6.88" />
                    <path d="M167.13,28.11c-1.11-3.73-2.19-6.84-3.26-9.77h-4.31l6.5,17.22c-2.54,1.49-6.25,1.87-8.63,1.87-2.16,0-4.03-.25-5.2-1.08-.89-.63-1.43-1.55-1.43-2.92,0-.23.06-.98.21-2.58h-2.46c-.27,2.55-.36,3.45-.36,4.14,0,3.68,1.78,6.57,8.79,6.57s11.33-2.54,11.33-7.11c0-1.68-.1-2.73-1.17-6.35" />
                    <path d="M201.82,18.42l3.96,15.58c-5.46,6.66-9.14,10.12-13.14,10.12-1.52,0-2.38-.13-4.66-.86l-1.36,2.28c2.92,1.08,5.71,1.9,7.65,1.9,6.82,0,13.9-9.33,13.9-14.15,0-4.13-.65-8.26-2.11-14.88h-4.23Z" />
                  </svg>
                </p>
                <p className="text-xs font-mono uppercase text-canvas/40 block select-none mb-4">
                  <sup aria-hidden="true"> 𖡡 </sup>
                  {t("footerStudioAddress")}
                </p>
                <a
                  href={`tel:${t("studioPhoneTel")}`}
                  className="text-xs font-mono uppercase text-canvas/40 block mb-4 hover:text-canvas transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas text-left rtl:text-right"
                >
                  <sup aria-hidden="true"> 🕻 </sup>
                  <span dir="ltr">{t("studioPhone")}</span>
                </a>
                <div>
                  <sup title={t("footerConnectWithUs")} aria-hidden="true"
                      className="text-xs font-mono uppercase text-canvas/40 block select-none"> ⌕ </sup>
                  <SocialLinks/>
                </div>
              </div>
          </div>
        </MaisonReveal>

        <MaisonReveal variant="unveil" delay={0.35} threshold={0.01}>
          <div
              className="flex flex-col sm:flex-row items-center justify-between text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-canvas/40 uppercase">
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

      <RibbonScroll
        height="h-10 sm:h-12"
        opacityClassName="opacity-[0.25]"
        copies={9}
        className="mt-8 ribbon-neutral-in-light"
      />
    </footer>
  );
}

export default React.memo(Footer);
