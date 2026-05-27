"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, ChevronDown } from "lucide-react";
import MaisonReveal from "../MaisonReveal";

function InquiryForm({ concierge, t, language }) {
    const { formData, setFormData, isSubmitting, isSuccess, preselectedItem, onClearPreselected, handleSubmit } = concierge;

    // PH1 FIX: Use a stable random ID that doesn't cause hydration mismatch
    const [sessionRef, setSessionRef] = useState("SEC-COM-PENDING");
    useEffect(() => {
        setSessionRef(`SEC-COM-${Math.floor(Math.random() * 90000) + 10000}`);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (isSuccess) {
        return (
            <MaisonReveal variant="slide-up-royal" delay={0.2} className="lg:col-span-5 flex flex-col justify-center min-h-[400px]">
                {/* ... success state unchanged ... */}
                <div className="bg-surface-frosted p-8 border border-ink/10 rounded-2xl text-center backdrop-blur-md">
                    <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-6" />
                    <h3 className="text-2xl font-serif text-ink mb-4">{t("inquiryReceived")}</h3>
                    <p className="text-sm text-muted font-light leading-relaxed mb-6">
                        {t("inquirySuccessMessage")}
                    </p>
                    <span className="text-[10px] font-mono tracking-widest text-ink uppercase bg-panel border border-ink/10 px-4 py-2 rounded-full inline-block">
                        {sessionRef}
                    </span>
                </div>
            </MaisonReveal>
        );
    }

    return (
        <MaisonReveal variant="slide-up-royal" delay={0.2} className="lg:col-span-5 space-y-6">
            <div className="bg-surface-frosted p-8 border border-ink/10 rounded-2xl backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... form content mostly unchanged, just updating the session ref below ... */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            {t("formName")} *
                        </label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-panel-glass border-b border-ink/20 focus:border-ink px-4 py-3 text-sm text-ink outline-none transition-colors rounded-none placeholder-dim"
                            placeholder="e.g. Jean Dupont"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            {t("formEmail")} *
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-panel-glass border-b border-ink/20 focus:border-ink px-4 py-3 text-sm text-ink outline-none transition-colors rounded-none placeholder-dim rtl:text-right"
                            dir={language === 'fa' ? 'rtl' : 'ltr'}
                            placeholder="jean@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            {t("formInterest")}
                        </label>
                        <div className="relative">
                            <select
                                name="interest"
                                value={formData.interest}
                                onChange={handleChange}
                                className="w-full bg-panel-glass border-b border-ink/20 focus:border-ink px-4 py-3 text-sm text-ink outline-none transition-colors appearance-none cursor-pointer rounded-none rtl:pl-10 rtl:pr-4"
                            >
                                <option value="Collection Inquiry">{t("collectionInquiry")}</option>
                                <option value="Bespoke Commission">{t("bespokeCommission")}</option>
                                <option value="Architecture Consulting">{t("architectureConsulting")}</option>
                                <option value="Gallery Viewing">{t("galleryViewing")}</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-muted absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {preselectedItem && (
                        <div className="bg-panel border border-ink/10 p-4 flex items-center justify-between rounded-lg">
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 rtl:mr-0 rtl:ml-3" />
                                <div>
                                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest block mb-0.5">
                                        {t("itemOfInterest")}
                                    </span>
                                    <span className="text-sm font-serif text-ink">{preselectedItem.name}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClearPreselected}
                                className="text-[10px] text-muted hover:text-ink uppercase tracking-widest"
                            >
                                {t("clearSelection")}
                            </button>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
                            {t("formMessage")}
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-panel-glass border-b border-ink/20 focus:border-ink px-4 py-3 text-sm text-ink outline-none transition-colors resize-none rounded-none placeholder-dim"
                            placeholder={t("formMessagePlaceholder")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-ink text-canvas hover:bg-surface-alt hover:text-ink py-4 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 flex items-center justify-center border border-transparent hover:border-ink/20 rounded-none cursor-pointer"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">{t("transmitting")}</span>
                        ) : (
                            <>
                                {t("submitInquiry")} <Send className="w-3.5 h-3.5 ml-3 rtl:ml-0 rtl:mr-3" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-between pt-4 border-t border-ink/10 mt-6">
                        <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                            {t("secureTransmission")}
                        </span>
                        <span className="text-[9px] font-mono text-muted uppercase tracking-widest text-right">
                            {sessionRef}
                        </span>
                    </div>
                </form>
            </div>
        </MaisonReveal>
    );
}

export default React.memo(InquiryForm);
