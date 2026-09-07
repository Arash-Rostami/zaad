"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowLeft,
    Bot,
    ClipboardList,
    Languages,
    RotateCw,
    Sparkles,
    Smartphone,
    MoonStar,
    SearchCheck,
    ShieldCheck,
    Gauge,
    Radar,
    CheckCircle2,
    ZoomIn,
    Type,
    Volume2,
    History,
    CalendarClock,
    Wand2,
    BookOpen,
    MousePointer2,
} from "lucide-react";
import { useLanguage } from "@/services/LanguageProvider";
import { HouseControls } from "@/components/house/HouseChrome";
import HouseSmoothScroll from "@/components/house/HouseSmoothScroll";
import MaisonReveal from "@/components/shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const COMPANY_NAME = "Persol Business Solution";
const COMPANY_URL = "http://www.persolbs.com/";

const PAGES = [
    { id: "home", route: "/", titleKey: "creditsPageHomeTitle", descKey: "creditsPageHomeDesc" },
    { id: "glance", route: "/glance", titleKey: "creditsPageGlanceTitle", descKey: "creditsPageGlanceDesc" },
    { id: "collection", route: "/collection", titleKey: "creditsPageCollectionTitle", descKey: "creditsPageCollectionDesc" },
    { id: "about", route: "/about", titleKey: "creditsPageAboutTitle", descKey: "creditsPageAboutDesc" },
    { id: "story", route: "/story", titleKey: "creditsPageStoryTitle", descKey: "creditsPageStoryDesc" },
    { id: "sustainability", route: "/sustainability", titleKey: "creditsPageSustainabilityTitle", descKey: "creditsPageSustainabilityDesc" },
    { id: "ledger", route: "/ledger", titleKey: "creditsPageLedgerTitle", descKey: "creditsPageLedgerDesc" },
];

const FEATURES = [
    { id: "concierge", icon: Bot, titleKey: "creditsFeatureConciergeTitle", descKey: "creditsFeatureConciergeDesc" },
    { id: "inquiry", icon: ClipboardList, titleKey: "creditsFeatureInquiryTitle", descKey: "creditsFeatureInquiryDesc" },
    { id: "bilingual", icon: Languages, titleKey: "creditsFeatureBilingualTitle", descKey: "creditsFeatureBilingualDesc" },
    { id: "viewer", icon: RotateCw, titleKey: "creditsFeatureViewerTitle", descKey: "creditsFeatureViewerDesc" },
    { id: "motion", icon: Sparkles, titleKey: "creditsFeatureMotionTitle", descKey: "creditsFeatureMotionDesc" },
    { id: "responsive", icon: Smartphone, titleKey: "creditsFeatureResponsiveTitle", descKey: "creditsFeatureResponsiveDesc" },
    { id: "theme", icon: MoonStar, titleKey: "creditsFeatureThemeTitle", descKey: "creditsFeatureThemeDesc" },
    { id: "seo", icon: SearchCheck, titleKey: "creditsFeatureSeoTitle", descKey: "creditsFeatureSeoDesc" },
    { id: "lightbox", icon: ZoomIn, titleKey: "creditsFeatureLightboxTitle", descKey: "creditsFeatureLightboxDesc" },
    { id: "fontScale", icon: Type, titleKey: "creditsFeatureFontScaleTitle", descKey: "creditsFeatureFontScaleDesc" },
    { id: "audio", icon: Volume2, titleKey: "creditsFeatureAudioTitle", descKey: "creditsFeatureAudioDesc" },
    { id: "memory", icon: History, titleKey: "creditsFeatureMemoryTitle", descKey: "creditsFeatureMemoryDesc" },
    { id: "scheduling", icon: CalendarClock, titleKey: "creditsFeatureSchedulingTitle", descKey: "creditsFeatureSchedulingDesc" },
    { id: "autofill", icon: Wand2, titleKey: "creditsFeatureAutofillTitle", descKey: "creditsFeatureAutofillDesc" },
    { id: "catalogue", icon: BookOpen, titleKey: "creditsFeatureCatalogueTitle", descKey: "creditsFeatureCatalogueDesc" },
    { id: "cursorScroll", icon: MousePointer2, titleKey: "creditsFeatureCursorScrollTitle", descKey: "creditsFeatureCursorScrollDesc" },
];

const CARE = [
    { id: "accessible", icon: ShieldCheck, titleKey: "creditsCareAccessibleTitle", descKey: "creditsCareAccessibleDesc" },
    { id: "performance", icon: Gauge, titleKey: "creditsCarePerformanceTitle", descKey: "creditsCarePerformanceDesc" },
    { id: "seo", icon: Radar, titleKey: "creditsCareSeoTitle", descKey: "creditsCareSeoDesc" },
    { id: "verified", icon: CheckCircle2, titleKey: "creditsCareVerifiedTitle", descKey: "creditsCareVerifiedDesc" },
];

const CHECKLIST = [
    { id: "phone", titleKey: "creditsChecklistPhoneTitle", descKey: "creditsChecklistPhoneDesc" },
    { id: "address", titleKey: "creditsChecklistAddressTitle", descKey: "creditsChecklistAddressDesc" },
    { id: "social", titleKey: "creditsChecklistSocialTitle", descKey: "creditsChecklistSocialDesc" },
    { id: "whatsapp", titleKey: "creditsChecklistWhatsappTitle", descKey: "creditsChecklistWhatsappDesc" },
    { id: "twitter", titleKey: "creditsChecklistTwitterTitle", descKey: "creditsChecklistTwitterDesc" },
];

function SectionHeading({ title, note }) {
    return (
        <div className="max-w-2xl mb-6 md:mb-7">
            <MaisonReveal variant="unveil" threshold={0.05}>
                <h2 className="italic font-normal font-serif-luxury text-xl md:text-2xl text-ink text-balance">
                    {title}
                </h2>
            </MaisonReveal>
            {note && (
                <MaisonReveal variant="unveil" delay={0.12} threshold={0.05}>
                    <p className="mt-3 text-sm text-muted font-light leading-relaxed">{note}</p>
                </MaisonReveal>
            )}
        </div>
    );
}

function RouteRow({ route, title, desc, delay }) {
    return (
        <MaisonReveal variant="unveil" delay={delay} threshold={0.05}>
            <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-1 sm:gap-6 py-5 border-b border-ink/10 last:border-b-0">
                <span dir="ltr" className="font-mono text-xs tracking-wide text-accent pt-0.5">
                    {route}
                </span>
                <div>
                    <h3 className="text-sm font-medium text-ink mb-1">{title}</h3>
                    <p className="text-sm text-muted font-light leading-relaxed">{desc}</p>
                </div>
            </div>
        </MaisonReveal>
    );
}

function FeatureCell({ icon: Icon, title, desc, delay }) {
    return (
        <MaisonReveal variant="unveil" delay={delay} threshold={0.05}>
            <div className="h-full bg-surface p-6">
                <div className="flex items-center gap-2.5 mb-2.5">
                    {Icon && <Icon className="w-4 h-4 text-accent shrink-0" strokeWidth={1.5} />}
                    <h3 className="text-sm font-medium text-ink">{title}</h3>
                </div>
                <p className="text-xs text-muted font-light leading-relaxed">{desc}</p>
            </div>
        </MaisonReveal>
    );
}

function CareRow({ icon: Icon, title, desc, delay }) {
    return (
        <MaisonReveal variant="unveil" delay={delay} threshold={0.05}>
            <div className="flex items-start gap-3.5 py-4 border-b border-ink/10 last:border-b-0">
                {Icon && <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />}
                <p className="text-sm text-ink font-light leading-relaxed">
                    <span className="font-medium">{title}</span>
                    <span className="text-muted"> — {desc}</span>
                </p>
            </div>
        </MaisonReveal>
    );
}

export default function CreditsPage() {
    const { t, isFarsi } = useLanguage();
    const mainRef = useRef(null);
    const progressBarRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!mainRef.current || !progressBarRef.current) return;

        const tween = gsap.fromTo(
            progressBarRef.current,
            { scaleX: 0 },
            {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: mainRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.3,
                    invalidateOnRefresh: true,
                },
            },
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, []);

    const productLine = t("creditsProductLine");
    const [beforeCompany, afterCompany] = productLine.includes(COMPANY_NAME)
        ? productLine.split(COMPANY_NAME)
        : [productLine, ""];

    return (
        <>
            <HouseSmoothScroll />

            <header className="fixed top-0 left-0 w-full z-50 bg-panel-glass hover:bg-panel-frost backdrop-blur-[6px] border-b border-ink-faint transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        aria-label={t("aboutBackToShowroom")}
                        data-touch-boost
                        className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-500 shrink-0 p-2.5 -m-2.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("aboutBackToShowroom")}</span>
                    </Link>
                    <HouseControls />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink/5" aria-hidden="true">
                    <div
                        ref={progressBarRef}
                        className="h-full bg-accent origin-left rtl:origin-right"
                        style={{ transform: "scaleX(0)" }}
                    />
                </div>
            </header>

            <main id="main-content" ref={mainRef} className="min-h-screen bg-surface text-ink">
                <section className="max-w-2xl mx-auto px-6 sm:px-12 pt-24 pb-10">
                    <MaisonReveal variant="unveil" threshold={0.1}>
                        <span className="text-[length:calc(10px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
                            {t("creditsEyebrow")}
                        </span>
                    </MaisonReveal>
                    <MaisonReveal variant="unveil" delay={0.15} threshold={0.1}>
                        <h4 className="text-xl sm:text-2xl md:text-[2rem] font-serif tracking-tight leading-[1.15] text-ink font-light text-balance mb-2">
                            {t("creditsHeading")}
                        </h4>
                    </MaisonReveal>
                    <MaisonReveal variant="unveil" delay={0.35} threshold={0.1}>
                        <p className="mt-4 text-base text-muted font-light leading-relaxed max-w-md">
                            {t("creditsLede")}
                        </p>
                    </MaisonReveal>
                </section>

                <section className="max-w-2xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div>
                            <span className="font-mono text-xs tracking-widest text-accent font-semibold uppercase block mb-5">
                                {t("creditsScopeProvidedLabel")}
                            </span>
                            <ul>
                                {[t("creditsScopeProvided1"), t("creditsScopeProvided2"), t("creditsScopeProvided3")].map((item, i) => (
                                    <MaisonReveal key={i} variant="unveil" delay={0.06 * i} threshold={0.05}>
                                        <li className="text-sm text-muted font-light py-2.5 border-b border-ink/10 last:border-b-0">
                                            {item}
                                        </li>
                                    </MaisonReveal>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <span className="font-mono text-xs tracking-widest text-accent font-semibold uppercase block mb-5">
                                {t("creditsScopeBuiltLabel")}
                            </span>
                            <ul>
                                {[
                                    t("creditsScopeBuilt1"),
                                    t("creditsScopeBuilt2"),
                                    t("creditsScopeBuilt3"),
                                    t("creditsScopeBuilt4"),
                                    t("creditsScopeBuilt5"),
                                ].map((item, i) => (
                                    <MaisonReveal key={i} variant="unveil" delay={0.06 * i} threshold={0.05}>
                                        <li className="text-sm text-ink font-light py-2.5 border-b border-ink/10 last:border-b-0">
                                            {item}
                                        </li>
                                    </MaisonReveal>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="max-w-2xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <SectionHeading title={t("creditsPagesTitle")} note={t("creditsPagesNote")} />
                    <div>
                        {PAGES.map((page, i) => (
                            <RouteRow
                                key={page.id}
                                route={page.route}
                                title={t(page.titleKey)}
                                desc={t(page.descKey)}
                                delay={0.05 * i}
                            />
                        ))}
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <SectionHeading title={t("creditsFeaturesTitle")} note={t("creditsFeaturesNote")} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
                        {FEATURES.map((feature, i) => (
                            <FeatureCell
                                key={feature.id}
                                icon={feature.icon}
                                title={t(feature.titleKey)}
                                desc={t(feature.descKey)}
                                delay={0.04 * i}
                            />
                        ))}
                    </div>
                </section>

                <section className="max-w-2xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <SectionHeading title={t("creditsCareTitle")} />
                    <div>
                        {CARE.map((item, i) => (
                            <CareRow
                                key={item.id}
                                icon={item.icon}
                                title={t(item.titleKey)}
                                desc={t(item.descKey)}
                                delay={0.06 * i}
                            />
                        ))}
                    </div>
                </section>

                <section className="max-w-2xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <MaisonReveal variant="unveil" threshold={0.1}>
                        <div className="border border-ink/10 p-7 md:p-8">
                            <span className="font-mono text-xs tracking-widest text-accent font-semibold uppercase block mb-3">
                                {t("creditsLedgerLabel")}
                            </span>
                            <h2 className="italic font-normal font-serif-luxury text-xl text-ink mb-3">{t("creditsLedgerTitle")}</h2>
                            <p className="text-sm text-muted font-light leading-relaxed">{t("creditsLedgerNote")}</p>
                        </div>
                    </MaisonReveal>
                </section>

                <section className="max-w-2xl mx-auto px-6 sm:px-12 py-10 border-t border-ink/10">
                    <SectionHeading title={t("creditsChecklistTitle")} note={t("creditsChecklistNote")} />
                    <div>
                        {CHECKLIST.map((item, i) => (
                            <MaisonReveal key={item.id} variant="unveil" delay={0.06 * i} threshold={0.05}>
                                <div className="flex items-start gap-4 py-4 border-b border-ink/10 last:border-b-0">
                                    <span className="mt-1 w-3 h-3 border border-muted shrink-0" aria-hidden="true" />
                                    <div>
                                        <div className="text-sm font-medium text-ink">{t(item.titleKey)}</div>
                                        <div className="mt-1 text-xs text-muted font-light">{t(item.descKey)}</div>
                                    </div>
                                </div>
                            </MaisonReveal>
                        ))}
                    </div>
                </section>

                <footer className="max-w-2xl mx-auto px-6 sm:px-12 pt-6 pb-10 border-t border-ink/10 text-center">
                    <MaisonReveal variant="unveil" threshold={0.1}>
                        <p className="font-mono text-[0.66rem] tracking-[0.08em] uppercase text-muted">
                            {beforeCompany}
                            <a
                                href={COMPANY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                dir="ltr"
                                className="text-muted underline decoration-ink/15 underline-offset-2 hover:text-accent hover:decoration-accent/60 transition-colors duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                {COMPANY_NAME}
                            </a>
                            {afterCompany || " "}
                            — {wrapLatinRuns(t("creditsEngineeredLine"), isFarsi)}
                        </p>
                    </MaisonReveal>
                </footer>
            </main>
        </>
    );
}
