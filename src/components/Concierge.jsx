"use client";

import {AnimatePresence, motion} from "motion/react";
import {Calendar, Check, Clock, Send, Sparkles} from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import {useLanguage} from "@/services/TranslationService";
import useConcierge from "../hooks/useConcierge";

export default function Concierge({preselectedItem, onClearPreselected}) {
    const {t, language, getItemTranslations} = useLanguage();

    const {
        clientName, setClientName,
        clientEmail, setClientEmail,
        clientPhone, setClientPhone,
        desiredConsultation, setDesiredConsultation,
        additionalNote, setAdditionalNote,
        formSubmitted,
        chatMessages,
        userQuery, setUserQuery,
        chatLoading,
        scrollRef,
        handleInquirySubmit,
        handleSendMessage,
    } = useConcierge({language, getItemTranslations, preselectedItem, onClearPreselected, t});

    return (
        <section
            id="concierge"
            className="py-24 md:py-36 bg-surface px-6 sm:px-12 border-b border-ink/10 relative"
        >
            <div className="max-w-7xl mx-auto">
                <MaisonReveal variant="unveil" threshold={0.05}>
                    <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span
                className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
              {t("acquisitionsServices")}
            </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light mb-4">
                            {t("privateCommissions")}
                        </h2>
                        <p className="text-sm md:text-base text-muted font-light leading-relaxed">
                            {t("privateCommissionsSub")}
                        </p>
                    </div>
                </MaisonReveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 relative">
                    {/* Column A: Inquiry Form */}
                    <MaisonReveal
                        variant="slide-up-royal"
                        delay={0.15}
                        className="lg:col-span-6 border-b lg:border-b-0 lg:border-r lg:rtl:border-r-0 lg:rtl:border-l border-ink/10 pb-12 lg:pb-0 lg:pr-12 lg:rtl:pr-0 lg:rtl:pl-12 text-left rtl:text-right"
                    >
                        <h3 className="text-xl md:text-2xl font-serif text-ink font-light mb-8 flex items-center justify-start tracking-tight">
                            <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-accent shrink-0"/>
                            {t("acquisitionCard")}
                        </h3>

                        <AnimatePresence mode="wait">
                            {!formSubmitted ? (
                                <motion.form
                                    onSubmit={handleInquirySubmit}
                                    initial={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                className="text-[9px] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium">
                                                {t("bespokeClientName")}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                                placeholder={t("clientNamePlaceholder")}
                                                className="w-full bg-panel border border-ink/15 px-4 py-3 text-xs focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="text-[9px] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium">
                                                {t("secureContactEmail")}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={clientEmail}
                                                onChange={(e) => setClientEmail(e.target.value)}
                                                placeholder="client@ZAAD.com"
                                                className="w-full bg-panel border border-ink/15 px-4 py-3 text-xs focus:border-ink/80 focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                className="text-[9px] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium">
                                                {t("directTelephone")}
                                            </label>
                                            <input
                                                type="tel"
                                                value={clientPhone}
                                                onChange={(e) => setClientPhone(e.target.value)}
                                                placeholder="+98 912 345 6789"
                                                className="w-full bg-panel border border-ink/15 px-4 py-3 text-xs focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-xl font-sans"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="text-[9px] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium">
                                                {t("consultationCategory")}
                                            </label>
                                            <select
                                                value={desiredConsultation}
                                                onChange={(e) => setDesiredConsultation(e.target.value)}
                                                className="w-full bg-panel border border-ink/15 px-4 py-3 text-xs focus:border-ink focus:outline-none transition-colors rounded-xl block font-sans"
                                            >
                                                <option value="acquisition">{t("privateArchiveAcquisition")}</option>
                                                <option value="interior">{t("residentialConsultation")}</option>
                                                <option value="visit">{t("florenceViewing")}</option>
                                                <option value="material">{t("customMaterialSpec")}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="text-[9px] font-mono tracking-widest text-muted uppercase block mb-1.5 font-medium">
                                            {t("archivalSpecs")}
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={additionalNote}
                                            onChange={(e) => setAdditionalNote(e.target.value)}
                                            placeholder={t("spacePlaceholder")}
                                            className="w-full bg-panel border border-ink/15 px-4 py-3 text-xs focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-xl resize-none font-sans"
                                        />
                                    </div>

                                    <MaisonButton type="submit" variant="solid" className="w-full font-sans">
                                        {t("submitInquiry")}
                                    </MaisonButton>

                                    <div
                                        className="p-4 bg-surface-frosted border border-ink/10 text-[10px] font-mono text-muted space-y-2 rounded-xl">
                                        <p className="flex items-center">
                                            <Clock className="w-3 h-3 text-accent mr-2 rtl:mr-0 rtl:ml-2 shrink-0"/>
                                            <span>{t("studioReplyStandard")}</span>
                                        </p>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{opacity: 0, scale: 0.98}}
                                    animate={{opacity: 1, scale: 1}}
                                    className="bg-panel-frost   p-8 border border-ink/10 text-center rounded-2xl shadow-xl font-sans"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center mx-auto mb-6 bg-surface">
                                        <Check className="w-5 h-5 text-accent"/>
                                    </div>
                                    <h4 className="font-serif text-xl font-light text-ink mb-2">
                                        {t("committedToArchive")}
                                    </h4>
                                    <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto mb-6">
                                        {language === "fa"
                                            ? `${clientName} عزیز، اطلاعات ثبت سفارش شما با موفقیت در سیستم مرکزی کارگاه فلورانس ثبت گردید. مدیر طراحی ارشد ZAAD به زودی طی ۴ ساعت آینده با شما تماس خواهد گرفت.`
                                            : `${clientName}, your secure consultation card has been committed to our Florence studio log. A dedicated design director will reach out directly to your coordinate email within 4 hours.`}
                                    </p>
                                    <div
                                        className="border-t border-ink/10 pt-4 font-mono text-[9px] text-accent tracking-widest uppercase">
                                        {t("sessionRef")}: SEC-COM-{Math.floor(Math.random() * 90000) + 10000}
                                    </div>
                                    <MaisonButton
                                        variant="ghost"
                                        onClick={() => {
                                            setFormSubmitted(false);
                                            setClientName("");
                                            setClientEmail("");
                                            setClientPhone("");
                                            setAdditionalNote("");
                                        }}
                                        className="mt-6 text-xs text-ink cursor-pointer"
                                    >
                                        {t("inquireAnotherObject")}
                                    </MaisonButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </MaisonReveal>

                    {/* Column B: AI Chat */}
                    <MaisonReveal
                        variant="scale-down-unveil"
                        delay={0.3}
                        className="lg:col-span-6 flex flex-col h-[520px] text-left rtl:text-right"
                    >
                        <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
                            <h3 className="text-xl md:text-2xl font-serif text-ink font-light flex items-center tracking-tight justify-start">
                                <Sparkles className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-accent shrink-0"/>
                                {t("zaadDigitalCurator")}
                            </h3>
                            <span
                                className="text-[9px] font-mono text-ink tracking-widest bg-panel border border-ink/10 px-3 py-1 uppercase rounded-full">
                Gemini 2.5 Flash
              </span>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none mb-4 bg-surface-overlay p-4 border border-ink/10 rounded-2xl">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 text-xs font-light leading-relaxed shadow-sm ${msg.role === "user" ? "bg-ink text-canvas font-normal rounded-2xl rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none" : "bg-panel text-ink border border-ink/10 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"}`}
                                    >
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                    <span className="text-[8px] font-mono text-muted/70 mt-1 uppercase tracking-widest">
                    {msg.role === "user" ? t("chatClient") : t("chatCurator")} • {msg.timestamp}
                  </span>
                                </div>
                            ))}

                            {chatLoading && (
                                <div className="flex flex-col items-start">
                                    <div
                                        className="bg-panel text-ink/70 border border-ink/10 max-w-[85%] p-4 text-xs font-mono tracking-wider animate-pulse rounded-full">
                                        {t("analyzingParams")}
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} style={{float: "left", clear: "both"}}/>
                        </div>

                        <form onSubmit={handleSendMessage} className="flex space-x-2 rtl:space-x-reverse">
                            <input
                                type="text"
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                disabled={chatLoading}
                                placeholder={t("chatPlaceholder")}
                                className="flex-1 bg-panel border border-ink/10 px-5 py-3 text-xs focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-full font-sans disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={chatLoading || !userQuery.trim()}
                                className="bg-ink text-canvas border border-ink w-12 h-12 rounded-full hover:bg-transparent hover:text-ink transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-canvas shrink-0 cursor-pointer"
                            >
                                <Send className="w-4 h-4 text-canvas"/>
                            </button>
                        </form>
                    </MaisonReveal>
                </div>
            </div>
        </section>
    );
}
