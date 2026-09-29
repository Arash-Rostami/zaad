"use client";

import React, { memo, useCallback, useEffect, useActionState, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, ArrowLeft, ChevronDown, Eye, EyeOff, KeyRound, LogOut, Search, Trash2 } from "lucide-react";
import LedgerHeader from "./LedgerHeader";
import Footer from "@/components/Footer";
import ScrollButton from "@/components/shared/ScrollButton";
import useLenisScroll from "@/hooks/useLenisScroll";
import useDeferredMedia from "@/hooks/useDeferredMedia";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";
import StatusScreen from "../shared/StatusScreen";
import { useLanguage } from "@/services/LanguageProvider";
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

const TAB_LINE_TRANSITION = Object.freeze({
    type: "spring",
    stiffness: 350,
    damping: 30,
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

const GATE_FALLBACK_VIDEOS = ["eucalyptus", "stone", "leather"];

const LedgerGate = memo(function LedgerGate({ unlockAction, t }) {
    const [state, submit, pending] = useActionState(unlockAction, EMPTY_STATE);
    const reduceMotion = useReducedMotion();
    const [clipIndex, setClipIndex] = useState(0);

    const handleEnded = useCallback(() => {
        setClipIndex((current) => (current + 1) % GATE_FALLBACK_VIDEOS.length);
    }, []);
    const clip = GATE_FALLBACK_VIDEOS[clipIndex];
    const [gateVideoReady, gateVideoRef] = useDeferredMedia();
    const gateVideoElRef = useRef(null);

    const handleClipLoadedData = useCallback(() => {
        if (reduceMotion) return;
        gateVideoElRef.current?.play().catch(() => {});
    }, [reduceMotion]);

    return (
        <div className="min-h-screen bg-surface text-ink flex items-center justify-center px-6 sm:px-12 pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)] pb-16">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
                <MaisonReveal variant="unveil" className="max-w-md w-full mx-auto text-center">
                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block mb-1">
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
                                className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium"
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
                                aria-invalid={!!state.error}
                                aria-describedby={state.error ? "ledger-key-error" : undefined}
                                className="w-full bg-panel border border-ink/15 focus:border-ink focus:outline-none px-4 py-3 text-base sm:text-sm font-mono rounded-xl placeholder-dim-faint transition-colors"
                            />
                            {state.error && (
                                <p id="ledger-key-error" role="alert" className="flex items-center gap-1.5 text-danger text-[length:calc(11px*var(--zaad-font-scale))] font-mono mt-1.5">
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
                            className="flex items-center gap-2 text-[length:calc(10px*var(--zaad-font-scale))] font-mono uppercase text-muted hover:text-ink transition-colors duration-500"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            {t("ledgerReturnHome")}
                        </Link>
                    </div>
                </MaisonReveal>
                <MaisonReveal variant="scale-down-unveil" delay={0.2} className="hidden lg:block">
                    <div
                        ref={gateVideoRef}
                        className="relative h-[70vh] max-h-[640px] aspect-[9/16] mx-auto"
                        aria-hidden="true"
                    >
                        <AnimatePresence mode="wait">
                            <motion.video
                                key={clip}
                                ref={gateVideoElRef}
                                src={`/video/material/fallback/${clip}.mp4`}
                                poster={`/video/material/fallback/${clip}.jpg`}
                                muted
                                playsInline
                                preload={gateVideoReady && !reduceMotion ? "auto" : "none"}
                                onLoadedData={handleClipLoadedData}
                                onEnded={handleEnded}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: EASE_IN_OUT }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>
                </MaisonReveal>
            </div>
        </div>
    );
});

const DetailRow = memo(function DetailRow({ label, children }) {
    return (
        <div className="space-y-1">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono text-muted block uppercase">
                {label}
            </span>
            <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">{children}</span>
        </div>
    );
});

const LedgerFilterTab = memo(function LedgerFilterTab({ tab, isActive, onSelect, t, language }) {
    const handleClick = useCallback(() => onSelect(tab.id), [onSelect, tab.id]);

    return (
        <button
            type="button"
            role="tab"
            id={`ledger-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls="ledger-entries-panel"
            onClick={handleClick}
            className="group relative pb-3 sm:pb-4 flex items-center gap-2 transition-colors duration-300 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shrink-0"
        >
            <span
                className={`text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase transition-colors ${
                    isActive ? "text-ink font-semibold" : "text-muted/60 group-hover:text-ink"
                }`}
            >
                {t(tab.labelKey)}
            </span>
            <span
                className={`font-mono text-[length:calc(10px*var(--zaad-font-scale))] transition-colors ${
                    isActive ? "text-accent" : "text-muted/40"
                }`}
            >
                ({countFor(tab.count, language)})
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeLedgerFilterLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    transition={TAB_LINE_TRANSITION}
                />
            )}
        </button>
    );
});

const LedgerEntry = memo(function LedgerEntry({ inquiry, entryKey, open, stagger, onToggle, onDelete, onSetViewed, pending, t, isFarsi, language }) {
    const [confirming, setConfirming] = useState(false);
    const confirmTimer = useRef(null);

    useEffect(() => () => clearTimeout(confirmTimer.current), []);

    const handleToggle = useCallback(() => {
        if (!open && !inquiry.viewed) onSetViewed(inquiry.sessionRef, inquiry.submittedAt, true);
        onToggle(entryKey);
    }, [entryKey, onToggle, open, onSetViewed, inquiry]);

    const handleToggleViewed = useCallback(() => {
        onSetViewed(inquiry.sessionRef, inquiry.submittedAt, !inquiry.viewed);
    }, [onSetViewed, inquiry]);

    const handleDelete = useCallback(() => {
        if (pending) return;
        if (!confirming) {
            setConfirming(true);
            clearTimeout(confirmTimer.current);
            confirmTimer.current = setTimeout(() => setConfirming(false), 4000);
            return;
        }
        clearTimeout(confirmTimer.current);
        setConfirming(false);
        onDelete(inquiry.sessionRef, inquiry.submittedAt);
    }, [confirming, pending, onDelete, inquiry.sessionRef, inquiry.submittedAt]);

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
                        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[length:calc(9px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase shrink-0 ${
                                    inquiry.viewed ? "border-ink/10 text-muted/60" : "border-accent/40 text-accent bg-accent/5"
                                }`}
                            >
                                {inquiry.viewed ? (
                                    <Eye className="w-2.5 h-2.5 shrink-0" />
                                ) : (
                                    <EyeOff className="w-2.5 h-2.5 shrink-0" />
                                )}
                                {inquiry.viewed ? t("ledgerTabViewed") : t("ledgerTabUnviewed")}
                            </span>
                            <span dir="ltr" className="font-latin font-mono text-[length:calc(11px*var(--zaad-font-scale))] text-accent shrink-0">
                                SEC-COM-{inquiry.sessionRef}
                            </span>
                            <span className="text-lg font-light text-ink truncate">{inquiry.clientName}</span>
                            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono uppercase text-muted">
                                {consultationLabel}
                            </span>
                        </div>
                        <p className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted/70 mt-1.5">
                            {stamp} · {inquiry.language === "fa" ? "FA" : "EN"} · {inquiry.source === "chat" ? t("ledgerSourceChat") : t("ledgerSourceForm")}
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
                                    <DetailRow label={t("contactEmail")}>
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
                                    <DetailRow label={t("mobilePhone")}>
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
                                        <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono text-muted block uppercase">
                                            {t("archivalSpecs")}
                                        </span>
                                        <p className="text-sm text-ink/90 font-light leading-relaxed">
                                            {wrapLatinRuns(inquiry.additionalNote, isFarsi)}
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleToggleViewed}
                                        disabled={pending}
                                        className={`flex items-center gap-1.5 font-mono uppercase text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 text-muted/70 hover:text-accent ${
                                            pending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                                        }`}
                                    >
                                        {inquiry.viewed ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
                                        {inquiry.viewed ? t("ledgerMarkUnviewed") : t("ledgerMarkViewed")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={pending}
                                        className={`flex items-center gap-1.5 font-mono uppercase text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                            confirming ? "text-danger" : "text-muted/70 hover:text-danger"
                                        } ${pending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
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

function Ledger({ unlocked, inquiries, unlockAction, lockAction, deleteAction, setViewedAction }) {
    const { t, language, isFarsi } = useLanguage();
    const router = useRouter();
    const [openKey, setOpenKey] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [viewedOverrides, setViewedOverrides] = useState(EMPTY_STATE);
    const [isMutating, startMutationTransition] = useTransition();

    useEffect(() => {
        setViewedOverrides(EMPTY_STATE);
    }, [inquiries]);

    const toggleEntry = useCallback((entryKey) => {
        setOpenKey((current) => (current === entryKey ? null : entryKey));
    }, []);

    const handleLock = useCallback(() => {
        lockAction();
    }, [lockAction]);

    const handleDelete = useCallback(
        (sessionRef, submittedAt) => {
            setOpenKey(null);
            startMutationTransition(async () => {
                await deleteAction(sessionRef, submittedAt);
                router.refresh();
            });
        },
        [deleteAction, router],
    );

    const handleSetViewed = useCallback(
        (sessionRef, submittedAt, viewed) => {
            setViewedOverrides((prev) => ({ ...prev, [`${sessionRef}-${submittedAt}`]: viewed }));
            startMutationTransition(async () => {
                await setViewedAction(sessionRef, submittedAt, viewed);
            });
        },
        [setViewedAction],
    );

    const goToPage = useCallback((next) => {
        setPageIndex(next);
        setOpenKey(null);
    }, []);

    useLenisScroll();

    const effectiveInquiries = useMemo(() => {
        if (!Object.keys(viewedOverrides).length) return inquiries;
        return inquiries.map((inquiry) => {
            const key = `${inquiry.sessionRef}-${inquiry.submittedAt}`;
            return key in viewedOverrides ? { ...inquiry, viewed: viewedOverrides[key] } : inquiry;
        });
    }, [inquiries, viewedOverrides]);

    const unviewedCount = useMemo(() => effectiveInquiries.filter((inquiry) => !inquiry.viewed).length, [effectiveInquiries]);
    const viewedCount = effectiveInquiries.length - unviewedCount;

    const filteredInquiries = useMemo(() => {
        let list = effectiveInquiries;
        if (activeFilter !== "all") {
            const wantViewed = activeFilter === "viewed";
            list = list.filter((inquiry) => Boolean(inquiry.viewed) === wantViewed);
        }
        const needle = query.trim().toLowerCase();
        if (needle) {
            list = list.filter((inquiry) => {
                const consultationKey = CONSULTATION_KEYS[inquiry.desiredConsultation];
                const consultationLabel = consultationKey ? t(consultationKey) : inquiry.desiredConsultation || "";
                return [inquiry.clientName, inquiry.clientEmail, inquiry.clientPhone, String(inquiry.sessionRef ?? ""), consultationLabel].some(
                    (field) => field && field.toLowerCase().includes(needle),
                );
            });
        }
        return list;
    }, [effectiveInquiries, activeFilter, query, t]);

    useEffect(() => {
        setPageIndex(0);
        setOpenKey(null);
    }, [activeFilter, query]);

    const pageCount = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE));
    const safePage = Math.min(pageIndex, pageCount - 1);
    const pageStart = safePage * PAGE_SIZE;
    const pageEntries = filteredInquiries.slice(pageStart, pageStart + PAGE_SIZE);

    const countLabel = countFor(inquiries.length, language);

    const filterTabs = useMemo(
        () => [
            { id: "all", labelKey: "ledgerTabAll", count: inquiries.length },
            { id: "unviewed", labelKey: "ledgerTabUnviewed", count: unviewedCount },
            { id: "viewed", labelKey: "ledgerTabViewed", count: viewedCount },
        ],
        [inquiries.length, unviewedCount, viewedCount],
    );

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
        <div className="min-h-screen bg-surface text-ink px-6 sm:px-12 pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)] pb-16">
            <div className="max-w-3xl mx-auto">
                <MaisonReveal variant="unveil" delay={0.1} threshold={0.01} className="mb-12 md:mb-16">
                    <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block mb-1">
                        {t("ledgerEyebrow")}
                    </span>
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight font-light text-ink text-glow-subtle">
                            {t("ledgerTitle")}
                        </h1>
                        <MaisonButton variant="ghost" onClick={handleLock} icon={LogOut}>
                            {t("ledgerLogout")}
                        </MaisonButton>
                    </div>
                    <p className="mt-4 font-mono text-[length:calc(11px*var(--zaad-font-scale))] uppercase text-muted">
                        {countLabel} {t("ledgerEntryCount")}
                        {unviewedCount > 0 && (
                            <>
                                {" "}
                                ·{" "}
                                <span className="text-accent">{countFor(unviewedCount, language)}</span>{" "}
                                {t("ledgerUnviewedCount")}
                            </>
                        )}
                    </p>
                </MaisonReveal>

                <MaisonReveal
                    variant="unveil"
                    delay={0.15}
                    threshold={0.01}
                    className="mb-10 pb-4 border-b border-ink/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
                >
                    <div
                        role="tablist"
                        aria-orientation="horizontal"
                        className="flex items-center gap-6 overflow-x-auto scrollbar-none"
                    >
                        {filterTabs.map((tab) => (
                            <LedgerFilterTab
                                key={tab.id}
                                tab={tab}
                                isActive={activeFilter === tab.id}
                                onSelect={setActiveFilter}
                                t={t}
                                language={language}
                            />
                        ))}
                    </div>
                    <div className="relative sm:w-64 shrink-0">
                        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60 pointer-events-none" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={t("ledgerSearchPlaceholder")}
                            aria-label={t("ledgerSearchLabel")}
                            className="w-full bg-panel border border-ink/15 focus:border-ink focus:outline-none pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 text-sm font-light rounded-xl placeholder-dim-faint transition-colors"
                        />
                    </div>
                </MaisonReveal>

                <div id="ledger-entries-panel" role="tabpanel" aria-labelledby={`ledger-tab-${activeFilter}`}>
                {pageEntries.length === 0 ? (
                    <p className="text-sm text-muted font-light text-center py-16">{t("ledgerNoResults")}</p>
                ) : (
                    pageEntries.map((inquiry, offset) => {
                        const entryKey = `${inquiry.sessionRef ?? "x"}-${inquiry.submittedAt ?? offset}`;
                        return (
                            <LedgerEntry
                                key={entryKey}
                                inquiry={inquiry}
                                entryKey={entryKey}
                                stagger={offset}
                                open={openKey === entryKey}
                                onToggle={toggleEntry}
                                onDelete={handleDelete}
                                onSetViewed={handleSetViewed}
                                pending={isMutating}
                                t={t}
                                isFarsi={isFarsi}
                                language={language}
                            />
                        );
                    })
                )}

                {pageCount > 1 && (
                    <div className="mt-14 flex items-center justify-center gap-8">
                        <button
                            type="button"
                            disabled={safePage === 0}
                            onClick={() => goToPage(safePage - 1)}
                            className={`font-mono uppercase text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                safePage === 0 ? "text-muted/40 cursor-not-allowed" : "text-muted hover:text-ink cursor-pointer"
                            }`}
                        >
                            {t("ledgerPrev")}
                        </button>
                        <span
                            dir="ltr"
                            className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] text-muted"
                        >
                            {countFor(safePage + 1, language)} / {countFor(pageCount, language)}
                        </span>
                        <button
                            type="button"
                            disabled={safePage === pageCount - 1}
                            onClick={() => goToPage(safePage + 1)}
                            className={`font-mono uppercase text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] transition-colors duration-700 ${
                                safePage === pageCount - 1 ? "text-muted/40 cursor-not-allowed" : "text-muted hover:text-ink cursor-pointer"
                            }`}
                        >
                            {t("ledgerNext")}
                        </button>
                    </div>
                )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
            <LedgerHeader />
            <main className="flex-1">{body}</main>
            <Footer />
            <ScrollButton />
        </div>
    );
}

export default memo(Ledger);
