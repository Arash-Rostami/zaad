"use client";

import React, { memo, useCallback, useEffect, useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, ChevronDown, KeyRound, LogOut, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollButton from "@/components/shared/ScrollButton";
import useLenisScroll from "@/hooks/useLenisScroll";
import MaisonButton from "../MaisonButton";
import MaisonReveal from "../MaisonReveal";
import StatusScreen from "../shared/StatusScreen";
import { useLanguage } from "@/services/TranslationService";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const EASE_IN_OUT = Object.freeze([0.16, 1, 0.3, 1]);
const EASE_EXIT = Object.freeze([0.7, 0, 0.84, 0]);

const DETAIL_INITIAL = Object.freeze({ opacity: 0, clipPath: "inset(0 0 100% 0)" });
const DETAIL_ANIMATE = Object.freeze({
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: Object.freeze({ duration: 0.8, ease: EASE_IN_OUT }),
});
const DETAIL_EXIT = Object.freeze({
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: Object.freeze({ duration: 0.6, ease: EASE_EXIT }),
});

const CONSULTATION_KEYS = {
    acquisition: "privateArchiveAcquisition",
    consultation: "residentialConsultation",
    visit: "florenceViewing",
};

const SLOT_KEYS = {
    "morning-1": { name: "appointmentSlotMorning1Name", time: "appointmentSlotMorning1Time" },
    "morning-2": { name: "appointmentSlotMorning2Name", time: "appointmentSlotMorning2Time" },
    midday: { name: "appointmentSlotMiddayName", time: "appointmentSlotMiddayTime" },
    "evening-1": { name: "appointmentSlotEvening1Name", time: "appointmentSlotEvening1Time" },
    "evening-2": { name: "appointmentSlotEvening2Name", time: "appointmentSlotEvening2Time" },
};

const EMPTY_STATE = Object.freeze({});
const PAGE_SIZE = 10;

const DATE_FORMATTERS = {
    fa: new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Rome",
    }),
    en: new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Rome",
    }),
};

const NUMBER_FORMATTERS = {
    fa: new Intl.NumberFormat("fa-IR"),
    en: new Intl.NumberFormat("en-GB"),
};

function stampFor(iso, language) {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    const formatter = language === "fa" ? DATE_FORMATTERS.fa : DATE_FORMATTERS.en;
    return formatter.format(date);
}

function countFor(value, language) {
    const formatter = language === "fa" ? NUMBER_FORMATTERS.fa : NUMBER_FORMATTERS.en;
    return formatter.format(value);
}

const LedgerGate = memo(function LedgerGate({ unlockAction, t }) {
    const [state, submit, pending] = useActionState(unlockAction, EMPTY_STATE);

    return (
        <div className="min-h-screen bg-surface text-ink flex items-center justify-center px-6 sm:px-12 pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)] pb-24">
            <MaisonReveal variant="unveil" className="max-w-md w-full text-center">
                <span className="text-[length:calc(10px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-5">
                    {t("ledgerEyebrow")}
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-[1.12] text-ink font-light text-glow-subtle mb-6">
                    {t("ledgerTitle")}
                </h1>
                <p className="text-sm text-muted font-light leading-relaxed mb-10">{t("ledgerGateIntro")}</p>
                <form action={submit} className="space-y-5 text-left rtl:text-right">
                    <div>
                        <label
                            htmlFor="ledger-key"
                            className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium"
                        >
                            {t("ledgerKeyLabel")}
                        </label>
                        <input
                            id="ledger-key"
                            type="password"
                            name="key"
                            required
                            autoComplete="off"
                            autoFocus
                            className="w-full bg-panel border border-ink/15 focus:border-ink focus:outline-none px-4 py-3 text-base sm:text-sm font-mono rounded-xl placeholder-dim-faint transition-colors"
                        />
                        {state.error && (
                            <p className="flex items-center gap-1.5 text-danger text-[length:calc(11px*var(--zaad-font-scale))] font-mono mt-1.5">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{t(state.error)}</span>
                            </p>
                        )}
                    </div>
                    <MaisonButton
                        type="submit"
                        variant="solid"
                        icon={KeyRound}
                        disabled={pending}
                        className="w-full font-sans"
                    >
                        {pending ? t("ledgerOpening") : t("ledgerEnter")}
                    </MaisonButton>
                </form>
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-500"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {t("ledgerReturnHome")}
                    </Link>
                </div>
            </MaisonReveal>
        </div>
    );
});

const DetailRow = memo(function DetailRow({ label, children }) {
    return (
        <div className="space-y-1">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-widest text-muted block uppercase">
                {label}
            </span>
            <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">{children}</span>
        </div>
    );
});

const LedgerEntry = memo(function LedgerEntry({ inquiry, index, open, stagger, onToggle, onDelete, deleting, t, isFarsi, language }) {
    const [confirming, setConfirming] = useState(false);
    const confirmTimer = useRef(null);

    useEffect(() => () => clearTimeout(confirmTimer.current), []);

    const handleToggle = useCallback(() => onToggle(index), [index, onToggle]);

    const handleDelete = useCallback(() => {
        if (deleting) return;
        if (!confirming) {
            setConfirming(true);
            clearTimeout(confirmTimer.current);
            confirmTimer.current = setTimeout(() => setConfirming(false), 4000);
            return;
        }
        clearTimeout(confirmTimer.current);
        setConfirming(false);
        onDelete(inquiry.sessionRef, inquiry.submittedAt);
    }, [confirming, deleting, onDelete, inquiry.sessionRef, inquiry.submittedAt]);

    const stamp = stampFor(inquiry.submittedAt, language);
    const consultationKey = CONSULTATION_KEYS[inquiry.desiredConsultation];
    const consultationLabel = consultationKey ? t(consultationKey) : inquiry.desiredConsultation;
    const slot = SLOT_KEYS[inquiry.appointmentWindow];
    const appointmentLabel = !inquiry.appointmentMode
        ? "—"
        : `${t(inquiry.appointmentMode === "audience" ? "appointmentModeAudience" : "appointmentModeCall")} · ${
            slot ? `${t(slot.name)} (${t(slot.time)})` : t("appointmentWindowArrangement")
        }`;

    const cleanedPhone = inquiry.clientPhone ? inquiry.clientPhone.replace(/[^\d+]/g, "") : "";

    return (
        <MaisonReveal variant="slide-up-royal" delay={Math.min(0.2 + stagger * 0.06, 0.8)} threshold={0.01} className="mb-4">
            <div
                className={`border rounded-2xl bg-panel overflow-hidden shadow-card-sm transition-colors duration-700 ${
                    open ? "border-accent/30" : "border-ink/10"
                }`}
            >
                <button
                    type="button"
                    onClick={handleToggle}
                    aria-expanded={open}
                    className="w-full text-left rtl:text-right px-5 sm:px-7 py-5 flex items-center gap-4 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                            <span dir="ltr" className="font-latin font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-widest text-accent shrink-0">
                                SEC-COM-{inquiry.sessionRef}
                            </span>
                            <span className="text-lg font-light text-ink truncate">{inquiry.clientName}</span>
                            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono tracking-widest uppercase text-muted">
                                {consultationLabel}
                            </span>
                        </div>
                        <p className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted/70 mt-1.5 tracking-wide">
                            {stamp} · {inquiry.language === "fa" ? "FA" : "EN"}
                        </p>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-muted/70 shrink-0 transition-transform duration-700 ${open ? "rotate-180" : ""}`}
                    />
                </button>
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div initial={DETAIL_INITIAL} animate={DETAIL_ANIMATE} exit={DETAIL_EXIT}>
                            <div className="px-5 sm:px-7 pb-6 pt-5 border-t border-ink/10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 pb-5">
                                    <DetailRow label={t("secureContactEmail")}>
                                        {inquiry.clientEmail ? (
                                            <a
                                                href={`mailto:${inquiry.clientEmail}`}
                                                dir="ltr"
                                                className="font-mono hover:text-accent transition-colors duration-700 inline-block"
                                            >
                                                {inquiry.clientEmail}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </DetailRow>
                                    <DetailRow label={t("directTelephone")}>
                                        {inquiry.clientPhone ? (
                                            <a
                                                href={`tel:${cleanedPhone}`}
                                                dir="ltr"
                                                className="font-mono hover:text-accent transition-colors duration-700 inline-block"
                                            >
                                                {inquiry.clientPhone}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </DetailRow>
                                    <DetailRow label={t("consultationCategory")}>{consultationLabel}</DetailRow>
                                    <DetailRow label={t("appointmentCadenceLabel")}>{appointmentLabel}</DetailRow>
                                </div>
                                {inquiry.additionalNote && (
                                    <div className="space-y-1.5 border-t border-ink/10 pt-4">
                                        <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-widest text-muted block uppercase">
                                            {t("archivalSpecs")}
                                        </span>
                                        <p className="text-sm text-ink/90 font-light leading-relaxed rtl:text-justify">
                                            {wrapLatinRuns(inquiry.additionalNote, isFarsi)}
                                        </p>
                                    </div>
                                )}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className={`flex items-center gap-1.5 font-mono uppercase tracking-widest text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                            confirming ? "text-danger" : "text-muted/70 hover:text-danger"
                                        } ${deleting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                        {confirming ? t("ledgerDeleteConfirm") : t("ledgerDelete")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MaisonReveal>
    );
});

function Ledger({ unlocked, inquiries, unlockAction, lockAction, deleteAction }) {
    const { t, language, isFarsi } = useLanguage();
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [isDeleting, startDeleteTransition] = useTransition();

    const toggleEntry = useCallback((index) => {
        setOpenIndex((current) => (current === index ? null : index));
    }, []);

    const handleLock = useCallback(() => {
        lockAction();
    }, [lockAction]);

    const handleDelete = useCallback(
        (sessionRef, submittedAt) => {
            setOpenIndex(null);
            startDeleteTransition(async () => {
                await deleteAction(sessionRef, submittedAt);
                router.refresh();
            });
        },
        [deleteAction, router],
    );

    const goToPage = useCallback((next) => {
        setPageIndex(next);
        setOpenIndex(null);
    }, []);

    useLenisScroll();

    const setActiveTab = (tab) => {
        if (tab === "pdf") {
            window.open("/showcase/index.html", "_blank", "noopener,noreferrer");
            return;
        }
        router.push("/");
    };
    const onScrollToSection = (sectionId) => router.push(`/#${sectionId}`);
    const onSelectProduct = (product) => router.push(product ? `/collection/${product.id}` : "/");

    const pageCount = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
    const safePage = Math.min(pageIndex, pageCount - 1);
    const pageStart = safePage * PAGE_SIZE;
    const pageEntries = inquiries.slice(pageStart, pageStart + PAGE_SIZE);

    const countLabel = countFor(inquiries.length, language);

    const body = !unlocked ? (
        <LedgerGate unlockAction={unlockAction} t={t} />
    ) : inquiries.length === 0 ? (
        <StatusScreen
            eyebrow={t("ledgerEyebrow")}
            title={t("ledgerEmptyTitle")}
            desc={t("ledgerEmptyDesc")}
            primaryLabel={t("ledgerLogout")}
            onPrimary={handleLock}
        />
    ) : (
        <div className="min-h-screen bg-surface text-ink px-6 sm:px-12 pt-[calc(61px+3rem)] sm:pt-[calc(73px+4rem)] pb-24">
            <div className="max-w-3xl mx-auto">
                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01} className="mb-12 md:mb-16">
                    <span className="text-[length:calc(10px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-5">
                        {t("ledgerEyebrow")}
                    </span>
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight font-light text-ink text-glow-subtle">
                            {t("ledgerTitle")}
                        </h1>
                        <MaisonButton variant="ghost" onClick={handleLock} icon={LogOut}>
                            {t("ledgerLogout")}
                        </MaisonButton>
                    </div>
                    <p className="mt-4 font-mono text-[length:calc(11px*var(--zaad-font-scale))] tracking-widest uppercase text-muted">
                        <span dir="ltr" className="font-latin">
                            {countLabel}
                        </span>{" "}
                        {t("ledgerEntryCount")}
                    </p>
                </MaisonReveal>

                {pageEntries.map((inquiry, offset) => (
                    <LedgerEntry
                        key={`${inquiry.sessionRef ?? "x"}-${inquiry.submittedAt ?? offset}`}
                        inquiry={inquiry}
                        index={pageStart + offset}
                        stagger={offset}
                        open={openIndex === pageStart + offset}
                        onToggle={toggleEntry}
                        onDelete={handleDelete}
                        deleting={isDeleting}
                        t={t}
                        isFarsi={isFarsi}
                        language={language}
                    />
                ))}

                {pageCount > 1 && (
                    <div className="mt-14 flex items-center justify-center gap-8">
                        <button
                            type="button"
                            disabled={safePage === 0}
                            onClick={() => goToPage(safePage - 1)}
                            className={`font-mono uppercase tracking-widest text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                safePage === 0 ? "text-muted/40 cursor-not-allowed" : "text-muted hover:text-ink cursor-pointer"
                            }`}
                        >
                            {t("ledgerPrev")}
                        </button>
                        <span
                            dir="ltr"
                            className="font-latin font-mono tracking-widest text-[length:calc(10px*var(--zaad-font-scale))] text-muted"
                        >
                            {countFor(safePage + 1, language)} / {countFor(pageCount, language)}
                        </span>
                        <button
                            type="button"
                            disabled={safePage === pageCount - 1}
                            onClick={() => goToPage(safePage + 1)}
                            className={`font-mono uppercase tracking-widest text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                safePage === pageCount - 1 ? "text-muted/40 cursor-not-allowed" : "text-muted hover:text-ink cursor-pointer"
                            }`}
                        >
                            {t("ledgerNext")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
            <Header
                activeTab="showroom"
                setActiveTab={setActiveTab}
                selectedProduct={null}
                onSelectProduct={onSelectProduct}
                onScrollToSection={onScrollToSection}
            />
            <main className="flex-1">{body}</main>
            <Footer onScrollToSection={onScrollToSection} setActiveTab={setActiveTab} />
            <ScrollButton />
        </div>
    );
}

export default memo(Ledger);