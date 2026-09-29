"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/services/LanguageProvider";
import { HouseControls } from "../house/HouseChrome";

function LedgerHeader() {
    const { t } = useLanguage();

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-5">
                <div className="flex justify-start min-w-0">
                    <Link
                        href="/"
                        aria-label={t("ledgerReturnHome")}
                        data-touch-boost
                        className="flex items-center gap-2 text-xs font-mono uppercase text-muted hover:text-ink transition-colors duration-500 shrink-0 p-2.5 -m-2.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("ledgerReturnHome")}</span>
                    </Link>
                </div>

                <Link
                    href="/"
                    aria-label="ZAAD"
                    className="justify-self-center text-ink w-20 sm:w-28 hover:opacity-85 transition-opacity duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent flex items-center"
                >
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
                </Link>

                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="flex-1 hidden md:flex justify-center min-w-0">
                        <span className="relative text-xs font-mono uppercase text-accent font-semibold whitespace-nowrap">
                            {t("ledgerEyebrow")}
                            <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-accent rounded-md" />
                        </span>
                    </div>
                    <HouseControls />
                </div>
            </div>
        </header>
    );
}

export default React.memo(LedgerHeader);
