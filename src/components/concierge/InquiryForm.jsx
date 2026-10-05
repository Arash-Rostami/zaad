import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Calendar, Check, ChevronDown, Clock, Send, RefreshCw } from "lucide-react";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const SLOT_KEYS = {
    "morning-1": { name: "appointmentSlotMorning1Name", time: "appointmentSlotMorning1Time" },
    "morning-2": { name: "appointmentSlotMorning2Name", time: "appointmentSlotMorning2Time" },
    "midday":    { name: "appointmentSlotMiddayName",    time: "appointmentSlotMiddayTime" },
    "evening-1": { name: "appointmentSlotEvening1Name", time: "appointmentSlotEvening1Time" },
    "evening-2": { name: "appointmentSlotEvening2Name", time: "appointmentSlotEvening2Time" },
};

const SLOT_ORDER = ["morning-1", "morning-2", "midday", "evening-1", "evening-2"];

function FieldError({ id, message }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="flex items-center gap-1.5 text-danger text-[length:calc(11px*var(--zaad-font-scale))] font-mono mt-1.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{message}</span>
        </p>
    );
}

export default function InquiryForm({ concierge, t, language }) {
    const isFarsi = language === "fa";
    const {
        clientName, setClientName,
        clientEmail, setClientEmail,
        clientPhone, setClientPhone,
        desiredConsultation, setDesiredConsultation,
        additionalNote, setAdditionalNote,
        formSubmitted, setFormSubmitted,
        formSubmitting,
        formErrors, setFormErrors,
        sessionRef,
        appointmentMode, selectAppointmentMode,
        appointmentWindow, setAppointmentWindow,
        resetAppointment,
        handleInquirySubmit,
    } = concierge;

    const slotLabel = appointmentWindow
        ? `${t(SLOT_KEYS[appointmentWindow].name)} (‪${t(SLOT_KEYS[appointmentWindow].time)}‬)`
        : t("appointmentWindowArrangement");

    const [cadenceOpen, setCadenceOpen] = useState(false);

    const cadenceSlots = useMemo(
        () => SLOT_ORDER.map((id) => ({ id, name: t(SLOT_KEYS[id].name), time: t(SLOT_KEYS[id].time) })),
        [t]
    );
    const appointmentModeOptions = useMemo(
        () => [
            { id: "call", label: t("appointmentModeCall") },
            { id: "audience", label: t("appointmentModeAudience") },
        ],
        [t]
    );
    const activeSlot = useMemo(
        () => cadenceSlots.find((s) => s.id === appointmentWindow),
        [cadenceSlots, appointmentWindow]
    );

    const handleAppointmentModeClick = useCallback(
        (e) => selectAppointmentMode(e.currentTarget.value),
        [selectAppointmentMode]
    );
    const selectCadence = useCallback(
        (id) => {
            setAppointmentWindow((prev) => (prev === id ? "" : id));
            setCadenceOpen(false);
        },
        [setAppointmentWindow]
    );
    const handleCadenceOptionClick = useCallback(
        (e) => selectCadence(e.currentTarget.value),
        [selectCadence]
    );
    const toggleCadenceOpen = useCallback(() => setCadenceOpen((v) => !v), []);
    const closeCadence = useCallback(() => setCadenceOpen(false), []);

    const identityRowAlignsBottom = !(formErrors.clientName || formErrors.clientEmail);
    const contactRowAlignsBottom = !(formErrors.clientPhone || formErrors.desiredConsultation);

    const handleInquireAnother = useCallback(() => {
        setFormSubmitted(false);
        setFormErrors({});
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setAdditionalNote("");
        resetAppointment();
    }, [setFormSubmitted, setFormErrors, setClientName, setClientEmail, setClientPhone, setAdditionalNote, resetAppointment]);

    return (
        <MaisonReveal
            variant="slide-up-royal"
            delay={0.5}
            className="lg:col-span-6 border-b lg:border-b-0 lg:border-r lg:rtl:border-r-0 lg:rtl:border-l border-ink/10 pb-12 lg:pb-0 lg:pr-12 lg:rtl:pr-0 lg:rtl:pl-12 text-left rtl:text-right"
        >
            <h3 className="text-xl md:text-2xl font-serif text-ink font-light mb-2 flex items-center justify-start tracking-tight">
                <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-accent shrink-0" />
                {t("acquisitionCard")}
            </h3>

            <AnimatePresence mode="wait">
                {!formSubmitted ? (
                    <motion.form
                        onSubmit={handleInquirySubmit}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="inquiry-name" className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium leading-snug">
                                    {t("bespokeClientName")}
                                </label>
                                <input
                                    id="inquiry-name"
                                    type="text"
                                    required
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder={t("clientNamePlaceholder")}
                                    aria-invalid={!!formErrors.clientName}
                                    aria-describedby={formErrors.clientName ? "inquiry-name-error" : undefined}
                                    className={`${identityRowAlignsBottom ? "mt-auto" : ""} w-full bg-panel border px-4 py-3 text-base sm:text-sm focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans ${formErrors.clientName ? "border-danger focus:border-danger" : "border-ink/15 focus:border-ink"}`}
                                />
                                <FieldError id="inquiry-name-error" message={formErrors.clientName && t(formErrors.clientName)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="inquiry-email" className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium leading-snug">
                                    {t("contactEmail")}{" "}
                                    <span className="text-[length:calc(10.5px*var(--zaad-font-scale))]">
                                        {t("optionalMarker")}
                                    </span>
                                </label>
                                <input
                                    id="inquiry-email"
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    placeholder="client@zaaddesign.com"
                                    aria-invalid={!!formErrors.clientEmail}
                                    aria-describedby={formErrors.clientEmail ? "inquiry-email-error" : undefined}
                                    className={`${identityRowAlignsBottom ? "mt-auto" : ""} w-full bg-panel border px-4 py-3 text-base sm:text-sm focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-mono ${formErrors.clientEmail ? "border-danger focus:border-danger" : "border-ink/15 focus:border-ink/80"}`}
                                />
                                <FieldError id="inquiry-email-error" message={formErrors.clientEmail && t(formErrors.clientEmail)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="inquiry-phone" className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium leading-snug">
                                    {t("mobilePhone")}
                                </label>
                                <input
                                    id="inquiry-phone"
                                    type="tel"
                                    required
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    placeholder="+98 912 345 6789"
                                    aria-invalid={!!formErrors.clientPhone}
                                    aria-describedby={formErrors.clientPhone ? "inquiry-phone-error" : undefined}
                                    className={`${contactRowAlignsBottom ? "mt-auto" : ""} w-full bg-panel border px-4 py-3 text-base sm:text-sm focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans ${formErrors.clientPhone ? "border-danger focus:border-danger" : "border-ink/15 focus:border-ink"}`}
                                />
                                <FieldError id="inquiry-phone-error" message={formErrors.clientPhone && t(formErrors.clientPhone)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="inquiry-consultation" className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium leading-snug">
                                    {t("consultationCategory")}
                                </label>
                                <input
                                    id="inquiry-consultation"
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={desiredConsultation}
                                    onChange={(e) => setDesiredConsultation(e.target.value)}
                                    aria-invalid={!!formErrors.desiredConsultation}
                                    aria-describedby={formErrors.desiredConsultation ? "inquiry-consultation-error" : undefined}
                                    className={`${contactRowAlignsBottom ? "mt-auto" : ""} w-full bg-panel border px-4 py-3 text-base sm:text-sm focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans ${formErrors.desiredConsultation ? "border-danger focus:border-danger" : "border-ink/15 focus:border-ink"}`}
                                />
                                <FieldError id="inquiry-consultation-error" message={formErrors.desiredConsultation && t(formErrors.desiredConsultation)} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="inquiry-note" className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-1.5 font-medium">
                                {t("archivalSpecs")}
                            </label>
                            <textarea
                                id="inquiry-note"
                                rows={4}
                                value={additionalNote}
                                onChange={(e) => setAdditionalNote(e.target.value)}
                                placeholder={t("spacePlaceholder")}
                                aria-invalid={!!formErrors.additionalNote}
                                aria-describedby={formErrors.additionalNote ? "inquiry-note-error" : undefined}
                                className={`w-full bg-panel border px-4 py-3 text-base sm:text-sm focus:outline-none placeholder-dim-faint transition-colors rounded-xl resize-none font-sans ${formErrors.additionalNote ? "border-danger focus:border-danger" : "border-ink/15 focus:border-ink"}`}
                            />
                            <FieldError id="inquiry-note-error" message={formErrors.additionalNote && t(formErrors.additionalNote)} />
                        </div>

                        {/* Appointment — Audience & Cadence */}
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
                                <div>
                                    <label className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-2 font-medium">
                                        {t("appointmentAudienceLabel")}
                                    </label>
                                    <div data-touch-boost className="flex items-center relative rounded-full bg-toggle-track p-0.5 font-mono text-[length:calc(10.5px*var(--zaad-font-scale))] h-9 w-full">
                                        {appointmentModeOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                value={opt.id}
                                                onClick={handleAppointmentModeClick}
                                                className={`cursor-pointer flex-1 h-full rounded-full transition-colors duration-700 relative z-10 flex items-center justify-center px-2 ${appointmentMode === opt.id ? "text-on-indicator font-semibold" : "text-muted hover:text-headline"}`}
                                                data-touch-boost
                                            >
                                                {appointmentMode === opt.id && (
                                                    <motion.div
                                                        layoutId="activeAppointmentBlob"
                                                        className="absolute inset-0 bg-indicator rounded-full z-[-1]"
                                                        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                                                    />
                                                )}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {appointmentMode === "audience" && (
                                        <p className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted/70 mt-2">
                                            {t("appointmentHintAudience")}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted uppercase block mb-2 font-medium">
                                        {t("appointmentCadenceLabel")}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={toggleCadenceOpen}
                                        aria-expanded={cadenceOpen}
                                        className={`cursor-pointer w-full flex items-center justify-between gap-2 bg-panel border rounded-full h-9 px-3 transition-colors duration-700 ${
                                            formErrors.appointmentWindow ? "border-danger" : cadenceOpen ? "border-accent" : "border-ink/15 hover:border-ink/30"
                                        }`}
                                    >
                                        <span className="flex items-center min-w-0">
                                            <Clock className="w-4 h-4 text-accent mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                                            <span className="text-[length:calc(12px*var(--zaad-font-scale))] font-mono uppercase text-ink truncate">
                                                {activeSlot ? <>{activeSlot.name} · <span dir="ltr">{activeSlot.time}</span></> : t("appointmentWindowArrangement")}
                                            </span>
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-muted/70 shrink-0 transition-transform duration-500 ${cadenceOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    <FieldError id="inquiry-cadence-error" message={formErrors.appointmentWindow && t(formErrors.appointmentWindow)} />

                                    <AnimatePresence>
                                        {cadenceOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-20"
                                                    onClick={closeCadence}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                                    className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 z-30 w-60 bg-panel border border-ink/10 rounded-2xl shadow-card-lg p-1.5 origin-top"
                                                >
                                                    {cadenceSlots.map((opt) => {
                                                        const active = appointmentWindow === opt.id;
                                                        return (
                                                            <button
                                                                key={opt.id}
                                                                type="button"
                                                                value={opt.id}
                                                                onClick={handleCadenceOptionClick}
                                                                className={`cursor-pointer w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left rtl:text-right transition-colors duration-500 ${active ? "bg-accent/10" : "hover:bg-ink/[0.03]"}`}
                                                            >
                                                                <span className={`text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase ${active ? "text-accent" : "text-ink"}`}>
                                                                    {opt.name}
                                                                </span>
                                                                <span className={`text-[length:calc(10px*var(--zaad-font-scale))] font-mono ${active ? "text-accent/80" : "text-muted"}`}>
                                                                    <span dir="ltr">{opt.time}</span>
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {formErrors.form && (
                            <p role="alert" className="flex items-center gap-2 text-danger text-xs font-mono bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{t(formErrors.form)}</span>
                            </p>
                        )}

                        <MaisonButton
                            type="submit"
                            variant="solid"
                            icon={Send}
                            iconClassName="rotate-45 rtl:-rotate-45"
                            disabled={formSubmitting}
                            className="w-full font-sans"
                        >
                            {formSubmitting ? t("formSending") : t("submitInquiry")}
                        </MaisonButton>

                        <div className="p-4 bg-surface-frosted border border-ink/10 text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] font-mono text-muted space-y-2 rounded-xl">
                            <p className="flex items-center">
                                <Clock className="w-3 h-3 text-accent mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                                <span>{t("studioReplyStandard")}</span>
                            </p>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        role="status"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-panel-frost p-8 border border-ink/10 text-center rounded-2xl shadow-card-lg font-sans"
                    >
                        <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center mx-auto mb-6 bg-surface">
                            <Check className="w-5 h-5 text-accent" />
                        </div>
                        <h4 className="font-serif text-lg font-light text-ink mb-2">
                            {t("committedToArchive")}
                        </h4>
                        <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto mb-6">
                            {wrapLatinRuns(t("committedConfirmationBody").replace("{clientName}", clientName), isFarsi)}
                        </p>
                        <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto mt-4">
                            {appointmentMode === "audience"
                                ? t("appointmentRequestedAudience").replace("{window}", slotLabel)
                                : t("appointmentRequestedCall").replace("{window}", slotLabel)}
                        </p>
                        <br />
                        <div className="border-t border-ink/10 pt-4 font-mono text-[length:calc(9px*var(--zaad-font-scale))] text-accent uppercase">
                            {t("sessionRef")}: <span dir="ltr" className="font-latin">SEC-COM-{sessionRef}</span>
                        </div>
                        <MaisonButton
                            variant="ghost"
                            onClick={handleInquireAnother}
                            icon={RefreshCw}
                            className="mt-6 text-xs text-ink cursor-pointer"
                        >
                            {t("inquireAnotherObject")}
                        </MaisonButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </MaisonReveal>
    );
}