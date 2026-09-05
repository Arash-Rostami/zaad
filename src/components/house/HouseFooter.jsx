"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/services/TranslationService";
import wrapLatinRuns from "@/lib/wrapLatinRuns";
import wrapBrandNames from "@/lib/wrapBrandNames";
import localizedYear from "@/lib/localizedYear";
import SocialLinks from "../shared/SocialLinks";

const HOUSE_LINKS = [
  { href: "/about", key: "footerAboutUs" },
  { href: "/story", key: "footerStoryBrandValue" },
  { href: "/sustainability", key: "footerSustainabilityResponsibility" },
];

const SHOWROOM_LINKS = [
  { href: "/#story", key: "footerPhilosophy" },
  { href: "/#collection", key: "footerCollection" },
  { href: "/#concierge", key: "footerConcierge" },
  { href: "/glance", key: "zaadAtAGlance" },
];

function HouseFooter() {
  const { t, isFarsi } = useLanguage();
  const pathname = usePathname();

  const footerCraft = useMemo(() => wrapBrandNames(t("footerCraft")), [t]);
  const footerCopyright = useMemo(
    () =>
      wrapLatinRuns(
        t("footerCopyright").replace("{year}", localizedYear(isFarsi)),
        isFarsi,
      ),
    [t, isFarsi],
  );

  return (
    <footer className="bg-foundation text-canvas py-12 px-6 sm:px-12 border-t border-foundation text-left rtl:text-right">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-canvas/10">
          <div>
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-canvas/50 uppercase block mb-3">
              {wrapBrandNames(t("footerHouseDir"))}
            </span>
            <ul className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {HOUSE_LINKS.map(({ href, key }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase transition-colors duration-700 ${
                        isActive
                          ? "text-accent pointer-events-none"
                          : "text-canvas/60 hover:text-canvas"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-canvas/50 uppercase block mb-3">
              {t("footerShowroomDir")}
            </span>
            <ul className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {SHOWROOM_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase text-canvas/60 hover:text-canvas transition-colors duration-700"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right rtl:text-left">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-canvas/50 uppercase block mb-3">
              {t("menuHouseOfZAAD")}
            </span>
            <Link
              href="/"
              className="text-accent text-xl font-serif tracking-[0.25em] uppercase font-semibold hover:opacity-85 transition-opacity duration-700"
            >
              ZAAD
            </Link>
            <SocialLinks className="justify-end mt-4" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-canvas/40 tracking-widest uppercase gap-3 mt-8">
          <a
            href="http://www.persolbs.com/"
            target="_blank"
            rel="noopener noreferrer"
            title={"PBS - A.R.‎"}
            className="text-center sm:text-left rtl:sm:text-right text-[length:calc(8px*var(--zaad-font-scale))] rtl:text-[length:calc(9px*var(--zaad-font-scale))] hover:text-accent transition-colors duration-700"
          >
            {footerCraft}
          </a>
          <div
            className="text-center sm:text-right rtl:sm:text-left"
            suppressHydrationWarning
          >
            {footerCopyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(HouseFooter);
