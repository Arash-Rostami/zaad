"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/services/LanguageProvider";
import { HouseControls } from "../house/HouseChrome";

function GlanceHeader() {
    const { t } = useLanguage();

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-5">
                <div className="flex justify-start min-w-0">
                    <Link
                        href="/"
                        aria-label={t("aboutBackToShowroom")}
                        data-touch-boost
                        className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-500 shrink-0 p-2.5 -m-2.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("aboutBackToShowroom")}</span>
                    </Link>
                </div>

                <Link
                    href="/"
                    className="justify-self-center whitespace-nowrap text-ink text-lg sm:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.35em] uppercase font-semibold hover:opacity-85 transition-opacity duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    ZAAD
                </Link>

                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="flex-1 hidden md:flex justify-center min-w-0">
                        <span className="relative text-xs font-mono tracking-[0.2em] uppercase text-accent font-semibold whitespace-nowrap">
                            {t("zaadAtAGlance")}
                            <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-accent rounded-md" />
                        </span>
                    </div>
                    <HouseControls />
                </div>
            </div>
        </header>
    );
}

export default React.memo(GlanceHeader);